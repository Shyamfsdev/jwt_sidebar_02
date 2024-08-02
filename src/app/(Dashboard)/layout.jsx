"use client";
import { styled, Container, Box, useTheme, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "../(Dashboard)/layout/header/Header";
import Sidebar from "../(Dashboard)/layout/sidebar/Sidebar";
import Cookies from "js-cookie";
import { axiosGet } from "../../lib/api";
import { useRouter } from "next/navigation";
import { allowedPathsByUserType } from "../../lib/config";
import { usePathname } from "next/navigation";
import Dashboard from "./page";
import RightSidebar from "../(Dashboard)/layout/sidebar/RightUserDrawer/Sidebar";

const MainWrapper = styled("div")(() => ({
  // display: "flex",
  // minHeight: "100vh",
  // width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  // paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function RootLayout({ children }) {
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(0);
  const [userCmp, setUserCmp] = useState(0);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eMail, setEmail] = useState("");
  const [userImage, setuserImage] = useState("");
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const token = Cookies.get("token");
  const router = useRouter();
  const pathname = usePathname();


  const fetchData = async () => {
    axiosGet
      .get(`valid_token?user_token=${token}`)
      .then((response) => {
        if (response.data.action_status === 'Success') {
          setUserData(response.data.user_data);
          setUserType(response.data.user_type);
          setUserName(response.data.user_data.user_name);
          setUserCmp(response.data.user_data.user_cmp);
          setEmail(response.data.user_data.email);
          setLastName(response.data.user_data.last_name);
          setFirstName(response.data.user_data.first_name);
          setuserImage(response.data.user_data.user_image)
          Cookies.set("cmpny", userCmp);
        } 
        else {
          Cookies.remove("token");
          Cookies.remove("ip");
          Cookies.remove("user_id");
          router.push("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const logout = async () => {
    axiosGet
      .get(`multiple_logout?access_token=${token}`)
      .then((response) => {
        if (response.data.status === 200) {
          router.push("/login");
          Cookies.remove("token");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const [drawerWidth, setdrawerWidth] = useState(100);

  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setMobileSidebarOpen(!isMobileSidebarOpen);
    if (isMobileSidebarOpen == false) {
      setdrawerWidth(260);
    } else {
      setdrawerWidth(100);
    }
  };

  const [isRightSidebarOpen, setisRightSidebarOpen] = useState(false);

  const ManualCloseDrawer = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
    if (isMobileSidebarOpen == false) {
      setdrawerWidth(260);
    } else {
      setdrawerWidth(100);
    }
  };

  const [rightDrawerWidth, setrightDrawerWidth] = useState(0);

  const RighttoggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setrightDrawerWidth(!rightDrawerWidth);
    if (rightDrawerWidth == false) {
      setrightDrawerWidth(250);
    } else {
      setrightDrawerWidth(0);
    }
  };

  const RightManualCloseDrawer = () => {
    setrightDrawerWidth(!rightDrawerWidth);
    if (rightDrawerWidth == false) {
      setrightDrawerWidth(250);
    } else {
      setrightDrawerWidth(0);
    }
  };

  return (
    <MainWrapper className="mainwrapper">
      <Header
        onLogout={logout}
        toggleMobileSidebar={() => ManualCloseDrawer()}
        userName={userName}
        company={userCmp}
        eMail={eMail}
        firstName={firstName}
        lastName={lastName}
        userImage={userImage}
        RightSidebar={() => RightManualCloseDrawer()}
        isRightSidebarOpen = {rightDrawerWidth}
      />
      <PageWrapper className="page-wrapper">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          userType={userType}
          toggleDrawer={toggleDrawer}
          drawerWidth={drawerWidth}
          onSidebarClose={ManualCloseDrawer}
        />
        <RightSidebar
          isMobileSidebarOpen={isRightSidebarOpen}
          toggleDrawer={RighttoggleDrawer}
          drawerWidth={rightDrawerWidth}
          onSidebarClose={RightManualCloseDrawer}
          onLogout={logout}
        />
        <Container
          component="main"
          sx={{
            height: "calc(100vh - 45px) !important",
            maxWidth: "100% !important",
            padding: "7px 0px 0px !important",
            paddingLeft: `${drawerWidth}px !important`,
            boxSizing: "border-box",
            transition: "all 0.3s",
          }}
        >
          <Box>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
