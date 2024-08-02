import React, {useState} from "react";
import SortIcon from "@mui/icons-material/Sort";
import DatePickerPage from "../container/DataRange";
import {
  Typography,
  Menu,
  Button
} from "@mui/material";

export default function DateFilter({ title, onDateRangeChange, isSelected }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setdateRange] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDone = () => {
    handleClose();
    onDateRangeChange(dateRange);
  };

  const onDateChange = (data) => {
    setdateRange(data);
  };
  return (
    <>
      <Button
        fullWidth
        size="small"
        variant="outlined"
        startIcon={<SortIcon />}
        sx={{
          fontSize:"14px",
          color: "#2a3547",
          borderColor: "rgb(123 123 123 / 30%)",
          bgcolor: isSelected && "#185aa617",
        }}
        onClick={handleClick}
      >
        <Typography variant="p">{title}</Typography>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <DatePickerPage onDateChange={onDateChange} />
        <Button
          variant="contained"
          onClick={handleDone}
          color={"primary"}
          sx={{ margin: "15px", float: "right" }}
          disabled={dateRange.length === 0}
        >
          Done
        </Button>
      </Menu>
    </>
  );
}
