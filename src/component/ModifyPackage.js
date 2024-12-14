import React, { useState } from "react";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

function ModifyPackage() {
    const [form, setForm] = useState({
        package_id: "1", // 初始包裹 ID，實際使用時可根據需求修改
        name: "",
        status: "",
        sender: "",
        receiver: "",
        location: "",
    });
    const [open, setOpen] = useState(false); // 控制模態框開關

    // 開啟模態框
    const handleClickOpen = () => setOpen(true);

    // 關閉模態框
    const handleClose = () => setOpen(false);

    const handleModify = async () => {
        try {
            const response = await axios.post("http://localhost/backend_api/modify_and_delete_package.php", form, {
                headers: { "Content-Type": "application/json" }
            });
            alert(response.data.message);  // 顯示回應訊息
            handleClose();  // 提交後關閉模態框
        } catch (error) {
            console.error("Error modifying package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete("http://localhost/db_project/backend_api/modify_and_delete_package.php", {
                headers: { "Content-Type": "application/json" },
                data: { package_id: form.package_id },
            });
            alert(response.data.message);  // 顯示回應訊息
            handleClose();  // 提交後關閉模態框
        } catch (error) {
            console.error("Error deleting package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                修改/刪除包裹
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">修改/刪除包裹</Typography>
                        <Typography variant="body2" color="textSecondary">
                            ※若要刪除包裹，則不用輸入任何資料
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="包裹 ID"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, package_id: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="名稱"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="狀態"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="寄件地址"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, sender: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="收件地址"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, receiver: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="當前位置"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose} color="primary" endIcon={<CloseIcon />}>
                        取消
                    </Button>
                    <Button variant="contained" onClick={handleModify} color="primary" endIcon={<SendIcon />}>
                        修改包裹
                    </Button>
                    <Button variant="contained" onClick={handleDelete} color="error" endIcon={<DeleteIcon />}>
                        刪除包裹
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ModifyPackage;
