"use client";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Menu,
  Button,
  IconButton,
  Drawer,
  TextField,
  Divider,
  Badge,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { axiosGet, axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import CreateButton from "../../../(Dashboard)/components/buttons/CreateButton";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Cookies from "js-cookie";
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import MasterTable from "../../components/dashboard/MasterTable";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";

const EmployeeList = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState({ status: "", message: "" });
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  // Data Toggle/Dialog State and Funtions -----
  const [openDrawer, setOpenDrawer] = useState(false);
  const [effectToggle, setEffectToggle] = useState(false);
  const [openDrawerType, setOpenDrawerType] = useState(1);
  const [open, setOpen] = useState(false);
  const [openMulitiStatus, setOpenMultistatus] = useState(false);
  const [openMulitiDelete, setOpenMultiDelete] = useState(false);
  const [dltOpen, setDltOpen] = useState(false);
  const [filtersList, setfiltersList] = useState(false);
  const [actionData, setActionData] = React.useState("");
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [filterBadgeVisible, setFilterBadgeVisible] = useState(false);

  const handlefilterBadgeVisible = () => {
    if (isStatusSelected || isDateSelected) {
      // setFilterBadgeVisible(true);
      return true;
    } else {
      // setFilterBadgeVisible(false);
      return false;
    }
  };

  // Menu component element
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [pageDrawerWidth, setpageDrawerWidth] = useState(0);

  // Toggel Drawer
  const toggleDrawer = (newOpen, type) => () => {
    if (newOpen === true) {
      if (type == 1) {
        setOpenDrawer(newOpen);
        setOpenDrawerType(type);
        setpageDrawerWidth(500);
        setjob_titleName("");
        setDataUniqId("");
        setcontectNumber("+91 ");
        setemailAddress("");
        setgstNumber("");
        setbankDetails({
          accountNo: "",
          bankName: "",
          branch: "",
          holder: "",
          ifsc: "",
        });
        setaddressDetails({
          flatStreet: "",
          pincode: "",
          state: "",
          district: "",
        });
      } else {
        setOpenDrawer(newOpen);
        setOpenDrawerType(type);
        setpageDrawerWidth(500);
        setjob_titleName(singleData.supplier_name);
        setDataUniqId(singleData.data_uniq_id);
        setcontectNumber(singleData?.contact_no);
        setemailAddress(singleData?.email_id);
        setgstNumber(singleData?.gst_no);
        setbankDetails(singleData?.bank_details);
        setaddressDetails(singleData?.address);
        settaxDetails1(singleData?.tax_details);
        handleClose2();
      }
    } else {
      setOpenDrawer(newOpen);
      setOpenDrawerType(type);
      setpageDrawerWidth(0);
    }
  };

  // Open Status change warning box
  const handleOpen = () => {
    setOpen(true);
    handleClose2();
  };

  const handleClose = () => {
    setOpen(false);
    handleClose2();
  };

  // Close delete warning box
  const handleCloseDlt = () => {
    setDltOpen(false);
  };

  // Close multi status change warning box
  const handleCloseMultiStatus = () => {
    setOpenMultistatus(false);
  };

  // Close multi delete warning box
  const handleCloseMultiDelete = () => {
    setOpenMultiDelete(false);
  };

  // Open single delete warning box
  const handleDelteOpen = () => {
    setDltOpen(true);
  };
  const singleDataGet = (data) => {
    setSingleData(data);
  };

  // Toggel filter component
  const HandleChangeFilter = () => {
    setfiltersList(!filtersList);
  };

  // opne multi status waring
  const handleChange = (event) => {
    setActionData(event.target.value);
    setOpenMultistatus(true);
  };

  // Pagination State and Funtions -----
  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [limitEnd, setlimitEnd] = useState("15");
  const [dataCount, setdataCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tableName, settableName] = useState("");
  const [idField, setidField] = useState("");
  const handleLimitChange = (event) => {
    setlimitEnd(event.target.value);
    handleRefresh();
  };
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  // Filter/Sort State and Funtions ------
  const [orderField, setOrderField] = useState("created_date");
  const [dateTitle, setDateTitle] = useState("Created Date");
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isStatusSelected, setIsStatusSelected] = useState(false);
  const [orderType, setOrderType] = useState("desc");
  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState(3);

  // Funtion for format date
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Function to update searchValue when input changes
  const handleSearchInputChange = (input) => {
    setSearchValue(input);
  };

  // Funtion to change created date for filter
  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateSelected(true);
    // handlefilterBadgeVisible(true)
  };

  // Funtion to change active status for filter
  const handleActiveStatusChange = (value) => {
    setActiveStatusFilter(value);
    setIsStatusSelected(true);
    // handlefilterBadgeVisible(true)
  };

  // Page action's state and funtions (create, Edit, Status change, Delete) ----
  const [job_titleName, setjob_titleName] = useState("");
  const [dataUniqId, setDataUniqId] = useState("");
  const [dataStatus, setDataStatus] = useState(1);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [postError, setPostError] = useState([]);


  // Funtion for create new data or edit existing data
  const handleSubmit = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: dataUniqId,
      supplier_name: job_titleName,
      contact_no: contectNumber,
      email_id: emailAddress,
      gst_no: gstNumber,
      bank_details: bankDetails,
      address: addressDetails,
      tax_details: taxDetails,
      active_status: dataStatus,
    };
    try {
      if (openDrawerType == 1) {
        axiosPost
          .post(`supplier_master`, jsonData)
          .then((response) => {
            // Handle the successful POST response here
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
            } else {
              setError({ status: "error", message: response.data.message });
            }
          })
          .catch((error) => {
            // Handle POST errors here
            console.error("POST Error:", error);
          });
      } else {
        axiosPost
          .put(`supplier_master`, jsonData)
          .then((response) => {
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
            } else {
              setError({ status: "error", message: response.data.message });
            }
          })
          .catch((error) => {
            // Handle POST errors here
            setOpenDrawer(false);
            console.error("POST Error:", error);
          });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setOpenDrawer(false);
    }
  };

  // Funtion for delete single data
  const handleDelete = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: [singleData.data_uniq_id],
      table_name: tableName,
      id_field: idField,
    };
    axiosPost
      .post(`delete_data`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        handleClose2();
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for change status of single data
  const handleStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: [singleData.data_uniq_id],
      table_name: tableName,
      id_field: idField,
      status: singleData.active_status === 1 ? 0 : 1,
      field_name: "active_status",
    };
    axiosPost
      .post(`active_status`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        setIsLoading(false);

        handleClose2();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for change status of multiple data
  const handleMulitiStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: selectedItems,
      table_name: tableName,
      id_field: idField,
      status: actionData,
      field_name: "active_status",
    };
    axiosPost
      .post(`active_status`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        setIsLoading(false);
        handleClose2();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for delete multiple data
  const handleMulitiDelete = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: selectedItems,
      table_name: tableName,
      id_field: idField,
    };
    axiosPost
      .post(`delete_data`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        handleClose2();
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const fetchData = async () => {
    setIsLoading(true);
    axiosGet
      .get(
        `supplier_master_list?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${
          activeStatusFilter === 3 ? "" : activeStatusFilter
        }`
      )
      .then((response) => {
        setData(response.data.data);
        setdataCount(response.data.total_items);
        setPageCount(response.data.total_pages);
        settableName(response.data.table_name);
        setidField(response.data.id_field);
        setPageNumber(pageNumber === 0 ? 1 : pageNumber);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData();
    HandleTaxTypeMaster();
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
    orderField,
    orderType,
    openDrawer,
    effectToggle,
    activeStatusFilter,
  ]);

  const title = "Supplier";

  const tableHead = [
    {
      id: 1,
      label: `${title} Name`,
      value: "supplier_name",
    },
    {
      id: 2,
      label: `Mobile No.`,
      value: "contact_no",
    },
    {
      id: 3,
      label: `Location`,
      value: "address",
    },
    {
      id: 4,
      label: "Created Date",
      value: "created_date",
    },
    {
      id: 5,
      label: "Status",
      value: "active_status",
    },
    {
      id: 6,
      label: "Action",
      action: true,
      align: "center",
    },
  ];

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setAnchorEl2(e.currentTarget);
  };
  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.supplier_name}
            </Typography>
          ),
          id: 1,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.contact_no}
            </Typography>
          ),
          id: 2,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.address?.district}
            </Typography>
          ),
          id: 3,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.created_f_date}
            </Typography>
          ),
          id: 4,
        },
        {
          comp: (
            <Box sx={{ padding: "5px 16px" }}>
              <Button
                className={`table_body_style_fab arrival_${item.active_status} flex_display`}
                sx={{ width: "20%" }}
              >
                {item.active_status == 1 ? "Active" : "Inactive"}
              </Button>
            </Box>
          ),
          id: 5,
        },
        {
          comp: (
            <IconButton
              size="small"
              onClick={(e) => handleOnActionClick(e, item)}
              title="Click to Action"
            >
              <MoreVertOutlined></MoreVertOutlined>
            </IconButton>
          ),
          id: 6,
          align: "center",
        },
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
    };
    td_data_set.push(array_data);
  });

  const handleRefresh = () => {
    setSearchValue("");
    setActiveStatusFilter(3);
    setDateTitle("Created date");
    setIsDateSelected(false);
    setIsStatusSelected(false);
    setCreatedEndDate("");
    setCreatedStartDate("");
    fetchData();
  };

  // Action Component
  const ActionComponent = () => {
    return (
      <FormControl size="small" sx={{ minWidth: "150px" }}>
        <InputLabel
          sx={{ fontSize: "12px" }}
          id="demo-simple-select-label"
          className="nunito_font"
        >
          {"Change Status"}
        </InputLabel>
        <Select
          sx={{ fontSize: "14px" }}
          placeholder={"Change Status"}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={actionData}
          label={"Change Status"}
          onChange={handleChange}
        >
          <MenuItem sx={{ fontSize: "14px" }} value={1}>
            Active
          </MenuItem>
          <MenuItem sx={{ fontSize: "14px" }} value={0}>
            Inactive
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  const [contectNumber, setcontectNumber] = useState("+91 ");

  const HandleChangeMobileNumber = (e) => {
    const regex = /^\+91\s\d{0,10}?$/;
    if (regex.test(e)) {
      setcontectNumber(e);
    }
  };

  const [emailAddress, setemailAddress] = useState("");

  const [gstNumber, setgstNumber] = useState("");

  const [addressDetails, setaddressDetails] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const handlePermanentAddressChange = (event) => {
    setaddressDetails((prevState) => ({
      ...prevState,
      flatStreet: event.target.value,
    }));
  };

  const handlePincodeChange = (event) => {
    const numberRegex = /^$|^[0-9]+(\.[0-9]+)?$/;
    const { value } = event.target;
  
    if (!numberRegex.test(value)) {
      setError({
        status: "error",
        message: "Pincode must be a number.",
      });
      return;
    }
  
    setaddressDetails((prevState) => ({
      ...prevState,
      pincode: value,
      state: "",
      district: "",
    }));
  
    if (value.length === 6) {
      axios
        .get(`https://api.postalpincode.in/pincode/${value}`)
        .then((response) => {
          const { PostOffice } = response.data[0];
          if (response.data.length > 0) {
            if (PostOffice !== null) {
              const { Division, State } = PostOffice?.[0];
              setaddressDetails((prevState) => ({
                ...prevState,
                pincode: value,
                state: State,
                district: Division,
              }));
            } else {
              setaddressDetails((prevState) => ({
                ...prevState,
                pincode: value,
                state: "",
                district: "",
              }));
              setError({
                status: "error",
                message: "Pincode not available.",
              });
            }
          } else {
            setaddressDetails((prevState) => ({
              ...prevState,
              pincode: value,
              state: "",
              district: "",
            }));
            setError({
              status: "error",
              message: "Pincode not available.",
            });
          }
        })
        .catch((error) => {
          setError({
            status: "error",
            message: "Failed to fetch pincode details.",
          });
        });
    }
  };
  

  const [bankDetails, setbankDetails] = useState({
    accountNo: "",
    bankName: "",
    branch: "",
    holder: "",
    ifsc: "",
  });

  const handleBankFormChange = (event) => {
    if (event.target.name == "accountNo") {
      const numberRegex = /^$|^[0-9]+(\.[0-9]+)?$/;
      if (numberRegex.test(event.target.value)) {
        setbankDetails((prevState) => ({
          ...prevState,
          [event.target.name]: event.target.value,
        }));
      }
    } else {
      setbankDetails((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const[taxDetails,settaxDetails] = useState([]);

  const[taxDetails1,settaxDetails1] = useState([]);

  const HandleTaxTypeMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `tax_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action === "success") {
            const tax_list = []
            res.data.data.forEach((val) => {
              const existingTaxDetailIndex = taxDetails1.filter(detail => detail.tax_id === val.data_uniq_id);
              if(existingTaxDetailIndex.length !== 0){
                const tax_details = {
                  tax_id: existingTaxDetailIndex[0].tax_id,
                  tax_name: existingTaxDetailIndex[0].tax_name,
                  value: existingTaxDetailIndex[0].value
              };
              tax_list.push(tax_details)
              }else{
                const tax_details = {
                  tax_id: val.data_uniq_id,
                  tax_name: val.tax_type,
                  value: 0
              };
              tax_list.push(tax_details)
              }
          });
          settaxDetails(tax_list);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };


  const ChangeCgstValue = (event, value,index) => {
    const newFields = [...taxDetails]
    if (value === 0) {
      newFields[index].value = 1;
      settaxDetails(newFields)
    } else {
      newFields[index].value = 0;
      settaxDetails(newFields)
    }
  };

  const CreateCompannet = () => {
    return (
      <div style={{ height: "85vh", overflow: "auto" }}>
        <Box sx={{ my: 1, padding: "5px" }}>
          <div className="master_create_style">
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              Supplier Details
            </Typography>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Supplier Name"
                  variant="outlined"
                  value={job_titleName}
                  onChange={(e) => setjob_titleName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Supplier Name"
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
                <TextField
                  id="outlined-basic"
                  label="Contact No."
                  variant="outlined"
                  value={contectNumber}
                  onChange={(e) => HandleChangeMobileNumber(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Contact No."
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
                <TextField
                  id="outlined-basic"
                  label="Email ID"
                  variant="outlined"
                  value={emailAddress}
                  onChange={(e) => setemailAddress(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Email ID"
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
            </Box>
            <TextField
              id="outlined-basic"
              label="GST No."
              variant="outlined"
              value={gstNumber}
              onChange={(e) => setgstNumber(e.target.value)}
              size="small"
              fullWidth
              placeholder="GST No."
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
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              Address
            </Typography>
            <TextField
              id="outlined-basic"
              label="Flat No. / Street"
              variant="outlined"
              value={addressDetails?.flatStreet}
              onChange={(e) => handlePermanentAddressChange(e)}
              size="small"
              fullWidth
              placeholder="Flat No. / Street"
              sx={{ pb: 1, marginTop: "10px" }}
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
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Pincode"
                  variant="outlined"
                  value={addressDetails?.pincode}
                  onChange={(e) => handlePincodeChange(e)}
                  size="small"
                  fullWidth
                  placeholder="Pincode"
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
                <TextField
                  id="outlined-basic"
                  label="State"
                  variant="outlined"
                  disabled
                  value={addressDetails?.state}
                  size="small"
                  fullWidth
                  placeholder="State"
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
                <TextField
                  id="outlined-basic"
                  label="District"
                  variant="outlined"
                  disabled
                  value={addressDetails?.district}
                  size="small"
                  fullWidth
                  placeholder="District"
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
            </Box>
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              Bank Details
            </Typography>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Acc No."
                  variant="outlined"
                  name="accountNo"
                  value={bankDetails?.accountNo}
                  onChange={(e) => handleBankFormChange(e)}
                  size="small"
                  fullWidth
                  placeholder="Acc No."
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
                <TextField
                  id="outlined-basic"
                  label="IFSC Code"
                  variant="outlined"
                  name="ifsc"
                  value={bankDetails?.ifsc}
                  onChange={handleBankFormChange}
                  size="small"
                  fullWidth
                  placeholder="IFSC Code"
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
                <TextField
                  id="outlined-basic"
                  label="Account Holder Name"
                  variant="outlined"
                  name="holder"
                  value={bankDetails?.holder}
                  onChange={handleBankFormChange}
                  size="small"
                  fullWidth
                  placeholder="Account Holder Name"
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
            </Box>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Bank Name"
                  variant="outlined"
                  name="bankName"
                  value={bankDetails?.bankName}
                  onChange={handleBankFormChange}
                  size="small"
                  fullWidth
                  placeholder="Bank Name"
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
                <TextField
                  id="outlined-basic"
                  label="Branch"
                  variant="outlined"
                  name="branch"
                  value={bankDetails?.branch}
                  onChange={handleBankFormChange}
                  size="small"
                  fullWidth
                  placeholder="Branch"
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
            </Box>
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              Tax Details{" "}
              <span style={{ color: "black" }}>
                (select the applicable GST)
              </span>
            </Typography>
            <Box sx={{ my: 2,overflow:'auto' }}>
              <Stack direction={"row"} gap={2} style={{width:'500px'}}>
              {taxDetails?.map((res,index) => (
                <div key={index}>
                  <Checkbox
                    onChange={(event) => ChangeCgstValue(event, res.value,index)}
                    checked={res.value == 0 ? false : true}
                    style={{ padding: "0px", color: "#c3c3c3" }}
                  />
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    style={{ color: "black" }}
                  >
                    {res.tax_name}
                  </Typography>
                </div>
              ))}
              </Stack>
            </Box>
          </div>
        </Box>
      </div>
    );
  };

  // Filter component
  const FilterComponent = () => {
    return (
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 1,
        }}
      >
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <InputLabel sx={{ fontSize: "14px" }} id="demo-simple-select-label">
            {"Status"}
          </InputLabel>
          <Select
            sx={
              isStatusSelected
                ? { fontSize: "14px", bgcolor: " #185aa617", height: "34px" }
                : { fontSize: "14px", height: "34px" }
            }
            placeholder={"Status"}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={activeStatusFilter}
            label={"Status"}
            onChange={(e) => handleActiveStatusChange(e.target.value)}
          >
            <MenuItem sx={{ fontSize: "14px" }} value={3}>
              All
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={1}>
              Active
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={0}>
              Inactive
            </MenuItem>
          </Select>
        </FormControl>
        <Box fullWidth>
          <DateFilter
            title={dateTitle}
            buttonType={1}
            onDateRangeChange={onCreatedDateChange}
            isSelected={isDateSelected}
          ></DateFilter>
        </Box>
        <IconButton
          onClick={handleRefresh}
          size="small"
          style={{ marginTop: "-4px" }}
          className="flex_display"
        >
          <RefreshOutlined />
        </IconButton>
      </Box>
    );
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="displey_space_between"
      >
        <CreateButton
          heading={title}
          pagecount={dataCount}
          onAddClick={toggleDrawer(true, 1)}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <SearchFilter
            onSearchButtonClick={handleSearchInputChange}
            searchValue={searchValue}
          />
          {/* <ExportButton /> */}
          <Badge
            color="secondary"
            variant="dot"
            invisible={!handlefilterBadgeVisible()}
            sx={{ marginRight: "15px" }}
          >
            <FilterButton
              HandleChangeFilter={HandleChangeFilter}
              filtersList={filtersList}
            />
          </Badge>
        </Box>
      </div>
      {/* {filtersList && ( */}
      <Collapse in={filtersList} timeout="auto" unmountOnExit>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {FilterComponent()}
        </Box>
      </Collapse>
      <div>
        <MasterTable
          pageCount={pageCount}
          tableHead={tableHead}
          onPageChange={handlePageChange}
          tableRow={td_data_set}
          order={orderType}
          orderBy={orderField}
          setOrder={setOrderType}
          setOrderBy={setOrderField}
          ActionComponent={ActionComponent}
          setSelected={setSelectedItems}
          selected={selectedItems}
          onDelete={() => setOpenMultiDelete(true)}
        />
        {/* )} */}
      </div>
      <MasterDrawer
        isPageSidebarOpen={openDrawer}
        drawerWidth={pageDrawerWidth}
        onSidebarClose={toggleDrawer(false)}
        heading={"Supplier"}
        postError={postError}
        setStateValue={setjob_titleName}
        setValue={job_titleName}
        onCreateClick={handleSubmit}
        CreateCompannet={CreateCompannet}
      />

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "right" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            minWidth: "100px",
            boxShadow: "0px 4px 7px 0px #00000024 !important",
          },
        }}
      >
        <List sx={{ p: 0, fontSize: "12px" }}>
          <ListItemButton onClick={handleOpen}>
            <Typography variant="p"> Change Status</Typography>
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={toggleDrawer(true, 2)}>
            <Typography variant="p">Edit</Typography>
          </ListItemButton>

          <Divider />
          <ListItemButton
            sx={{ bgcolor: "#dfc4cd69" }}
            onClick={handleDelteOpen}
          >
            <Typography variant="p">Delete</Typography>
          </ListItemButton>
        </List>
      </Menu>
      <AlertDialog
        onsubmit={handleDelete}
        open={dltOpen}
        handleClose={handleCloseDlt}
        text={"Are you sure want to Delete?"}
      ></AlertDialog>
      <AlertDialog
        onsubmit={handleStatusChange}
        open={open}
        handleClose={handleClose}
        text={"Are you sure want to change status?"}
      ></AlertDialog>
      <AlertDialog
        onsubmit={handleMulitiStatusChange}
        open={openMulitiStatus}
        handleClose={handleCloseMultiStatus}
        text={`Are you sure want to ${
          actionData === 0 ? "Inactive" : "Active"
        } ${selectedItems.length} items?`}
      ></AlertDialog>

      <AlertDialog
        onsubmit={handleMulitiDelete}
        open={openMulitiDelete}
        handleClose={handleCloseMultiDelete}
        text={`Are you sure want to delete ${selectedItems.length} items?`}
      ></AlertDialog>
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
        <Alert onClose={handleCloseError} severity={error.status}>
          {error.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeList;
