import React, { useState, useEffect } from "react";
import axios from "axios";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography,
        IconButton, InputLabel, Select, MenuItem, FormControl} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

function ModifyAndDeleteDeliveryHistory({ open, onClose, rowData, setHistoryReload }) {
    const [form, setForm] = useState({
        package_id: "",
        status: "",
        new_current_location: "",
        new_timestamp: "",
        old_current_location: "",
        old_timestamp: ""
    });

    useEffect(() => {
        if (rowData && open) {
            setForm({
                package_id: rowData.package_id || "",
                status: rowData.status || "",
                new_current_location : rowData.current_location || "",
                new_timestamp: rowData.timestamp || "",
                old_current_location: rowData.current_location || "",
                old_timestamp: rowData.timestamp || ""
            });
        }
    }, [rowData, open]);

    const handleModify = async () => {
        if (!form.status || !form.new_current_location || !form.new_timestamp) {
            alert("所有欄位都必填，請確認所有欄位都已填寫。");
            return;
        }
        try {
            // console.log("form", form);
            const response = await axios.post(
                "/delivery-query-system/api/modify_and_delete_delivery_history.php",
                form,
                { headers: { "Content-Type": "application/json" } }
            );
            alert(response.data.message);
            console.log("修改歷史紀錄", response.data);
            onClose();
            setHistoryReload(true);
        } catch (error) {
            console.error("Error modifying delivery history:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            // console.log("form", form);
            const response = await axios.delete(
                "/delivery-query-system/api/modify_and_delete_delivery_history.php",
                {
                    headers: { "Content-Type": "application/json" },
                    data: {
                        package_id: form.package_id,
                        old_current_location: form.old_current_location,
                        old_timestamp: form.old_timestamp
                    }
                }
            );
            alert(response.data.message);
            console.log("刪除歷史紀錄", response.data);
            onClose();
            setHistoryReload(true);
        } catch (error) {
            console.error("Error deleting delivery history:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">修改/刪除配送歷史</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 10 }}>
                        ※若要刪除配送歷史，則不用輸入任何資料
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
                    value={form.new_current_location}
                    onChange={(e) => setForm({ ...form, new_current_location: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="時間"
                    fullWidth
                    variant="outlined"
                    value={form.new_timestamp}
                    onChange={(e) => setForm({ ...form, new_timestamp: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleDelete} color="error" endIcon={<DeleteIcon />}>
                    刪除配送歷史
                </Button>
                <Button variant="contained" onClick={handleModify} color="primary" endIcon={<SendIcon />}>
                    修改配送歷史
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifyAndDeleteDeliveryHistory;
