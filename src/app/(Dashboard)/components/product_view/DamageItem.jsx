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

const ProductCreate = ({ product_table, orderMaterial }) => {
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
            width: "2000px",
            overflow: "auto",
          }}
        >
          <TableHead
            sx={{
              background: "#185AA6",
              position: "sticky",
              top: "-1px",
              zIndex: 1,
            }}
          >
            <TableRow>
              {product_table.map((res) => (
                <TableCell
                  key={res.id}
                  align="center"
                  sx={{ padding: "8px 0px", border: "1px solid #ffffff5e" }}
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
                    padding: "8px 0px",
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
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.purchase_details?.[0]?.supplier_data?.supplier_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.purchase_details?.[0]?.supplier_data?.contact_no}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.purchase_details?.[0]?.supplier_data?.address?.district}
                </TableCell>
               
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.material_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.material_code}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.division}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.hsn_code}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.batch_number}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.purchase_details?.[0]?.pur_entry_number}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.purchase_details?.[0]?.invoice_date}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.created_f_date}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.user_details?.first_name + row.user_details?.last_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  <Box style={{ padding: "0px" }}>
                    <span
                      className={`table_body_style_fab arrival_${row.purchase_details?.[0]?.purchase_entry_status_org}`}
                      sx={{ width: "20%" }}
                    >
                      {row.purchase_details?.[0]?.purchase_entry_status}
                    </span>
                  </Box>
                </TableCell>
                 
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.total_qty !== null && row.total_qty !== undefined ? row.total_qty.toFixed(2) : "NA"}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {(row.total_amount)?.toFixed(2)}
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
