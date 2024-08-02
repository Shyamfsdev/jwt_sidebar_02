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
import CloseIcon from "@mui/icons-material/Close";
import OutlinedInput from "@mui/material/OutlinedInput";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Fade from "@mui/material/Fade";
import { useRouter } from "next/navigation";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosPost, axiosGet } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PickerWithButtonField from "../../components/buttons/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import moment from "moment";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
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
            console.log(res,"ytugtyftyftr")
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

  const [employeeTypeMaster, setemployeeTypeMaster] = useState([]);

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

  useEffect(() => {
    HandleDepartmentMaster();
    HandleDesignationMaster();
    HandleEmployeeTypeMaster();
    HandleRouteMaster();
  }, []);

  const router = useRouter();
  const [employeeName, setemployeeName] = useState("");

  const [gender, setGender] = useState("");
  const [onBordingNotes, setOnBordingNotes] = useState("");
  const [itcSalary, setitcSalary] = useState("");
  const [kmMangementSalary, setkmMangementSalary] = useState("");
  const [mangementSalary, setMangementSalary] = useState("");
  const [kmItcSalary, setkmItcSalary] = useState("");
  const [petaSalary, setpetaSalary] = useState("");
  const [age, setAge] = useState("");
  const [isWhatsAppNum, setIsWhatsAppNum] = useState(true);
  const [managerID, setmanagerID] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("MM/DD/YYYY");
  const [activePersonal, setActivePersonal] = useState(true);
  const [salaryPersonal, setsalaryPersonal] = useState(true);
  const [salryDetails, setsalryDetails] = useState(true);
  const [isFresher, setIsFresher] = useState(false);

  const [activeJob, setActiveJob] = useState(true);
  const [activeSalary, setActiveSalary] = useState(true);
  const [routeData, setrouteData] = useState(true);
  const [eMail, seteMail] = useState("");

  const [mobileNumber, setmobileNumber] = useState("+91 ");

  const [whatsAPPNumber, setwhatsAPPNumber] = useState("+91 ");

  const HandleWhatsBool = (e) => {
    setIsWhatsAppNum(e);
    if (e == true) {
      setwhatsAPPNumber(mobileNumber);
    } else {
      setwhatsAPPNumber("+91 ");
    }
  };

  const HandleChangeMobileNumber = (e) => {
    const regex = /^\+91\s\d{0,10}?$/;
    if (regex.test(e)) {
      setmobileNumber(e);
      if (isWhatsAppNum == true) {
        setwhatsAPPNumber(e);
      } else {
        setwhatsAPPNumber("+91 ");
      }
    }
  };

  const handleChangeSalary = (e) => {
    const { name, value } = e.target;
  
    if (value) {
      const floatValue = parseFloat(value);
      if (!isNaN(floatValue)) {
        if (name === "itcSalary") {
          setitcSalary(floatValue);
        } else if (name === "managementSalary") {
          setMangementSalary(floatValue);
        } else if (name === "kilometer_management_salary") {
          setkmMangementSalary(floatValue);
        } else if (name === "kilometer_itc_salary") {
          setkmItcSalary(floatValue);
        } else if (name === "peta") {
          setpetaSalary(floatValue);
        }
      }
    }
  };
  const HandleChangeWhatsMobileNumber = (e) => {
    const regex = /^\+91\s\d{0,10}?$/;
    if (regex.test(e)) {
      setwhatsAPPNumber(e);
    }
  };

  const [addressFormData, setAddressFormData] = useState({
    permanentAddress: {
      flatStreet: "",
      state: "",
      district: "",
      pincode: "",
    },
  });

  const [jobFormData, setJobFormData] = useState({
    doj: "",
    employmentType: "",
    Department: "",
    Designation: "",
    mail: "",
    phone: "+91 ",
    grade: "",
  });

  const [bankFormData, setBankFormData] = useState({
    accountNo: "",
    ifsc: "",
    holder: "",
    bankName: "",
    branch: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(true);
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
    const formattedDate = moment(value).format("YYYY-MM-DD");
    setJobFormData((prevState) => ({
      ...prevState,
      ["doj"]: formattedDate,
    }));
  };

  const handleGenterChange = (event) => {
    setGender(event.target.value);
  };

  const handlePermanentAddressChange = (event) => {
    if (isSameAddress == true) {
      setAddressFormData((prevState) => ({
        ...prevState,
        permanentAddress: {
          ...prevState.permanentAddress,
          [event.target.name]: event.target.value,
        },
      }));
    } else {
      setAddressFormData((prevState) => ({
        ...prevState,
        permanentAddress: {
          ...prevState.permanentAddress,
          [event.target.name]: event.target.value,
        },
      }));
    }
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
    }else {
      setJobFormData((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
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
    if (isSameAddress == true) {
      setAddressFormData((prevState) => ({
        ...prevState,
        permanentAddress: {
          ...prevState.permanentAddress,
          pincode: event.target.value,
          state: "",
          district: "",
        },
        temporaryAddress: {
          ...prevState.temporaryAddress,
          pincode: event.target.value,
          state: "",
          district: "",
        },
      }));
      if (event.target.value.length === 6) {
        // Corrected condition
        axios
          .get(`https://api.postalpincode.in/pincode/${event.target.value}`)
          .then((response) => {
            const { PostOffice } = response.data[0];
            if (response.data.length > 0) {
              if (PostOffice !== null) {
                const { Division, State } = PostOffice?.[0];
                setAddressFormData((prevState) => ({
                  ...prevState,
                  permanentAddress: {
                    ...prevState.permanentAddress,
                    pincode: event.target.value,
                    state: State,
                    district: Division,
                  },
                  temporaryAddress: {
                    ...prevState.temporaryAddress,
                    pincode: event.target.value,
                    state: State,
                    district: Division,
                  },
                }));
              } else {
                setAddressFormData((prevState) => ({
                  ...prevState,
                  permanentAddress: {
                    ...prevState.permanentAddress,
                    pincode: event.target.value,
                    state: "",
                    district: "",
                  },
                  temporaryAddress: {
                    ...prevState.temporaryAddress,
                    pincode: event.target.value,
                    state: "",
                    district: "",
                  },
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
                },
                temporaryAddress: {
                  ...prevState.temporaryAddress,
                  pincode: event.target.value,
                  state: "",
                  district: "",
                },
              }));
              setError({ status: "error", message: "Pincode not available." });
            }
          });
      }
    } else {
      if (type === "permanentAddress") {
        setAddressFormData((prevState) => ({
          ...prevState,
          permanentAddress: {
            ...prevState.permanentAddress,
            pincode: event.target.value,
            state: "",
            district: "",
          },
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
                    },
                  }));
                } else {
                  setAddressFormData((prevState) => ({
                    ...prevState,
                    permanentAddress: {
                      ...prevState.permanentAddress,
                      pincode: event.target.value,
                      state: "",
                      district: "",
                    },
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
                  },
                }));
                setError({
                  status: "error",
                  message: "Pincode not available.",
                });
              }
            });
        }
      }
      if (type === "temporaryAddress") {
        setAddressFormData((prevState) => ({
          ...prevState,
          temporaryAddress: {
            ...prevState.temporaryAddress,
            pincode: event.target.value,
            state: "",
            district: "",
          },
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
                    temporaryAddress: {
                      ...prevState.temporaryAddress,
                      pincode: event.target.value,
                      state: State,
                      district: Division,
                    },
                  }));
                } else {
                  setAddressFormData((prevState) => ({
                    ...prevState,
                    temporaryAddress: {
                      ...prevState.temporaryAddress,
                      pincode: event.target.value,
                      state: "",
                      district: "",
                    },
                  }));
                  setError({
                    status: "error",
                    message: "Pincode not available.",
                  });
                }
              } else {
                setAddressFormData((prevState) => ({
                  ...prevState,
                  temporaryAddress: {
                    ...prevState.temporaryAddress,
                    pincode: event.target.value,
                    state: "",
                    district: "",
                  },
                }));
                setError({
                  status: "error",
                  message: "Pincode not available.",
                });
              }
            });
        }
      }
    }
  };

  const [imageUrl, setImageUrl] = useState("");

  const [imageUrl1, setImageUrl1] = useState("");

  const [imageUrl2, setImageUrl2] = useState("");

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    const imageUrlPort = URL.createObjectURL(selectedFile);
    setImageUrl(selectedFile);
    setImageUrl1(event.target.files[0].name);
    setImageUrl2(imageUrlPort);
  };

  const [pfNumber, setpfNumber] = useState("");

  const [aadhaarNumber, setaadhaarNumber] = useState("");

  const [loadingPage, setloadingPage] = useState(false);

  const EmployeeCreateMaster = async () => {
    if (imageUrl == "") {
    //   setloadingPage(true);
      const mdata = {
        access_token: ACCESS_TOKEN,
        full_name: employeeName,
        mobile_number: mobileNumber,
        email_address: eMail,
        permanent_address: addressFormData?.permanentAddress,
        date_of_birth: dateOfBirth,
        gender: gender,
        age: age,
        whatsapp_number: whatsAPPNumber,
        date_of_join: jobFormData?.doj,
        employee_type: jobFormData?.employmentType,
        work_mail_id: jobFormData?.mail,
        work_mobile_number: jobFormData?.phone,
        aadhaar_number: aadhaarNumber,
        pf_number: pfNumber,
        status: "active",
        user_type: "salesman_user",
        desig_id: jobFormData?.Designation,
        dept_id: jobFormData?.Department,
        image: "",
        upload_file: imageUrl1,
        bank_details: bankFormData,
        on_board_note: onBordingNotes,
        job_essentials: jobFormData,
        active_status: 1,
        itc_salary: itcSalary,
        kilometer_management_salary:kmMangementSalary,
        management_salary:mangementSalary,
        kilometer_itc_salary:kmItcSalary,
        route:routeDetails,
        peta:petaSalary
      };
      axiosPost.post(`sales_man_master`, mdata).then((res) => {
        setloadingPage(false);
        console.log(res,"SALESMAN DATA")
        if (res.data.action === "error") {
          setError({ status: "error", message: res.data.message});
        } else {
          const successMessage = "Created Successfully";
          setError({ status: "success", message: successMessage });
          setTimeout(() => {
            router.push("/sales_man_list");
          }, 200);
        }
      });
    } else {
    //   setloadingPage(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const mdata = {
          access_token: ACCESS_TOKEN,
          full_name: employeeName,
          mobile_number: mobileNumber,
          email_address: eMail,
          permanent_address: addressFormData?.permanentAddress,
          date_of_birth: dateOfBirth,
          gender: gender,
          age: age,
          whatsapp_number: whatsAPPNumber,
          date_of_join: jobFormData?.doj,
          employee_type: jobFormData?.employmentType,
          work_mail_id: jobFormData?.mail,
          work_mobile_number: jobFormData?.phone,
          aadhaar_number: aadhaarNumber,
          pf_number: pfNumber,
          status: "active",
          user_type: "salesman_user",
          desig_id: jobFormData?.Designation,
          dept_id: jobFormData?.Department,
          image: result.split(",")[1],
          upload_file: imageUrl1,
          bank_details: bankFormData,
          on_board_note: onBordingNotes,
          job_essentials: jobFormData,
          active_status: 1,
          itc_salary:itcSalary,
          kilometer_management_salary:kmMangementSalary,
          management_salary:mangementSalary,
          kilometer_itc_salary:kmItcSalary,
          
          route:routeDetails,
          peta:petaSalary
        };
        axiosPost.post(`sales_man_master`, mdata).then((res) => {
          setloadingPage(false);
          if (res.data.action === "error") {
            setError({ status: "error", message: res.data.message });
          } else {
            const successMessage = "Created Successfully";
            setError({ status: "success", message: successMessage });
            setTimeout(() => {
              router.push("/sales_man_list");
            }, 200);
          }
        });
      };
      reader.readAsDataURL(imageUrl);
    }
  };

  const handleListClaim = () => {
    router.push(`/sales_man_list`);
  };

  if (loadingPage) {
    return <Loader />;
  }

  const [routeDetails, setrouteDetails] = useState([
    {
      routeID: "",
      routeName: "",
      day:""
    },
  ]);
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
  

  return (
    <div>
      <div
        className="displey_space_between global_padding"
        style={{ padding: "10px" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleListClaim()}>
            <KeyboardBackspaceIcon style={{ color: "black" }} />
          </IconButton>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "18px", fontWeight: "700", color: "#185AA6" }}
          >
            Add New Salesman
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            className="nunito_font_width create_button"
            onClick={() => EmployeeCreateMaster()}
          >
            Save
          </Button>
        </div>
      </div>
      <Box sx={{ margin: "8px" }}>
        <Grid
          container
          sx={{ height: "100%" }}
          spacing={1}
          style={{ marginLeft: "-4px" }}
        >
          <Grid item xs={12} md={2} style={{ padding: "8px" }}>
            <Paper
              square={false}
              sx={{
                p: 1,
                height: "87vh",
                position: "sticky",
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pb: 2,
                }}
              >
                <Box sx={{ position: "relative" }}>
                  {imageUrl2 == undefined ||
                  imageUrl2 == "" ||
                  imageUrl2 == NaN ? (
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
              <Box sx={{ px: 1 }}>
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  color={"primary"}
                >
                  Basic Details*
                </Typography>
                <Box sx={{ my: 1 }}>
                  <TextField
                    id="outlined-basic"
                    label="Salesman Name"
                    variant="outlined"
                    value={employeeName}
                    onChange={(e) => setemployeeName(e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="Salesman Name"
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
                        onChange={handleGenterChange}
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
                    <FormControl sx={{ p: 0 }} variant="outlined" size="small">
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
                      sx={{ pb: 1, width: 100 }}
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
              <Box sx={{ px: 1 }}>
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  color={"primary"}
                >
                  Contact Details*
                </Typography>
                <Box sx={{ my: 1 }}>
                  <TextField
                    id="outlined-basic"
                    label="Mobile Number"
                    variant="outlined"
                    size="small"
                    value={mobileNumber}
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
                      onChange={(e) => HandleWhatsBool(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="p" fontSize={"12px"}>
                      Use this number for WhatsApp
                    </Typography>
                  }
                />
                {!isWhatsAppNum && (
                  <Box sx={{ my: 1 }}>
                    <TextField
                      id="outlined-basic"
                      label="WhatsApp Number"
                      variant="outlined"
                      size="small"
                      value={whatsAPPNumber}
                      fullWidth
                      onChange={(e) =>
                        HandleChangeWhatsMobileNumber(e.target.value)
                      }
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
                    value={eMail}
                    onChange={(e) => seteMail(e.target.value)}
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
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={10}
            style={{ height: "90vh", overflow: "auto", padding: "8px" }}
          >
            <Typography
              variant="h4"
              fontWeight={"bold"}
              color={"primary"}
              style={{ fontSize: "16px" }}
            >
              Personal Details{" "}
              <Typography variant="span">
                <IconButton
                  className="create_svg_icon"
                  size="small"
                  onClick={() => setActivePersonal(!activePersonal)}
                >
                  {" "}
                  {activePersonal ? (
                    <KeyboardArrowDownIcon className="svg_style_create" />
                  ) : (
                    <KeyboardArrowUpIcon className="svg_style_create" />
                  )}{" "}
                </IconButton>
              </Typography>
            </Typography>
            {activePersonal && (
              <>
                <Paper sx={{ p: 1, mb: 1 }}>
                  <Stack direction={"row"} gap={2}>
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
                        <Box sx={{ my: 1 }}>
                          <TextField
                            id="outlined-basic"
                            label="Pincode"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={addressFormData.permanentAddress.pincode}
                            onChange={(e) =>
                              handlePincodeChange(e, "permanentAddress")
                            }
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
                        <Box sx={{ my: 1 }}>
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
                        <Box sx={{ my: 1 }}>
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
                  </Stack>
                </Paper>
              </>
            )}
            <Box>
            <Typography
              variant="h4"
              fontWeight={"bold"}
              color={"primary"}
              style={{ fontSize: "16px" }}
            >
              Salary Details{" "}
              <Typography variant="span">
                <IconButton
                  className="create_svg_icon"
                  size="small"
                  onClick={() => setsalaryPersonal(!salaryPersonal)}
                >
                  {" "}
                  {salaryPersonal ? (
                    <KeyboardArrowDownIcon className="svg_style_create" />
                  ) : (
                    <KeyboardArrowUpIcon className="svg_style_create" />
                  )}{" "}
                </IconButton>
              </Typography>
            </Typography>
            {salaryPersonal && (
              <>
                <Paper sx={{ p: 1, mb: 1 }}>
                  <Stack direction={"row"} gap={2}>
                    <Box sx={{ px: 1 }}>
                      <Box sx={{ mb: 2, mt: 1 }}>
                        <Typography
                          variant="p"
                          fontSize={"12px"}
                          fontWeight={"bold"}
                          color={"primary"}
                          // my={1}
                        >
                         Salary Details
                        </Typography>
                      </Box>
                      <Stack direction={"row"} gap={1}>
                        <Box sx={{ my: 1 }}>
                          <TextField
                            id="outlined-basic"
                            label="ITC Salary"
                            variant="outlined"
                            size="small"
                            name="itcSalary"
                            fullWidth
                            value={itcSalary}
                            onChange={handleChangeSalary}
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
                        <Box sx={{ my: 1 }}>
                          <TextField
                            id="outlined-basic"
                            label="Management Salary"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={mangementSalary}
                            onChange={handleChangeSalary}
                            inputProps={{
                              name: "managementSalary", 
                              style: {
                                fontSize: "12px"
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
                        <Box sx={{ my: 1 }}>
                          <TextField
                            id="outlined-basic"
                            label="KM Management Cost"
                            variant="outlined"
                            size="small"
                            sx={{ pb: 1 }}
                            fullWidth
                            name="kilometer_management_salary"
                            value={kmMangementSalary}
                            onChange={handleChangeSalary}
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
                        <Box sx={{ my: 1 }}>
                          <TextField
                            id="outlined-basic"
                            label="ITC KM Cost"
                            variant="outlined"
                            size="small"
                            fullWidth
                            inputProps={{
                              style: {
                                fontSize: "12px",
                              },
                              type: "number",
                              step: "0.01",
                              min: "0"
                            }}
                            name="kilometer_itc_salary"
                            value={kmItcSalary}
                            onChange={handleChangeSalary}
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
                            label="Bata"
                            variant="outlined"
                            size="small"
                            fullWidth
                            inputProps={{
                              style: {
                                fontSize: "12px",
                              },
                              type: "number",
                              step: "0.01",
                              min: "0"
                            }}
                            name="peta"
                            value={petaSalary}
                            onChange={handleChangeSalary}
                            InputLabelProps={{
                              style: {
                                fontSize: "12px",
                              },
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </>
            )}
            </Box>
           
            <Box>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                color={"primary"}
                style={{ fontSize: "16px" }}
              >
                Bank Details
                <Typography variant="span">
                  <IconButton
                    className="create_svg_icon"
                    size="small"
                    onClick={() => setActiveSalary(!activeSalary)}
                  >
                    {" "}
                    {activeSalary ? (
                      <KeyboardArrowDownIcon className="svg_style_create" />
                    ) : (
                      <KeyboardArrowUpIcon className="svg_style_create" />
                    )}{" "}
                  </IconButton>
                </Typography>
              </Typography>
            </Box>

            {activeSalary && (
              <>
                <Paper sx={{ p: 1, mb: 1 }}>
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    color={"primary"}
                    my={1}
                  >
                    Bank Details
                  </Typography>
                  <Stack direction={"row"} gap={2}>
                    <Box sx={{ my: 1 }}>
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
                    <Box sx={{ my: 1 }}>
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
                </Paper>
              </>
            )}

            <Box>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                color={"primary"}
                style={{ fontSize: "16px" }}
              >
                Route Details
                <Typography variant="span">
                  <IconButton
                    className="create_svg_icon"
                    size="small"
                    onClick={() => setrouteData(!routeData)}
                  >
                    {" "}
                    {routeData ? (
                      <KeyboardArrowDownIcon className="svg_style_create" />
                    ) : (
                      <KeyboardArrowUpIcon className="svg_style_create" />
                    )}{" "}
                  </IconButton>
                </Typography>
              </Typography>
            </Box>

            {routeData && (
              <>
                <Paper sx={{ p: 1, mb: 1 }}>
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    color={"primary"}
                    my={1}
                  >
                    Route Details
                  </Typography>
                  <Stack direction="column">
                    {routeDetails.map((res, index) => (
                      <Stack direction="row" gap={1} key={index}>
                        <Box sx={{width: "180px" }}>
                          <Autocomplete
                            margin="normal"
                            variant="outlined"
                            style={{ marginTop: "4px"}}
                            options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
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



                </Paper>
              </>
            )}  

            <Box>
              <Typography
                variant="h4"
                fontWeight={"bold"}
                color={"primary"}
                style={{ fontSize: "16px" }}
              >
                Job Essentials
                <Typography variant="span">
                  <IconButton
                    className="create_svg_icon"
                    size="small"
                    onClick={() => setActiveJob(!activeJob)}
                  >
                    {" "}
                    {activeJob ? (
                      <KeyboardArrowDownIcon className="svg_style_create" />
                    ) : (
                      <KeyboardArrowUpIcon className="svg_style_create" />
                    )}{" "}
                  </IconButton>
                </Typography>
              </Typography>
            </Box>

            {activeJob && (
              <>
                <Paper sx={{ p: 1, mb: 1 }}>
                  <Stack direction={"row"} gap={2}>
                    <FormControl
                      sx={{ p: 0, my: 1 }}
                      variant="outlined"
                      size="small"
                    >
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
                    <FormControl sx={{ my: 1, width: "200px" }} size="small">
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
                    <Box sx={{ my: 1 }}>
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
                  </Stack>
                  <Stack direction={"row"} gap={2}>
                    <Box sx={{ my: 1 }}>
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
                </Paper>
              </>
            )}

            <Paper sx={{ p: 1, mb: 1, mt: 1 }}>
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  color={"primary"}
                  my={1}
                >
                  Onboarding Note
                </Typography>

                <Box sx={{ my: 1 }}>
                  <TextField
                    id="outlined-basic"
                    label="Notes"
                    variant="outlined"
                    size="small"
                    name="branch"
                    fullWidth
                    value={onBordingNotes}
                    onChange={(e) => setOnBordingNotes(e.target.value)}
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
            </Paper>
          </Grid>
        </Grid>
      </Box>
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

export default EmployeeCreate;
