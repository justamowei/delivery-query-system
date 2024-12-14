// LogoutButton.js
import React from "react";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ onLogoutSuccess }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onLogoutSuccess();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("登出失敗！");
        }
    };

    return (
        <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ mb: 2 }}
        >
            登出
        </Button>
    );
};

export default LogoutButton;
