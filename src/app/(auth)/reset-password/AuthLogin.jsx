import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CustomTextField from "../../(Dashboard)/components/forms/CustomTextField";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

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
      <Box mt="25px">
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
          // onChange={(e) =>
          //   onLoginDetailsChange("show_password", e.target.value)
          // }
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
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        <Typography
          fontWeight="500"
          sx={{
            cursor: "pointer",
            textDecoration: "none",
            color: "primary.main",
          }}
          onClick={handleForgotPassword}
        >
          Forgot Password ?
        </Typography>
      </Stack>
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        onClick={onSignIn}
      >
        Login
      </Button>
    </Box>
    {subtitle}
  </form>
  );
};

export default AuthLogin;
