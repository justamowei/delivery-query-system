import React, { useState, useEffect } from "react";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

function ModifyAndDeletePackage({ open, onClose, rowData, setReload }) {
    const [form, setForm] = useState({package_id: "", name: "", sender: "", receiver: ""});

    useEffect(() => {
        if (rowData && open) {
            setForm({
                package_id: rowData.package_id || "",
                name: rowData.name || "",
                sender: rowData.sender_address || "",
                receiver: rowData.receiver_address || "",
            });
        }
    }, [rowData, open]);

    const handleModify = async () => {
        if (!form.name || !form.sender || !form.receiver) {
            alert("所有欄位都必填，請確認所有欄位都已填寫。");
            return;
        }
        try {
            const response = await axios.post(
                "/delivery-query-system/api/modify_and_delete_package.php",
                form,
                { headers: { "Content-Type": "application/json" } }
            );
            alert(response.data.message);
            onClose();
            setReload(true);
        } catch (error) {
            console.error("Error modifying package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                "/delivery-query-system/api/modify_and_delete_package.php",
                {
                    headers: { "Content-Type": "application/json" },
                    data: { package_id: form.package_id },
                }
            );
            alert(response.data.message);
            onClose(); // 關閉彈窗
            setReload(true);
        } catch (error) {
            console.error("Error deleting package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">修改/刪除包裹</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 15 }}>
                        ※若要刪除包裹，則不用輸入任何資料
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="包裹 ID"
                    fullWidth
                    variant="outlined"
                    value={form.package_id}
                    disabled
                />
                <TextField
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
                <Button variant="contained" onClick={handleDelete} color="error" endIcon={<DeleteIcon />}>
                    刪除包裹
                </Button>
                <Button variant="contained" onClick={handleModify} color="primary" endIcon={<SendIcon />}>
                    修改包裹
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifyAndDeletePackage;
