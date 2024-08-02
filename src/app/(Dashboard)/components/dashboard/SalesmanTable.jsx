// "use server";
import React, { useState, useEffect } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/navigation";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import {
  FormControl,
  Menu,
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
import Checkbox from "@mui/material/Checkbox";
import TableSortLabel from "@mui/material/TableSortLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function EnhancedTableToolbar(props) {
  const { numSelected, ActionComponent } = props;
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
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
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Tooltip placement="top" title="Change Status">
          {ActionComponent()}
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

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
  list_menu_2
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tableRow.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };
  const handleClick = (event, id) => {
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
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <BaseCard>
      {selected.length > 0 && list_menu_2.length !== 0 && (
        <EnhancedTableToolbar
          numSelected={selected.length}
          ActionComponent={ActionComponent}
        />
      )}
      <TableContainer
        sx={{
          width: {
            xs: "274px",
            sm: "100%",
          },height: "74vh",overflow: "auto"
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
              {list_menu_2.length !== 0 && 
              <TableCell sx={{ padding: "5px" }} align="center">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  color="primary"
                  style={{ padding: "0px", color: "rgb(58 114 178)" }}
                  indeterminate={
                    selected.length > 0 && selected.length < tableRow.length
                  }
                  checked={
                    tableRow.length > 0 && selected.length === tableRow.length
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </div>
            </TableCell>}
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
                      // onClick={handleRequestSort(headCell.value)}
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

                    {/* <img
                      src="/images/icons/sort_icon.png"
                      alt="Sort"
                      style={{
                        objectFit: "contain",
                        marginLeft: "4px",
                        marginBottom: "3px",
                      }}
                    /> */}
                  </Typography>
                </TableCell>
              ))}
              <TableCell align="center" sx={{ padding: "5px" }}>
                <Typography className="table_cell" variant="h5">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center" sx={{ padding: "5px" }}>
                <Typography className="table_cell" variant="h5">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRow.map((row, index) => (
              <TableRow key={index}>
                {list_menu_2.length !== 0 && 
                <TableCell sx={{ padding: "4px 8px" }} align="center">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    key={index}
                    onChange={(event) => handleClick(event, row.id)}
                    checked={isSelected(row.id)}
                    style={{ padding: "0px", color: "#c3c3c3" }}
                  />
                </div>
              </TableCell>}
                {row.data.map((cell, index) => (
                  <TableCell
                    key={index}
                    sx={{ padding: "4px 8px" }}
                  >
                    <Box display="flex" alignItems="center">
                      {cell.td}
                    </Box>
                  </TableCell>
                ))}
                <TableCell
                  className="flex_display"
                  align="center"
                  sx={{ padding: "2px 8px" }}
                >
                  <Button
                    className={`table_body_style_fab arrival_${row.active_name} flex_display`}
                    sx={{ width: "20%" }}
                  >
                    <span>
                    {row.active_name}
                    </span>
                  </Button>
                </TableCell>
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
                        boxShadow: "0px 4px 7px 0px #00000024 !important",
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
      <Box
          sx={{ width: "100%", display: "flex", justifyContent: "end", p: 1 }}
        >
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

export default UserTbale;
