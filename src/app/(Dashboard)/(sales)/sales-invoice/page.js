"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
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
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FormControl, Typography } from "@mui/material";
import CreateButton from "../../../(Dashboard)/components/buttons/CreateButton";
import Cookies from "js-cookie";
import SalesInvoiceTable from "../../../(Dashboard)/components/dashboard/SalesInvoiceTable";
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
import { styled } from "@mui/material/styles";

const OrderList = () => {
  const fileInputRef = useRef(null);

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const router = useRouter();

  const handleCreatePurchaseInvoice = () => {
    router.push("/sales_invoice_create");
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
    sal_invoice_status
  ) => {
    axiosGet
      .get(
        `sales_invoice_details_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&sal_invoice_status=${sal_invoice_status}`
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
      label: "Invoice Number",
      value: "sales_invoice_number",
    },
    {
      id: 2,
      label: "Sify Invoice Number",
      value: "sify_invoice_number",
    },
    {
      id: 3,
      label: "Sify Document Number",
      value: "sify_doc_number",
    },
    {
      id: 4,
      label: "Invoice Date",
      value: "invoice_date",
    },
    {
      id: 5,
      label: "Customer Name",
      value: "customer_name",
    },
    {
      id: 6,
      label: "Contact No.",
      value: "contact_number",
    },
    {
      id: 7,
      label: "Net Amount (₹)",
      value: "sub_total",
    },
    {
      id: 8,
      label: "Status",
      value: "sal_invoice_status",
    },
  ];

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.sales_invoice_number, type: "text", id: 1, alian: "left" },
        { td: item.sify_invoice_number, type: "text", id: 2, alian: "left" },
        { td: item.sify_doc_number, type: "text", id: 3, alian: "left" },
        {
          td: moment(item.invoice_date).format("YYYY-MM-DD"),
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: item.customer_name,
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: item.customer_data?.contact_number,
          type: "text",
          id: 6,
          alian: "left",
        },
        {
          td: item.sub_total,
          type: "text",
          id: 7,
          alian: "left",
        },
        {
          td: (
            <Box style={{ padding: "8px 0px" }}>
              <span
                className={`table_body_style_fab arrival_${item.sal_invoice_status_org}`}
                sx={{ width: "20%" }}
              >
                {item.sal_invoice_status}
              </span>
            </Box>
          ),
          id: 8,
          alian: "left",
        },
      ],
      json: [item],
      active: item.sal_invoice_status_org,
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
    if (singleData?.sal_invoice_status_org === "waiting_for_arrival") {
      setcancelOrderStatus(true);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Invoice Order Cannot be Cancelled.",
      });
    }
  };

  const HandleCancelOrderClose = () => {
    setcancelOrderStatus(false);
    setcancelOrderNotes("");
  };

  const [closeOrderStatus, setcloseOrderStatus] = useState(false);

  const [closeOrderNotes, setcloseOrderNotes] = useState("");

  const HandleCloseOrder = () => {
    if (
      singleData?.sal_invoice_status_org === "waiting_for_arrival" ||
      singleData?.sal_invoice_status_org === "partially_delivered"
    ) {
      setcloseOrderStatus(true);
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Invoice Order Cannot be Canceled.",
      });
    }
  };

  const HandleCloseOrderClose = () => {
    setcloseOrderStatus(false);
    setcloseOrderNotes("");
  };

  const HandleOpenEditInvoice = () => {
    if (
      singleData?.sal_invoice_status_org === "waiting_for_arrival" &&
      singleData?.direct_invoice === 0
    ) {
      router.push("/sales_invoice_edit");
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Invoice Order Cannot be Editable.",
      });
    }
  };

  const DispatchCancelMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: singleData?.data_uniq_id,
      cancel_order: cancelOrderStatus === true ? 1 : 0,
      cancel_notes: cancelOrderNotes,
      close_order: closeOrderStatus === true ? 1 : 0,
      close_notes: closeOrderNotes,
    };
    axiosPost.post(`sales_cancel`, mdata).then((res) => {
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
          HandleCloseOrderClose();
        }, 200);
      }
    });
  };

  const [versionOrderStatus, setversionOrderStatus] = useState(false);

  const [versionList, setversionList] = useState([]);

  const HandleVersionOrder = () => {
    const fetchData = async (access_token, ref_order_id) => {
      axiosGet
        .get(
          `sales_invoice_version_list?access_token=${access_token}&ref_order_id=${ref_order_id}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setversionList(res.data.data);
            setversionOrderStatus(true);
            handleClose2();
          }
        });
    };
    fetchData(ACCESS_TOKEN, singleData?.ref_order_id);
  };

  const HandleVersionOrderClose = () => {
    setversionOrderStatus(false);
    setversionList([]);
  };

  const HandleOpenViewInvoiceManual = (value) => {
    Cookies.set("data_uniq_id", value);
    router.push("/view_sales_invoice");
    HandleVersionOrderClose();
  };

  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => HandleOpenViewInvoice()}>
          <Typography variant="p">View Invoice</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleOpenEditInvoice()}
          style={
            singleData?.sal_invoice_status_org === "waiting_for_arrival" &&
            singleData?.direct_invoice === 0
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Edit Invoice</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCancelOrder()}
          style={
            singleData?.sal_invoice_status_org === "waiting_for_arrival"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Cancel Invoice</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCloseOrder()}
          style={
            singleData?.sal_invoice_status_org === "waiting_for_arrival" ||
            singleData?.sal_invoice_status_org === "partially_delivered"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Close Invoice</Typography>
        </ListItemButton>
        <ListItemButton onClick={() => HandleVersionOrder()}>
          <Typography variant="p">Versions List</Typography>
        </ListItemButton>
      </List>
    );
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data.json[0]);
    Cookies.set("data_uniq_id", data.id);
    setAnchorEl2(e.currentTarget);
  };

  const HandleOpenViewInvoice = () => {
    router.push("/view_sales_invoice");
    handleClose2();
  };

  

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const [loadingPage, setloadingPage] = useState(false);

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

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));

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
            <MenuItem sx={{ fontSize: "14px" }} value={"picklist not generated"}>
              Picklist Not Generated
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"picklist generated"}>
              Picklist Generated
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"delivered"}>
              Delivered Invoice
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"cancelled order"}>
              Cancelled Order
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"closed order"}>
              Closed Order
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
            heading={"Sales Invoice List"}
            onAddClick={() => handleCreatePurchaseInvoice()}
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
        <SalesInvoiceTable
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
          onDelete={() => setOpenMultiDelete(true)}
         
        />

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
                    {singleData.sales_invoice_number}
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
                    {singleData.sales_invoice_number}
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

        <Drawer
          anchor="right"
          open={versionOrderStatus}
          onClose={HandleVersionOrderClose}
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
                <Item onClick={HandleVersionOrderClose}>
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
                    Versions List
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
                      <TableCell align="center" sx={{ padding: "5px" }}>
                        <Typography className="table_cell" variant="h5">
                          #
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "5px" }}>
                        <Typography className="table_cell" variant="h5">
                          Sales Number
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "5px" }}>
                        <Typography className="table_cell" variant="h5">
                          Customer Name
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
                    {versionList?.map((row, index) => (
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
                          {row.sales_invoice_number}
                        </TableCell>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          {row.customer_name}
                        </TableCell>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          <div
                            className={`table_body_style_fab invoice flex_display`}
                            onClick={() => HandleOpenViewInvoiceManual(row.data_uniq_id)}
                            style={{cursor: 'pointer'}}
                          >
                            View Invoice
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
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
