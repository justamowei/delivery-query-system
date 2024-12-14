<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // 限制為您的前端地址
header("Access-Control-Allow-Methods: POST, OPTIONS"); // 允許的HTTP方法
header("Access-Control-Allow-Headers: Content-Type"); // 允許的自定義頭
header("Access-Control-Allow-Credentials: true"); // 如果需要跨域時攜帶Cookie，則設定為true

require 'db_conn.php'

// 接收前端發送的JSON請求並解碼
$requestData = json_decode(file_get_contents("php://input"), true);
$id = $requestData['id'] ?? null;

// 如果前端沒有發送任何ID，返回錯誤
if (is_null($id) || trim($id) === "") {
    echo json_encode(['error' => '未收到有效的ID']);
    exit;
}

// 查詢該ID的所有配送歷史記錄並按時間順序排列
try {
    $query_deliveryhistory = "
        SELECT dh.*, p.*
        FROM deliveryhistory dh
        JOIN package p ON dh.package_id = p.package_id
        WHERE dh.package_id = ?
        ORDER BY dh.timestamp ASC"; // 按照時間升序排列
    $stmt_deliveryhistory = $pdo->prepare($query_deliveryhistory);
    $stmt_deliveryhistory->execute([$id]);
    $result = $stmt_deliveryhistory->fetchAll(PDO::FETCH_ASSOC);

    // 回傳結果
    echo json_encode($result);
} catch (PDOException $e) {
    echo json_encode(['error' => '錯誤：' . $e->getMessage()]);
}
