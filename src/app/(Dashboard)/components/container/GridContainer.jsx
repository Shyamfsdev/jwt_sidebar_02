
import React from "react";
import {
    Grid,
} from "@mui/material";
function GridContainer({children}) {
  return (
    <Grid
    container spacing={1} sx={{padding:"4px 12px 4px 4px", margin:'0 0 10px 0 !important', borderRadius:"8px", border:"1px solid #e0e0e0"}}
    >
        {children}
    </Grid>
  )
}

export default GridContainer


