import React, { useState, useEffect } from "react";
import {
  Menu,
  Typography,
  Box,
  Toolbar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Pagination,
  Checkbox,
  TableSortLabel,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "../../loading";
import BaseCard from "../shared/DashboardCard";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function EnhancedTableToolbar(props) {
  const { numSelected,SalesinvoicePickCreateMaster } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
        minHeight: "44px",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%", fontSize: "12px" }}
        color="inherit"
        variant="subtitle1"
        component="div"
        className="nunito_font"
      >
        {numSelected} selected
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip placement="top" title="Generate Picklist">
          <Button
            className="nunito_font_width generate"
            onClick={() => SalesinvoicePickCreateMaster()}
          >
            Generate Picklist
          </Button>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

const SalesInvoiceTable = ({
  pageCount,
  tableHead,
  tableRow,
  rowsPerPage,
  onPageChange,
  page,
  ActionComponent,
  anchorEl2,
  handleClose2,
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
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const ACCESS_TOKEN = Cookies.get("token");

  const [isLoading, setIsLoading] = useState(false);

  const SalesinvoicePickCreateMaster = async () => {
    setIsLoading(true);
    const mdata = {
      data_uniq_id: selected,
      access_token: ACCESS_TOKEN
    };
    axiosPost.post(`pick_list_generate`, mdata).then((res) => {
      setIsLoading(false);
      if (res.data.action === "Error") {
      } else {
        setTimeout(() => {
          APIRecall();
          setSelected([]);
        }, 500);
      }
    });
  };

  const handleClick = (event, id, status) => {
    if (status === "waiting_for_arrival") {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRow.length) : 0;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BaseCard>
      {selected.length > 0 && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          ActionComponent={ActionComponent}
          SalesinvoicePickCreateMaster={SalesinvoicePickCreateMaster}
        />
      )}
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
          stickyHeader
          aria-label="customized table"
          sx={{
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <TableHead sx={{ background: "#F0F0F0" }}>
            <TableRow>
              <TableCell padding="checkbox">
                {/* <Checkbox
                  size="small"
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < tableRow.length
                  }
                  checked={
                    tableRow.length > 0 && selected.length === tableRow.length
                  }
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                /> */}
              </TableCell>
              {tableHead.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{ padding: "5px" }}
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
              <TableCell align="center" sx={{ padding: "5px" }}>
                <Typography className="table_cell" variant="h5">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRow.map((row, index) => {
              const isItemSelected = isSelected(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer", borderBottom: "1px solid #e5eaef" }}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(event) => handleClick(event, row.id, row.active)}
                  >
                    <Checkbox
                      color="primary"
                      size="small"
                      sx={row.active !== "waiting_for_arrival" && {opacity:'0.2'}}
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  {row.data.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
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
                      />
                    </IconButton>
                    <Menu
                      id={`msgs-menu-${row.id}`} // Make each menu unique
                      anchorEl={anchorEl2}
                      keepMounted
                      open={Boolean(anchorEl2)}
                      onClose={handleClose2}
                      anchorOrigin={{ horizontal: "right", vertical: "top" }} // Corrected vertical position
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
              );
            })}
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
        />
      </Box>
    </BaseCard>
  );
};

export default SalesInvoiceTable;
