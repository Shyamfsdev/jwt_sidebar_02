"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

const OrderList = () => {
  const [open, setOpen] = React.useState(false);
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

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
    dispatch_status
  ) => {
    axiosGet
      .get(
        `dispatch_do_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&dispatch_status=${dispatch_status}`
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
      label: "DO Number",
      value: "dispatch_order_number",
    },
    {
      id: 2,
      label: "Period of DO",
      value: "dispatch_start_date",
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
      label: "Invoice Details",
      value: "created_by",
    },
    {
      id: 7,
      label: "Net Amount (₹)",
      value: "sub_total",
    },
    {
      id: 8,
      label: "Creation Info",
      value: "date_of_join",
    },
    {
      id: 9,
      label: "Status",
      value: "dispatch_status",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.dispatch_order_id,
      data: [
        { td: item.dispatch_order_number, type: "text", id: 1, alian: "left" },
        {
          td:
            moment(item.dispatch_start_date).format("YYYY-MM-DD") +
            "  to  " +
            moment(item.dispatch_end_date).format("YYYY-MM-DD"),
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td: item.supplier_name,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td: item.supplier_data?.contact_no,
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: (
            <Button
              className={`table_body_style_fab invoice flex_display`}
              sx={{ width: "20%" }}
              onClick={() => HandleOpenViewInvoiceManual(item)}
            >
              View Invoice
            </Button>
          ),
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: item.sub_total,
          type: "text",
          id: 6,
          alian: "left",
        },
        {
          td: item.created_f_date,
          type: "text",
          id: 7,
          alian: "left",
        },
        {
          td: (
            <Box>
              <span
                className={`table_body_style_fab arrival_${item.dispatch_status_org}`}
                sx={{ width: "20%" }}
              >
                {item.dispatch_status}
              </span>
            </Box>
          ),
          id: 9,
          alian: "left",
        },
      ],
      json: [item],
      active: item.dispatch_status,
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

  const [cancelOrderStatus, setcancelOrderStatus] = useState(false);

  const [cancelOrderNotes, setcancelOrderNotes] = useState("");

  const HandleCancelOrder = () => {
    if(singleData?.dispatch_status_org === 'waiting_for_arrival'){
      setcancelOrderStatus(true);
      handleClose2();
    }else{
      setError({ status: "error", message: "Dispatch Order Cannot be Cancelled." });
    }
  };

  const HandleCancelOrderClose = () => {
    setcancelOrderStatus(false);
    setcancelOrderNotes("");
  };

  const DispatchCancelMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      dispatch_order_id: singleData?.dispatch_order_id,
      cancel_order: 1,
      cancel_notes: cancelOrderNotes,
    };
    axiosPost.post(`dispatch_order_edit`, mdata).then((res) => {
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
          <Typography variant="p">View Do</Typography>
        </ListItemButton>
        <ListItemButton onClick={() => HandleCancelOrder()} style={singleData?.dispatch_status_org === 'waiting_for_arrival' ? {opacity:1}:{opacity:0.3}}>
          <Typography variant="p">Cancel Do</Typography>
        </ListItemButton>
      </List>
    );
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data.json[0]);
    setAnchorEl2(e.currentTarget);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [viewInvoiceState, setviewInvoiceState] = useState(false);

  const HandleOpenViewInvoice = () => {
    setviewInvoiceState(true);
    handleClose2();
  };

  const HandleOpenViewInvoiceManual = (value) => {
    setviewInvoiceState(true);
    setSingleData(value);
    handleClose2();
  };


  const HandleCloseViewInvoice = () => {
    setviewInvoiceState(false);
  };

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileName(null);
  };

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
              Waiting for Arrival
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"partially delivered"}>
              Partially Delivered
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"fully delivered"}>
              Fully Delivered
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"cancelled order"}>
              Cancelled Order
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
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <CreateButton
            heading={"Dispatch Order"}
            onAddClick={toggleDrawer(true)}
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

        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 400 }} role="presentation">
            <Box
              display={"flex"}
              alignItems={"center"}
              padding={1}
              justifyContent={"space-between"}
              spacing={0.5}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Item onClick={() => setOpen(false)}>
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
                    Dispatch Order List
                  </Box>
                </Item>
              </Stack>
              {fileName && supplierName ? (
                <Button
                  className="nunito_font_width"
                  sx={{
                    fontSize: "12px",
                    marginTop: "1px",
                    fontWeight: "300",
                  }}
                  variant="contained"
                  onClick={() => handleImport()}
                >
                  Import
                </Button>
              ) : (
                <></>
              )}
            </Box>
            <Container maxWidth="md">
              <FormControl fullWidth>
                {fileName ? (
                  <div>
                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      spacing={2}
                    >
                      <DemoPaper square={false} sx={{ width: 1 }}>
                        <Box display="flex" alignItems="center" spacing={2}>
                          <Box
                            component="img"
                            sx={{
                              width: 20,
                              marginRight: 2,
                            }}
                            alt="Excel"
                            src="/images/icons/excel.png"
                          />
                          {fileName}
                        </Box>
                      </DemoPaper>
                      <IconButton
                        sx={{ padding: 0.5 }}
                        onClick={resetFileInput}
                      >
                        <CloseIcon sx={{ color: "black" }} />
                      </IconButton>
                    </Stack>
                    <Autocomplete
                      margin="normal"
                      variant="outlined"
                      style={{ marginTop: "30px" }}
                      options={supplierMaster}
                      value={
                        supplierMaster.find(
                          (year) => year.supplier_name === supplierName
                        ) || null
                      }
                      onChange={(e, value) =>
                        HandleUpdateSupplier(e.target.value, value)
                      }
                      getOptionLabel={(val) => val.supplier_name}
                      required
                      id="supplier_name"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          value={supplierName}
                          style={{ margin: "0px" }} // Align label to center
                          InputLabelProps={{
                            className: "textfieldstylefont",
                            style: { top: "-7px", fontSize: "12px" },
                          }}
                          InputProps={{
                            ...params.InputProps,
                            autoComplete: "off",
                            className: "fontInput",
                          }}
                          label="Supplier Name"
                        />
                      )}
                      clearIcon={null}
                    />
                  </div>
                ) : (
                  <label htmlFor="dropzone-file">
                    <div
                      style={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ marginBottom: "16px" }}>
                        <Box
                          component="img"
                          sx={{
                            height: 50,
                            width: 50,
                          }}
                          alt="Excel"
                          src="/images/icons/excel.png"
                        />
                      </div>
                      <Typography
                        variant="subtitle1"
                        style={{ fontWeight: "bold", marginBottom: "8px" }}
                      >
                        Select an Excel file to import
                      </Typography>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      ref={fileInputRef}
                      accept=".xls, .xlsx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </FormControl>
            </Container>
          </Box>
        </Drawer>

        <Drawer
          anchor="right"
          open={viewInvoiceState}
          onClose={HandleCloseViewInvoice}
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
                <Item onClick={HandleCloseViewInvoice}>
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
                    {singleData.dispatch_order_number}
                  </Box>
                </Item>
              </Stack>
            </Box>
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
                      <TableCell align="center" className="custom_padding">
                        <Typography className="table_cell" variant="h5">
                          #
                        </Typography>
                      </TableCell>
                      <TableCell align="center" className="custom_padding">
                        <Typography className="table_cell" variant="h5">
                          Purchase Invoice
                        </Typography>
                      </TableCell>
                      <TableCell align="center" className="custom_padding">
                        <Typography className="table_cell" variant="h5">
                          Invoice Value (₹)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {singleData?.invoice_details?.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          {row.pur_invoice_number}
                        </TableCell>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          {row.sub_total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Box sx={{ marginTop: "20px", padding: "10px" }}>
              <Stack
                direction={"row"}
                gap={2}
                style={{ justifyContent: "space-between" }}
              >
                <Typography
                  variant="p"
                  fontSize={"14px"}
                  fontWeight={"bold"}
                  style={{ color: "#185AA6" }}
                >
                  Total Invoice Value
                </Typography>
                <Typography variant="p" fontSize={"14px"} fontWeight={"bold"}>
                  {singleData?.sub_total}
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Drawer>

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
                    {singleData.dispatch_order_number}
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
            <Box sx={{ my: 1, width: "100%",p:1 }}>
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
