<?php
require 'db_conn.php'; // 資料庫連線檔案

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

if ($data === null) {
    echo json_encode(["success" => false, "message" => "Invalid JSON received."]);
    exit;
}

// 取得前端送來的資料
$name = $data['name'];
$sender = $data['sender'];
$receiver = $data['receiver'];

// 檢查是否有必填欄位
if ($name && $sender && $receiver) {
    // 插入資料到 Package 表
    $stmt = $db->prepare("INSERT INTO Package (name, sender_address, receiver_address) 
                           VALUES (?, ?, ?)");
    $stmt->execute([$name, $sender, $receiver]);

    echo json_encode(["success" => true, "message" => "包裹已新增"]);
} else {
    echo json_encode(["success" => false, "message" => "所有欄位皆為必填"]);
}
?>
