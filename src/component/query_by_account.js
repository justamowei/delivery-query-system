import React, { useState } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import Search_Button from "./search_button";

export default function Query_by_account({ onSearch }) {
  const [name, setName] = useState("");

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSearch = async () => {
    if (!name.trim()) {
      alert("請輸入帳號名稱");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/search_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }), // 直接發送單個帳號名稱
      });

      if (response.ok) {
        const data = await response.json();
        onSearch(data); // 回傳查詢結果給父組件
      } else {
        console.error("請求失敗", response.statusText);
      }
    } catch (error) {
      console.error("發生錯誤", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "70%",
        height: "75vh",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">帳號查詢</Typography>
      </Box>
      <Box mt={2} borderBottom={1} borderColor="grey.300" pb={1}>
        <Typography variant="subtitle1">透過帳號查詢包裹。</Typography>
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="帳號"
          variant="outlined"
          sx={{ mb: 2 }}
          value={name}
          onChange={handleInputChange}
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <Search_Button
          color="primary"
          onClick={handleSearch}
          sx={{ margin: 2, padding: 1, width: "20%" }}
        />
      </Box>
    </Paper>
  );
}
