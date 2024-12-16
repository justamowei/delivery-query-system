import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

function ModifyDialog({ open, onClose, fields, apiUrl, onSubmit }) {
    const defaultForm = fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || ""; // 設置預設值
        return acc;
    }, {});

    const [form, setForm] = useState(defaultForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            // 每次開啟視窗時，將 form 重設為預設值
            setForm(defaultForm);
            setErrors({});
        }
    }, [open]);

    const validateField = (field, value) => {
        if (!value) {
            setErrors(prevErrors => ({ ...prevErrors, [field]: "此欄位為必填" }));
        } else {
            setErrors(prevErrors => {
                const { [field]: removed, ...rest } = prevErrors;
                return rest;
            });
        }
    };

    const handleBlur = (field) => {
        const value = form[field];
        validateField(field, value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleModify = async () => {
        Object.keys(form).forEach((field) => {
            validateField(field, form[field]);
        });

        if (Object.keys(errors).length > 0) return;

        try {
            const response = await axios.post(apiUrl, form, {
                headers: { "Content-Type": "application/json" }
            });
            alert(response.data.message);
            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error("Error modifying data:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(apiUrl, {
                headers: { "Content-Type": "application/json" },
                data: { package_id: form.package_id }
            });
            alert(response.data.message);
            onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("發生錯誤: " + error.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">修改/刪除資料</Typography>
                    <IconButton edge="end" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {fields.map((field, idx) => (
                    field.name === "status" ? (
                        <FormControl key={idx} fullWidth margin="dense" variant="outlined" error={!!errors[field.name]}>
                            <InputLabel>狀態</InputLabel>
                            <Select
                                name={field.name}
                                value={form[field.name]}
                                onChange={handleChange}
                                label="狀態"
                                onBlur={() => handleBlur(field.name)}
                            >
                                {field.options.map((option, index) => (
                                    <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                            {errors[field.name] && <FormHelperText error>{errors[field.name]}</FormHelperText>}
                        </FormControl>
                    ) : (
                        <TextField
                            key={idx}
                            margin="dense"
                            label={field.label}
                            fullWidth
                            variant="outlined"
                            name={field.name}
                            value={form[field.name]}
                            error={!!errors[field.name]}
                            helperText={errors[field.name] || ""}
                            onChange={handleChange}
                            onBlur={() => handleBlur(field.name)}
                        />
                    )
                ))}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleDelete} color="error" endIcon={<DeleteIcon />}>
                    刪除
                </Button>
                <Button variant="contained" onClick={handleModify} color="primary" endIcon={<SendIcon />}>
                    修改
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModifyDialog;
