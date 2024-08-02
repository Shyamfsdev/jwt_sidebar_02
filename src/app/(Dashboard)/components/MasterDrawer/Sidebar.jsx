import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
const Sidebar = ({
    isPageSidebarOpen,
    drawerWidth,
    onSidebarClose,
    heading,
    postError,
    setStateValue,
    setValue,
    onCreateClick,
    CreateCompannet
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
        open={isPageSidebarOpen}
        onClose={onSidebarClose}
        variant="permanent"
        PaperProps={{
          sx: {
            width: sidebarWidth,
            boxSizing: "border-box",
            border: "0",
            top: "0px !important",
            boxShadow: "1px 0 20px #00000014",
            boxSizing: "border-box",
            transition: "all 0.3s",
            zIndex:'1300 !important'
          },
        }}
      >
        <Box
          sx={{
            height: "100%",overflow: "hidden"
          }}
        >
          <Box>
            <Box sx={{marginTop:'10px'}}><SidebarItems onSidebarClose={onSidebarClose} heading={heading} postError={postError} setStateValue={setStateValue} setValue={setValue} onCreateClick={onCreateClick} CreateCompannet={CreateCompannet}/></Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
