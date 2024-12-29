<?php
require 'db_conn.php'; 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);
$method = $_SERVER['REQUEST_METHOD'];

$package_id = $data['package_id'];
$old_current_location = $data['old_current_location'];
$old_timestamp = $data['old_timestamp'];

if ($method == 'POST') {
    $status = $data['status'];
    $new_current_location = $data['new_current_location'];
    $new_timestamp = $data['new_timestamp']; 

    $stmt = $db->prepare("UPDATE deliveryhistory 
                                 SET status = ?, current_location = ?, timestamp = ?
                                 WHERE package_id = ? AND timestamp = ? AND current_location = ?");

    $stmt->execute([$status, $new_current_location, $new_timestamp, $package_id, $old_timestamp, $old_current_location]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "配送歷史已更新"]);
    } else {
        echo json_encode(["success" => false, "message" => "沒有找到符合條件的記錄"]);
    }
   
} elseif ($method == 'DELETE') {
    $stmt = $db->prepare("DELETE FROM DeliveryHistory WHERE package_id = ? AND current_location = ? AND timestamp = ?");
    $stmt->execute([$package_id, $old_current_location, $old_timestamp]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "配送歷史已刪除"]);
    } else {
        echo json_encode(["success" => false, "message" => "未找到匹配的配送歷史記錄"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "無效的請求方法"]);
}
?>
