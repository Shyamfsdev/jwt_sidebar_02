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

const ProductCreate = ({ product_table, orderMaterial,total_amount,total_quantity }) => {
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
            {orderMaterial?.map((row, index) => (
              <TableRow
                key={row.name}
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
                  {row.customer_data?.customer_name ? row.customer_data?.customer_name: 'NA'}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.customer_data?.contact_number ? row.customer_data?.contact_number: 'NA'}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.customer_data?.address?.district ?  row.customer_data?.address?.district: 'NA'}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.customer_data?.gst_no ? row.customer_data?.gst_no: 'NA'}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.sales_man_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.route_name}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.sales_invoice_number}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {row.invoice_date}
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
                      className={`table_body_style_fab arrival_${row.sal_invoice_status_org}`}
                      sx={{ width: "20%" }}
                    >
                      {row.sal_invoice_status}
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
                  {(row.total_qty).toFixed(2)}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {(row.sub_total)?.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {orderMaterial?.length !== 0 && orderMaterial !== undefined && <TableRow
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
                  {orderMaterial.length + 1}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  TOTAL
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding: "8px 0px",
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  --
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
                      className="table_body_style_fab"
                      sx={{ width: "20%" }}
                    >
                      --
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
                  {(total_quantity).toFixed(2)}
                </TableCell>
                <TableCell
                  className="table_cell_3"
                  sx={{
                    padding:'8px 0px',
                    border: "1px solid rgb(119 119 119 / 20%)",
                  }}
                  align="center"
                >
                  {(total_amount).toFixed(2)}
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseCard>
  );
};

export default ProductCreate;
