// "use server";
import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import {
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Fab,
  IconButton,
  List,
  ListItemText,
  ListItemButton,
  Divider,
  Pagination,
  TablePagination,
  Select,
} from "@mui/material";
// ProductPerformance.js
// ... (your other imports)
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BaseCard from "../shared/DashboardCard";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';

const ProductCreate = ({
  product_table,
  orderMaterial,
  handleProductChange,
  productMaster,
  divisionMaster,
  handleRemoveProductDetails,
  HandleAddBatch
}) => {
  return (
    <BaseCard>
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },
          height: "74vh",
          overflow: "auto",
        }}
      >
        <Table
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            width: "4500px",
            overflow: "auto",
          }}
        >
          <TableHead sx={{ background: "#185AA6" }}>
            <TableRow>
              {product_table.map((res) => (
                <TableCell
                  key={res.id}
                  align="center"
                  sx={{ padding: "0px", border: "1px solid #ffffff5e" }}
                >
                  <Typography className="table_cell_white" variant="h5">
                    {res.th}
                  </Typography>
                  {res.sub_item?.length !== 0 && (
                    <Box className="invoice_table_sub">
                      {res.sub_item?.map((val) => (
                        <Typography
                          key={val.id}
                          className="table_cell"
                          variant="h5"
                        >
                          {val.tl}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orderMaterial.map((row, index) => (
              <TableRow
                key={index}
                style={{ border: "1px solid rgb(119 119 119 / 20%)" }}
              >
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  {index + 1}
                </TableCell>
                <TableCell
                    sx={{
                        padding: "8px",
                        border: "1px solid rgb(119 119 119 / 20%)",
                    }}
                    
                    align="center"
                  >
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.mismatch_material_code}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "mismatch_material_code")
                    }
                    name="mismatch_material_code"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    fullWidth
                    value={row.mismatch_material_name}
                    name="material_code"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={row.mismatch_batch_list}
                    value={
                      row.mismatch_batch_list?.find(
                        (year) => year.batch_number === row.mismatch_batch_number
                      ) || null
                    }
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "mismatch_batch_number")
                    }
                    getOptionLabel={(val) => val.batch_number}
                    required
                    id="mismatch_batch_number"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={row.mismatch_batch_number}
                        style={{ margin: "0px" }} // Align label to center
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                      />
                    )}
                    clearIcon={null}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.mismatch_material_qty}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "mismatch_material_qty")
                    }
                    name="mismatch_material_qty"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    fullWidth
                    value={row.mismatch_base_value}
                    name="material_code"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.material_code}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "material_code")
                    }
                    name="material_code"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={productMaster}
                    value={
                      productMaster.find(
                        (year) => year.product_name === row.material_name
                      ) || null
                    }
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "material_name")
                    }
                    getOptionLabel={(val) => val.product_name}
                    required
                    id="supplier"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={row.material_name}
                        style={{ margin: "0px" }} // Align label to center
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                      />
                    )}
                    clearIcon={null}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.uom}
                    name="uom"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={divisionMaster}
                    value={
                      divisionMaster.find(
                        (year) => year.division === row.division_name
                      ) || null
                    }
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "division")
                    }
                    getOptionLabel={(val) => val.division}
                    required
                    id="division"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={row.division_name}
                        style={{ margin: "0px" }} // Align label to center
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                      />
                    )}
                    clearIcon={null}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={row.batch_list}
                    value={
                      row.batch_list?.find(
                        (year) => year.batch_number === row.batch_number
                      ) || null
                    }
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "batch_number")
                    }
                    getOptionLabel={(val) => val.batch_number}
                    required
                    id="batch_number"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={row.batch_number}
                        style={{ margin: "0px" }} // Align label to center
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                      />
                    )}
                    clearIcon={null}
                  />
                    </div>
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.hsn_code}
                    name="hsn_code"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.material_qty}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "material_qty")
                    }
                    name="material_qty"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.base_value}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "base_value")
                    }
                    name="base_value"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.invoice_discount_per}
                    onChange={(event, value) =>
                      handleProductChange(
                        event,
                        value,
                        index,
                        "invoice_discount"
                      )
                    }
                    name="invoice_discount"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.other_discount_per}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index, "other_discount")
                    }
                    name="other_discount"
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    borderBottom: "0px solid rgb(119 119 119 / 20%)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    style={{ width: "24%" }}
                    value={row.cgst_rate}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "cgst_rate")
                    // }
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
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    style={{ width: "24%" }}
                    value={row.cgst_value}
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
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    style={{ width: "24%" }}
                    value={row.sgst_rate}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "sgst_rate")
                    // }
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
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    style={{ width: "24%" }}
                    value={row.sgst_value}
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    value={row.cess_rate}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "cess_rate")
                    // }
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.cess_value}
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    fullWidth
                    value={row.additional_cess_value}
                    // onChange={(event, value) =>
                    //   handleProductChange(
                    //     event,
                    //     value,
                    //     index,
                    //     "additional_cess_value"
                    //   )
                    // }
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    value={row.total_tax}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "total_tax")
                    // }
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    disabled
                    fullWidth
                    value={row.tcs_rate}
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    disabled
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.tcs_value}
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    value={row.total_payable}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "total_payable")
                    // }
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <Tooltip placement="top" title="Delete" >
                    <IconButton onClick={() => handleRemoveProductDetails(index)} className='delete_icon_style'>
                        <DeleteIcon />
                    </IconButton>
                    </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseCard>
  );
};

export default ProductCreate;
