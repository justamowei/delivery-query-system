import { useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function AddPackage() {
    const [form, setForm] = useState({
        name: "",
        sender: "",
        receiver: "",
    });
    const [open, setOpen] = useState(false); // 控制模態框開關

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost/db_project  /backend_api/add_package.php", form, {
                headers: { "Content-Type": "application/json" }
            });

            alert(response.data.message);
            handleClose();
        } catch (error) {
            console.error("Error adding package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                新增包裹
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>新增包裹</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="名稱"
                        fullWidth
                        variant="outlined"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="primary" endIcon={<CloseIcon />}>
                        取消
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" endIcon={<SendIcon />}>
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPackage;
