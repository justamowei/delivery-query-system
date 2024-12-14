import React, { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import Query_by_number from "./query_by_number";
import Query_by_account from "./query_by_account"; // 引入帳號查詢組件
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
export default function Homepage_and_searching() {
  const [currentView, setCurrentView] = useState("number");
  const navigate = useNavigate(); // 使用 React Router 的導航功能

  const handleSearchResult = (data) => {
    console.log("接收到查詢結果:", data);
    navigate("/results", { state: { results: data } }); // 跳轉到結果頁，並傳遞數據
  };

  return (
    <Box padding={2}>
      <LogoutButton
      onLogoutSuccess={() => {
        console.log("使用者成功登出！");
        navigate("/login");
      }}>
      </LogoutButton>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          fontWeight: "bold",
        }}
        onClick={() => navigate("/add-package")}
      >
        新增包裹資料
      </Button>

      <Box
        display="flex"
        justifyContent="space-between"
        height="80%"
        paddingTop={6}
      >
        {currentView !== "result" && (
          <Paper
            elevation={3}
            sx={{
              width: "20%",
              height: "45%",
              padding: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              variant={currentView === "number" ? "contained" : "outlined"}
              color={currentView === "number" ? "primary" : "default"}
              sx={{ marginBottom: 2 }}
              onClick={() => setCurrentView("number")}
            >
              透過編號查詢
            </Button>
            <Button
              variant={currentView === "account" ? "contained" : "outlined"}
              color={currentView === "account" ? "primary" : "default"}
              sx={{ marginBottom: 2 }}
              onClick={() => setCurrentView("account")}
            >
              透過個人帳號查詢
            </Button>
            
          </Paper>
        )}

        {currentView === "number" && (
          <Query_by_number onSearch={handleSearchResult} />
        )}
        {currentView === "account" && <Query_by_account onSearch={handleSearchResult} />}
      </Box>
    </Box>
  );
}
