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
  import Cookies from "js-cookie";
  import { axiosGet } from "../../../../../lib/api";
  import MasterCreate from '../../histroy/MasterCreate';
  
  const NavItem = ({onSidebarClose, heading,postError,setStateValue,setValue,onCreateClick,CreateCompannet}) => {
    const ACCESS_TOKEN = Cookies.get("token");
    const [data, setData] = useState();
  
    const fetchData = async () => {
      axiosGet
        .get(`valid_token?user_token=${ACCESS_TOKEN}`)
        .then((response) => {
          if (response.data.status === 200) {
            setData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    useEffect(() => {
      fetchData();
    }, [ACCESS_TOKEN]);
  
    
  
    return (
      <div>
        <MasterCreate onSidebarClose={onSidebarClose} heading={heading} postError={postError} setStateValue={setStateValue} setValue={setValue} onCreateClick={onCreateClick} CreateCompannet={CreateCompannet}/>
      </div>
    );
  };
  
  export default NavItem;
  