import React from "react";
import {Typography,Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function CreateButton({heading,pagecount,onAddClick}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
    {isMdUp ? <div className="display_flex global_padding" style={{width:'50%'}}>
        <Typography variant="h4" className="nunito_font" style={{fontSize:'16px',fontWeight:"700",color:'#185AA6'}}>{heading} [{pagecount}] </Typography>
        <Button className="nunito_font_width" sx={{left: '10px',fontSize:'12px',marginTop: "1px",fontWeight:'300'}} variant="contained" onClick={()=>onAddClick()}>
        <AddIcon style={{fontSize:'18px'}}/> Add New
        </Button>
    </div>:<div className="display_flex global_padding_10" style={{width:'100%'}}>
        <Typography variant="h4" className="nunito_font" style={{fontSize:'12px',fontWeight:"700",color:'#185AA6'}}>{heading} [{pagecount}] </Typography>
        <Button className="nunito_font_width" sx={{left: '10px',fontSize:'10px',marginTop: "1px",fontWeight:'300'}} variant="contained" onClick={()=>onAddClick()}>
        <AddIcon style={{fontSize:'18px'}}/>
        </Button>
    </div>}
    </>
  );
}
