<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_conn.php';

$data = json_decode(file_get_contents("php://input"), true);
$account = $data["account"];

try {
    $stmt = $db->prepare("SELECT * FROM user WHERE account = :account");
    $stmt->bindParam(':account', $account);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(["exists" => true]);
    } else {
        echo json_encode(["exists" => false]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
