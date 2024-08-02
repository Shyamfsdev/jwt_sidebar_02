import React, { useState, useEffect } from "react";
import {
    Grid,
    Box,
    Typography,
    Paper,
  } from "@mui/material";

const PurchaseLayout = ({
  SupplierDetailsComponent,
  ProductCreateComponent
}) => {
  return (
    <Box sx={{ margin: "8px" }}>
      <Box className="flex_display" sx={{ width: "100%" }}>
        {SupplierDetailsComponent()}
        {ProductCreateComponent()}
      </Box>
    </Box>
  );
};

export default PurchaseLayout;
