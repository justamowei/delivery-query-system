import React, { useState, useEffect } from "react";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem,
        FormControl, InputLabel, IconButton, Typography, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

function UpdatePackage({ open, onClose, rowData, setReload}) {
    const [form, setForm] = useState({package_id: "", status: "", location: ""});
    useEffect(() => {
        if (rowData && open) {
            setForm({
                package_id: rowData.package_id || "",
                status: rowData.status || "Pending",
                location: "",
            });
        }
    }, [rowData, open]);

    const handleUpdate = async () => {
        if (!form.status || !form.location) {
            alert("所有欄位都必填，請確認所有欄位都已填寫。");
            return;
        }
        try {
            const response = await axios.post("/delivery-query-system/api/update_package.php", form, {
                headers: { "Content-Type": "application/json" }
            });
            alert(response.data.message);
            onClose();
            setReload(true);
        } catch (error) {
            console.error("Error updating package:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">更新包裹狀態</Typography>
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

                <FormControl margin="dense" fullWidth variant="outlined">
                    <InputLabel>狀態</InputLabel>
                    <Select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        label="狀態"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Delivery">In Delivery</MenuItem>
                        <MenuItem value="Arrived">Arrived</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    margin="dense"
                    label="當前位置"
                    fullWidth
                    variant="outlined"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="center" width="100%">
                    <Button variant="contained" onClick={handleUpdate} color="primary" endIcon={<SendIcon />}>
                        更新包裹
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}

export default UpdatePackage;
