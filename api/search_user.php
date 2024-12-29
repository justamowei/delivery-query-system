<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_conn.php'; // 引入資料庫連接

if (!isset($db)) {
    die('資料庫連接失敗，請確認 db_conn.php 配置是否正確');
}

// 接收前端發送的JSON請求並解碼
$requestData = json_decode(file_get_contents("php://input"), true);
$account = $requestData['name'] ?? null;

// 如果前端沒有發送任何名稱，返回錯誤
if (is_null($account) || trim($account) === "") {
    echo json_encode(['error' => '未收到有效的帳號名稱']);
    exit;
}

// 查詢packageaccount表格來獲取所有對應的包裹ID
$query_package_ids = "SELECT package_id FROM packagetoaccount WHERE account = ?";
$stmt_package_ids = $db->prepare($query_package_ids);
$stmt_package_ids->execute([$account]);
$package_ids = $stmt_package_ids->fetchAll(PDO::FETCH_COLUMN, 0); // 返回所有對應的package_id的陣列

// 如果未找到任何包裹ID，返回錯誤
if (empty($package_ids)) {
    echo json_encode(['error' => '未找到有效的包裹']);
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

    // 使用 json_encode 並控制錯誤輸出格式
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo json_encode(['error' => '錯誤：' . $e->getMessage()]);
}