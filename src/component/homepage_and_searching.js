import React, {useEffect, useState} from "react";
import { Box, Button, Paper } from "@mui/material";
import Query_by_number from "./query_by_number";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import AddPackage from "./CRD_operation/AddPackage";
import axios from "axios";
import Query_by_account from "./query_by_account";

export default function Homepage_and_searching() {
    const [currentView, setCurrentView] = useState("number");
    const [openAddPackage, setOpenAddPackage] = useState(false); // 控制 AddPackage 開關
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("/delivery-query-system/api/userRole.php");
                const data = await response.data;
                if (data.success) {
                    setUserRole(data.role);
                } else {
                    console.error("未登入或無法取得角色資訊:", data.error);
                }
            } catch (error) {
                console.error("無法取得角色資訊:", error);
            }
        };

        fetchUserRole();
    }, []);

    const handleSearchResult = (data) => {
        console.log("接收到查詢結果:", data);
        navigate("/results", { state: { results: data } });
    };

    return (
        <Box padding={2}>
            <LogoutButton
                onLogoutSuccess={() => {
                    console.log("使用者成功登出！");
                    navigate("/login");
                }}
            />

            { userRole === "admin" && (
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        fontWeight: "bold",
                    }}
                    onClick={() => setOpenAddPackage(true)} // 打開 AddPackage
                >
                    新增包裹資料
                </Button>
            )}

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
                {currentView === "account" && (
                    <Query_by_account onSearch={handleSearchResult} />
                )}
            </Box>

            <AddPackage open={openAddPackage} onClose={() => setOpenAddPackage(false)} />
        </Box>
    );
}
