import React, { useState } from "react";
import { auth } from "./Firebase";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [role, setRole] = useState("user");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const account = userCredential.user.email;

            const response = await axios.post("/delivery-query-system/api/register.php", {
                account,
                nickname,
                role,
            });

            if (response.data.success) {
                alert("註冊成功！");
                navigate("/login");
            } else {
                await deleteUser(userCredential.user);
                throw new Error("資料庫儲存失敗");
            }
        } catch (error) {
            console.error("註冊失敗：", error);
            alert("註冊失敗！請重新嘗試。");
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: "auto",
                mt: 8,
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 2,
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                註冊帳號
            </Typography>
            <form onSubmit={handleRegister}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    fullWidth
                    label="Nickname"
                    margin="normal"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 2 }}
                >
                    註冊
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/login")}
                >
                    已有帳號？去登入
                </Button>
            </form>
        </Box>
    );
};

export default Register;
