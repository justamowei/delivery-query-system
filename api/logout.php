<?php
// logout.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

session_start(); // 啟動 session

// 清除所有 session 資料
session_unset();

// 摧毀 session
session_destroy();

// 回應成功的 JSON
echo json_encode(["success" => true, "message" => "Logout successful"]);
