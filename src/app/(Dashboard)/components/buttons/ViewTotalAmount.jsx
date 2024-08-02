import React from "react";
import {Typography,Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function CreateButton({amount}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
    <div className="display_flex_end global_padding" style={{width:'100%'}}>
        <Typography variant="h4" className="nunito_font" style={{fontSize:'16px',fontWeight:"700",color:'#185AA6'}}>Total Amount : {amount}</Typography>
    </div>
    </>
  );
}
