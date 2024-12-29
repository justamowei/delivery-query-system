<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Credentials: true"); 

require 'db_conn.php'; 

// 接收前端發送的JSON請求並解碼
$requestData = json_decode(file_get_contents("php://input"), true);
$package_ids = $requestData['package_ids'] ?? [];

// 如果前端沒有發送任何包裹ID，返回錯誤
if (empty($package_ids)) {
    echo json_encode(['error' => '未收到有效的包裹ID']);
    exit;
}

// 用占位符創建查詢
$placeholders = implode(',', array_fill(0, count($package_ids), '?'));

// 查詢每個包裹的最新紀錄
try {
    $query_deliveryhistory = "
        SELECT dh.*, p.*
        FROM deliveryhistory dh
        JOIN package p ON dh.package_id = p.package_id
        WHERE dh.package_id IN ($placeholders)
        AND dh.timestamp = (
            SELECT MAX(timestamp)
            FROM deliveryhistory
            WHERE package_id = dh.package_id
        )";
    $stmt_deliveryhistory = $db->prepare($query_deliveryhistory);
    $stmt_deliveryhistory->execute($package_ids);
    $result = $stmt_deliveryhistory->fetchAll(PDO::FETCH_ASSOC);

    // 回傳結果
    echo json_encode($result);
} catch (PDOException $e) {
    echo json_encode(['error' => '錯誤：' . $e->getMessage()]);
}