import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./NavItem";
import NavItemSmall from "./NavItemSmall";
import { useRouter } from "next/navigation";
import { Divider } from "@mui/material";
const SidebarItems = ({ isMobileSidebarOpen, userType, onSidebarClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box>
      <List sx={{ overflow: "hidden" }} component="div">
        {isMobileSidebarOpen == true ? (
          <NavItem
            Menuitems={Menuitems}
            pathDirect={pathDirect}
            onClick={onSidebarClose}
          />
        ) : (
          <NavItemSmall
            Menuitems={Menuitems}
            pathDirect={pathDirect}
            onClick={onSidebarClose}
          />
        )}
      </List>
    </Box>
  );
};
export default SidebarItems;
