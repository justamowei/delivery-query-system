<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
require 'db_conn.php';

// 接收前端發送的JSON請求並解碼
$requestData = json_decode(file_get_contents("php://input"), true);
$id = $requestData['id'] ?? null;

// 如果前端沒有發送任何ID，返回錯誤
if (is_null($id) || trim($id) === "") {
    echo json_encode(['error' => '未收到有效的ID']);
    exit;
}

try {
    // 調用存儲過程
    $stmt = $db->prepare("CALL GetDeliveryHistory(?)");
    $stmt->execute([$id]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // 回傳結果
    echo json_encode($result);
} catch (PDOException $e) {
    echo json_encode(['error' => '錯誤：' . $e->getMessage()]);
}