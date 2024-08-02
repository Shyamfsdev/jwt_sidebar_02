import {
  Grid,
  Box,
  Typography,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Avatar,
  Paper,
  IconButton,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Divider,
  Menu,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

const VehicleCreate = ({ vehicleDetails, HandleVehicleDetails }) => {
  return (
    <>
      <Box sx={{ mb: 2, mt: 1 }}>
        <Typography
          variant="p"
          fontSize={"14px"}
          fontWeight={"bold"}
          color={"primary"}
        >
          Vehicle Details
        </Typography>
      </Box>
      <Box sx={{ margin: "8px 0px" }}>
        <TextField
          id="outlined-basic"
          label="Company Name"
          variant="outlined"
          size="small"
          style={{ marginTop: "8px" }}
          fullWidth
          value={vehicleDetails.company_name}
          onChange={(event) => HandleVehicleDetails(event)}
          name="company_name"
          inputProps={{
            style: {
              fontSize: "12px",
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
      <Box sx={{ margin: "8px 0px" }}>
        <TextField
          id="outlined-basic"
          label="Vehicle No."
          variant="outlined"
          size="small"
          style={{ marginTop: "8px" }}
          fullWidth
          value={vehicleDetails.vehicle_number}
          onChange={(event) => HandleVehicleDetails(event)}
          name="vehicle_number"
          inputProps={{
            style: {
              fontSize: "12px",
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
      <Box sx={{ margin: "8px 0px" }}>
        <TextField
          id="outlined-basic"
          label="Driver Name"
          variant="outlined"
          size="small"
          style={{ marginTop: "8px" }}
          fullWidth
          value={vehicleDetails.driver_name}
          onChange={(event) => HandleVehicleDetails(event)}
          name="driver_name"
          inputProps={{
            style: {
              fontSize: "12px",
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
      <Box sx={{ margin: "8px 0px" }}>
        <TextField
          id="outlined-basic"
          label="Driver Mobile No."
          variant="outlined"
          size="small"
          style={{ marginTop: "8px" }}
          fullWidth
          value={vehicleDetails.driver_mobile}
          onChange={(event) => HandleVehicleDetails(event)}
          name="driver_mobile"
          inputProps={{
            style: {
              fontSize: "12px",
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "12px",
            },
          }}
        />
      </Box>
    </>
  );
};

export default VehicleCreate;
