import React from "react";
import { styled, alpha, InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  border: "1px solid #e0e0e0",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: "100%",
  position: "absolute",
  right: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: "0.5",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "24ch",
      padding: "7px",
    },
  },
}));

export default function SearchFilter({
  onSearchButtonClick,
  searchValue,
  HandleOnClick,
}) {
  return (
      <Search
        sx={{
          margin: 0,
          height: "32px",
          width: "80% !important",
          margin: "10px !important",
        }}
      >
        <StyledInputBase
          size="small"
          placeholder="Search …"
          inputProps={{ "aria-label": "search" }}
          sx={{ fontSize: "14px", margin: 0, width: "100%" }}
          value={searchValue}
          onChange={(e) => onSearchButtonClick(e.target.value)}
        />
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
      </Search>
  );
}
