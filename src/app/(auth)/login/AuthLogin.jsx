import React from "react";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CustomTextField from "../../(Dashboard)/components/forms/CustomTextField";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { MuiOtpInput } from 'mui-one-time-password-input'
const AuthLogin = ({
  title,
  subtitle,
  subtext,
  onSignIn,
  handleForgotPassword,
  passwordShown,
  toggleButton,
  password,
  username,
}) => {

  return (
  <form onSubmit={onSignIn}>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title} 
      </Typography>
    ) : null}

    {subtext}
    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="username"
          mb="5px"
        >
          Username
        </Typography>
        <CustomTextField
          variant="outlined"
          fullWidth
          onChange={(e) => username(e.target.value)}
        />
      </Box>
      <Box mt={1}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <TextField
          type={passwordShown ? "text" : "password"}
          variant="outlined"
          fullWidth
          onChange={(e) =>
            password(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" style={{ cursor: "pointer" }}>
                {passwordShown ? (
                  <LockOpenIcon
                    onClick={toggleButton}
                    style={{ color: "#185aa6" }}
                  />
                ) : (
                  <LockIcon
                    onClick={toggleButton}
                    style={{ color: "#185aa6" }}
                  />
                )}
              </InputAdornment>
            ),
            style: { paddingLeft: "10px", backgroundColor: "white" },
          }}
        />
      </Box>
    </Stack>
    <Box my={2}>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
      >
        Login
      </Button>
    </Box>
    {subtitle}
  </form>
  );
};

export default AuthLogin;
