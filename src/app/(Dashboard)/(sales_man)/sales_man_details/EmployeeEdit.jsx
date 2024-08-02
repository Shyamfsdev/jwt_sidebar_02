"use client";
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
} from "@mui/material";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRouter } from "next/navigation";
import { axiosGet, axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PickerWithButtonField from "../../components/buttons/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuthContext } from "../../../../app/DataProvider";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from '@mui/icons-material/Close';

const EmployeeEdit = ({
  compName,
  toggle,
  employee_id,
  getSingleEmployeeData,
}) => {
  const ACCESS_TOKEN = Cookies.get("token");

  const data_uniq_id = Cookies.get("data_uniq_id");
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  useEffect(() => {
    HandleEmployeeTypeMaster();
    HandleDepartmentMaster();
    HandleDesignationMaster();
    HandleRouteMaster();
  }, [ACCESS_TOKEN]);

  const router = useRouter();

  const [errorData, setErrorData] = useState({});

  const [bloodGroup, setBloodGroup] = useState(
    compName?.data[0]?.bloodGroupData
  );
  const [employeeName, setEmployeeName] = useState(compName?.data[0]?.name);
  const [pfNumber, setpfNumber] = useState(compName?.data[0]?.pf_number);
  const [aadhaarNumber, setaadhaarNumber] = useState(
    compName?.data[0]?.aadhaar_number
  );
  const [employeeMobile, setEmployeeMobile] = useState(
    compName?.data[0]?.mobile
  );
  const HandleChangeMobileNumber = (e) => {
    const regex = /^\+91\s\d{0,10}?$/;
    if (regex.test(e)) {
      setEmployeeMobile(e);
    }
  };
  const [apiPost, setapiPost] = useState(compName?.api);

  const [employeeMail, setemployeeMail] = useState(compName?.data[0]?.mail);
  const [employeeWhatsApp, setEmployeeWhatsApp] = useState(
    compName?.data[0]?.whatsApp
  );
  const HandleChangeWhatsMobileNumber = (e) => {
    const regex = /^\+91\s\d{0,10}?$/;
    if (regex.test(e)) {
      setEmployeeWhatsApp(e);
    }
  };
  const [onBordingNotes, setOnBordingNotes] = useState("");
  const [age, setAge] = useState(compName?.data[0]?.age);
  const [gender, setGender] = useState(compName?.data[0]?.genderData);
  const [isWhatsAppNum, setIsWhatsAppNum] = useState(
    compName?.data[0]?.mobile === compName?.data[0]?.whatsApp ? true : false
  );
  const [dateOfBirth, setDateOfBirth] = useState(compName?.data[0]?.dob);
  const [isFresher, setIsFresher] = useState(false);
  const ChangeFresherState = (e) => {
    setIsFresher(e);
    setExperienceDetails([
      {
        companyName: "",
        jobTitle: "",
        doj: "",
        dol: "",
        reason: "",
        responsabilites: "",
      },
    ]);
  };

  const [addressFormData, setAddressFormData] = useState(compName.data);

  const [jobFormData, setJobFormData] = useState(compName?.data);

  const [bankFormData, setBankFormData] = useState(compName?.data);

  const [userData, setuserData] = useState(compName?.data);

  const [employeeTypeMaster, setemployeeTypeMaster] = useState([]);

  const [itcSalary, setitcSalary] = useState(compName?.data[0]?.itcSalary);
  const [kmMangementSalary, setkmMangementSalary] = useState(compName?.data[0]?.kmManagementSalary);
  const [mangementSalary, setMangementSalary] = useState(compName?.data[0]?.managementSalary);
  const [kmItcSalary, setkmItcSalary] = useState(compName?.data[0]?.kilometerItcSalary);
  const [petaSalary, setpetaSalary] = useState(compName?.data[0]?.peta);
  const [routeDetails, setrouteDetails] = useState(compName?.data
  );
  const handleAddRoute = () => {
    setrouteDetails([
      ...routeDetails,
      {
        routeID: "",
        routeName: "",
        day:""
      },
    ]);
  };

  const handleRemoveRoute = (index) => {
    if (routeDetails.length > 1) {
      const newEducationDetails = [...routeDetails];
      newEducationDetails.splice(index, 1);
      setrouteDetails(newEducationDetails);
    }
  };

  const HandleChangeRouteDetails = (value, ref, index) => {
    const newfields = [...routeDetails];
    if (ref === 'route') {
      if (value != null) {
        newfields[index].routeID = value.data_uniq_id;
        newfields[index].routeName = value.route;
      } else {
        newfields[index].routeID = '';
        newfields[index].routeName = '';
      }
    } else if (ref === 'day') {
      newfields[index].day = value || '';
    }
    setrouteDetails(newfields);
  };
  const [routeMaster, setrouteMaster] = useState([]);

  const HandleRouteMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `route_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setrouteMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const HandleEmployeeTypeMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `employee_type_details?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setemployeeTypeMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [departmentMaster, setdepartmentMaster] = useState([]);

  const HandleDepartmentMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `department_details?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdepartmentMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [designtionMaster, setdesigntionMaster] = useState([]);

  const HandleDesignationMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `designation_details?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdesigntionMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [anchorElValueType, setAnchorElValueType] = useState(null);

  const handleDOBChange = (value) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    setDateOfBirth(formattedDate);
    const dob = new Date(value);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    ) {
      age--;
    }
    setAge(age);
  };
  const handleDOJChange = (value) => {
    setJobFormData((prevState) => ({
      ...prevState,
      ["doj"]: moment(value).format("YYYY-MM-DD"),
    }));
  };

  const handlePermanentAddressChange = (event) => {
    setAddressFormData((prevState) => ({
      ...prevState,
      permanentAddress: {
        ...prevState.permanentAddress,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const handleJobFormChange = (event) => {
    if (event.target.name == "phone") {
      const regex = /^\+91\s\d{0,10}?$/;
      if (regex.test(event.target.value)) {
        setJobFormData((prevState) => ({
          ...prevState,
          [event.target.name]: event.target.value,
        }));
      }
    } else {
      setJobFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handleChangeCrendials = (event) => {
    setuserData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBankFormChange = (event) => {
    if (event.target.name == "accountNo") {
      const numberRegex = /^$|^[0-9]+(\.[0-9]+)?$/;
      if (numberRegex.test(event.target.value)) {
        setBankFormData((prevState) => ({
          ...prevState,
          [event.target.name]: event.target.value,
        }));
      }
    } else {
      setBankFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const handlePincodeChange = (event, type) => {
    setAddressFormData((prevState) => ({
    ...prevState,
    permanentAddress: {
        ...prevState.permanentAddress,
        pincode: event.target.value,
        state: "",
        district: "",
    }
    }));
    if (event.target.value.length === 6) {
    // Corrected condition
    axios
        .get(`https://api.postalpincode.in/pincode/${event.target.value}`)
        .then((response) => {
        const { PostOffice } = response.data[0];
        if (response.data.length > 0) {
            if (PostOffice !== null) {
            const { Division, State } = PostOffice[0];
            setAddressFormData((prevState) => ({
                ...prevState,
                permanentAddress: {
                ...prevState.permanentAddress,
                pincode: event.target.value,
                state: State,
                district: Division,
                }
            }));
            } else {
            setAddressFormData((prevState) => ({
                ...prevState,
                permanentAddress: {
                ...prevState.permanentAddress,
                pincode: event.target.value,
                state: "",
                district: "",
                }
            }));
            setError({
                status: "error",
                message: "Pincode not available.",
            });
            }
        } else {
            setAddressFormData((prevState) => ({
            ...prevState,
            permanentAddress: {
                ...prevState.permanentAddress,
                pincode: event.target.value,
                state: "",
                district: "",
            }
            }));
            setError({ status: "error", message: "Pincode not available." });
        }
        });
    }
    
  };

  const [passwordShown, setPasswordShown] = useState(false);

  const toggleButton = () => {
    setPasswordShown(!passwordShown);
  };

  const [confirmpasswordShown, setconfirmpasswordShown] = useState(false);

  const toggleConfirmButton = () => {
    setconfirmpasswordShown(!confirmpasswordShown);
  };

  const handleSubmit = () => {
    if (imageUrl == "") {
      const mdata = {
        access_token: ACCESS_TOKEN,
        data_uniq_id: data_uniq_id,
        full_name: employeeName,
        mobile_number: employeeMobile,
        email_address: employeeMail,
        permanent_address: addressFormData?.permanentAddress,
        date_of_birth: dateOfBirth,
        gender: gender,
        age: age,
        whatsapp_number:
          isWhatsAppNum === true ? employeeMobile : employeeWhatsApp,
        bank_details: bankFormData,
        desig_id: jobFormData?.Designation,
        dept_id: jobFormData?.Department,
        date_of_join: jobFormData?.doj,
        employee_type: jobFormData?.employmentType,
        work_mail_id: jobFormData?.mail,
        work_mobile_number: jobFormData?.phone,
        user_type: "salesman_user",
        job_essentials: jobFormData,
        aadhaar_number: aadhaarNumber,
        pf_number: pfNumber,
        username: userData?.username,
        password: userData?.password,
        confirm_password: userData?.confirm_password,
        image: "",
        upload_file: imageUrl1,
        active_status: 1,
        status: "active",
        itc_salary: itcSalary,
        kilometer_management_salary:kmMangementSalary,
        management_salary:mangementSalary,
        kilometer_itc_salary:kmItcSalary,
        route:routeDetails,
        peta:petaSalary
      };
      axiosPost.post(apiPost, mdata).then((res) => {
        if (res.data.action === "error") {
          setError({ status: "error", message: "Data Error" });
        } else {
          const successMessage = "Salesman Updated Successfully";
          setError({ status: "success", message: successMessage });
          getSingleEmployeeData();
          toggle(false);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const mdata = {
          access_token: ACCESS_TOKEN,
          data_uniq_id: data_uniq_id,
          full_name: employeeName,
          mobile_number: employeeMobile,
          email_address: employeeMail,
          permanent_address: addressFormData?.permanentAddress,
          date_of_birth: dateOfBirth,
          gender: gender,
          age: age,
          whatsapp_number:
            isWhatsAppNum === true ? employeeMobile : employeeWhatsApp,
          bank_details: bankFormData,
          desig_id: jobFormData?.Designation,
          dept_id: jobFormData?.Department,
          date_of_join: jobFormData?.doj,
          employee_type: jobFormData?.employmentType,
          work_mail_id: jobFormData?.mail,
          work_mobile_number: jobFormData?.phone,
          user_type: "salesman_user",
          job_essentials: jobFormData,
          aadhaar_number: aadhaarNumber,
          pf_number: pfNumber,
          username: userData?.username,
          password: userData?.password,
          confirm_password: userData?.confirm_password,
          image: result.split(",")[1],
          upload_file: imageUrl1,
          active_status: 1,
          status: "active",
          itc_salary: itcSalary,
          kilometer_management_salary:kmMangementSalary,
          management_salary:mangementSalary,
          kilometer_itc_salary:kmItcSalary,
          route:routeDetails,
          peta:petaSalary
        };
        axiosPost.post(apiPost, mdata).then((res) => {
          if (res.data.action === "error") {
            setError({ status: "error", message: "Data Error" });
          } else {
            const successMessage = "Created Successfully";
            setError({ status: "success", message: successMessage });
            getSingleEmployeeData();
            toggle(false);
          }
        });
      };
      reader.readAsDataURL(imageUrl);
    }
  };

  const [imageUrl, setImageUrl] = useState("");

  const [imageUrl1, setImageUrl1] = useState("");

  const [imageUrl2, setImageUrl2] = useState(
    compName?.data[0]?.salesman_image == undefined
      ? ""
      : compName?.data[0]?.salesman_image
  );

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    const imageUrlPort = URL.createObjectURL(selectedFile);
    setImageUrl(selectedFile);
    setImageUrl1(event.target.files[0].name);
    setImageUrl2(imageUrlPort);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "16px", fontWeight: 700, color: "#185AA6" }}
          >
            Edit {compName.id} details
          </Typography>
        </Box>
        <Box>
          <Button onClick={handleSubmit} size="small" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
      {/* BASIC DETAILS Start */}
      {compName.id === "basic" && (
        <Box sx={{ p: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pb: 2,
            }}
          >
            <Box sx={{ position: "relative" }}>
              {imageUrl2 == undefined || imageUrl2 == "" || imageUrl2 == NaN ? (
                <Avatar
                  src="/images/users/7.jpg"
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              ) : (
                <Avatar
                  src={imageUrl2}
                  sx={{ width: 100, height: 100 }}
                ></Avatar>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                {" "}
                <IconButton
                  className="image_upload_button"
                  component="span"
                >
                  <EditOutlinedIcon style={{ color: "black" }} />
                </IconButton>
              </label>
            </Box>
          </Box>
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="Employee Name"
              variant="outlined"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              size="small"
              fullWidth
              placeholder="Employee Name"
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
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="PF NO."
              variant="outlined"
              value={pfNumber}
              onChange={(e) => setpfNumber(e.target.value)}
              size="small"
              fullWidth
              placeholder="PF NO."
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
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="AADHAR NO."
              variant="outlined"
              value={aadhaarNumber}
              onChange={(e) => setaadhaarNumber(e.target.value)}
              size="small"
              fullWidth
              placeholder="AADHAR NO."
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
            />
          </Box>
          <Box sx={{ my: 1 }}>
            <Stack direction={"row"} gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{ fontSize: "12px" }}
                  id="demo-simple-select-label"
                >
                  Gender
                </InputLabel>
                <Select
                  sx={{ fontSize: "12px" }}
                  placeholder="Blood Group"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  label="Blood Group"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          <Box sx={{ my: 2 }}>
            <Stack direction={"row"} gap={2}>
              <FormControl
                sx={{ p: 0, width: "50%" }}
                variant="outlined"
                size="small"
              >
                <InputLabel
                  sx={{ fontSize: "12px" }}
                  htmlFor="outlined-adornment-password"
                >
                  DOB
                </InputLabel>
                <OutlinedInput
                  value={dateOfBirth}
                  sx={{ fontSize: "12px", p: 0 }}
                  id="outlined-adornment-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <PickerWithButtonField onChange={handleDOBChange} />
                    </InputAdornment>
                  }
                  inputProps={{
                    style: {
                      fontSize: "12px",
                      paddingRight: 0,
                    },
                  }}
                  label="DOB"
                />
              </FormControl>

              <TextField
                id="outlined-basic"
                label="Age"
                variant="outlined"
                value={age}
                size="small"
                disabled
                sx={{ pb: 1, width: "50%" }}
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
              />
            </Stack>
          </Box>
        </Box>
      )}

      {/* BASIC DETAILS End */}

      {/* Conatct DETAILS Start */}

      {compName.id === "contact" && (
        <Box sx={{ px: 1 }}>
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="Mobile Number"
              variant="outlined"
              size="small"
              value={employeeMobile}
              fullWidth
              onChange={(e) => HandleChangeMobileNumber(e.target.value)}
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
            />
          </Box>
          <FormControlLabel
            sx={{ margin: 0 }}
            control={
              <Checkbox
                size="small"
                checked={isWhatsAppNum}
                style={{ padding: "0px 5px", marginTop: "-5px" }}
                onChange={(e) => setIsWhatsAppNum(e.target.checked)}
              />
            }
            label={
              <Typography variant="p" fontSize={"12px"}>
                Use this number for WhatsApp
              </Typography>
            }
          />

          {!isWhatsAppNum ? (
            <Box sx={{ my: 2 }}>
              <TextField
                id="outlined-basic"
                label="WhatsApp Number"
                variant="outlined"
                size="small"
                value={employeeWhatsApp}
                fullWidth
                onChange={(e) => HandleChangeWhatsMobileNumber(e.target.value)}
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
              />
            </Box>
          ) : (
            <Box sx={{ my: 2 }}>
              <TextField
                id="outlined-basic"
                label="WhatsApp Number"
                variant="outlined"
                size="small"
                style={{ opacity: 0.3 }}
                value={employeeWhatsApp}
                fullWidth
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
              />
            </Box>
          )}
          <Box sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="Email ID"
              variant="outlined"
              value={employeeMail}
              onChange={(e) => setemployeeMail(e.target.value)}
              size="small"
              fullWidth
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
            />
          </Box>
        </Box>
      )}

      {compName.id === "job" && (
        <Box sx={{ py: 1 }}>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <FormControl sx={{ p: 0, my: 1 }} variant="outlined" size="small">
              <InputLabel
                sx={{ fontSize: "12px" }}
                htmlFor="outlined-adornment-password"
              >
                Date of Joining
              </InputLabel>
              <OutlinedInput
                name="doj"
                value={jobFormData.doj}
                onChange={handleJobFormChange}
                sx={{ fontSize: "12px", p: 0 }}
                id="outlined-adornment-password"
                endAdornment={
                  <InputAdornment position="end">
                    <PickerWithButtonField onChange={handleDOJChange} />
                  </InputAdornment>
                }
                inputProps={{
                  style: {
                    fontSize: "12px",
                    paddingRight: 0,
                  },
                }}
                label="Date of Joining"
              />
            </FormControl>
            <FormControl sx={{ my: 1, width: "200px" }} size="small">
              <InputLabel
                sx={{ fontSize: "12px" }}
                id="demo-simple-select-label"
              >
                Employment Type
              </InputLabel>
              <Select
                sx={{ fontSize: "12px" }}
                // placeholder="Blood Group"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Employment Type"
                name="employmentType"
                value={jobFormData.employmentType}
                onChange={handleJobFormChange}
              >
                {employeeTypeMaster.map((option) => (
                  <MenuItem key={option.id} value={option.data_uniq_id}>
                    {option.employee_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ my: 1, width: "200px" }} size="small">
              <InputLabel
                sx={{ fontSize: "12px" }}
                id="demo-simple-select-label"
              >
                Department
              </InputLabel>
              <Select
                sx={{ fontSize: "12px" }}
                // placeholder="Blood Group"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Department"
                name="Department"
                value={jobFormData.Department}
                onChange={handleJobFormChange}
              >
                {departmentMaster.map((option) => (
                  <MenuItem key={option.id} value={option.data_uniq_id}>
                    {option.department_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"row"} gap={1} sx={{ my: 2 }}>
            <FormControl sx={{ my: 1, width: "50%" }} size="small">
              <InputLabel
                sx={{ fontSize: "12px" }}
                id="demo-simple-select-label"
              >
                Designation
              </InputLabel>
              <Select
                sx={{ fontSize: "12px" }}
                // placeholder="Blood Group"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Designation"
                name="Designation"
                value={jobFormData.Designation}
                onChange={handleJobFormChange}
              >
                {designtionMaster.map((option) => (
                  <MenuItem key={option.id} value={option.data_uniq_id}>
                    {option.desig_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"row"} gap={1} sx={{ my: 2 }}>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Work Mail ID"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
                name="mail"
                value={jobFormData.mail}
                onChange={handleJobFormChange}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Work Phone Number"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
                name="phone"
                value={jobFormData.phone}
                onChange={handleJobFormChange}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      )}

      {compName.id === "bank" && (
        <Box sx={{ py: 1 }}>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Account No."
                variant="outlined"
                size="small"
                name="accountNo"
                fullWidth
                value={bankFormData.accountNo}
                onChange={handleBankFormChange}
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
              />
            </Box>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Holder Name"
                variant="outlined"
                size="small"
                name="holder"
                fullWidth
                value={bankFormData.holder}
                onChange={handleBankFormChange}
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
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                label="IFSC Code"
                variant="outlined"
                size="small"
                name="ifsc"
                fullWidth
                value={bankFormData.ifsc}
                onChange={handleBankFormChange}
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
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                label="Bank Name"
                variant="outlined"
                size="small"
                name="bankName"
                fullWidth
                value={bankFormData.bankName}
                onChange={handleBankFormChange}
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
              />
            </Box>
            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                label="Branch"
                variant="outlined"
                size="small"
                name="branch"
                fullWidth
                value={bankFormData.branch}
                onChange={handleBankFormChange}
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
              />
            </Box>
          </Stack>
        </Box>
      )}

      {compName.id === "salary" && (
        <Box sx={{ py: 1 }}>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="ITC Salary."
                variant="outlined"
                size="small"
                name="itcSalary"
                fullWidth
                value={itcSalary}
                onChange={(e) => setitcSalary(e.target.value)}
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                  type: "number",
                  step: "0.01",
                  min: "0"
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1, width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Management Salary"
                variant="outlined"
                size="small"
                name="managementsalary"
                fullWidth
                value={mangementSalary}
                onChange={(e) => setMangementSalary(e.target.value)}
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                  type: "number",
                  step: "0.01",
                  min: "0"
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <Box sx={{ my: 1,  width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="KM Management Cost"
                variant="outlined"
                size="small"
                name="kmmanagementsalary"
                fullWidth
                value={kmMangementSalary}
                onChange={(e) => setkmMangementSalary(e.target.value)}
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                  type: "number",
                  step: "0.01",
                  min: "0"
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
            <Box sx={{ my: 1,  width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="KM ITC Cost"
                variant="outlined"
                size="small"
                name="kmitcsalary"
                fullWidth
                value={kmItcSalary}
                onChange={(e) => setkmItcSalary(e.target.value)}
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                  type: "number",
                  step: "0.01",
                  min: "0"
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
          <Stack>
          <Box sx={{ my: 1,  width: "50%" }}>
              <TextField
                id="outlined-basic"
                label="Bata"
                variant="outlined"
                size="small"
                name="peta"
                fullWidth
                value={petaSalary}
                onChange={(e) => setpetaSalary(e.target.value)}
                sx={{ pb: 1 }}
                inputProps={{
                  style: {
                    fontSize: "12px",
                  },
                  type: "number",
                  step: "0.01",
                  min: "0"
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "12px",
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      )}

      {compName.id === "route" && (
        <Box sx={{ py: 1 }}> 
          <Stack direction="column">
            {routeDetails.map((res, index) => (
              <Stack direction="row" gap={1} key={index}>
                <Box sx={{width: "180px" }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "4px"}}
                    options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                    value={res.day}
                    getOptionLabel={(val) => val} 
                    required
                    id="day"
                    onChange={(event, value) => HandleChangeRouteDetails(value, 'day', index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={res.day}
                        style={{ margin: "0px" }}
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px"},
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                        label="Day"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>

                <Box sx={{width: "180px"}}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    options={routeMaster}
                    value={routeMaster.find((year) => year.route === res.routeName) || null}
                    onChange={(event, value) => HandleChangeRouteDetails(value, 'route', index)}
                    getOptionLabel={(val) => val.route}
                    required
                    id="route"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={res.routeName}
                        style={{ marginTop: "4px" }}
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px"},
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                        label="Route"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>

                <Box sx={{ my: 0.5 }}>
                  <IconButton
                    size="small"
                    variant="outlined"
                    style={
                      routeDetails.length > 1
                        ? { marginTop: '4px', background: 'rgb(24, 90, 166)', color: 'white' }
                        : { marginTop: '4px', opacity: 0.3, cursor: "no-drop", background: 'rgb(24, 90, 166)', color: 'white' }
                    }
                    onClick={() => handleRemoveRoute(index)}
                  >
                    <CloseIcon sx={
                    {width:'20px', height:'20px'}
                    } />
                  </IconButton>
                </Box>
              </Stack>
            ))}
            <Button
              onClick={handleAddRoute}
              variant="outlined"
              sx={{
                width: '75px',
                height: '35px',
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      )}    

      {compName.id === "address" && (
        <Box sx={{ py: 1 }}>
          {/* <Stack direction={"row"} gap={2}> */}
          <Box sx={{ px: 1 }}>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography
                variant="p"
                fontSize={"12px"}
                fontWeight={"bold"}
                color={"primary"}
                // my={1}
              >
                Permanent Address
              </Typography>
            </Box>

            <Box sx={{ my: 1 }}>
              <TextField
                id="outlined-basic"
                label="Flat No. / Street"
                variant="outlined"
                size="small"
                name="flatStreet"
                fullWidth
                value={addressFormData.permanentAddress.flatStreet}
                onChange={handlePermanentAddressChange}
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
              />
            </Box>
            <Stack direction={"row"} gap={1}>
              <Box sx={{ my: 1, width: "30%" }}>
                <TextField
                  id="outlined-basic"
                  label="Pincode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={addressFormData.permanentAddress.pincode}
                  onChange={(e) => handlePincodeChange(e, "permanentAddress")}
                  inputProps={{
                    style: {
                      fontSize: "12px",
                      width: "100px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>
              <Box sx={{ my: 1, width: "40%" }}>
                <TextField
                  id="outlined-basic"
                  label="State"
                  disabled
                  variant="outlined"
                  size="small"
                  sx={{ pb: 1 }}
                  fullWidth
                  name="state"
                  value={addressFormData.permanentAddress.state}
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
                />
              </Box>
              <Box sx={{ my: 1, width: "40%" }}>
                <TextField
                  id="outlined-basic"
                  label="District"
                  disabled
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                  name="district"
                  value={addressFormData.permanentAddress.district}
                  InputLabelProps={{
                    style: {
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      )}

      {compName.id === "user" && (
        <Box sx={{ py: 1 }}>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="Username"
              variant="outlined"
              size="small"
              name="username"
              fullWidth
              value={userData.username}
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
            />
          </Stack>
          <Stack direction={"row"} gap={1} sx={{ my: 1 }}>
            <TextField
              id="outlined-basic"
              label="Password"
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
                        style={{ color: "#185aa6" }}
                      />
                    ) : (
                      <LockIcon
                        onClick={toggleConfirmButton}
                        style={{ color: "#185aa6" }}
                      />
                    )}
                  </InputAdornment>
                ),
                style: { paddingLeft: "10px", backgroundColor: "white" },
              }}
            />
          </Stack>
        </Box>
      )}
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

export default EmployeeEdit;
