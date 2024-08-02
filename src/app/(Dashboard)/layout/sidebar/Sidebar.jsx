import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  userType,
  toggleDrawer,
  drawerWidth
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
        anchor="left"
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
            backgroundColor:'#F2F2F2',
            overflow: "hidden"
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
          }}
        >
          <Box sx={{
             height: "calc(100vh - 50px)",
             overflow: "auto", 
             scrollbarWidth:'none'
          }}>
            <Box mt={1.5}><SidebarItems userType={userType} isMobileSidebarOpen={isMobileSidebarOpen} onSidebarClose={onSidebarClose}/></Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
