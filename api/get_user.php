<?php
// userRole.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if (isset($_SESSION["role"]) && isset($_SESSION["account"]) && isset($_SESSION["nickname"])) {
    echo json_encode([
        "success" => true,
        "role" => $_SESSION["role"],
        "account" => $_SESSION["account"],
        "nickname" => $_SESSION["nickname"],
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "No session found or user not logged in"
    ]);
}
