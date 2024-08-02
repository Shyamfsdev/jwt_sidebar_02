import React from "react";
import { IconButton, Box } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

export default function FilterButton({ HandleChangeFilter, filtersList }) {
  return (
    <Box>
      <IconButton
        size="small"
        onClick={() => HandleChangeFilter()}
        sx={{
          fontSize: "12px",
          fontWeight: "300",
          border: "1px solid #e0e0e0",
          borderRadius: "6px",
          padding: "7px",
        }}
      >
        {filtersList == false ? (
          <FilterListIcon style={{ fontSize: "16px", color: "black" }} />
        ) : (
          <FilterListOffIcon style={{ fontSize: "16px" }} />
        )}
      </IconButton>
    </Box>
  );
}
