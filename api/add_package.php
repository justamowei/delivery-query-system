<?php
require 'db_conn.php'; 
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode(["success" => false, "message" => "Invalid JSON received."]);
    exit;
}

$name = $data['name'];
$sender = $data['sender'];
$receiver = $data['receiver'];

if ($name && $sender && $receiver) {
    try {
        // 開始資料庫交易
        $db->beginTransaction();

        // 插入資料到 Package 表
        $stmt = $db->prepare("INSERT INTO Package (name, sender_address, receiver_address) 
                               VALUES (?, ?, ?)");
        $stmt->execute([$name, $sender, $receiver]);

        // 獲取剛剛插入的包裹 ID
        $package_id = $db->lastInsertId();

        // 插入資料到 DeliveryHistory 表
        $stmt = $db->prepare("INSERT INTO DeliveryHistory (package_id, status, current_location) 
                               VALUES (?, 'Pending', ?)");
        $stmt->execute([$package_id, $sender]);

        // 提交交易
        $db->commit();

        echo json_encode(["success" => true, "message" => "包裹已新增，並更新其配送歷史"]);
    } catch (Exception $e) {
        // 發生錯誤，回滾交易
        $db->rollBack();
        echo json_encode(["success" => false, "message" => "新增包裹時出錯：" . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "所有欄位皆為必填"]);
}
?>
