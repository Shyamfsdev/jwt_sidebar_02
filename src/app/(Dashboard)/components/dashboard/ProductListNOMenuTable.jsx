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
  Pagination,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";

const ProductCreate = ({
  product_table,
  tableRow,
  onPageChange,
  pageCount,
  pageNumber,
}) => {
  return (
    <BaseCard>
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },
          height: "65vh",
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
          <TableHead sx={{ background: "#185AA6" }}>
            <TableRow>
              {product_table.map((res) => (
                <TableCell
                  key={res.id}
                  align="center"
                  sx={{ padding: "0px", border: "1px solid #ffffff5e" }}
                >
                  <Typography
                    className="table_cell_white"
                    variant="h5"
                    style={{ padding: "8px 0px" }}
                  >
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
            {tableRow.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  className="table_cell_black"
                  sx={
                    tableRow.length === index + 1
                      ? {
                          padding: "8px 0px",
                          borderRight: "1px solid #9393935e",
                          borderBottom: "1px solid #9393935e !important",
                        }
                      : {
                          padding: "8px 0px",
                          borderRight: "1px solid #9393935e",
                        }
                  }
                  align="center"
                >
                  {index + 1}
                </TableCell>
                {row.data.map((cell, index2) => (
                  <TableCell
                    className="table_cell_black"
                    key={index2}
                    sx={
                      tableRow.length === index + 1
                        ? {
                            padding: "8px 0px",
                            borderRight: "1px solid #9393935e",
                            borderBottom: "1px solid #9393935e !important",
                          }
                        : {
                            padding: "8px 0px",
                            borderRight: "1px solid #9393935e",
                          }
                    }
                    align="center"
                  >
                    {cell.td}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "end", p: 1 }}>
        <Pagination
          color="primary"
          showFirstButton
          showLastButton
          onChange={onPageChange}
          size="small"
          count={pageCount}
          shape="rounded"
          page={pageNumber}
        />
      </Box>
    </BaseCard>
  );
};

export default ProductCreate;
