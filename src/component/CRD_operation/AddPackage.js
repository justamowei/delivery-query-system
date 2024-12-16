import React, { useState, useEffect } from "react";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton, Box, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

function AddPackage({ open, onClose }) {
    const [form, setForm] = useState({name: "", sender: "", receiver: ""});

    useEffect(() => {
        if (open) {
            setForm({ name: "", sender: "", receiver: "" });
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!form.name || !form.sender || !form.receiver) {
            alert("所有欄位都必須填寫");
            return;
        }

        try {
            const response = await axios.post("/delivery-query-system/api/add_package.php", form, {
                headers: { "Content-Type": "application/json" },
            });

            alert(response.data.message);
            onClose();
        } catch (error) {
            console.error("Error adding package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">新增包裹</Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="名稱"
                    fullWidth
                    variant="outlined"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="寄件地址"
                    fullWidth
                    variant="outlined"
                    value={form.sender}
                    onChange={(e) => setForm({ ...form, sender: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="收件地址"
                    fullWidth
                    variant="outlined"
                    value={form.receiver}
                    onChange={(e) => setForm({ ...form, receiver: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="center" width="100%">
                    <Button onClick={handleSubmit} variant="contained" color="primary" endIcon={<SendIcon />}>
                        新增包裹
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default AddPackage;
