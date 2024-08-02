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
  HandleAddBatch,
  handleFocus
}) => {
  return (
    <BaseCard>
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },
          height: "56.5vh",
          overflow: "auto",
        }}
      >
        <Table
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
         <TableHead sx={{ background: "#185AA6" }}>
            <TableRow>
              {product_table.map((res) => (
                <TableCell
                  key={res.id}
                  align="center"
                  sx={{ padding: "6px", border: "1px solid #ffffff5e",width: `${res.weigh}` }}
                >
                  <Typography className="table_cell_white" variant="h5">
                    {res.th}
                  </Typography>
                  {res.sub_item?.length !== 0 && (
                    <Box className="invoice_table_sub">
                      {res.sub_item?.map((val,index) => (
                        <Typography
                          key={index}
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
                    padding: "6px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "6px",
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
                    value={row.material_code}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "material_code")
                    // }
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
                    padding: "6px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    disabled
                    style={{ marginTop: "0px" }}
                    options={productMaster}
                    value={
                      productMaster.find(
                        (year) => year.product_name === row.material_name
                      ) || null
                    }
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "material_name")
                    // }
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
                    padding: "6px",
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
                    padding: "6px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  
                  align="center"
                >
                    <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    disabled
                    options={row.batch_list}
                    value={
                      row.batch_list?.find(
                        (year) => year.batch_number === row.batch_number
                      ) || null
                    }
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "batch_number")
                    // }
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
                </TableCell>
                <TableCell
                  sx={{
                    padding: "6px",
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
                    value={row.balance_qty}
                    name="balance_qty"
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
                    padding: "6px",
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
                    onFocus={() => handleFocus(index)}
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
                    padding: "6px",
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
                    value={row.base_value}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index, "base_value")
                    // }
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
                    padding: "6px",
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
