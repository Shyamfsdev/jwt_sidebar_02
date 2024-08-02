import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Profile = ({
  onLogout,
  userName,
  eMail,
  firstName,
  lastName,
  userImage,
  RightSidebar,
  isRightSidebarOpen,
  onNoticifiClose,
}) => {
  const router = useRouter();

  const [anchorEl2, setAnchorEl2] = useState(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
    onNoticifiClose(false);
    RightSidebar();
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleOnclick = () => {
    router.push("/change-password");
  };
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  return (
    <div>
      {isMdUp ? (
        <Box>
          <IconButton
            size="large"
            aria-label="menu"
            color="inherit"
            aria-controls="msgs-menu"
            aria-haspopup="true"
            sx={{
              ...(typeof anchorEl2 === "object" && {
                borderRadius: "9px",
                padding: "0px",
              }),
            }}
            onClick={handleClick2}
          >
            {userImage == undefined || userImage == "" || userImage == NaN ? (
              <Avatar
                src="/images/users/7.jpg"
                sx={{ width: 30, height: 30 }}
              ></Avatar>
            ) : (
              <Avatar src={userImage} sx={{ width: 30, height: 30 }}></Avatar>
            )}
            <div style={{ marginLeft: "5px" }}>
              <Typography
                variant="h6"
                color="#fff"
                mr={1}
                className="header_font_size nunito_font"
                style={{ fontSize: "12px", textAlign: "left" }}
              >
                {firstName} {lastName}
              </Typography>
              <Typography
                variant="h6"
                color="#fff"
                mr={1}
                className="header_font_size nunito_font"
                style={{ fontSize: "10px", marginTop: "-6px" }}
              >
                {eMail}
              </Typography>
            </div>
          </IconButton>
          <IconButton onClick={() => RightSidebar()}>
            {" "}
            {isRightSidebarOpen == 0 ? (
              <KeyboardArrowLeftIcon style={{ color: "#fff" }} />
            ) : (
              <KeyboardArrowRightIcon style={{ color: "#fff" }} />
            )}{" "}
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={() => RightSidebar()}>
          {" "}
          {isRightSidebarOpen == 0 ? (
            <KeyboardArrowLeftIcon style={{ color: "#fff" }} />
          ) : (
            <KeyboardArrowRightIcon style={{ color: "#fff" }} />
          )}{" "}
        </IconButton>
      )}
    </div>
  );
};

export default Profile;
