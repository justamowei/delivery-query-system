import React, { useState } from "react";
import { Box, TextField, Typography, Paper } from "@mui/material";
import Search_Button from "./search_button";

export default function Query_by_number({ onSearch }) {
  const [packageIds, setPackageIds] = useState({ id1: "", id2: "", id3: "" });

  const handleInputChange = (e) => {
    setPackageIds({ ...packageIds, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const { id1, id2, id3 } = packageIds;
    const ids = [id1, id2, id3].filter((id) => id.trim() !== "");
    if (ids.length === 0) {
      alert("請輸入至少一個編號");
      return;
    }

    try {
      const response = await fetch("/delivery-query-system/api/search_package.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ package_ids: ids }),
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
        <Typography variant="h6">編號查詢</Typography>
      </Box>
      <Box mt={2} borderBottom={1} borderColor="grey.300" pb={1}>
        <Typography variant="subtitle1">透過編號查詢，可以一次提交多個編號</Typography>
      </Box>

      <Box mt={2}>
        <TextField
          fullWidth
          label="編號1"
          variant="outlined"
          sx={{ mb: 2 }}
          name="id1"
          value={packageIds.id1}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          label="編號2"
          variant="outlined"
          sx={{ mb: 2 }}
          name="id2"
          value={packageIds.id2}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          label="編號3"
          variant="outlined"
          name="id3"
          value={packageIds.id3}
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