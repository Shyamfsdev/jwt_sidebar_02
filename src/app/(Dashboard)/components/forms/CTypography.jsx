import React from 'react'
import {
    Typography,
  } from "@mui/material";

export default function CTypography({children}) {
  return (
    <Typography
        variant="h5"
        style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#185AA6",
            marginBottom: "10px",
        }}
        >
        {children}
    </Typography>
  )
}
