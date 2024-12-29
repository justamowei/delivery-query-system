<?php
require 'db_conn.php'; 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);

$package_id = $data['package_id'];
$status = $data['status'];
$location = $data['location'];

try {
    $stmt = $db->prepare("INSERT INTO DeliveryHistory (package_id, status, current_location) VALUES (?, ?, ?)");
    $stmt->execute([$package_id, $status, $location]);
    echo json_encode(["success" => true, "message" => "包裹狀態已更新"]);
} catch (PDOException $e) {
    // catch觸發器的錯誤
    if ($e->getCode() == '45000') { // SQLSTATE '45000' (自訂錯誤，已經有不是Pending的資料，就不能再更新成Pending)
        echo json_encode(["success" => false, "message" => "Trigger判斷更新無效：" . $e->getMessage()]);
    } else {
        echo json_encode(["success" => false, "message" => "系統錯誤：" . $e->getMessage()]);
    }
}
?>
