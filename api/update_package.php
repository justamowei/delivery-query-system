<?php
require 'db_conn.php'; // 資料庫連線檔案

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$package_id = $data['package_id'];
$status = $data['status'];
$location = $data['location'];

$stmt = $db->prepare("INSERT INTO DeliveryHistory (package_id, status, current_location) VALUES (?, ?, ?)");
$stmt->execute([$package_id, $status, $location]);

echo json_encode(["success" => true, "message" => "包裹狀態已更新"]);

?>
