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
  InvoiceTaxComponent,
  TotalComponent
}) => {
  return (
    <Box sx={{ margin: "8px" }}>
      <Box className="flex_display" sx={{ width: "100%" }}>
        {SupplierDetailsComponent()}
        <Box sx={{ width: "85%", height: "83vh", overflow: "auto" }}>
          <Paper sx={{ mb: 1, p: 1 }}>
            {ProductCreateComponent()}
          </Paper>
          <Box className="flex_display" sx={{ width: "100%", height: "28%" }}>
            <Paper sx={{ p: 1, mr: 1, width: "70%", height: "100%" }}>
              <Box sx={{ mb: 1, mt: 1 }}>
                <Typography
                  variant="p"
                  fontSize={"14px"}
                  fontWeight={"bold"}
                  color={"primary"}
                >
                  Other Details
                </Typography>
              </Box>
              {InvoiceTaxComponent()}
            </Paper>
            <Paper
              sx={{
                p: 1,
                width: "30%",
                backgroundColor: "#E8F3FF",
                height: "100%",
              }}
            >
              <Box sx={{ mb: 1, mt: 1 }}>
                <Typography variant="p" fontSize={"14px"} fontWeight={"bold"}>
                  Total Values
                </Typography>
              </Box>
              {TotalComponent()}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseLayout;
