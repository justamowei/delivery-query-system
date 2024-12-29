import React, { useState } from "react";
import { auth, provider } from "./Firebase";
import {signInWithPopup, signInWithEmailAndPassword, deleteUser} from "firebase/auth";
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

const Login = () => {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [role, setRole] = useState("user");
    const [accountExists, setAccountExists] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, account, password);
            const response = await axios.post("/delivery-query-system/api/check_account.php", {
                account: account,
            });
            if (response.data.exists) {
                setAccountExists(true);
                alert("帳戶已經存在，直接登入！");
                const response = await axios.post("/delivery-query-system/api/login.php", {
                    account: account,
                });
                console.log(response);
                navigate("/");
            } else {
                setAccountExists(false);
                alert("資料庫存取失敗，請重新填寫詳細資料！");
            }
        } catch (error) {
            console.error(error);
            alert("登入失敗，請檢查帳號密碼！");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;

            setAccount(email);

            const response = await axios.post("/delivery-query-system/api/check_account.php", {
                account: email,
            });

            if (response.data.exists) {
                setAccountExists(true);
                alert("帳戶已經存在，直接登入！");
                const response = await axios.post("/delivery-query-system/api/login.php", {
                    account: email,
                });
                console.log(response);
                navigate("/");
            } else {
                setAccountExists(false);
                alert("首次登入，請設定資料！");
            }
        } catch (error) {
            console.error(error);
            alert("登入失敗！");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/delivery-query-system/api/register.php", {
                account,
                nickname,
                role,
            });

            if (response.data.success) {
                alert("資料儲存成功！");
                setAccountExists(true);
                const response = await axios.post("/delivery-query-system/api/check_account.php", {
                    account: account,
                });
                console.log(response);
                navigate("/");
            } else {
                if (auth.currentUser) {
                    await deleteUser(auth.currentUser);
                }
                setAccountExists(null);
                throw new Error("資料儲存失敗");
            }
        } catch (error) {
            console.error("儲存失敗：", error);
            alert("資料儲存失敗！請重試。");
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
                登入系統
            </Typography>

            {accountExists === null && (
                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="帳號 (Email)"
                        margin="normal"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="密碼"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        登入
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleGoogleSignIn}
                        sx={{ mt: 2 }}
                    >
                        使用 Google 登入
                    </Button>
                </form>
            )}

            {accountExists === false && (
                <>
                    <Typography variant="h6" align="center" gutterBottom>
                        填寫基本資料
                    </Typography>
                    <form onSubmit={handleSave}>
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
                            儲存資料
                        </Button>
                    </form>
                </>
            )}

            {accountExists === null && (
                <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/register")}
                >
                    前往註冊
                </Button>
            )}
        </Box>
    );
};

export default Login;
