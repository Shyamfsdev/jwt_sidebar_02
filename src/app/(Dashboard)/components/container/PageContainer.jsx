
import React from "react";
import {
  Box,
} from "@mui/material";
function PageContainer({children}) {
  return (
    <Box
      sx={{
        padding: "15px 5px",
        background: "#F4F9FF",
        marginTop: "-7px",
        borderTop: "2px solid #dddddd66",
        height:"calc(100vh - 45px)"
      }}
    >
        {children}
    </Box>
  )
}

export default PageContainer


