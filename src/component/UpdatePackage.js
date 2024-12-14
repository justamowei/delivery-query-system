import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function UpdatePackage() {
    const [form, setForm] = useState({
        package_id: "",
        status: "Pending",  // 預設狀態
        location: "",
    });
    const [open, setOpen] = useState(false); // 控制模態框開關

    // 開啟模態框
    const handleClickOpen = () => setOpen(true);

    // 關閉模態框
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost/db_project/backend_api/update_package.php", form, {
                headers: { "Content-Type": "application/json" }
            });

            alert(response.data.message);  // 顯示回應訊息
            handleClose();  // 提交後關閉模態框
        } catch (error) {
            console.error("Error updating package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                更新包裹狀態
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>更新包裹狀態</DialogTitle>
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
                        label="狀態"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                    <Button variant="contained" onClick={handleSubmit} color="primary" endIcon={<SendIcon />}>
                        更新包裹狀態
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UpdatePackage;
