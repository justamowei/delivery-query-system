<?php
// login.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'db_conn.php';
session_start(); // 啟用 Session

$result = [
    "session_start_success" => session_status() === PHP_SESSION_ACTIVE,
    "session_id" => session_id(),
    "errors" => []
];

try {
    // 取得用戶輸入
    $data = json_decode(file_get_contents("php://input"), true);
    $account = $data["account"] ?? null;

    // 檢查是否有 account 資料
    if (!$account) {
        $result["errors"][] = "Account is missing or empty in the request.";
        echo json_encode($result, JSON_PRETTY_PRINT);
        exit;
    }

    // 查詢用戶資料
    $stmt = $db->prepare("SELECT * FROM user WHERE account = :account");
    $stmt->bindParam(':account', $account);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $result["errors"][] = "User not found with account: " . $account;
        echo json_encode($result, JSON_PRETTY_PRINT);
        exit;
    }

    // 寫入 Session
    $_SESSION["account"] = $user["account"];
    $_SESSION["nickname"] = $user["nickname"];
    $_SESSION["role"] = $user["role"];

    // 驗證 Session 是否成功
    if (isset($_SESSION["role"])) {
        $result["session_data"] = $_SESSION;
    } else {
        $result["errors"][] = "Failed to write session data.";
    }

} catch (PDOException $e) {
    $result["errors"][] = "Database error: " . $e->getMessage();
} catch (Exception $e) {
    $result["errors"][] = "General error: " . $e->getMessage();
}

// 回傳檢查結果
echo json_encode($result, JSON_PRETTY_PRINT);
