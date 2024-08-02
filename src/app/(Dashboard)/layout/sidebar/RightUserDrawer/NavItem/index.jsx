import {
  Grid,
  Box,
  Typography,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Avatar,
  Paper,
  IconButton,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Divider,
  Menu,
  Tooltip,
  Modal,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { axiosGet, axiosPost } from "../../../../../../lib/api";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import CakeIcon from "@mui/icons-material/Cake";
import GradeIcon from "@mui/icons-material/Grade";
import PasswordIcon from "@mui/icons-material/Password";
import InputAdornment from "@mui/material/InputAdornment";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

const NavItem = ({ onSidebarClose, onLogout }) => {
  const ACCESS_TOKEN = Cookies.get("token");
  const router = useRouter();
  const [data, setData] = useState();
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const fetchData = async () => {
    axiosGet
      .get(`valid_token?user_token=${ACCESS_TOKEN}`)
      .then((response) => {
        if (response.data.status === 200) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [ACCESS_TOKEN]);

  const [changePasswordStatus, setchangePasswordStatus] = useState(false);

  const HandleChangeStatus = () => {
    setchangePasswordStatus(!changePasswordStatus);
  };

  const [userData, setuserData] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });

  const handleChangeCrendials = (event) => {
    setuserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const [passwordShown, setPasswordShown] = useState(false);

  const toggleButton = () => {
    setPasswordShown(!passwordShown);
  };

  const [confirmpasswordShown, setconfirmpasswordShown] = useState(false);

  const toggleConfirmButton = () => {
    setconfirmpasswordShown(!confirmpasswordShown);
  };

  const [currentpasswordShown, setcurrentpasswordShown] = useState(false);

  const toggleCurrentButton = () => {
    setcurrentpasswordShown(!currentpasswordShown);
  };

  const ChangePasswordMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      user_id: data?.user_id,
      current_password: userData?.current_password,
      new_password: userData?.password,
      confirm_password: userData?.confirm_password,
    };
    axiosPost.post(`change_password`, mdata).then((res) => {
      if (res.data.action_status === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Batch No Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          router.push("/login");
          Cookies.remove("token");
        }, 200);
      }
    });
  };

  return (
    <div>
      <div className="displey_space_between global_padding">
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => onSidebarClose()}>
            <KeyboardBackspaceIcon
              style={{ color: "black", marginTop: "-2px", fontSize: "20px" }}
            />
          </IconButton>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "14px", fontWeight: 700, color: "#185AA6" }}
          >
            My Profile
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Change Password">
            <IconButton onClick={() => HandleChangeStatus()}>
              <PasswordIcon
                style={{
                  color: "#185AA6",
                  marginTop: "-2px",
                  fontSize: "20px",
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Logout">
            <IconButton onClick={() => onLogout()}>
              <LogoutIcon
                style={{
                  color: "#185AA6",
                  marginTop: "-2px",
                  fontSize: "20px",
                }}
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {data?.user_type == "employee_user" ? (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Box sx={{ position: "relative" }}>
              {data?.user_image == undefined ||
              data?.user_image == "" ||
              data?.user_image == NaN ? (
                <Avatar
                  src="/images/users/7.jpg"
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              ) : (
                <Avatar
                  src={data?.user_image}
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              )}
            </Box>
          </Box>
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="p"
                fontSize={"16px"}
                fontWeight={"bold"}
                style={{ color: "black", marginTop: "8px" }}
              >
                {data?.first_name} {data?.last_name}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="p"
                fontSize={"10px"}
                style={{ color: "#00000057" }}
              >
                Joined {data?.employee_id?.joined_f_date}
              </Typography>
            </div>
          </Box>

          <Box sx={{ marginTop: "15px" }}>
            <div style={{ borderTop: "2px solid #c9c9c926", padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmailIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "0px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>{data?.email}</span>
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PhoneInTalkIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "-1px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>
                    {data?.employee_id?.mobile_number}
                  </span>
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <WhatsAppIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "-3px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>
                    {data?.employee_id?.whatsapp_number}
                  </span>
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <BloodtypeIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "-1px",
                    }}
                  />
                  <span
                    style={{ marginLeft: "5px", textTransform: "uppercase" }}
                  >
                    {data?.employee_id?.blood_group}
                  </span>
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CakeIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "-3px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>
                    {data?.employee_id?.date_of_birth}
                  </span>
                </Typography>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <GradeIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "-3px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>
                    {data?.employee_id?.grade}
                  </span>
                </Typography>
              </div>
            </div>
          </Box>
        </div>
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <Box sx={{ position: "relative" }}>
              {data?.user_image == undefined ||
              data?.user_image == "" ||
              data?.user_image == NaN ? (
                <Avatar
                  src="/images/users/7.jpg"
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              ) : (
                <Avatar
                  src={data?.user_image}
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              )}
            </Box>
          </Box>
          <Box>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="p"
                fontSize={"16px"}
                fontWeight={"bold"}
                style={{ color: "black", marginTop: "8px" }}
              >
                {data?.first_name} {data?.last_name}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="p"
                fontSize={"10px"}
                style={{ color: "#00000057" }}
              >
                Created Date {data?.created_f_date}
              </Typography>
            </div>
          </Box>

          <Box sx={{ marginTop: "15px" }}>
            <div style={{ borderTop: "2px solid #c9c9c926", padding: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmailIcon
                    style={{
                      color: "black",
                      fontSize: "16px",
                      marginTop: "0px",
                    }}
                  />
                  <span style={{ marginLeft: "5px" }}>{data?.email}</span>
                </Typography>
              </div>
            </div>
          </Box>
        </div>
      )}

      <Modal
        open={changePasswordStatus}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "15px",
            p: 2,
          }}
        >
          <Box sx={{ padding: "10px 10px 10px" }}>
            <Box sx={{ py: 1 }}>
              <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
                <TextField
                  id="outlined-basic"
                  label="Current Password"
                  type={currentpasswordShown ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  name="current_password"
                  fullWidth
                  value={userData.current_password}
                  onChange={handleChangeCrendials}
                  sx={{ pb: 1 }}
                  inputProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ cursor: "pointer" }}
                      >
                        {currentpasswordShown ? (
                          <LockOpenIcon
                            onClick={toggleCurrentButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        ) : (
                          <LockIcon
                            onClick={toggleCurrentButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        )}
                      </InputAdornment>
                    ),
                    style: { paddingLeft: "10px", backgroundColor: "white" },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
                <TextField
                  id="outlined-basic"
                  label="Change Password"
                  type={passwordShown ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  name="password"
                  fullWidth
                  value={userData.password}
                  onChange={handleChangeCrendials}
                  sx={{ pb: 1 }}
                  inputProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ cursor: "pointer" }}
                      >
                        {passwordShown ? (
                          <LockOpenIcon
                            onClick={toggleButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        ) : (
                          <LockIcon
                            onClick={toggleButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        )}
                      </InputAdornment>
                    ),
                    style: { paddingLeft: "10px", backgroundColor: "white" },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
                <TextField
                  id="outlined-basic"
                  label="Confirm Password"
                  type={confirmpasswordShown ? "text" : "password"}
                  variant="outlined"
                  size="small"
                  name="confirm_password"
                  fullWidth
                  value={userData.confirm_password}
                  onChange={handleChangeCrendials}
                  sx={{ pb: 1 }}
                  inputProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ cursor: "pointer" }}
                      >
                        {confirmpasswordShown ? (
                          <LockOpenIcon
                            onClick={toggleConfirmButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        ) : (
                          <LockIcon
                            onClick={toggleConfirmButton}
                            style={{ color: "#185aa6",fontSize:'17px' }}
                          />
                        )}
                      </InputAdornment>
                    ),
                    style: { paddingLeft: "10px", backgroundColor: "white" },
                  }}
                />
              </Stack>
            </Box>
            <div className="display_flex_end" style={{ marginTop: "10px" }}>
              <Button
                type="submit"
                className="nunito_font_width create_button_cancel"
                sx={{ fontSize: "12px", fontWeight: "300" }}
                variant="contained"
                onClick={() => HandleChangeStatus()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="nunito_font_width"
                sx={{ fontSize: "12px", fontWeight: "300",marginLeft:'10px' }}
                variant="contained"
                onClick={() => ChangePasswordMaster()}
              >
                Update
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={error.message !== ""}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message={error.message}
        onClose={() => setError({ status: "", message: "" })}
        autoHideDuration={2500}
      >
        <Alert onClose={handleClose} severity={error.status}>
          {error.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NavItem;
