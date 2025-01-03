import React, {useEffect, useState} from "react";
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
  Paper as ModalPaper,
} from "@mui/material";
import axios from "axios";
import ModifyAndDeletePackage from "./CRD_operation/ModifyAndDeletePackage";
import ModifyAndDeleteDeliveryHistory from "./CRD_operation/ModifyAndDeleteDeliveryHistory";
import UpdatePackage from "./CRD_operation/UpdatePackage";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results || []);
  const [source, setSource ] = useState(location.state?.source || []);

  const [selectedHistory, setSelectedHistory] = useState(null);
  const [open, setOpen] = useState(false);
  const [statusDetails, setStatusDetails] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openModify, setOpenModify] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openHistoryModify, setOpenHistoryModify] = useState(false);
  const [reload, setReload] = useState(false);
  const [historyReload, setHistoryReload] = useState(false);
  const [accountReload, setAccountReload] = useState(false);

  const [userRole, setUserRole] = useState(null);
  const [userAccount, setUserAccount] = useState(null);

  useEffect(() => {
    if (reload) {
      fetchPackage(results);
      setReload(false);
    }

    if (accountReload) {
      fetchPackageByAccount();
      setAccountReload(false);
    }

    if (historyReload) {
      fetchDeliveryHistory(selectedHistory.package_id);
      setHistoryReload(false);
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/delivery-query-system/api/get_user.php");
        const data = await response.data;
        if (data.success) {
          setUserRole(data.role);
          setUserAccount(data.account);
        } else {
          console.error("未登入或無法取得角色資訊:", data.error);
        }
      } catch (error) {
        console.error("無法取得角色資訊:", error);
      }
    };

    fetchUserRole();
  }, [historyReload, reload, accountReload, results, selectedHistory]);

  const handleAddToAccount = async (packageId) => {
    try {
      const response = await axios.post(
          "/delivery-query-system/api/insert_package_to_account.php",
          { package_id: packageId, account: userAccount }
      );

      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert("加入帳單清單失敗，" + response.data.message);
      }
    } catch (error) {
      console.error("發生錯誤", error);
    }
  };

  const handleRemoveFromAccount = async (packageId) => {
    try {
      setAccountReload(true);
      const response = await axios.post("/delivery-query-system/api/delete_package_from_account.php", {
        package_id: packageId,
        account: userAccount,
      });
      if (response.data) {

        alert("成功把編號為" + packageId + "的包裹移出收藏清單");
      } else {
        alert("移出收藏清單失敗，" + response.data.message);
      }
    } catch (error) {
      console.error("無法移出收藏清單:", error);
    }
  };

  const handleOpen = async (history) => {
    setSelectedHistory(history);
    console.log('Sending request with ID:', history);
    setOpen(true); // 打開彈出視窗
    fetchDeliveryHistory(history.package_id); // 調用獨立函式
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModify = (row) => {
    setSelectedRowData(row);
    setOpenModify(true);
  };

  const handleOpenUpdate = (row) => {
    setSelectedRowData(row);
    setOpenUpdate(true);
  };

  const handleOpenHistoryModify = (row) => {
    setSelectedRowData(row);
    console.log("row", row)
    setOpenHistoryModify(true);
  };

  const fetchDeliveryHistory = async (packageId) => {
    try {
      const response = await axios.post("/delivery-query-system/api/search_status.php", {
        id: packageId,
      });
      setStatusDetails(response.data);
    } catch (error) {
      console.error("查詢失敗", error);
    }
  };

  const fetchPackage = async (results) => {
    try {
      const packageIds = results.map((item) => item.package_id);

      const response = await axios.post(
          "/delivery-query-system/api/search_package.php",
          { package_ids: packageIds },
          { headers: { "Content-Type": "application/json" } }
      );

      setResults(response.data);
      console.log("fetchPackage的結果:", response.data);
    } catch (error) {
      console.error("發生錯誤", error.message);
    }
  };

  const fetchPackageByAccount = async () => {
    try {
      const response = await axios.post(
          "/delivery-query-system/api/search_user.php",
          { name: userAccount },
          { headers: { "Content-Type": "application/json" } }
      );

      setResults(response.data);
      console.log("fetchPackageByAccount的結果:", response.data);
    } catch (error) {
      console.error("發生錯誤", error.message);
    }
  };

  return (
      <Box padding={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button variant="outlined" color="primary" onClick={() => navigate("/")}>
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
                    <TableCell style={{ width: '10%' }}>包裹ID</TableCell>
                    <TableCell style={{ width: '10%' }}>包裹名稱</TableCell>
                    <TableCell style={{ width: '10%' }}>當前狀態</TableCell>
                    <TableCell style={{ width: '10%' }}>當前位置</TableCell>
                    <TableCell style={{ width: '10%' }}>收件地址</TableCell>
                    <TableCell style={{ width: '10%' }}>寄件地址</TableCell>
                    <TableCell style={{ width: '10%' }}>
                      {source === "number" ? "加入收藏清單" : "移出收藏清單"}
                    </TableCell>
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
                        <TableCell>{result.package_id}</TableCell>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.status}</TableCell>
                        <TableCell>{result.current_location}</TableCell>
                        <TableCell>{result.receiver_address}</TableCell>
                        <TableCell>{result.sender_address}</TableCell>
                        <TableCell>
                          {source === "number" && (
                              <Button variant="contained" onClick={() => handleAddToAccount(result.package_id)}>
                                +
                              </Button>
                          )}
                          {source === "account" && (
                              <Button variant="contained" onClick={() => handleRemoveFromAccount(result.package_id)}>
                                -
                              </Button>
                          )}
                        </TableCell>
                        {userRole === "admin" && <>
                          <TableCell>
                            <Button variant="contained" color="primary" onClick={() => handleOpenModify(result)}>
                              修改
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" color="primary" onClick={() => handleOpenUpdate(result)}>
                              更新
                            </Button>
                          </TableCell>
                        </>
                        }
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

        <ModifyAndDeletePackage
            open={openModify}
            onClose={() => setOpenModify(false)}
            rowData={selectedRowData}
            setReload={setReload}
        />

        <UpdatePackage
            open={openUpdate}
            onClose={() => setOpenUpdate(false)}
            rowData={selectedRowData}
            setReload={setReload}
        />

        <ModifyAndDeleteDeliveryHistory
            open={openHistoryModify}
            onClose={() => setOpenHistoryModify(false)}
            rowData={selectedRowData}
            setHistoryReload={setHistoryReload}
        />

        <Modal open={open} onClose={handleClose} sx={{ top: "-10%" }}>
          <Fade in={open}>
            <ModalPaper style={{padding: 20, width: 400, margin: '20% auto'}}>
              <Typography variant="h6" gutterBottom>
                配送歷史詳細資訊
              </Typography>
              <div style={{maxHeight: '200px', overflowY: 'auto', marginTop: '10px', paddingRight: '10px',}}>
                {statusDetails.length > 0 ? (
                    statusDetails.map((detail, index) => (
                        <div key={index}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography>狀態: {detail.status}</Typography>
                              <Typography>現在位置: {detail.current_location}</Typography>
                              <Typography>日期: {new Date(detail.timestamp).toLocaleString()}</Typography>
                            </Box>
                            {userRole === "admin" && <Button variant="contained" onClick={() => handleOpenHistoryModify(detail)} sx={{margin: "5px"}}>
                              修改
                            </Button>
                            }
                          </Box>
                          {index < statusDetails.length - 1 && <hr/>}
                        </div>
                    ))
                ) : (
                    <Typography>加載中...</Typography>
                )}
              </div>
            </ModalPaper>
          </Fade>
        </Modal>
      </Box>
);
}
