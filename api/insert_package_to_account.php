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

    // 檢查該包裹是否已經被該用戶加入
    $stmt = $db->prepare("SELECT * FROM PackageToAccount WHERE package_id = ? AND account = ?");
    $stmt->execute([$package_id, $account]);
    $existingRecord = $stmt->fetch();

    if ($existingRecord) {
        echo json_encode(["success" => false, "message" => "此包裹已被加入過收藏"]);
        exit();
    }

    // 如果未找到相同的記錄，插入新資料
    $stmt = $db->prepare("INSERT INTO PackageToAccount (package_id, account) VALUES (?, ?)");
    $stmt->execute([$package_id, $account]);

    echo json_encode(["success" => true, "message" => "包裹已成功加入帳單清單"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "發生錯誤：" . $e->getMessage()]);
}
?>
