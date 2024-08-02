"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Tabs from "../../components/container/CustomeTab";
import Paper from "@mui/material/Paper";
import {
  Modal,
  CircularProgress,
  List,
  ListItemButton,
  Autocomplete,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Badge,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { FormControl, Typography } from "@mui/material";
import CreateButton from "../../../(Dashboard)/components/buttons/CreateButton";
import Cookies from "js-cookie";
import UserTable from "../../../(Dashboard)/components/dashboard/UserTable";
import moment from "moment";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Collapse from "@mui/material/Collapse";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const OrderList = () => {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const router = useRouter();

  const ACCESS_TOKEN = Cookies.get("token");

  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);

  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [limitEnd, setlimitEnd] = useState("30");
  const [dataCount, setdataCount] = useState(0);

  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");

  const [searchValue, setSearchValue] = useState(""); // State variable to store search input

  const handleSearchInputChange = (input) => {
    setSearchValue(input);
  };

  const handleLimitChange = (event) => {
    setlimitEnd(event.target.value);
    handleRefresh();
  };

  const [orderType, setOrderType] = useState("desc");
  const [orderField, setOrderField] = useState("created_date");
  const [draftData, setdraftData] = useState([]);


  const fetchData = async (
    access_token,
    limit,
    end,
    searchValue,
    createdStartDate,
    createdEndDate,
    order_type,
    order_field,
    pur_invoice_status
  ) => {
    axiosGet
      .get(
        `purchase_entry_master_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&pur_invoice_status=${pur_invoice_status}`
      )
      .then((response) => {
        setData(response.data.data);
        setdataCount(response.data.total_items);
        setPageCount(response.data.total_pages);
        setPageNumber(pageNumber === 0 ? 1 : pageNumber);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchData2 = async (access_token) => {
    axiosGet
      .get(`purchase_entry_master_list_dispatch?access_token=${access_token}`)
      .then((response) => {
        setdraftData(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const APIRecall = () => {
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter
    );
  };

  useEffect(() => {
    HandleInvoiceMaster();
    HandleSupplierTypeMaster();
    HandleDispatchMaster();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter
    );
    fetchData2(ACCESS_TOKEN);
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
  ]);

  const tableHead = [
    {
      id: 1,
      label: "Entry Number",
      value: "pur_invoice_number",
    },
    {
      id: 2,
      label: "Entry Date",
      value: "invoice_date",
    },
    {
      id: 3,
      label: "DO Details",
      value: "dispatch_order_id",
    },
    {
      id: 4,
      label: "Invoice Details",
      value: "dispatch_order_id",
    },
    {
      id: 5,
      label: "Supplier Name",
      value: "supplier_name",
    },
    {
      id: 6,
      label: "Contact No.",
      value: "supplier_data",
    },
    {
      id: 7,
      label: "Net Amount (₹)",
      value: "sub_total",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.pur_entry_number, type: "text", id: 1, alian: "left" },
        {
          td: moment(item.invoice_date).format("YYYY-MM-DD"),
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td:
            item.pur_entry_status == 0
              ? "NA"
              : item.dispatch_order_id === null ||
                item.dispatch_order_id === undefined ||
                item.dispatch_order_id === ""
              ? "NA"
              : item?.dispatch_order_number,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td:
            item.pur_entry_status == 0
              ? "NA"
              : item.purchase_invoice_id === null ||
                item.purchase_invoice_id === undefined
              ? "NA"
              : item.purchase_invoice_id?.pur_invoice_number,
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: item.supplier_name,
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: item.supplier_data?.contact_no,
          type: "text",
          id: 6,
          alian: "left",
        },
        {
          td: <Box style={{ padding: "8px 0px" }}>{item.sub_total}</Box>,
          id: 7,
          alian: "left",
        },
      ],
      json: [item],
      active: item.pur_invoice_status,
    };
    td_data_set.push(array_data);
  });

  const [dateTitle, setDateTitle] = useState("Created Date");

  const handleRefresh = () => {
    setSearchValue("");
    setCreatedEndDate("");
    setCreatedStartDate("");
    setActiveStatusFilter("");
    setDateTitle("Created Date");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      "desc",
      "created_date",
      ""
    );
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  const singleDataGet = (data) => {
    setSingleData(data);
  };

  const [filtersList, setfiltersList] = useState(false);
  const HandleChangeFilter = () => {
    setfiltersList(!filtersList);
  };

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const ActionComponent = () => {
    return <div></div>;
  };

  const HandleOpenViewInvoice = () => {
    router.push("/view_purchase_entry");
    handleClose2();
  };

  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => HandleOpenViewInvoice()}>
          <Typography variant="p">View Entry</Typography>
        </ListItemButton>
      </List>
    );
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data.json[0]);
    Cookies.set("invoice_id", data.id);
    setAnchorEl2(e.currentTarget);
  };

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const [loadingPage, setloadingPage] = useState(false);

  const handleImport = () => {
    if (file) {
      setloadingPage(true);
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result.split(",")[1];
        const data = {
          file: file.name,
          excel_file_upload: fileData,
          access_token: ACCESS_TOKEN,
          supplier_id: supplierID,
          supplier_name: supplierName,
          supplier_data: supplierData,
        };
        axiosPost
          .post("dispatch_do_details", data)
          .then((response) => {
            if (response.action_status == "Error") {
              setloadingPage(false);
              setFileName(null);
              setOpen(false);
              setFile(null);
            } else {
              fetchData(
                ACCESS_TOKEN,
                pageNumber,
                limitEnd,
                searchValue,
                createdStartDate,
                createdEndDate,
                orderType,
                orderField,
                activeStatusFilter
              );
              setloadingPage(false);
              setFileName(null);
              setOpen(false);
              setFile(null);
            }
          })
          .catch((error) => {
            console.error("Error sending file to API:", error);
            setloadingPage(false);
            setFileName(null);
            setOpen(false);
            setFile(null);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));

  const DemoPaper = styled(Paper)(({ theme }) => ({
    width: "80%",
    padding: theme.spacing(1.5),
    ...theme.typography.subtitle2,
    textAlign: "left",
  }));

  const [selectedItems, setSelectedItems] = useState([]);

  const [supplierMaster, setsupplierMaster] = useState([]);

  const HandleSupplierTypeMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `supplier_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setsupplierMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [supplierID, setsupplierID] = useState("");

  const [supplierName, setsupplierName] = useState("");

  const [supplierData, setsupplierData] = useState();

  const HandleUpdateSupplier = (event, value) => {
    if (value != null) {
      setsupplierID(value.data_uniq_id);
      setsupplierName(value.supplier_name);
      setsupplierData(value);
    } else {
      setsupplierID("");
      setsupplierName("");
      setsupplierData();
    }
  };

  const [isStatusSelected, setIsStatusSelected] = useState(false);

  const [isDateSelected, setIsDateSelected] = useState(false);

  const handlefilterBadgeVisible = () => {
    if (isStatusSelected || isDateSelected) {
      return true;
    } else {
      return false;
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateSelected(true);
    // handlefilterBadgeVisible(true)
  };

  const [activeStatusFilter, setActiveStatusFilter] = useState("");

  const handleActiveStatusChange = (value) => {
    setActiveStatusFilter(value);
    setIsDateSelected(true);
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      value
    );
  };

  const FilterComponent = () => {
    return (
      <Box
        sx={{
          m: 2,
          display: "flex",
          gap: 1,
        }}
      >
        {/* <FormControl size="small" sx={{ minWidth: "150px" }}>
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
            <MenuItem sx={{ fontSize: "14px" }} value={""}>
              All
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"waiting for arrival"}>
              Waiting for Arrival
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"partially received"}>
              Partially Received
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"fully received"}>
              Fully Received
            </MenuItem>
          </Select>
        </FormControl> */}
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

  const [viewInvoiceState, setviewInvoiceState] = useState(false);

  const [pageDrawerWidth, setpageDrawerWidth] = useState(0);

  const HandleOpenViewInvoiceManual = () => {
    setviewInvoiceState(true);
    setpageDrawerWidth(500);
    handleClose2();
  };

  const HandleCloseViewInvoice = () => {
    setpageDrawerWidth(0);
    setviewInvoiceState(false);
  };

  const [postError, setPostError] = useState([]);

  const [job_titleName, setjob_titleName] = useState("Test");

  const [error, setError] = useState({ status: "", message: "" });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const handleCreatePurchaseInvoice = () => {
    if (dispatchOrderID !== "") {
      router.push("/purchase_entry_create");
      Cookies.set("start_date", createdInvStartDate);
      Cookies.set("end_date", createdInvEndDate);
      Cookies.set("dispatch_number", dispatchOrderID);
      Cookies.set("dispatch_status", purchaseEntryStatus);
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const handleCreateInvoice = () => {
    if (invoiceOrderID !== "") {
      router.push("/purchase_entry_invoice_create");
      Cookies.set("invoice_id", invoiceOrderID);
      Cookies.set("dispatch_status", purchaseEntryStatus);
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const handleCreateEntry = () => {
    router.push("/purchase_direct_entry_create");
  };

  const handleCreateDraftInvoice = (value) => {
    if (value !== "") {
      router.push("/purchase_entry_draft_create");
      Cookies.set("invoice_id", value.data_uniq_id);
      Cookies.set("dispatch_number", value.dispatch_order_id_en);
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const [dispatchOrderDetails, setdispatchOrderDetails] = useState([]);

  const HandleDispatchMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate,
      dispatch_status
    ) => {
      axiosGet
        .get(
          `purchase_entry_dispatch_get?access_token=${access_token}&search_input=${searchValue}&start_date=${createdStartDate}&end_date=${createdEndDate}&dispatch_status=${dispatch_status}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdispatchOrderDetails(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", createdInvStartDate, createdInvEndDate,'fully_delivered');
  };

  const [invoiceOrderDetails, setinvoiceOrderDetails] = useState([]);

  const HandleInvoiceMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pur_entry_status=${"fully delivered"}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setinvoiceOrderDetails(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [purchaseEntryStatus, setpurchaseEntryStatus] = useState("");

  const [dispatchOrderNumber, setdispatchOrderNumber] = useState("");
  const [dispatchOrderID, setdispatchOrderID] = useState("");

  const handleDispatchOrderChange = (event, value) => {
    if (value != null) {
      setdispatchOrderID(value.dispatch_order_id);
      setdispatchOrderNumber(value.dispatch_order_number);
      setpurchaseEntryStatus("dispatch_order");
    } else {
      setdispatchOrderID("");
      setdispatchOrderNumber("");
      setpurchaseEntryStatus("");
    }
  };

  const [invoiceOrderNumber, setinvoiceOrderNumber] = useState("");
  const [invoiceOrderID, setinvoiceOrderID] = useState("");

  const handleInvoiceOrderChange = (event, value) => {
    if (value != null) {
      setinvoiceOrderID(value.pur_invoice_id);
      setinvoiceOrderNumber(value.ref_purchse_invoice_number);
      setpurchaseEntryStatus("invoice_order");
    } else {
      setinvoiceOrderID("");
      setinvoiceOrderNumber("");
      setpurchaseEntryStatus("");
    }
  };

  const [createdInvStartDate, setcreatedInvStartDate] = useState("");
  const [createdInvEndDate, setcreatedInvEndDate] = useState("");

  const [dateInvoiceTitle, setdateInvoiceTitle] = useState("Invoice Date");

  const [isDateInvoiceSelected, setIsDateInvoiceSelected] = useState(false);

  const onCreatedInvoiceDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setcreatedInvStartDate(formattedStartDate);
    setcreatedInvEndDate(formattedEndDate);
    setdateInvoiceTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateInvoiceSelected(true);
    HandleDispatchMaster();
  };

  const [tabsValue, settabsValue] = useState();

  const TabContext = ({ value }) => {
    settabsValue(value);
    if (value === 1) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Stack direction={"row"} gap={1}>
              <Box sx={{ mt: 1 }}>
                <DateFilter
                  title={dateInvoiceTitle}
                  buttonType={1}
                  onDateRangeChange={onCreatedInvoiceDateChange}
                  isSelected={isDateInvoiceSelected}
                ></DateFilter>
              </Box>
              {isDateInvoiceSelected !== false && dispatchOrderDetails.length !== 0 && (
                <Box sx={{ my: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={dispatchOrderDetails}
                    value={
                      dispatchOrderDetails.find(
                        (year) =>
                          year.dispatch_order_number === dispatchOrderNumber
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleDispatchOrderChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.dispatch_order_number}
                    required
                    id="supplier"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        style={{ margin: "0px" }} // Align label to center
                        value={dispatchOrderNumber}
                        InputLabelProps={{
                          className: "textfieldstylefont",
                          style: { top: "-7px", fontSize: "12px" },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: "off",
                          className: "fontInput",
                        }}
                        label="Dispatch Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      );
    } else if (value === 2) {
      return (
        <Box>
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ my: 1, width: "100%" }}>
              <Autocomplete
                margin="normal"
                variant="outlined"
                style={{ marginTop: "0px", width: "100%" }}
                options={invoiceOrderDetails}
                value={
                  invoiceOrderDetails.find(
                    (year) =>
                      year.ref_purchse_invoice_number === invoiceOrderNumber
                  ) || null
                }
                onChange={(e, value) =>
                  handleInvoiceOrderChange(e.target.value, value)
                }
                getOptionLabel={(val) => val.ref_purchse_invoice_number}
                required
                id="supplier"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    style={{ margin: "0px" }} // Align label to center
                    value={invoiceOrderNumber}
                    InputLabelProps={{
                      className: "textfieldstylefont",
                      style: { top: "-7px", fontSize: "12px" },
                    }}
                    InputProps={{
                      ...params.InputProps,
                      autoComplete: "off",
                      className: "fontInput",
                    }}
                    label="Invoice Number"
                  />
                )}
                clearIcon={null}
              />
            </Box>
          </Box>
        </Box>
      );
    } else if (value === 3) {
      return (
        <Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
              width: "100%",
            }}
          >
            <Button
              className="nunito_font_width achievement_edit_button"
              style={{ width: "100%" }}
              onClick={() => handleCreateEntry()}
            >
              <span>Direct Inward Entry</span>
            </Button>
          </Box>
        </Box>
      );
    }
  };

  const tabs = [
    {
      value: 1,
      name: "Dispatch Order (DO)",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Purchase Invoice",
      content: <TabContext value={2} />,
    },
    {
      value: 3,
      name: "Direct Inward Entry",
      content: <TabContext value={3} />,
    },
  ];

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
              Select Method For
            </Typography>
            <Tabs tabs={tabs} />
          </div>
        </Box>
        {tabsValue === 1 && draftData.length !== 0 && (
          <Box sx={{ my: 1, padding: "5px" }}>
            <div className="master_create_style">
              <Typography
                variant="p"
                fontSize={"14px"}
                fontWeight={"bold"}
                style={{ color: "#185AA6" }}
              >
                Draft List
              </Typography>
              <div style={{ padding: "10px" }}>
                <TableContainer
                  sx={{
                    width: {
                      xs: "274px",
                      sm: "100%",
                    },
                    height: "80vh",
                    overflow: "auto",
                  }}
                >
                  <Table
                    stickyHeader
                    aria-label="customized table"
                    sx={{
                      whiteSpace: "nowrap",
                      width: "100%",
                    }}
                  >
                    <TableHead sx={{ background: "#F0F0F0" }}>
                      <TableRow>
                        <TableCell align="center" sx={{ padding: "5px" }}>
                          <Typography className="table_cell" variant="h5">
                            #
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ padding: "5px" }}>
                          <Typography className="table_cell" variant="h5">
                            Dispatch Number
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ padding: "5px" }}>
                          <Typography className="table_cell" variant="h5">
                            Created Date
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ padding: "5px" }}>
                          <Typography className="table_cell" variant="h5">
                            Action
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {draftData?.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell
                            sx={{ padding: "4px 8px" }}
                            padding="5px"
                            align="center"
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ padding: "4px 8px" }} align="center">
                            {row.do_no}
                          </TableCell>
                          <TableCell sx={{ padding: "4px 8px" }} align="center">
                            {row.created_f_date}
                          </TableCell>
                          <TableCell sx={{ padding: "4px 8px" }} align="center">
                            <Button className="nunito_font_width create_button_open" onClick={() => handleCreateDraftInvoice(row)}>
                              Create
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </Box>
        )}
      </div>
    );
  };

  return (
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <CreateButton
            heading={"Inward Entry List"}
            onAddClick={() => HandleOpenViewInvoiceManual()}
            pagecount={dataCount}
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
        <Collapse in={filtersList} timeout="auto" unmountOnExit>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            {FilterComponent()}
          </Box>
        </Collapse>
        <UserTable
          pageCount={pageCount}
          limitEnd={limitEnd}
          pageNumber={pageNumber}
          onLimitChange={handleLimitChange}
          tableHead={tableHead}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          tableRow={td_data_set}
          dataCount={dataCount}
          onRefresh={handleRefresh}
          onMenuClick={singleDataGet}
          anchorEl2={anchorEl2}
          setAnchorEl2={setAnchorEl2}
          handleClose2={handleClose2}
          ActionComponent={ActionComponent}
          setSelected={setSelectedItems}
          selected={selectedItems}
          order={orderType}
          orderBy={orderField}
          setOrder={setOrderType}
          setOrderBy={setOrderField}
          APIRecall={APIRecall}
          handleOnActionClick={handleOnActionClick}
          MenuComponent={MenuComponent}
        />

        <MasterDrawer
          isPageSidebarOpen={viewInvoiceState}
          drawerWidth={pageDrawerWidth}
          onSidebarClose={HandleCloseViewInvoice}
          heading={"Inward Entry"}
          postError={postError}
          setStateValue={setjob_titleName}
          setValue={tabsValue === 3 ? "" : job_titleName}
          onCreateClick={
            purchaseEntryStatus === "dispatch_order"
              ? handleCreatePurchaseInvoice
              : purchaseEntryStatus === "invoice_order"
              ? handleCreateInvoice
              : handleCreatePurchaseInvoice
          }
          CreateCompannet={CreateCompannet}
        />

        <Modal open={loadingPage}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <CircularProgress />
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
      </Box>
    </>
  );
};
export default OrderList;
