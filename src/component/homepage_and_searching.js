import React, { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import Query_by_number from "./query_by_number";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import AddPackage from "./CRD_operation/AddPackage";

export default function Homepage_and_searching() {
    const [currentView, setCurrentView] = useState("number");
    const [openAddPackage, setOpenAddPackage] = useState(false); // 控制 AddPackage 開關
    const navigate = useNavigate();

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
                            sx={{ marginBottom: 4 }}
                            onClick={() => setCurrentView("number")}
                        >
                            透過編號查詢
                        </Button>
                    </Paper>
                )}

                {currentView === "number" && (
                    <Query_by_number onSearch={handleSearchResult} />
                )}
            </Box>

            <AddPackage open={openAddPackage} onClose={() => setOpenAddPackage(false)} />
        </Box>
    );
}
