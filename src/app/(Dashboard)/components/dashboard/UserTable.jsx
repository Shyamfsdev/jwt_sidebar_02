// "use server";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Pagination,
  TablePagination,
  Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BaseCard from "../shared/DashboardCard";
import TableSortLabel from "@mui/material/TableSortLabel";

const UserTbale = ({
  pageCount,
  pageNumber,
  limitEnd,
  onMenuClick,
  searchValue,
  onRefresh,
  onSearchButtonClick,
  onAddClick,
  tableHead,
  tableRow,
  dataCount,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
  page,
  onLimitChange,
  anchorEl2,
  setAnchorEl2,
  handleClose2,
  ActionComponent,
  setSelected,
  selected,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  APIRecall,
  handleOnActionClick,
  MenuComponent,
}) => {
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    APIRecall();
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

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
          stickyHeader
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <TableHead sx={{ background: "#F0F0F0" }}>
            <TableRow>
              {tableHead.map((headCell) => (
                <TableCell
                  key={headCell.value}
                  className="custom_padding"
                  align="left"
                >
                  <Typography
                    className="table_cell"
                    variant="h5"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.value}
                      direction={orderBy === headCell.value ? order : "asc"}
                      onClick={createSortHandler(headCell.value)}
                    >
                      <Typography
                        className="table_cell"
                        color="primary"
                        fontWeight={"bold"}
                      >
                        {headCell.label}
                      </Typography>

                      {orderBy === headCell.id ? (
                        <Box component="span">
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="center" className="custom_padding">
                <Typography className="table_cell" variant="h5">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRow.map((row, index) => (
              <TableRow key={row.id}>
                {row.data.map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    sx={{ padding: "4px 8px" }}
                  >
                    <Box display="flex" alignItems="center">
                      {cell.td}
                    </Box>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ padding: "4px 8px" }}>
                  <IconButton
                    style={{ padding: 0 }}
                    onClick={(event) => handleOnActionClick(event, row)}
                  >
                    <MoreVertIcon
                      style={{ width: "0.8em", height: "0.8em" }}
                    ></MoreVertIcon>
                  </IconButton>
                  <Menu
                    id="msgs-menu"
                    anchorEl={anchorEl2}
                    keepMounted
                    open={Boolean(anchorEl2)}
                    onClose={handleClose2}
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    sx={{
                      "& .MuiMenu-paper": {
                        minWidth: "100px",
                        boxShadow: "0px 0px 3px 0px #edf4f8",
                      },
                    }}
                  >
                    {MenuComponent(row.id)}
                  </Menu>
                </TableCell>
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

export default UserTbale;
