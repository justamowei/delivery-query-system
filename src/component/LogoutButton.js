// LogoutButton.js
import React from "react";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogoutButton = ({ onLogoutSuccess }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogoutSuccess();
            await axios.post("/delivery-query-system/api/logout.php");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("登出失敗！");
        }
    };

    return (
        <Button
            variant="outlined"
            color="primary"
        
            onClick={handleLogout}
            sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      fontWeight: "bold",
                    }}
        >
            登出
        </Button>
    );
};

export default LogoutButton;
