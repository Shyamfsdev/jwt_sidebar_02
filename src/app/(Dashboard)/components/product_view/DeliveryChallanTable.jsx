// "use server";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
const formatNumber = (value) => {
  const number = parseFloat(value);
  return isNaN(number) ? 'N/A' : number.toFixed(2);
};
const ProductCreate = ({
  product_table,
  orderMaterial
}) => {
  return (
    <BaseCard>
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },
          height: "78vh",
          overflow: "auto",
        }}
      >
        <Table
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            overflow: "auto",
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
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                  className="table_cell_3"
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.material_code}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.material_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.uom}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.division_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.batch_number}

                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.hsn_code}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.material_qty}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {(row.total_payable && !isNaN(row.total_payable)) ? row.total_payable.toFixed(2) : '0.00'}
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
