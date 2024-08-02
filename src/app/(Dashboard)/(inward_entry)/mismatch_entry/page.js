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
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
        `purchase_entry_master_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&pur_invoice_status=${pur_invoice_status}&inwaed_entry_method=${0}`
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
      label: "Invoice Details",
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
    {
      id: 7,
      label: "Status",
      value: "purchase_entry_status",
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
        {
          td: (
            <Box style={{ padding: "8px 0px" }}>
              <span
                className={`table_body_style_fab arrival_${item.purchase_entry_status_org}`}
                sx={{ width: "20%" }}
              >
                {item.purchase_entry_status}
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

  const HandleCancelOrder = () => {
    if (
      singleData?.purchase_entry_status_org === "pending" ||
      (singleData?.purchase_entry_status_org === "partially" &&
        singleData?.mismatch_status !== "return")
    ) {
      router.push("/return_mismatch_entry");
      Cookies.set("invoice_id", singleData?.data_uniq_id);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Mismatch Cannot be Return.",
      });
    }
  };

  const [closeOrderStatus, setcloseOrderStatus] = useState(false);

  const [closeOrderNotes, setcloseOrderNotes] = useState("");

  const HandleClosedOrder = () => {
    if (
      singleData?.purchase_entry_status_org === "pending" ||
      singleData?.purchase_entry_status_org === "partially"
    ) {
      setcloseOrderStatus(true);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Mismatch Cannot be Return.",
      });
    }
  };

  const HandleCloseOrderClose = () => {
    setcloseOrderStatus(false);
    setcloseOrderNotes("");
  };

  const DispatchCancelMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      purchase_entry_id: singleData?.data_uniq_id,
      close_order: closeOrderStatus === true ? 1 : 0,
      close_notes: closeOrderNotes,
      method_type: "close_order",
    };
    axiosPost.post(`purchase_entry_master_action`, mdata).then((res) => {
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
          HandleCloseOrderClose();
        }, 200);
      }
    });
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
    router.push("/view_mismatch_entry");
    handleClose2();
  };

  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => HandleOpenViewInvoice()}>
          <Typography variant="p">View Mismatch</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCancelOrder()}
          style={
            singleData?.purchase_entry_status_org === "pending" ||
            (singleData?.purchase_entry_status_org === "partially" &&
              singleData?.mismatch_status !== "return")
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Return Mismatch</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleClosedOrder()}
          style={
            singleData?.purchase_entry_status_org === "pending" ||
            singleData?.purchase_entry_status_org === "partially"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Close Mismatch</Typography>
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

  const [selectedItems, setSelectedItems] = useState([]);

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
            <MenuItem sx={{ fontSize: "14px" }} value={"pending"}>
              Pending
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"partially"}>
              Partially
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"completed"}>
              Completed
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"closed"}>
              Closed
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

  const handleCreateInvoice = () => {
    if (invoiceOrderID !== "") {
      router.push("/mismatch_entry_create");
      Cookies.set("invoice_id", invoiceOrderID);
    } else {
      setError({ status: "error", message: "Data Invalid" });
    }
  };

  const [invoiceOrderDetails, setinvoiceOrderDetails] = useState([]);

  const HandleInvoiceMaster = () => {
    setloadingPage(true);
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&inward_status=${0}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setinvoiceOrderDetails(res.data.data);
            setloadingPage(false);
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
      setinvoiceOrderID(value.pur_invoice_id);
      setinvoiceOrderNumber(value.ref_purchse_invoice_number);
      setpurchaseEntryStatus("invoice_order");
    } else {
      setinvoiceOrderID("");
      setinvoiceOrderNumber("");
      setpurchaseEntryStatus("");
    }
  };

  const [tabsValue, settabsValue] = useState();

  const handleCreateEntry = () => {
    router.push("/diract_mismatch_entry_create");
  };

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
    } else if (value === 2) {
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
              <span>Direct Mismatch Entry</span>
            </Button>
          </Box>
        </Box>
      );
    }
  };

  const tabs = [
    {
      value: 1,
      name: "Purchase Invoice",
      content: <TabContext value={1} />,
    },
    // {
    //   value: 2,
    //   name: "Direct Mismatch Entry",
    //   content: <TabContext value={2} />,
    // },
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

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));

  return (
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <CreateButton
            heading={"Mismatch List"}
            onAddClick={() => HandleOpenViewInvoiceManual()}
            pagecount={dataCount}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <SearchFilter
              onSearchButtonClick={handleSearchInputChange}
              searchValue={searchValue}
            />
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
          heading={"Mismatch Entry"}
          postError={postError}
          setStateValue={setjob_titleName}
          setValue={tabsValue === 3 ? "" : job_titleName}
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
          open={closeOrderStatus}
          onClose={HandleCloseOrderClose}
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
                <Item onClick={HandleCloseOrderClose}>
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
                    {singleData?.pur_entry_number}
                  </Box>
                </Item>
              </Stack>
              <Button
                className="nunito_font_width"
                sx={{ fontSize: "12px", marginTop: "1px", fontWeight: "300" }}
                variant="contained"
                onClick={() => DispatchCancelMaster()}
              >
                <span>Close</span>
              </Button>
            </Box>
            <Box sx={{ my: 1, width: "100%", p: 1 }}>
              <TextField
                id="outlined-basic"
                label="Close Notes"
                variant="outlined"
                size="small"
                fullWidth
                value={closeOrderNotes}
                onChange={(e) => setcloseOrderNotes(e.target.value)}
                name="close_notes"
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
