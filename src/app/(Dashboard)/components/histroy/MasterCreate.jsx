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
  import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
  import Snackbar from "@mui/material/Snackbar";
  import Alert from "@mui/material/Alert";
  import Cookies from "js-cookie";
  
  const AchievementEdit = ({onSidebarClose, heading,postError,setStateValue,setValue,onCreateClick,CreateCompannet}) => {
    const ACCESS_TOKEN = Cookies.get("token");
    const [error, setError] = useState({ status: "", message: "" });
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
    };
  
    return (
      <div>
        <div className="displey_space_between global_padding">
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => onSidebarClose()}>
              <KeyboardBackspaceIcon
                style={{ color: "black", marginTop: "-2px", fontSize: "20px" }}
              />
            </IconButton>
            <Typography
              variant="h4"
              className="nunito_font"
              style={{ fontSize: "14px", fontWeight: "700", color: "#185AA6" }}
            >
              {heading} Create
            </Typography>
          </div>
          {setValue != '' && 
          <div>
             <Button className="nunito_font_width" sx={{fontSize:'12px',marginTop: "1px",fontWeight:'300'}} variant="contained" onClick={()=>onCreateClick()}>
             <span>Create</span>
        </Button>
        </div>}
        </div>
        {CreateCompannet()}
        <Snackbar
          open={error.message !== ""}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message={error.message}
          onClose={() => setError({ status: "", message: "" })}
          autoHideDuration={2500}
        >
          <Alert onClose={handleClose} severity={error.status}>
            {error.message}
          </Alert>
        </Snackbar>
      </div>
    );
  };
  
  export default AchievementEdit;
  