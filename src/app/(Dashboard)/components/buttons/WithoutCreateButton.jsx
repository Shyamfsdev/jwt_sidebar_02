import React from "react";
import {Typography,Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function WithoutCreateButton({heading,pagecount}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>{isMdUp ? 
      <div className="display_flex global_padding" style={{width:'50%'}}>
      <Typography variant="h4" className="nunito_font" style={{fontSize:'16px',fontWeight:700,color:'#185AA6'}}>{heading} [{pagecount}] </Typography>
  </div>:
  <div className="display_flex global_padding" style={{width:'100%'}}>
  <Typography variant="h4" className="nunito_font" style={{fontSize:'16px',fontWeight:700,color:'#185AA6'}}>{heading} [{pagecount}] </Typography>
</div>}</>
    
  );
}
