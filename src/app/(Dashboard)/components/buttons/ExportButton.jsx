import React from "react";
import { Button, Box } from "@mui/material";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";

export default function ExportButton({}) {
  return (
    <Box>
      <Button
        size="small"
        variant="outlined"
      >
        <ContentPasteGoIcon style={{ fontSize: "16px" }} />
        <span style={{ marginLeft: "5px" }}>Export</span>
      </Button>
    </Box>
  );
}
