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
import { RefreshOutlined } from "@mui/icons-material";
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
        `purchase_entry_master_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&pur_invoice_status=${pur_invoice_status}&inwaed_entry_method=${5}`
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
    HandleMaismatchMaster();
    HandleSupplierTypeMaster();
    HandleMaismatchShortage();
    HandleMaismatchUndelivered();
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
      label: "Billed Number",
      value: "pur_invoice_number",
    },
    {
      id: 2,
      label: "Billed Date",
      value: "invoice_date",
    },
    {
      id: 3,
      label: "Entry Number",
      value: "dispatch_order_id",
    },
    {
      id: 4,
      label: "Supplier Name",
      value: "supplier_name",
    },
    {
      id: 5,
      label: "Contact No.",
      value: "supplier_data",
    },
    {
      id: 6,
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
          td:item.ref_invoice_number,
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

  const [cancelOrderNotes, setcancelOrderNotes] = useState("");
  const [cancelOrderStatus, setcancelOrderStatus] = useState(false);

  const HandleCancelOrderClose = () => {
    setcancelOrderStatus(false);
    setcancelOrderNotes("");
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
          <Typography variant="p">View Bill</Typography>
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
    router.push("/view_billed_entry");
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

  const handleCreateInvoice = () => {
    if (invoiceOrderID !== "") {
      if (purchaseEntryStatus === 0) {
        router.push("/billed_entry_create_mismatch");
        Cookies.set("invoice_id", invoiceOrderID);
        Cookies.set("billed_type", purchaseEntryStatus);
      } else {
        router.push("/billed_entry_create");
        Cookies.set("invoice_id", invoiceOrderID);
        Cookies.set("billed_type", purchaseEntryStatus);
      }
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const [invoiceOrderMismatch, setinvoiceOrderMismatch] = useState([]);

  const HandleMaismatchMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `purchase_entry_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pur_billed_status=${"completed"}&inwaed_entry_method=${0}&return_status=${"invoice"}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setinvoiceOrderMismatch(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [invoiceOrderShortage, setinvoiceOrderShortage] = useState([]);

  const HandleMaismatchShortage = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `purchase_entry_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pur_billed_status=${"completed"}&inwaed_entry_method=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setinvoiceOrderShortage(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [invoiceOrderUndelivered, setinvoiceOrderUndelivered] = useState([]);

  const HandleMaismatchUndelivered = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `purchase_entry_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pur_billed_status=${"completed"}&inwaed_entry_method=${2}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setinvoiceOrderUndelivered(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [purchaseEntryStatus, setpurchaseEntryStatus] = useState();

  const [invoiceOrderNumber, setinvoiceOrderNumber] = useState("");
  const [invoiceOrderID, setinvoiceOrderID] = useState("");

  const handleInvoiceOrderChange = (event, value) => {
    if (value != null) {
      setinvoiceOrderID(value.data_uniq_id);
      setinvoiceOrderNumber(value.pur_entry_number);
      setpurchaseEntryStatus(value.inwaed_entry_method);
    } else {
      setinvoiceOrderID("");
      setinvoiceOrderNumber("");
      setpurchaseEntryStatus();
    }
  };

  const [dispatchDate, setdispatchDate] = useState({
    start_date: moment("").format("YYYY-MM-DD"),
    end_date: moment("").format("YYYY-MM-DD"),
  });

  const [tabsValue, settabsValue] = useState();

  const TabContext = ({ value }) => {
    settabsValue(value);
    if (value === 1) {
      return (
        <Box>
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ my: 1, width: "100%" }}>
              <Autocomplete
                margin="normal"
                variant="outlined"
                style={{ marginTop: "0px", width: "100%" }}
                options={invoiceOrderMismatch}
                value={
                  invoiceOrderMismatch.find(
                    (year) => year.pur_entry_number === invoiceOrderNumber
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
                    label="Mismatch"
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
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ my: 1, width: "100%" }}>
              <Autocomplete
                margin="normal"
                variant="outlined"
                style={{ marginTop: "0px", width: "100%" }}
                options={invoiceOrderShortage}
                value={
                  invoiceOrderShortage.find(
                    (year) => year.pur_entry_number === invoiceOrderNumber
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
                    label="Shortage"
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
          <Box sx={{ display: "flex", mb: 2 }}>
            <Box sx={{ my: 1, width: "100%" }}>
              <Autocomplete
                margin="normal"
                variant="outlined"
                style={{ marginTop: "0px", width: "100%" }}
                options={invoiceOrderUndelivered}
                value={
                  invoiceOrderUndelivered.find(
                    (year) => year.pur_entry_number === invoiceOrderNumber
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
                    label="Undelivered"
                  />
                )}
                clearIcon={null}
              />
            </Box>
          </Box>
        </Box>
      );
    }
  };

  const tabs = [
    {
      value: 1,
      name: "Mismatch",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Shortage",
      content: <TabContext value={2} />,
    },
    {
      value: 3,
      name: "Undelivered",
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
      </div>
    );
  };

  return (
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <CreateButton
            heading={"Billed List"}
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
          heading={"Billed"}
          postError={postError}
          setStateValue={setjob_titleName}
          setValue={job_titleName}
          onCreateClick={handleCreateInvoice}
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
