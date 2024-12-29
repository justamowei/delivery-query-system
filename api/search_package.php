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

try {
    $package_ids_string = implode(',', $package_ids);
    $query = "SELECT GetLatestDeliveryHistoryByIds(?) as result";
    $stmt = $db->prepare($query);
    $stmt->execute([$package_ids_string]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC)['result'];
    echo $result;
} catch (PDOException $e) {
    echo json_encode(['error' => '錯誤：' . $e->getMessage()]);
}