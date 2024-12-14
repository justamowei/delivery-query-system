import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  Modal,
  Fade,
  Paper as ModalPaper
} from "@mui/material";
import axios from 'axios'; // 引入axios來進行http請求

export default function Result() {
  const location = useLocation(); // 獲取傳遞的數據
  const navigate = useNavigate();
  const results = location.state?.results || []; // 確保結果存在

  const [selectedHistory, setSelectedHistory] = useState(null); // 用來跟踪選中的歷史記錄
  const [open, setOpen] = useState(false); // 控制彈出視窗的顯示與隱藏
  const [statusDetails, setStatusDetails] = useState([]); // 用來存儲查詢結果

  const handleOpen = async (history) => {
    setSelectedHistory(history); // 設置選中的歷史記錄，包括ID
    setOpen(true); // 打開彈出視窗
    try {
      const response = await axios.post('http://localhost:8080/search_status.php', {
        id: history.id
      });
      setStatusDetails(response.data); // 更新查詢結果狀態
    } catch (error) {
      console.error("查詢失敗", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // 關閉彈出視窗
  };

  return (
    <Box padding={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="outlined" color="primary" onClick={() => navigate("/Home")}>
          返回查詢
        </Button>
        <Typography variant="h6" fontSize="1rem">
          查詢結果
        </Typography>
      </Box>

      {results.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '10%' }}>配送歷史</TableCell>
                <TableCell style={{ width: '10%' }}>包裹名稱</TableCell>
                <TableCell style={{ width: '8%' }}>狀態</TableCell>
                <TableCell style={{ width: '10%' }}>現在位置</TableCell>
                <TableCell style={{ width: '15%' }}>收件地址</TableCell>
                <TableCell style={{ width: '10%' }}>寄件地址</TableCell>
                <TableCell style={{ width: '15%' }}>加入帳單清單</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleOpen(result)}>
                      ▶
                    </Button>
                  </TableCell>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.status}</TableCell>
                  <TableCell>{result.current_location}</TableCell>
                  <TableCell>{result.receiver_address}</TableCell>
                  <TableCell>{result.sender_address}</TableCell>
                  <TableCell><Button variant="contained">+</Button></TableCell>
                  <TableCell>
                    <Button variant="contained">修改</Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained">更新</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1" color="textSecondary">
          沒有符合的資料
        </Typography>
      )}

      {/* 彈出視窗顯示選中的歷史記錄 */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ top: "-10%" }}
      >
        <Fade in={open}>
          <ModalPaper style={{ padding: 20, width: 400, margin: '20% auto' }}>
            <Typography variant="h6" gutterBottom>
              配送歷史詳細資訊
            </Typography>
            {statusDetails.length > 0 ? (
              statusDetails.map((detail, index) => (
                <div key={index}>
                  <Typography>狀態: {detail.status}</Typography>
                  <Typography>現在位置: {detail.current_location}</Typography>
                  <Typography>日期: {new Date(detail.timestamp).toLocaleString()}</Typography>
                  {index < statusDetails.length - 1 && <hr />} {/* 添加橫線 */}
                </div>
              ))
            ) : (
              <Typography>加載中...</Typography>
            )}
          </ModalPaper>
        </Fade>
      </Modal>
    </Box>
  );
}
