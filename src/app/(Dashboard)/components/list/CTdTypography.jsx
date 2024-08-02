import React from 'react'
import {
    Typography,
  } from "@mui/material";

export default function CTdTypography({children}) {
  return (
    <Typography
        px={2}
        style={{
            fontSize: "14px",
        }}
        >
        {children}
    </Typography>
  )
}
