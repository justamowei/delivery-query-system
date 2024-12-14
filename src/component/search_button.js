import React from "react";
import { Button } from "@mui/material";

export default function Search_Button({ onClick, color = "primary", ...props }) {
    return (
        <Button
            variant="contained"
            color={color}
            onClick={onClick}
            sx={props.sx} 
            {...props}
        >
            查詢
        </Button>
    );
}
