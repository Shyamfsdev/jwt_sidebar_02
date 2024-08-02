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
import UserTable from "../../../(Dashboard)/components/dashboard/UserTable";
import moment from "moment";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Collapse from "@mui/material/Collapse";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import RefreshIcon from '@mui/icons-material/Refresh';
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
    router.push("/purchase_invoice_create");
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

  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (input) => {
    setSearchValue(input);
  };

  const handleLimitChange = (event) => {
    setlimitEnd(event.target.value);
    handleRefresh();
  };
  const [invoiceData, setinvoiceData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

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
    pick_list_status,
    pick_list_id,
    route_id,
    ref_sales_invoice_id,
    salesman_id,
    ref_sales_excel_id
  ) => {
    axiosGet
      .get(
        `pick_list_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&pick_list_status=${pick_list_status}&pick_list_id=${pick_list_id}&route_id=${route_id}&ref_sales_invoice_id=${ref_sales_invoice_id}&salesman_id=${salesman_id}&ref_sales_excel_id=${ref_sales_excel_id}`
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
// SALES MAN //
const [SalesmanID, setSalesmanID] = useState("");
const [SalesmanName, setSalesmanName] = useState("");
const handleSalesmanChange = (event, value) => {
  if (value != null) {
    setSalesmanID(value.data_uniq_id);
    setSalesmanName(value.full_name);
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      value.data_uniq_id,
      SalesexcelID
    );
  } else {
    setSalesmanID("");
    setSalesmanName("");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      "",
      SalesexcelID
    );
  }
};
const [SalesmanMaster, setSalesmanMaster] = useState([]);

const HandleSalesmanMaster = () => {
  const fetchData = async (
    access_token,
    searchValue,
    createdStartDate,
    createdEndDate
  ) => {
    axiosGet
      .get(
        `salesman_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
      )
      .then((res) => {
        if (res.data.action == "success") {
          setSalesmanMaster(res.data.data);
        }
      });
  };
  fetchData(ACCESS_TOKEN, "", "", "");
};

// SALES MAN //

// SALES MAN //
const [SalesexcelID, setSalesexcelID] = useState("");
const [SalesexcelNo, setSalesexcelNo] = useState("");
const handleSalesexcelChange = (event, value) => {
  if (value != null) {
    setSalesexcelID(value.sales_excel_id);
    setSalesexcelNo(value.sales_excel_number);
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      SalesmanID,
      value.data_uniq_id,
    );
  } else {
    setSalesmanID("");
    setSalesmanName("");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      SalesmanID,
      "",
    );
  }
};
const [SalesexcelMaster, setsetSalesexcelMaster] = useState([]);

const HandlesetSalesexcelMaster = () => {
  const fetchData = async (
    access_token,
    searchValue,
    createdStartDate,
    createdEndDate
  ) => {
    axiosGet
      .get(
        `sales_excel_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
      )
      .then((res) => {
        if (res.data.action == "success") {
          setsetSalesexcelMaster(res.data.data);
        }
      });
  };
  fetchData(ACCESS_TOKEN, "", "", "");
};

// SALES MAN //
  const HandleNewData = () => {
    const fetchData = async (
      access_token,
      limit,
      end,
      searchValue,
      createdStartDate,
      createdEndDate,
      order_type,
      order_field
    ) => {
      axiosGet
        .get(
          `pick_list_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}`
        )
        .then((response) => {
          setFilteredData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN,1,"10000000000000","","","","desc","created_date");
  }

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
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      SalesmanID,
      SalesexcelID
    );
  };
  useEffect(() => {
    HandleNewData();
    HandleSupplierTypeMaster();
    HandleRouteMaster();
    HandleSalesMaster();
    HandleSalesmanMaster();
    HandlesetSalesexcelMaster();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      invoiceID,
      RouteID,
      SalesID,
      SalesmanID,
      SalesexcelID
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
      label: "Pick List Number",
      value: "pick_list_number",
    },
    {
      id: 8,
      label: "Invoice Details",
      value: "invoice_date",
    },
    {
      id: 2,
      label: "Sales Man",
      value: "salesman_name",
    },
    {
      id: 3,
      label: "Beat",
      value: "route_name",
    },
    {
      id: 7,
      label: "Status",
      value: "pick_list_status_org",
    },
  ];

  const td_data_set = [];
  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.pick_list_number, type: "text", id: 1, alian: "left" },
        {
          td: (
            <Button
              className={`table_body_style_fab invoice flex_display`}
              sx={{ width: "20%" }}
              onClick={() => HandleOpenViewInvoiceManualS(item)}
            >
              View Invoice
            </Button>
          ),
          type: "text",
          id: 8,
          alian: "left",
        },
        {
          td: item.salesman_name,
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: item.route_name,
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: (
            <Box style={{ padding: "8px 0px" }}>
              <span
                className={`table_body_style_fab arrival_${item.pick_list_status_org}`}
                sx={{ width: "20%" }}
              >
                {item.pick_list_status}
              </span>
            </Box>
          ),
          id: 7,
          alian: "left",
        },
      ],
      json: [item],
      active: item.pick_list_status,
    };
    td_data_set.push(array_data);
  });

  const [dateTitle, setDateTitle] = useState("Created Date");

  const handleRefresh = () => {
    setSearchValue("");
    setCreatedEndDate("");
    setCreatedStartDate("");
    setActiveStatusFilter("");
    setFilteredData([]);
    setDateTitle("Created Date");
    setinvoiceID("");
    setRouteID("");
    setinvoiceName("");
    setSalesID("");
    setSalesmanID("");
    setRouteName("");
    setSalesNo("");
    setSalesmanName("");
    setSalesexcelNo("");
    setSalesexcelID("");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      "desc",
      "created_date",
      "",
      "",
      "",
      "",
      "",
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
    if (singleData?.pick_list_status_org === "waiting_for_arrival") {
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
  const [viewInvoiceState, setviewInvoiceState] = useState(false);
  const HandleCloseViewInvoice = () => {
    setviewInvoiceState(false);
  };
  const HandleOpenViewInvoiceManualS = (value) => {
    setviewInvoiceState(true);
    setSingleData(value);
    handleClose2();
  };
  const HandleOpenEditInvoice = () => {
    if (
      singleData?.pick_list_status_org === "waiting_for_arrival" &&
      singleData?.delivery_pick_list === 0
    ) {
      Cookies.set("invoice_id", singleData?.data_uniq_id);
      router.push("/delivery_pick_list");
      handleClose2();
    } else {
      setError({
        status: "error",
        message: "Picklist Cannot be Delivery.",
      });
    }
  };

  const DispatchCancelMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: singleData?.data_uniq_id,
      cancel_order: cancelOrderStatus === true ? 1 : 0,
      cancel_notes: cancelOrderNotes,
    };
    axiosPost.post(`pick_list_edit`, mdata).then((res) => {
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
            activeStatusFilter,
            invoiceID,
            RouteID,
            SalesID,
            SalesmanID,
            SalesexcelID
          );
          HandleCancelOrderClose();
        }, 200);
      }
    });
  };

  const HandleOpenViewInvoiceManual = () => {
    Cookies.set("invoice_id", singleData?.data_uniq_id);
    router.push("/view_pick_list");
  };

  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => HandleOpenViewInvoiceManual()}>
          <Typography variant="p">View Invoice</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleOpenEditInvoice()}
          style={
            singleData?.delivery_pick_list === 0 &&
            singleData?.pick_list_status_org === "waiting_for_arrival"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Delivery Pick List</Typography>
        </ListItemButton>
        <ListItemButton
          onClick={() => HandleCancelOrder()}
          style={
            singleData?.pick_list_status_org === "waiting_for_arrival"
              ? { opacity: 1 }
              : { opacity: 0.3 }
          }
        >
          <Typography variant="p">Cancel Pick List</Typography>
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

  const [supplierMaster, setsupplierMaster] = useState([]);

  const [invoiceName, setinvoiceName] = useState("");

  const [invoiceID, setinvoiceID] = useState("");


  const handleInputChange = (event, value) => {
    setinvoiceData(value);
    setinvoiceName(value);
    setFilteredData(Array.isArray(value) ? value : []);
  };

  const handleInvoiceChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.pick_list_number);
      setinvoiceID(value.data_uniq_id);
      fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      value.data_uniq_id,
      RouteID,
      SalesID,
      SalesmanID,
      SalesexcelID
      );
    } else {
      setinvoiceName("");
      setinvoiceID("");
      fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      activeStatusFilter,
      "",
      RouteID,
      SalesID,
      SalesmanID,
      SalesexcelID
      );
    }
  };

  const [SalesID, setSalesID] = useState("");
  const [SalesNo, setSalesNo] = useState("");
  const handleSalesnoChange = (event, value) => {
    if (value != null) {
      setSalesID(value.data_uniq_id);
      setSalesNo(value.sales_invoice_number);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        activeStatusFilter,
        invoiceID,
        RouteID,
        value.data_uniq_id,
        SalesmanID,
        SalesexcelID
      );
    } else {
      setSalesID("");
      setSalesNo("");
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        activeStatusFilter,
        invoiceID,
        RouteID,
        "",
        SalesmanID,
        SalesexcelID
      );
    }
  };
  const [SalesMaster, setSalesMaster] = useState([]);

  const HandleSalesMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `sales_invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setSalesMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [RouteID, setRouteID] = useState("");
  const [RouteName, setRouteName] = useState("");

  const handleRouteChange = (event, value) => {
    if (value != null) {
      setRouteID(value.data_uniq_id);
      setRouteName(value.route);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        activeStatusFilter,
        invoiceID,
        value.data_uniq_id,
        SalesID,
        SalesmanID,
        SalesexcelID
      );
    } else {
      setRouteID("");
      setRouteName("");
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        activeStatusFilter,
        invoiceID,
        "",
        SalesID,
        SalesmanID,
        SalesexcelID
      );
    }
  };
  const [RouteMaster, setRouteMaster] = useState([]);

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
            setRouteMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

 
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
      value,
      invoiceID,
      RouteID,
      SalesID,
      SalesmanID,
      SalesexcelID
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
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={SalesmanMaster}
            value={
              SalesmanMaster.find(
                (year) => year.full_name === SalesmanName
              ) || null
            }
            onChange={(e, value) =>
              handleSalesmanChange(e.target.value, value)
            }
            getOptionLabel={(val) => val.full_name}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={SalesmanName}
                style={{ margin: "0px" }} 
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Salesman Name"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={SalesexcelMaster}
            value={
              SalesexcelMaster.find(
                (year) => year.sales_excel_number === SalesexcelNo
              ) || null
            }
            onChange={(e, value) =>
              handleSalesexcelChange(e.target.value, value)
            }
            getOptionLabel={(val) => val.sales_excel_number}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={SalesexcelNo}
                style={{ margin: "0px" }} 
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Do Number"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={SalesMaster}
            value={
              SalesMaster.find(
                (year) => year.sales_invoice_number === SalesNo
              ) || null
            }
            onChange={(e, value) =>
              handleSalesnoChange(e.target.value, value)
            }
            getOptionLabel={(val) => val.sales_invoice_number}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={SalesNo}
                style={{ margin: "0px" }} 
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
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={RouteMaster}
            value={
              RouteMaster.find(
                (year) => year.route === RouteName
              ) || null
            }
            onChange={(e, value) =>
              handleRouteChange(e.target.value, value)
            }
            getOptionLabel={(val) => val.route}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={RouteName}
                style={{ margin: "0px" }} 
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Route Name"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={filteredData}
            value={
              filteredData.find(
                (year) => year.pick_list_number === invoiceName
              ) || null
            }
            onChange={(e, value) => handleInvoiceChange(e.target.value, value)}
            getOptionLabel={(val) => val.pick_list_number}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={invoiceName}
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
                label="Picklist Number"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
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
            <MenuItem sx={{ fontSize: "14px" }} value={"not delivered"}>
              Not Delivered
            </MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={"delivered"}>
              Delivered
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <RefreshIcon
            
            style={{ marginLeft: "10px" }}
            onClick={handleRefresh}
          />
        </div>
      </Box>
    );
  };

  return (
    <>
      <Box sx={{ px: 2, height: "1" }}>
        <div className="dispatch_do_flex">
          <div className="display_flex global_padding" style={{ width: "50%" }}>
            <Typography
              variant="h4"
              className="nunito_font"
              style={{ fontSize: "16px", fontWeight: "700", color: "#185AA6" }}
            >
              Pick List [{dataCount}]{" "}
            </Typography>
          </div>
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
                    {singleData.pick_list_number}
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
          open={viewInvoiceState}
          onClose={HandleCloseViewInvoice}
        >
          <Box sx={{ width: 600 }} role="presentation">
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
                    {singleData.pick_list_number}
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
                          Invoice Number
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "5px" }}>
                        <Typography className="table_cell" variant="h5">
                          Invoice Date
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "5px" }}>
                        <Typography className="table_cell" variant="h5">
                          DO Number
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {singleData?.sales_invoice_data?.map((row, index) => (
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
                          {row.invoice_date}
                        </TableCell>
                        <TableCell
                          sx={{ padding: "4px 8px" }}
                          align="center"
                        >
                          {row.sales_excel_number && row.sales_excel_number.length > 0
                            ? row.sales_excel_number
                            : "NA"}
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
