import React from "react";
import { Box, Typography, Button, IconButton, Drawer } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CDrawer({
  position = "right",
  open,
  close,
  openType,
  title,
  buttonName,
  children,
  onSave,
}) {
  return (
    <Drawer anchor={position} open={open} onClose={close}>
      <Box sx={{ minWidth: "400px", pb: 1, maxWidth: "700px" }} >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1,
            px: 1,
            zIndex: 9,
            top: "0px",
            backgroundColor: "white",
            position: "sticky",
            borderBottom: "1px solid #3636363b",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={close} size="small">
              <ArrowBackIcon style={{ color: "black" }} />
            </IconButton>
            <Typography
              variant="h6"
              className="nunito_font"
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#185AA6",
              }}
            >
              {openType === 1 ? "Create" : "Edit"} {title}
            </Typography>
          </Box>
          <Box>
            <Button onClick={onSave} size="small" variant="contained">
              {buttonName}
            </Button>
          </Box>
        </Box>
        <Box sx={{ p: 1, px: 2, my: 1 }}>{children}</Box>
      </Box>
    </Drawer>
  );
}
