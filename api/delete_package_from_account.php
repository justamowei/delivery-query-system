<?php
require 'db_conn.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"), true);
$package_id = $data['package_id'];
$account = $data['account'];

try {
    // 檢查帳號是否存在
    $stmt = $db->prepare("SELECT * FROM User WHERE account = ?");
    $stmt->execute([$account]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["success" => false, "message" => "帳號不存在"]);
        exit();
    }

    // 檢查該包裹是否在該用戶的收藏清單中
    $stmt = $db->prepare("SELECT * FROM PackageToAccount WHERE package_id = ? AND account = ?");
    $stmt->execute([$package_id, $account]);
    $existingRecord = $stmt->fetch();

    if (!$existingRecord) {
        echo json_encode(["success" => false, "message" => "該包裹不在您的收藏清單中"]);
        exit();
    }

    // 刪除收藏清單中的包裹
    $stmt = $db->prepare("DELETE FROM PackageToAccount WHERE package_id = ? AND account = ?");
    $stmt->execute([$package_id, $account]);

    echo json_encode(["success" => true, "message" => "包裹已成功從收藏清單中移除"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "發生錯誤：" . $e->getMessage()]);
}
?>
