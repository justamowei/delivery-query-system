<?php
// register_user.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$db = require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$account = $data["account"];
$nickname = $data["nickname"];
$role = $data["role"];

try {
    $stmt = $db->prepare("INSERT INTO user (account, nickname, role) VALUES (:account, :nickname, :role)");
    $stmt->bindParam(':account', $account);
    $stmt->bindParam(':nickname', $nickname);
    $stmt->bindParam(':role', $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User registered successfully"]);
    } else {
        echo json_encode(["error" => "Failed to register user"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
