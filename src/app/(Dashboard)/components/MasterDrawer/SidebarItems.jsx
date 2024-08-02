import React from "react";
import { usePathname } from "next/navigation";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./NavItem";
import { useRouter } from "next/navigation";

const SidebarItems = ({onSidebarClose,heading,postError,setStateValue,setValue,onCreateClick,CreateCompannet}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
            <NavItem onSidebarClose={onSidebarClose} heading={heading} setStateValue={setStateValue} setValue={setValue} postError={postError} onCreateClick={onCreateClick} CreateCompannet={CreateCompannet}/>
      </List>
    </Box>
  );
};
export default SidebarItems;
