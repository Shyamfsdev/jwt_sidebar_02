import React from "react";
import { Box, Typography } from "@mui/material";

export default function CStatus({ active_status }) {
  return (
    <Box sx={{ px: 2 }}>
      <Box
        sx={
          active_status == 1
            ? {
                bgcolor: "#E7FFEF",
                color: "#3D8325",
                width: "max-content",
                p: 0.5,
                my: 0.5,
                borderRadius: 1,
              }
            : {
                bgcolor: "#FFE7E7",
                color: "#FF4141",
                width: "max-content",
                p: 0.5,
                my: 0.5,
                borderRadius: 1,
              }
        }
      >
        <Typography px={1} fontSize={"14px"}>
          {active_status == 1 ? "Active" : "Inactive"}
        </Typography>
      </Box>
    </Box>
  );
}
