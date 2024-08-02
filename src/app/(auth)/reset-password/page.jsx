"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, Card, Typography } from "@mui/material";
import AuthLogin from "./AuthLogin";
import AutoHideAlert from "../../(Dashboard)/components/container/AutoHideAlert";
import Cookies from "js-cookie";
import { useAuthContext } from "../../DataProvider";
import { axiosPost, axiosGet } from "../../../lib/api";

const Login = () => {
  const { userData, setUserData } = useAuthContext();
  const router = useRouter();

  const token = Cookies.get("token") !== undefined;

  const [loginDetails, setLoginDetails] = useState({
    user_name: "",
    show_password: "",
  });

  const [username, setUserName] = useState("");
  const [password, setpassword] = useState("");
  const [alertSeverity, setAlertSeverity] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isForgot, setisForgot] = useState(false);

  const handleLoginDetailsChange = (fieldName, value) => {
    setLoginDetails((prevLoginDetails) => ({
      ...prevLoginDetails,
      [fieldName]: value,
    }));
  };

  const handleForgotPassword = () => {
    setisForgot(true);
    router.push("/forgot-password");
  };

  useEffect(() => {
    axiosGet
      .get(
        `valid_token?user_token=${token}`
      )
      .then((response) => {
        if (response.data.action_status == "Success") {
          Cookies.set("token", response.data.access_token, {
            expires: 7, // Set the cookie expiration (7 days in this example)
          });
          Cookies.set("user_id", response.data.user_id, {
            expires: 7, // Set the cookie expiration (7 days in this example)user_login
          });
          router.push("/dashboard");
          
        } else {
          router.push("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    const jsonStructure = {
      show_password: password,
      user_name: username,
    };
    try {
      axiosPost
        .post("multiple_login", jsonStructure)
        .then((response) => {
          if (response.data.action_status === "success") {
            setAlertVisible(true);
            setAlertSeverity("success");
            setAlertMessage(response.data.message);
            Cookies.set("token", response.data.access_token, {
              expires: 7, // Set the cookie expiration (7 days in this example)
            });
            Cookies.set("user_id", response.data.user_id, {
              expires: 7, // Set the cookie expiration (7 days in this example)user_login
            });
            setUserData(response.data);
            router.push("/");
            setTimeout(() => {
              setAlertVisible(false);
            }, 3000);
          } else {
            setAlertVisible(true);
            setAlertSeverity("error");
            setAlertMessage(response.data.message);

            // You can also set a timeout to hide the alert after a certain duration
            setTimeout(() => {
              setAlertVisible(false);
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("POST Error:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);

  const toggleButton = () => {
    setPasswordShown(!passwordShown);
  };

  const backgroundImageUrl = "url(/images/bg.png)";

  return (
    <>
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <Grid container spacing={2} justifyContent="center" sx={{ overflow: "hidden" }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
            <Box
                component={"img"}
                textAlign="center"
                sx={{
                  width: "100%",
                  position: "relative",
                }}
                src="https://placehold.co/880x1080"
              >
              </Box>
            
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={6}
          xl={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "100vh",
            padding: "0px 25px !important",
            background: 'white'
          }}
        >
            <Box
                sx={{
                  width: "50%",
                  position: "relative",
                }}
              >
                <Typography variant="h5" sx={{fontWeight:'900',marginBottom:'5px'}}>Clay ERP</Typography>
                {/* <img src="/images/logos/ClayDark.svg" alt="logo" style={{height:"45px"}} priority /> */}
                <Typography variant="h3" sx={{fontWeight:'600',marginBottom:'5px'}}>Log in to your Account</Typography>
                <Typography variant="h6" sx={{fontWeight:'400', fontSize:'12px',marginBottom:'25px'}}>Welcome back!</Typography>
                <AuthLogin
                  password={setpassword}
                  username={setUserName}
                  onSignIn={handleSignIn}
                  handleForgotPassword={handleForgotPassword}
                  passwordShown={passwordShown}
                  toggleButton={toggleButton}
                />
              </Box>
              {isAlertVisible && (
              <AutoHideAlert
                severity={alertSeverity}
                message={alertMessage}
                autoHideDuration={3000}
                onClose={() => {
                  setAlertVisible(false);
                }}
              />
            )}
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Login;
