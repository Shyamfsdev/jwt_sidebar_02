import React, { useState, useEffect } from "react";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material";

// Define a functional component
function BadgerComponent({badgeContent,HandleNotification}) {
    return (
        <Badge badgeContent={badgeContent} style={{marginRight:'5px'}} color="success" sx={{ "& .MuiBadge-badge": { borderRadius: '5px',
        top: '4px',
        fontSize: '12px',
        padding: '0',
        minWidth: '17px',
        height: '17px',
        right: '1px',} }}
        >
           <IconButton onClick={() => HandleNotification()} style={{padding:'3px'}}><NotificationsIcon style={{color:'#fff',fontSize:'20px'}} color="action" /></IconButton>
        </Badge>
    );
}

export default BadgerComponent;