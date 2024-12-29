<?php
// userRole.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if (isset($_SESSION["role"])) {
    echo json_encode([
        "success" => true,
        "role" => $_SESSION["role"]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "No session found or user not logged in"
    ]);
}
