import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
// import Paginations from '../../ui-components/pagination/page';
import { Grid, Pagination, Stack } from "@mui/material";

import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
  createData(9, "KitKat", 518, 26.0, 65, 7.0),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0),
  createData(11, "Marshmallow", 318, 0, 81, 2.0),
  createData(12, "Nougat", 360, 19.0, 9, 37.0),
  createData(14, "Oreo", 437, 18.0, 63, 4.0),
  createData(15, "Oreo", 437, 18.0, 63, 4.0),
  createData(16, "Oreo", 437, 18.0, 63, 4.0),
  createData(17, "Oreo", 437, 18.0, 63, 4.0),
  createData(18, "Oreo", 437, 18.0, 63, 4.0),
  createData(19, "Oreo", 437, 18.0, 63, 4.0),
  createData(20, "Oreo", 437, 18.0, 63, 4.0),
  createData(21, "Oreo", 437, 18.0, 63, 4.0),
  createData(23, "Oreo", 437, 18.0, 63, 4.0),
  createData(24, "Oreo", 437, 18.0, 63, 4.0),
  createData(25, "Oreo", 437, 18.0, 63, 4.0),
  createData(26, "Oreo", 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    tableHead,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ bgcolor: "#F0F0F0" }}>
      <TableRow>
        <TableCell></TableCell>
        {tableHead.map((headCell) => (
          <TableCell
            color="primary"
            className="table_cell"
            style={{padding: '8px 0px'}}
            key={headCell.id}
            align={headCell.align ? headCell.align : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.action ? (
              <Typography
                className="table_cell"
                color="primary"
                fontWeight={"bold"}
              >
                {headCell.label}
              </Typography>
            ) : (
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
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, ActionComponent, onDelete } = props;

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
        <Tooltip placement="top" title="Change Status">
          {ActionComponent()}
        </Tooltip>

        <Tooltip placement="top" title="Delete">
          <IconButton onClick={onDelete} className="delete_icon_style">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default function MasterTable({
  tableHead,
  tableRow,
  onPageChange,
  pageCount,
  order,
  orderBy,
  setOrderBy,
  setOrder,
  ActionComponent,
  selected,
  setSelected,
  onDelete,
}) {
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tableRow.map((n) => n.id);
      setSelected(newSelected);

      return;
    }
    setSelected([]);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box sx={{ width: "100%", padding: '8px 0px' }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {selected.length > 0 && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            ActionComponent={ActionComponent}
            onDelete={onDelete}
          />
        )}
        <TableContainer
          id="table-container"
          style={{ height: "75vh", overflow: "auto" }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-label="customized table"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              tableHead={tableHead}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableRow.length}
            />
            <TableBody>
              {tableRow.map((row, index) => {
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid #e5eaef !important",
                    }}
                  >
                    <TableCell sx={{borderBottom: "1px solid #e5eaef !important"}}></TableCell>
                    {row.data.map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ fontSize: "13px" }}
                        component="th"
                        scope="row"
                        padding="none"
                        align={cell.align ? cell.align : "left"}
                      >
                        {cell.comp}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              {tableRow.length === 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6}> No data found</TableCell>
                </TableRow>
              )}
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
      </Paper>
    </Box>
  );
}
