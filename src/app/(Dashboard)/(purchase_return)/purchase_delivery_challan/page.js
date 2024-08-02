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
  Badge,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
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
  RefreshOutlined,
} from "@mui/icons-material";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (input) => {
    setSearchValue(input);
  };

  const handleLimitChange = (event) => {
    setlimitEnd(event.target.value);
    handleRefresh();
  };

  const [orderType, setOrderType] = useState("desc");
  const [orderField, setOrderField] = useState("created_date");
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
        `purchase_return_master_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&pur_invoice_status=${pur_invoice_status}&delivery_challan=1`
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
      label: "Delivery Challan Number",
      value: "pur_return_number",
    },
    {
      id: 2,
      label: "Delivery Date",
      value: "invoice_date",
    },
    {
      id: 3,
      label: "Customer Name",
      value: "supplier_name",
    },
    {
      id: 4,
      label: "Contact No.",
      value: "supplier_data",
    },
    {
      id: 7,
      label: "Salesman Name",
      value: "purchase_entry_return_againt",
    },{
      id: 8,
      label: "Route Name",
      value: "route_name",
    },{
      id: 9,
      label: "Status",
      value: "pur_return_status_org",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.pur_return_number, type: "text", id: 1, alian: "left" },
        {
          td: moment(item.return_date).format("YYYY-MM-DD"),
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td: item.customer_name,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td: item.customer_data?.contact_number,
          type: "text",
          id: 4,
          alian: "left",
        },{
          td: item.sales_man_name,
          type: "text",
          id: 6,
          alian: "left",
        },{
          td: item.route_name,
          type: "text",
          id: 7,
          alian: "left",
        },{
          td: (
            <Box style={{ padding: "8px 0px" }}>
              <span
                className={`table_body_style_fab arrival_${item.pur_return_status_org}`}
                sx={{ width: "20%" }}
              >
                {item.pur_return_status_org === 'waiting_for_arrival' ? "Pending":item.pur_return_status_org === 'partially_delivered' ? "Partially":"Completed"}
              </span>
            </Box>
          ),
          id: 8,
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

  const [cancelOrderNotes, setcancelOrderNotes] = useState("");
  const [cancelOrderStatus, setcancelOrderStatus] = useState(false);

  const HandleCancelOrderClose = () => {
    setcancelOrderStatus(false);
    setcancelOrderNotes("");
  };

  const HandleCancelOrder = () => {
    if (singleData?.pur_return_status_org === "waiting_for_arrival" || singleData?.pur_return_status_org === "partially_delivered") {
      router.push("/outward_delivery_challan");
      Cookies.set("invoice_id", singleData?.data_uniq_id);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Invoice Order Cannot be Cancelled.",
      });
    }
  };

  const HandleCanvertInvoiceOrder = () => {
    if (singleData?.pur_return_status_org === "waiting_for_arrival" || singleData?.pur_return_status_org === "partially_delivered") {
      router.push("/convert_sales_invoice_create");
      Cookies.set("invoice_id", singleData?.data_uniq_id);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Invoice Order Cannot be Cancelled.",
      });
    }
  };

  const DispatchCancelMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: singleData?.data_uniq_id,
      return_cancel: cancelOrderStatus === true ? 1 : 0,
      cancel_notes: cancelOrderNotes,
      pur_return_status_org: singleData?.pur_return_status_org,
    };
    axiosPost.post(`purchase_return_cancel`, mdata).then((res) => {
      if (res.data.action === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
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
          HandleCancelOrderClose();
        }, 200);
      }
    });
  };


  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => HandleOpenViewInvoice()}>
          <Typography variant="p">View Delivery Challan</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCancelOrder()}
          style={
            singleData?.pur_return_status_org === "waiting_for_arrival" || singleData?.pur_return_status_org === "partially_delivered"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Return Delivery Challan</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCanvertInvoiceOrder()}
          style={
            singleData?.pur_return_status_org === "waiting_for_arrival" || singleData?.pur_return_status_org === "partially_delivered"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Convert Sales Invoice</Typography>
        </ListItemButton>
      </List>
    );
  };


  const handleOnActionClick = (e, data) => {
    setSingleData(data.json[0]);
    Cookies.set("invoice_id", data.id);
    setAnchorEl2(e.currentTarget);
  };

  const HandleOpenViewInvoice = () => {
    router.push("/view_delivery_challan");
    Cookies.set("invoice_id", singleData?.data_uniq_id);
    handleClose2();
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
            <MenuItem sx={{ fontSize: "14px" }} value={""}>
              All
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"waiting for arrival"}>
              Pending
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"partially delivered"}>
              Partially
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"fully delivered"}>
              Completed
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
    setError({ status: "error", message: "Cannot Open this Page." });
  };

  const handleCreateInvoice = () => {
    if (invoiceOrderID !== "") {
      router.push("/purchase_entry_challan");
      Cookies.set("invoice_id", invoiceOrderID);
      Cookies.set("dispatch_status", purchaseEntryStatus);
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const handleCreateEntry = () => {
    router.push("/purchase_diract_challan");
  };

  const [dispatchOrderDetails, setdispatchOrderDetails] = useState([]);
 
  const HandleDispatchMaster = (start_date, end_date) => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate,
      dispatch_start_date,
      dispatch_end_date
    ) => {
      axiosGet
        .get(
          `dispatch_do_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&dispatch_start_date=${dispatch_start_date}&dispatch_end_date=${dispatch_end_date}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdispatchOrderDetails(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "", start_date, end_date);
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
          `purchase_order_entry_id?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pur_entry_status=${'fully delivered'}&return_status=0`
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


  const [invoiceOrderNumber, setinvoiceOrderNumber] = useState("");
  const [invoiceOrderID, setinvoiceOrderID] = useState("");

  const handleInvoiceOrderChange = (event, value) => {
    if (value != null) {
      setinvoiceOrderID(value.data_uniq_id);
      setinvoiceOrderNumber(value.pur_entry_number);
      setpurchaseEntryStatus("invoice_order");
    } else {
      setinvoiceOrderID("");
      setinvoiceOrderNumber("");
      setpurchaseEntryStatus("");
    }
  };

  const [dispatchDate, setdispatchDate] = useState({
    start_date: moment("").format("YYYY-MM-DD"),
    end_date: moment("").format("YYYY-MM-DD"),
  });

  const handleInvoiceDateChange = (value, label) => {
    const formattedDate = moment(value).format("YYYY-MM-DD");
    if (label === "start_date") {
      const newField = { ...dispatchDate };
      newField.start_date = formattedDate;
      HandleDispatchMaster(formattedDate, newField.end_date);
      setdispatchDate(newField);
    } else if (label === "end_date") {
      const newField = { ...dispatchDate };
      newField.end_date = formattedDate;
      HandleDispatchMaster(newField.start_date, formattedDate);
      setdispatchDate(newField);
    }
  };
  const [tabsValue,settabsValue] = useState();

  const TabContext = ({ value }) => {
    settabsValue(value)
    if (value === 1) {
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
                      year.pur_entry_number === invoiceOrderNumber
                  ) || null
                }
                onChange={(e, value) =>
                  handleInvoiceOrderChange(e.target.value, value)
 
                }
                getOptionLabel={(val) => val.pur_entry_number}
                
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
                    label="Purchase Entry"
                  />
                )}
                clearIcon={null}
              />
            </Box>
          </Box>
        </Box>
      );
    } else if (value === 2) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2,width:'100%' }}>
            <Button className="nunito_font_width achievement_edit_button" style={{width:'100%'}} onClick={() => handleCreateEntry()}>
              <span>Direct Delivery Challan</span>
            </Button>
          </Box>
        </Box>
      );
    }
  };

  const tabs = [
    {
      value: 1,
      name: "Purchase Entry",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Direct Delivery Challan",
      content: <TabContext value={2} />,
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
      </div>
    );
  };

  return (
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <CreateButton
            heading={"Delivery Challan List"}
            onAddClick={() => handleCreateEntry()}
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
          heading={"Delivery Challan"}
          postError={postError}
          setStateValue={setjob_titleName}
          setValue={tabsValue === 3 ? '':job_titleName}
          onCreateClick={purchaseEntryStatus === "invoice_order"
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
        <Drawer
          anchor="right"
          open={cancelOrderStatus}
          onClose={HandleCancelOrderClose}
        >
          <Box sx={{ width: 400 }} role="presentation">
            <Box
              display={"flex"}
              alignItems={"center"}
              padding={1}
              justifyContent={"space-between"}
              spacing={0.5}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Item onClick={HandleCancelOrderClose}>
                  <IconButton
                    type="button"
                    sx={{ p: 0, m: 0, height: 10 }}
                    aria-label="search"
                  >
                    <ArrowBackIcon sx={{ color: "black" }} />
                  </IconButton>
                </Item>
                <Item>
                  <Box
                    sx={{
                      fontWeight: "bold",
                      fontSize: "p.fontSize",
                      color: "#185AA6",
                      m: 0,
                    }}
                  >
                    {singleData.data_uniq_id}
                  </Box>
                </Item>
              </Stack>
              <Button
                className="nunito_font_width"
                sx={{ fontSize: "12px", marginTop: "1px", fontWeight: "300" }}
                variant="contained"
                onClick={() => DispatchCancelMaster()}
              >
                <span>Cancel</span>
              </Button>
            </Box>
            <Box sx={{ my: 1, width: "100%", p: 1 }}>
              <TextField
                id="outlined-basic"
                label="Cancel Notes"
                variant="outlined"
                size="small"
                fullWidth
                value={cancelOrderNotes}
                onChange={(e) => setcancelOrderNotes(e.target.value)}
                name="cancel_notes"
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
          </Box>
        </Drawer>
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
