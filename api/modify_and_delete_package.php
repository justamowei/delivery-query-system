<?php
require 'db_conn.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $package_id = $data['package_id'];
    $name = $data['name'];
    $sender = $data['sender'];
    $receiver = $data['receiver'];

    $stmt = $db->prepare("UPDATE Package SET name = ?, sender_address = ?, receiver_address = ? WHERE package_id = ?");
    $stmt->execute([$name, $sender, $receiver, $package_id]);

    echo json_encode(["success" => true, "message" => "包裹已更新"]);
} 
elseif ($method == 'DELETE') {
    $package_id = $data['package_id'];

    $stmt = $db->prepare("DELETE FROM Package WHERE package_id = ?");
    $stmt->execute([$package_id]);

    echo json_encode(["success" => true, "message" => "包裹已刪除"]);
} 
else {
    echo json_encode(["success" => false, "message" => "無效的方法"]);
}
?>
