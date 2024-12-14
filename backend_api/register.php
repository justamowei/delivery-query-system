<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = require_once 'db_connection.php';

$data = json_decode(file_get_contents("php://input"), true);
$account = $data["account"];
$nickname = $data["nickname"];
$role = $data["role"];

$stmt = $conn->prepare("INSERT INTO users (account, nickname, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $account, $nickname, $role);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["error" => "Failed to register user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
