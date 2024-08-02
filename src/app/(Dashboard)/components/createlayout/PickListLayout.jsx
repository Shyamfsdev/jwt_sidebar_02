import React, { useState, useEffect } from "react";
import {
    Grid,
    Box,
    Typography,
    Paper,
  } from "@mui/material";

const PurchaseLayout = ({
  SupplierDetailsComponent,
  ProductCreateComponent,
}) => {
  return (
    <Box sx={{ margin: "8px" }}>
      <Box className="flex_display" sx={{ width: "100%" }}>
        {SupplierDetailsComponent()}
        <Box sx={{ width: "80%", height: "83vh", overflow: "auto" }}>
          <Paper sx={{ mb: 1, p: 1 }}>
            {ProductCreateComponent()}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseLayout;
