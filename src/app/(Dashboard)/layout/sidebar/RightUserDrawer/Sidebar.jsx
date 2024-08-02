import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  drawerWidth,
  onLogout
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const sidebarWidth = drawerWidth;
  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      <Drawer
        anchor="right"
        open={isMobileSidebarOpen}
        onClose={onSidebarClose}
        variant="permanent"
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxSizing: "border-box",
            border: "0",
            top: "40px",
            boxShadow: "1px 0 20px #00000014",
            boxSizing: "border-box",
            transition: "all 0.3s",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
          }}
        >
          <Box sx={{
             overflow: "auto", 
          }}>
            <Box mt={3}><SidebarItems onSidebarClose={onSidebarClose} onLogout={onLogout}/></Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
