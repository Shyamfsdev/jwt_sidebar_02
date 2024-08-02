import React from "react";
import { usePathname } from "next/navigation";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./NavItem";
import { useRouter } from "next/navigation";

const SidebarItems = ({onSidebarClose,onLogout}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
            <NavItem onSidebarClose={onSidebarClose} onLogout={onLogout}/>
      </List>
    </Box>
  );
};
export default SidebarItems;
