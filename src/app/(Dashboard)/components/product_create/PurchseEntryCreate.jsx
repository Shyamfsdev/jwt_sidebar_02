import React, { useState, useEffect } from "react";
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
import BaseCard from "../shared/DashboardCard";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductCreate = ({
  product_table,
  orderMaterial,
  handleProductChange,
  productMaster,
  divisionMaster,
  handleRemoveProductDetails,
  index
}) => {
  return (
    <BaseCard>
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },
          // height: "74vh",
          // overflow: "auto",
        }}
      >
        <Table
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            width: "3500px",
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
            {orderMaterial?.map((row, index1) => (
              <TableRow
                key={index1 + 1}
                style={{ border: "1px solid rgb(119 119 119 / 20%)" }}
              >
                <TableCell
                  sx={{
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {index1 + 1}
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
                      handleProductChange(event, value, index1,index, "material_code")
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
                      handleProductChange(event, value, index1,index, "material_name")
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
                      handleProductChange(event, value, index1,index, "division")
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
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.batch_number}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index1,index, "batch_number")
                    }
                    name="batch_number"
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
                    value={row.hsn_code}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index1,index, "hsn_code")
                    }
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
                      handleProductChange(event, value, index1,index, "material_qty")
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
                      handleProductChange(event, value, index1,index, "base_value")
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
                        index1,index,
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
                      handleProductChange(event, value, index1,index, "other_discount")
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
                    //   handleProductChange(event, value, index1,index, "cgst_rate")
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
                    variant="outlined"
                    size="small"
                    disabled
                    style={{ width: "24%" }}
                    value={row.cgst_value}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index1,index, "cgst_value")
                    // }
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
                    //   handleProductChange(event, value, index1,index, "sgst_rate")
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
                    variant="outlined"
                    size="small"
                    disabled
                    style={{ width: "24%" }}
                    value={row.sgst_value}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index1,index, "sgst_value")
                    // }
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
                    //   handleProductChange(event, value, index1,index, "cess_rate")
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
                    variant="outlined"
                    size="small"
                    disabled
                    fullWidth
                    value={row.cess_value}
                    // onChange={(event, value) =>
                    //   handleProductChange(event, value, index1,index, "cess_value")
                    // }
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
                    //     index1,index,
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
                    //   handleProductChange(event, value, index1,index, "total_tax")
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
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={row.tcs_value}
                    onChange={(event, value) =>
                      handleProductChange(event, value, index1,index, "tcs_value")
                    }
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
                    //   handleProductChange(event, value, index1,index, "total_payable")
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
                    padding: "8px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  <Tooltip placement="top" title="Delete" >
                    <IconButton onClick={() => handleRemoveProductDetails(index,index1)} className='delete_icon_style'>
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
