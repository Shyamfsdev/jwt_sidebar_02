import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  Stack
} from "@mui/material";

const PurchaseInvoiceTax = ({ orderMaterial, index }) => {
  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ mr: 1, p: "0px 8px" }}>
        <Typography variant="p" fontSize={"14px"} fontWeight={"bold"}>
          GST Values
        </Typography>
        <Box>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="CGST Rate"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].cgst_rate}
                name="cgst_rate"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="CGST Value"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].cgst_value}
                name="cgst_value"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="SGST Rate"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].sgst_rate}
                name="sgst_rate"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="SGST Value"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].sgst_value}
                name="sgst_value"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ mr: 1, p: "0px 8px" }}>
        <Typography variant="p" fontSize={"14px"} fontWeight={"bold"}>
          Cess Details
        </Typography>
        <Box>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Cess Rate"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].cess_rate}
                name="cess_rate"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Cess Value"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].cess_value}
                name="cess_value"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Additional Cess Value"
              size="small"
              fullWidth
              disabled
              value={orderMaterial[index].additional_cess_value}
              name="additional_cess_value"
              inputProps={{
                style: {
                  fontSize: "12px",
                  width: "100%",
                },
              }}
              InputLabelProps={{
                style: {
                  fontSize: "12px",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: "0px 8px" }}>
        <Typography variant="p" fontSize={"14px"} fontWeight={"bold"}>
          Total
        </Typography>
        <Box>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="TCS Rate"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].tcs_rate}
                name="tcs_rate"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="TCS Value"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].tcs_value}
                name="tcs_value"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Total Tax"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].total_tax}
                name="total_tax"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Total Payable"
                size="small"
                fullWidth
                disabled
                value={orderMaterial[index].total_payable}
                name="total_payable"
                inputProps={{
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default PurchaseInvoiceTax;
