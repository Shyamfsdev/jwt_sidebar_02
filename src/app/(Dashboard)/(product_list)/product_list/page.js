"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tabs from "../../components/container/ReportsTab";
import SearchFilter from "../../../(Dashboard)/components/buttons/ProductListSearch";
import { Modal, CircularProgress, Tooltip, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DateFilter from "../../../(Dashboard)/components/buttons/FilterDateFilter";
import {
  FormControl,
  Typography,
  Autocomplete,
  TextField,
  Button,
  List,
  ListItemButton,
} from "@mui/material";
import Cookies from "js-cookie";
import UserTable from "../../../(Dashboard)/components/dashboard/ReportsTable";
import ProductCreate from "../../components/dashboard/ProductListTable";
import PurchaseItemReport from "../../components/dashboard/ProductListNOMenuTable";
import moment from "moment";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";

const OrderList = () => {
  const fileInputRef = useRef(null);

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const router = useRouter();

  const ACCESS_TOKEN = Cookies.get("token");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const [data, setData] = useState([]);

  useEffect(() => {
    HandlePurchaseInvoice();
    HandleDivisionMaster();
    HandleProductMaster();
    HandleUomMaster();
    HandleCategoryHandlerMaster();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      productOneName,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      invoiceName
    );
    fetchData2(
      ACCESS_TOKEN,
      pageTwoNumber,
      limitEnd,
      productName,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      invoiceTwoName
    );
  }, []);

  const [purchaseItemData, setpurchaseItemData] = useState([]);
  const [dataCount, setdataCount] = useState();
  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const [dataTwoCount, setdataTwoCount] = useState();
  const [pageTwoCount, setPageTwoCount] = useState();
  const [pageTwoNumber, setpageTwoNumber] = useState(1);
  const [limitEnd, setlimitEnd] = useState("30");

  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");

  const [createdItemStartDate, setcreatedItemStartDate] = useState("");
  const [createdItemEndDate, setcreatedItemEndDate] = useState("");

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
    invoice_id
  ) => {
    axiosGet
      .get(
        `purchase_product_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&start_date=${createdStartDate}&end_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&invoice_id=${invoice_id}&create_status=${0}`
      )
      .then((response) => {
        setData(response.data.data);
        setPageCount(response.data.total_pages);
        setdataCount(response.data.total_items);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchData2 = async (
    access_token,
    limit,
    end,
    searchValue,
    createdStartDate,
    createdEndDate,
    order_type,
    order_field,
    invoice_id
  ) => {
    axiosGet
      .get(
        `purchase_product_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&start_date=${createdStartDate}&end_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&invoice_id=${invoice_id}&create_status=${1}`
      )
      .then((response) => {
        setpurchaseItemData(response.data.data);
        setPageTwoCount(response.data.total_pages);
        setdataTwoCount(response.data.total_items);
        setloadingPage(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [loadingPage, setloadingPage] = useState(true);

  const [tabsValue, settabsValue] = useState(1);

  const product_table = [
    { th: "#", id: "id", weigh: "2%", sub_item: [] },
    { th: "Material Name", id: "product_name", weigh: "15%", sub_item: [] },
    { th: "Material Code", id: "item_code", weigh: "15%", sub_item: [] },
    { th: "HSN Code", id: "hsn_code", weigh: "15%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "15%", sub_item: [] },
    { th: "Material Quantity", id: "material_qty", weigh: "12%", sub_item: [] },
    { th: "Division", id: "division", weigh: "12%", sub_item: [] },
    { th: "Invoice Number", id: "ref_invoice_id", weigh: "12%", sub_item: [] },
    { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
    { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
    { th: "Action", id: "base_value", weigh: "8%", sub_item: [] },
  ];

  const HandleOnSubmit = () => {
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      productOneName,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      invoiceName
    );
  };

  const [dateTitle, setDateTitle] = useState("Created Date");

  const [isDateSelected, setIsDateSelected] = useState(false);

  const [isShowSelected, setisShowSelected] = useState(false);

  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateSelected(true);
    setisShowSelected(false);
  };

  const HandleOnReload = () => {
    setCreatedStartDate("");
    setCreatedEndDate("");
    setIsDateSelected(false);
    setDateTitle("Created Date");
    setproductOneName("");
    setinvoiceName("");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      orderType,
      orderField,
      ""
    );
  };

  const [invoiceName, setinvoiceName] = useState("");

  const handleInvoiceChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.pur_invoice_number);
    } else {
      setinvoiceName("");
    }
  };

  const [invoiceTwoName, setinvoiceTwoName] = useState("");

  const handleInvoiceTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTwoName(value.pur_invoice_number);
    } else {
      setinvoiceTwoName("");
    }
  };

  const [productOneName, setproductOneName] = useState("");

  const handleSearchInputChange = (input) => {
    setproductOneName(input);
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      input,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      invoiceName
    );
  };

  // Tab 2

  const handleSearchInputTwoChange = (input) => {
    setproductName(input);
    fetchData2(
      ACCESS_TOKEN,
      pageTwoNumber,
      limitEnd,
      input,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      invoiceTwoName
    );
  };

  const [productMaster, setproductMaster] = useState([]);

  const HandleProductMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `product_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setproductMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [invoiceData, setinvoiceData] = useState([]);

  const HandlePurchaseInvoice = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
        )
        .then((response) => {
          setinvoiceData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [productName, setproductName] = useState("");

  const product_table_purchase_item = [
    { th: "#", id: "id", weigh: "2%", sub_item: [] },
    { th: "Material Name", id: "product_name", weigh: "15%", sub_item: [] },
    { th: "Material Code", id: "item_code", weigh: "15%", sub_item: [] },
    { th: "HSN Code", id: "hsn_code", weigh: "15%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "15%", sub_item: [] },
    { th: "Material Quantity", id: "material_qty", weigh: "12%", sub_item: [] },
    { th: "Division", id: "division", weigh: "12%", sub_item: [] },
    { th: "Invoice Number", id: "ref_invoice_id", weigh: "12%", sub_item: [] },
    { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
    { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
  ];

  const HandleOnSubmitItem = () => {
    setloadingPage(true);
    fetchData2(
      ACCESS_TOKEN,
      pageTwoNumber,
      limitEnd,
      productName,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      invoiceTwoName
    );
  };

  const [dateItemTitle, setDateItemTitle] = useState("Created Date");

  const [isDateItemSelected, setIsDateItemSelected] = useState(false);

  const [isShowItemSelected, setisShowItemSelected] = useState(false);

  const onCreatedItemDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setcreatedItemStartDate(formattedStartDate);
    setcreatedItemEndDate(formattedEndDate);
    setDateItemTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateItemSelected(true);
  };

  const HandleOnReloadItem = () => {
    setproductName("");
    setloadingPage(true);
    setcreatedItemStartDate("");
    setcreatedItemEndDate("");
    setIsDateItemSelected(false);
    setDateItemTitle("Created Date");
    setinvoiceTwoName("");
    fetchData2(
      ACCESS_TOKEN,
      pageTwoNumber,
      limitEnd,
      "",
      "",
      "",
      orderType,
      orderField,
      ""
    );
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    fetchData(
      ACCESS_TOKEN,
      value,
      limitEnd,
      productOneName,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      invoiceName
    );
  };

  const handlePageTwoChange = (event, value) => {
    setpageTwoNumber(value);
    fetchData2(
      ACCESS_TOKEN,
      value,
      limitEnd,
      productName,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      invoiceTwoName
    );
  };

  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.product_name, type: "text", id: 1, alian: "left" },
        {
          td: item.item_code,
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td: item.hsn_code,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td: item.uom,
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: item.material_qty,
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: item.division,
          type: "text",
          id: 6,
          alian: "left",
        },
        {
          td: item.ref_invoice_data?.pur_invoice_number,
          type: "text",
          id: 7,
          alian: "left",
        },
        {
          td: item.created_f_date,
          type: "text",
          id: 8,
          alian: "left",
        },
        {
          td: item.user_details?.first_name + item.user_details?.last_name,
          type: "text",
          id: 9,
          alian: "left",
        },
      ],
      json: [item],
      active: item.create_status,
    };
    td_data_set.push(array_data);
  });

  const td_data_set2 = [];

  purchaseItemData?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.product_name, type: "text", id: 1, alian: "left" },
        {
          td: item.item_code,
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td: item.hsn_code,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td: item.uom,
          type: "text",
          id: 4,
          alian: "left",
        },
        {
          td: item.material_qty,
          type: "text",
          id: 5,
          alian: "left",
        },
        {
          td: item.division,
          type: "text",
          id: 6,
          alian: "left",
        },
        {
          td: item.ref_invoice_data?.pur_invoice_number,
          type: "text",
          id: 7,
          alian: "left",
        },
        {
          td: item.created_f_date,
          type: "text",
          id: 8,
          alian: "left",
        },
        {
          td: item.user_details?.first_name + item.user_details?.last_name,
          type: "text",
          id: 9,
          alian: "left",
        },
      ],
      json: [item],
      active: item.create_status,
    };
    td_data_set2.push(array_data);
  });

  const [singleData, setSingleData] = useState([]);

  const [createConfirmModel, setcreateConfirmModel] = useState(false);

  const HandleCloseCreateModel = () => {
    setcreateConfirmModel(false);
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data.json[0]);
    setcreateConfirmModel(true);
  };

  const TableComponents = () => {
    if (tabsValue === 1) {
      return (
        <Box className="reports_bax_sub">
          <Stack
            direction={"row"}
            gap={1}
            sx={{ padding: "10px" }}
            className="displey_space_between"
          >
            <Stack direction={"row"} gap={1}>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={invoiceData}
                  value={
                    invoiceData?.find(
                      (year) => year.pur_invoice_number === invoiceName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleInvoiceChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.pur_invoice_number}
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
                      label="Invoice Number"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <DateFilter
                  title={dateTitle}
                  buttonType={1}
                  onDateRangeChange={onCreatedDateChange}
                  isSelected={isDateSelected}
                  setisShowSelected={setisShowSelected}
                  isShowSelected={isShowSelected}
                ></DateFilter>
              </Box>
            </Stack>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="nunito_font_width create_button"
                onClick={() => HandleOnSubmit()}
              >
                Submit
              </Button>
              <Button
                className="nunito_font_width create_button_draft"
                style={{ marginLeft: "10px" }}
                onClick={() => HandleOnReload()}
              >
                Reload
              </Button>
            </div>
          </Stack>
          <Box sx={{ padding: "10px" }}>
            <ProductCreate
              product_table={product_table}
              tableRow={td_data_set}
              onPageChange={handlePageChange}
              pageCount={pageCount}
              handleOnActionClick={handleOnActionClick}
              pageNumber={pageNumber}
            />
          </Box>
        </Box>
      );
    } else if (tabsValue === 2) {
      return (
        <Box className="reports_bax_sub">
          <Stack
            direction={"row"}
            gap={1}
            sx={{ padding: "10px" }}
            className="displey_space_between"
          >
            <Stack direction={"row"} gap={1}>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={invoiceData}
                  value={
                    invoiceData?.find(
                      (year) => year.pur_invoice_number === invoiceTwoName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleInvoiceTwoChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.pur_invoice_number}
                  required
                  id="supplier"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={invoiceTwoName}
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
                      label="Invoice Number"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <DateFilter
                  title={dateItemTitle}
                  buttonType={1}
                  onDateRangeChange={onCreatedItemDateChange}
                  isSelected={isDateItemSelected}
                  setisShowSelected={setisShowItemSelected}
                  isShowSelected={isShowItemSelected}
                ></DateFilter>
              </Box>
            </Stack>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="nunito_font_width create_button"
                onClick={() => HandleOnSubmitItem()}
              >
                Submit
              </Button>
              <Button
                className="nunito_font_width create_button_draft"
                style={{ marginLeft: "10px" }}
                onClick={() => HandleOnReloadItem()}
              >
                Reload
              </Button>
            </div>
          </Stack>
          <Box sx={{ padding: "10px" }}>
            <PurchaseItemReport
              product_table={product_table_purchase_item}
              tableRow={td_data_set2}
              onPageChange={handlePageTwoChange}
              pageCount={pageTwoCount}
              pageNumber={pageTwoNumber}
            />
          </Box>
        </Box>
      );
    }
  };

  const [stickStatus, setstickStatus] = useState(0);

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
              Product Detailss
            </Typography>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Product Name"
                  variant="outlined"
                  value={job_titleName}
                  onChange={(e) => setjob_titleName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Product Name"
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
                  label="Item Code"
                  variant="outlined"
                  value={itemCode}
                  onChange={(e) => setitemCode(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Item Code"
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
                  label="HSN Code"
                  variant="outlined"
                  value={hsnCode}
                  onChange={(e) => sethsnCode(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="HSN Code"
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
            <Box>
              <Stack direction={"row"} gap={2} style={{ alignItems: "center" }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "10px" }}
                  options={divisionMaster}
                  value={
                    divisionMaster.find(
                      (year) => year.division === divisionName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeDivision(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.division}
                  required
                  id="division"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={divisionName}
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
                      label="Division"
                    />
                  )}
                  clearIcon={null}
                />

                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "10px" }}
                  options={subDivisionList}
                  value={
                    subDivisionList.find(
                      (year) => year.sub_division === rfaDivisionName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeRFADivision(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.sub_division}
                  required
                  id="sub_division"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={rfaDivisionName}
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
                      label="RFA Division"
                    />
                  )}
                  clearIcon={null}
                />

                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "10px" }}
                  options={uomMaster}
                  value={
                    uomMaster.find((year) => year.uom === uomValue) || null
                  }
                  onChange={(e, value) =>
                    HandleUpdateUOM(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.uom}
                  required
                  id="UOM"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={uomValue}
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
                      label="UOM"
                    />
                  )}
                  clearIcon={null}
                />

              </Stack>
            </Box>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2} style={{ alignItems: "center" }}>
                <div style={{ width: '30%' }}>
                  <Checkbox
                    onChange={(event) => ChangeFreeStock(event, freeStockValue)}
                    checked={freeStockValue == 0 ? false : true}
                    style={{ padding: "0px", color: "#c3c3c3" }}
                  />
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    style={{ color: "black" }}
                  >
                    Free Stock
                  </Typography>
                </div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={cfcWeightValue}
                  onChange={(e) => HandleChangeCfcWeight(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder={stickStatus === 0 ? "CFC Weight" : "Box Count"}
                  sx={{ pb: 1, width: '35%' }}
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
                  label="Expiry Days"
                  variant="outlined"
                  value={expiryDaysvalue}
                  onChange={(e) => HandleExpiryValue(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Expiry Days"
                  sx={{ pb: 1, width: '35%' }}
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
            {freeStockValue !== 0 && (
              <Box>
                <Stack
                  direction={"row"}
                  gap={2}
                  style={{ alignItems: "center" }}
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "20px", width: "100%" }}
                    options={productMaster}
                    value={
                      productMaster.find(
                        (year) => year.item_code === productName
                      ) || null
                    }
                    onChange={(e, value) =>
                      HandleChangeProduct(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.item_code}
                    required
                    id="item_code"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={productName}
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
                        label="Free Stock Item Code"
                      />
                    )}
                    clearIcon={null}
                  />
                </Stack>
              </Box>
            )}
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              UOM Details
            </Typography>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2} my={2} >
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px", width: "35%" }}
                  options={uomMasterSUB}
                  value={
                    uomMasterSUB?.find(
                      (year) => year.uom_name === uomDetails[0]?.uomName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeUOMDetails(e.target.value, value, 0, "sub_uom")
                  }
                  getOptionLabel={(val) => val.uom_name}
                  required
                  id="sub_uom"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={uomDetails[0]?.uomName}
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
                      label="Sub UOM"
                    />
                  )}
                  clearIcon={null}
                />
                <TextField
                  id="outlined-basic"
                  label="Per UOM Value"
                  variant="outlined"
                  value={uomDetails[0]?.per_value}
                  onChange={(e, value) =>
                    HandleChangeUOMDetails(
                      e.target.value,
                      value,
                      0,
                      "per_value"
                    )
                  }
                  size="small"
                  fullWidth
                  placeholder="Per UOM Value"
                  sx={{ pb: 1, width: "35%" }}
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
                  label={
                    stickStatus === 0
                      ? "Total Quantity Of CFC"
                      : "Total Quantity Of Box"
                  }
                  variant="outlined"
                  disabled
                  value={uomDetails[0]?.total_qty}
                  size="small"
                  fullWidth
                  placeholder={
                    stickStatus === 0
                      ? "Total Quantity Of CFC"
                      : "Total Quantity Of Box"
                  }
                  sx={{ pb: 1, width: "30%" }}
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
              <Stack direction={"row"} gap={2} my={2}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  multiple={false}
                  style={{ width: "33%", fontSize: '12px' }}
                  options={categoryHandlerMaster}
                  value={categoryDetails.categoryHandlerName || null}
                  onChange={HandleUpdateCategoryHandler}
                  getOptionLabel={(option) => option.category_type || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  required
                  id="category_handler"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      style={{ margin: "0px" }}
                      InputLabelProps={{
                        className: "textfieldstylefont",
                        style: { top: "-5px", fontSize: "12px" },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        autoComplete: "off",
                        className: "fontInput",
                      }}
                      label="Category Handler"
                    />
                  )}
                  clearIcon={null}
                />
              </Stack>
            </Box>
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <div>
              <Typography
                variant="p"
                fontSize={"14px"}
                fontWeight={"bold"}
                style={{ color: "#185AA6" }}
              >
                Price & Tax Details
              </Typography>
            </div>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="MRP Price"
                  variant="outlined"
                  name="mrp_price"
                  value={taxDetails.mrp_price}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="MRP Price"
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
                  error={Boolean(errors.mrp_price)}
                  helperText={errors.mrp_price}
                />
                <TextField
                  id="outlined-basic"
                  label="Salvage Value"
                  variant="outlined"
                  name="salvage_value"
                  value={taxDetails.salvage_value}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="Salvage Value"
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


              </Stack>
              <Stack direction={"row"} gap={2}>

                <TextField
                  id="outlined-basic"
                  label="Sales Price"
                  variant="outlined"
                  name="sales_price"
                  value={taxDetails.sales_price}
                  onChange={(event) => handleTaxFormChange(event,'sales')}
                  size="small"
                  fullWidth
                  placeholder="Sales Price"
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
                  error={Boolean(errors.sales_price)}
                  helperText={errors.sales_price}
                />
                <TextField
                  id="outlined-basic"
                  label="Cfc Price"
                  variant="outlined"
                  value={cfcPrice.toFixed(2) || 0}
                  disabled
                  size="small"
                  placeholder="Cfc Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />

                <TextField
                  id="outlined-basic"
                  label="Sub UOM Price"
                  variant="outlined"
                  value={subUOMPrice.toFixed(2) || 0}
                  disabled
                  size="small"
                  placeholder="Sub UOM Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>

                <TextField
                  id="outlined-basic"
                  label="Base Value"
                  variant="outlined"
                  name="baseValue"
                  value={taxDetails.baseValue}
                  onChange={(event) => handleTaxFormChange(event,'purchase')}
                  size="small"
                  fullWidth
                  placeholder="Base Value"
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
                  error={Boolean(errors.baseValue)}
                  helperText={errors.baseValue}
                />
                <TextField
                  id="outlined-basic"
                  label="Cfc Base Price"
                  variant="outlined"
                  value={cfcbasePrice?.toFixed(2) || 0}
                  disabled
                  size="small"
                  placeholder="Cfc Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />

                <TextField
                  id="outlined-basic"
                  label="Sub UOM  Base Price"
                  variant="outlined"
                  value={subUOMbasePrice?.toFixed(2) || 0}
                  disabled
                  size="small"
                  placeholder="Sub UOM Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Tax %"
                  variant="outlined"
                  name="taxValue"
                  value={taxDetails?.taxValue}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="Tax %"
                  sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                  label="Inversement Value"
                  variant="outlined"
                  value={(totalValue || 0).toFixed(0)}
                  disabled
                  size="small"
                  placeholder="Inversement Value"
                  sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
              <Stack direction={"row"} gap={2}>
                {cigrateDivisionValue !== 0 && (
                  <TextField
                    id="outlined-basic"
                    label="Cess %"
                    variant="outlined"
                    name="cessValue"
                    value={taxDetails.cessValue}
                    onChange={(event) => handleTaxFormChange(event,'null')}
                    size="small"
                    fullWidth
                    placeholder="Cess %"
                    sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                )}
                {cigrateDivisionValue !== 0 && (
                  <TextField
                    id="outlined-basic"
                    label="Additional Cess"
                    variant="outlined"
                    name="additionalCessValue"
                    value={taxDetails.additionalCessValue}
                    onChange={(event) => handleTaxFormChange(event,'null')}
                    size="small"
                    fullWidth
                    placeholder="Additional Cess"
                    sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                )}
              </Stack>
            </Box>
          </div>
        </Box>
      </div>
    );
  };

  const TabContext = ({ value }) => {
    settabsValue(value);
    return <UserTable TableComponents={TableComponents} />;
  };

  const tabs = [
    {
      value: 1,
      name: "Product List (Not Generated)",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Product List (Generated)",
      content: <TabContext value={2} />,
    },
  ];

  const [openDrawer, setOpenDrawer] = useState(false);

  const [pageDrawerWidth, setpageDrawerWidth] = useState(0);

  const [itemCode, setitemCode] = useState("");

  const [hsnCode, sethsnCode] = useState("");

  const [totalValue, setTotalValue] = useState("");

  const [taxDetails, settaxDetails] = useState({
    baseValue: "",
    taxValue: "",
    cessValue: "",
    additionalCessValue: "",
    sales_price: "",
    mrp_price: "",
    salvage_value: ""
  });
  useEffect(() => {
    const calculateTotalValue = () => {
      const base = parseFloat(taxDetails.baseValue) || 0;
      const taxPercentage = parseFloat(taxDetails.taxValue) || 0;
      const tax = ((base * taxPercentage) / 100);
      const cessPercentage = parseFloat(taxDetails.cessValue) || 0;
      const cess = ((base * cessPercentage) / 100);
      const additionalCess = parseFloat(taxDetails.additionalCessValue) || 0;
      return base + tax + cess + additionalCess;
    };

    setTotalValue(calculateTotalValue());

  }, [taxDetails]);


  const [errors, setErrors] = useState({
    baseValue: "",
    sales_price: "",
    mrp_price: "",
  });
  const validateTaxValue = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0 && number <= 100;
  };

  const handleTaxFormChange = (event,ref) => {
    const { name, value } = event.target;
    if (!isNaN(value) && value >= 0) {
      let newTaxDetails = { ...taxDetails, [name]: value };
      let newErrors = { ...errors };
      if (validateTaxValue(value)) {
        const newfields = [...uomDetails];
        if(ref === 'sales'){
          newfields[0].sales_uom_value = value;
        }
        else if(ref === 'purchase'){
          newfields[0].purchase_uom_value = value;
        }
        setuomDetails(newfields)
        settaxDetails({
          ...taxDetails,
          [name]: value,
        });
      }

      if (name === "baseValue") {
        if (Number(value) > Number(newTaxDetails.sales_price)) {
          newErrors.baseValue = "Base Value should be lower than Sales Price";
        } else {
          newErrors.baseValue = "";
        }
      }

      settaxDetails(newTaxDetails);
      setErrors(newErrors);
    }
  };

  const [uomDetails, setuomDetails] = useState([
    {
      uomName: "",
      per_value: "",
      total_qty: "",
      sales_uom_value: "",
      sales_cfc_value: "",
      sales_sub_uom_value: "",
      purchase_uom_value: "",
      purchase_cfc_value: "",
      purchase_sub_uom_value: ""
    },
  ]);


  const [uomMasterSUB, setuomMasterSUB] = useState([]);

  const [uomValue, setuomValue] = useState("");
  const HandleUpdateUOM = (event, value) => {
    if (value != null) {
      const newfields = [...uomDetails];
      newfields[0].uomName = "";
      newfields[0].per_value = "";
      newfields[0].total_qty = "";
      setuomDetails(newfields);
      setuomValue(value.uom);
      const validTaxDetails = value.subuom_details.filter(
        (detail) => detail.uom_name !== ""
      );
      setuomMasterSUB(validTaxDetails);
    } else {
      setuomValue("");
      setuomMasterSUB([]);
    }
  };

  const [freeStockValue, setfreeStockValue] = useState(0);

  const ChangeFreeStock = (event, value) => {
    if (value === 0) {
      setfreeStockValue(1);
    } else {
      setfreeStockValue(0);
    }
  };

  const [divisionMaster, setdivisionMaster] = useState([]);

  const HandleDivisionMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `division_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdivisionMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [divisionID, setdivisionID] = useState("");
  const [divisionName, setdivisionName] = useState("");

  const [cigrateDivisionValue, setcigrateDivisionValue] = useState(0);

  const [subDivisionList, setsubDivisionList] = useState([]);

  const HandleChangeDivision = (event, value) => {
    setstickStatus(Number(value.stick_status));
    if (value != null) {
      setdivisionID(value.data_uniq_id);
      setdivisionName(value.division);
      setcigrateDivisionValue(value.cigarette_division);
      setsubDivisionList(value.sub_division_list);
    } else {
      setdivisionID("");
      setdivisionName("");
      setcigrateDivisionValue(0);
      setsubDivisionList([]);
    }
  };

  const [rfaDivisionID, setrfaDivisionID] = useState("");
  const [rfaDivisionName, setrfaDivisionName] = useState("");

  const HandleChangeRFADivision = (event, value) => {
    if (value != null) {
      setrfaDivisionID(value.data_uniq_id);
      setrfaDivisionName(value.sub_division);
    } else {
      setrfaDivisionID("");
      setrfaDivisionName("");
    }
  };

  const [productID, setproductID] = useState("");
  const [productRefName, setproductRefName] = useState("");
  const HandleChangeProduct = (event, value) => {
    if (value != null) {
      setproductID(value.data_uniq_id);
      setproductRefName(value.item_code);
    } else {
      setproductID("");
      setproductRefName("");
    }
  };

  const [expiryDaysvalue, setexpiryDaysvalue] = useState("");

  const HandleExpiryValue = (e) => {
    if (!isNaN(e) && e >= 0) {
      setexpiryDaysvalue(e);
    }
  };
  ///////////////////////CATEGORY MASTER////////////////////////////
  const [categoryHandlerMaster, setcategoryHandlerMaster] = useState([]);

  const [categoryDetails, setcategoryDetails] = useState({
    categoryHandlerName: null,
  });
  const HandleCategoryHandlerMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `category_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setcategoryHandlerMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  const HandleUpdateCategoryHandler = (event, value) => {
    setcategoryDetails((prevState) => ({
      ...prevState,
      categoryHandlerName: value,
    }));
  };
  ///////////////////////CATEGORY MASTER////////////////////////////
  ///////////////////////UOM MASTER////////////////////////////
  const [uomMaster, setuomMaster] = useState([]);

  const [cfcWeightValue, setcfcWeightValue] = useState("");

  const HandleUomMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `uom_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setuomMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  /////////////////////////////UOM MASTER/////////////////////////////////

  //////////////////////////Calculation For CFC Based////////////////////
  const [cfcPrice, setCfcPrice] = useState(0);
  useEffect(() => {
    const calculatedPrice = parseFloat(taxDetails.sales_price) * parseFloat(cfcWeightValue);
    setCfcPrice(calculatedPrice);
    const newfields = [...uomDetails];
    newfields[0].sales_cfc_value = calculatedPrice;
    setuomDetails(newfields)
  }, [taxDetails.sales_price, cfcWeightValue]);

  const [subUOMPrice, setsubUOMPrice] = useState(0);
  useEffect(() => {
    const calculatedsubUOMPrice = parseFloat(cfcPrice) / parseFloat(uomDetails[0]?.total_qty);
    setsubUOMPrice(calculatedsubUOMPrice);
    const newfields = [...uomDetails];
    newfields[0].sales_sub_uom_value = calculatedsubUOMPrice;
    setuomDetails(newfields)
  }, [cfcPrice, uomDetails[0]?.total_qty]);

  const [cfcbasePrice, setCfcbasePrice] = useState(0);
  useEffect(() => {
    const calculatedPrice = parseFloat(taxDetails.baseValue) * parseFloat(cfcWeightValue);
    setCfcbasePrice(calculatedPrice);
    const newfields = [...uomDetails];
    newfields[0].purchase_cfc_value = calculatedPrice;
    setuomDetails(newfields)
  }, [taxDetails.baseValue, cfcWeightValue]);

  const [subUOMbasePrice, setsubbaseUOMPrice] = useState(0);
  useEffect(() => {
    const calculatedsubUOMPrice = parseFloat(cfcbasePrice) / parseFloat(uomDetails[0]?.total_qty);
    setsubbaseUOMPrice(calculatedsubUOMPrice);
    const newfields = [...uomDetails];
    newfields[0].purchase_sub_uom_value = calculatedsubUOMPrice;
    setuomDetails(newfields)
  }, [cfcbasePrice, uomDetails[0]?.total_qty]);
  ///////////////////////END Calculation//////////////////////////////

  const HandleChangeUOMDetails = (event, value, index, ref) => {
    const newfields = [...uomDetails];
    if (ref == "sub_uom") {
      if (value != null) {
        newfields[index].uomName = value.uom_name;
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      } else {
        newfields[index].uomName = "";
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      }
    } else {
      if (event != null) {
        if (!isNaN(event) && event >= 0) {
          newfields[index].per_value = event;
          newfields[index].total_qty = Number(cfcWeightValue) / (event / 1000);
          setuomDetails(newfields);
        }
      } else {
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      }
    }
  };

  const HandleChangeCfcWeight = (event) => {
    if (event != null) {
      if (!isNaN(event) && event >= 0) {
        setcfcWeightValue(event);
      }
    } else {
      setcfcWeightValue("");
    }
  };

  // Toggel Drawer
  const toggleDrawer = (newOpen) => () => {
    if (newOpen === true) {
      setOpenDrawer(newOpen);
      setpageDrawerWidth(500);
      setjob_titleName(singleData?.product_name);
      setitemCode(singleData?.item_code);
      sethsnCode(singleData?.hsn_code);
      setdivisionID("");
      setproductID("");
      setproductRefName("");
      setdivisionName("");
      setcigrateDivisionValue(0);
      setexpiryDaysvalue("");
      setfreeStockValue(0);
      setuomValue("");
      setuomMasterSUB([]);
      setstickStatus(0);
      setTotalValue(0);
      setuomDetails([
        {
          uomName: "",
          per_value: "",
          total_qty: "",
        },
      ]);
      settaxDetails({
        baseValue: "" || 0,
        taxValue: "" || 0,
        cessValue: "" || 0,
        additionalCessValue: "" || 0,
        sales_price: "" || 0,
        mrp_price: "" || 0,
        salvage_value: "" || 0
      });
      setcategoryDetails({
        categoryHandlerName: [],
      });
      setCfcPrice(0);
      setsubUOMPrice(0);
      setCfcbasePrice(0);
      setsubUOMPrice(0);
    } else {
      setOpenDrawer(newOpen);
      setpageDrawerWidth(0);
    }
  };

  const [job_titleName, setjob_titleName] = useState("");

  const [postError, setPostError] = useState([]);

  const handleSubmit = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      product_name: job_titleName,
      hsn_code: hsnCode,
      expiry_days: expiryDaysvalue,
      free_stock: freeStockValue,
      uom: uomValue,
      division: divisionID,
      free_stock_item_code: productID,
      base_value: taxDetails?.baseValue,
      tax: taxDetails?.taxValue,
      cess: taxDetails?.cessValue,
      addtional_cess_value: taxDetails?.additionalCessValue,
      item_code: itemCode,
      uom_details: uomDetails,
      subuom_details: uomMasterSUB,
      batch_number: singleData?.batch_number,
      material_qty: singleData?.material_qty,
      active_status: 1,
      cfc_weight: cfcWeightValue,
      product_list_id: singleData?.data_uniq_id,
      sales_price: taxDetails?.sales_price,
      mrp_price: Number(taxDetails?.mrp_price),
      stick_status: stickStatus,
      inversement_value: totalValue,
      category_handler: categoryDetails?.categoryHandlerName,
      salvage_value: Number(taxDetails?.salvage_value),
      cfc_value: cfcPrice,
      sub_uom_price: subUOMPrice,
      cfc_basevalue: cfcbasePrice,
      subuom_basevalue: subUOMbasePrice,
      rfa_division_id: rfaDivisionID,
      rfa_division: rfaDivisionName
    };
    try {
      axiosPost
        .post(`product_master_in_product_list`, jsonData)
        .then((response) => {
          console.log(response)
          // Handle the successful POST response here
          if (response.data.action === "success") {
            setOpenDrawer(false);
            setpageDrawerWidth(0);
            setjob_titleName("");
            fetchData(
              ACCESS_TOKEN,
              pageNumber,
              limitEnd,
              productOneName,
              createdStartDate,
              createdEndDate,
              orderType,
              orderField,
              invoiceName
            );
            fetchData2(
              ACCESS_TOKEN,
              pageTwoNumber,
              limitEnd,
              productName,
              createdItemStartDate,
              createdItemEndDate,
              orderType,
              orderField,
              invoiceTwoName
            );
          } else {
            setError({ status: "error", message: response.data.message });
          }
        })
        .catch((error) => {
          // Handle POST errors here
          console.error("POST Error:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      setOpenDrawer(false);
    }
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
              {tabsValue === 1
                ? `Product List [${dataCount}]`
                : `Product List [${dataTwoCount}]`}
            </Typography>
          </div>
          <div
            className="display_flex_end global_padding"
            style={{ width: "50%" }}
          >
            <Box sx={{ display: "flex", gap: 1, width: "80%" }}>
              {tabsValue === 1 ? (
                <SearchFilter
                  onSearchButtonClick={handleSearchInputChange}
                  searchValue={productOneName}
                />
              ) : (
                <SearchFilter
                  onSearchButtonClick={handleSearchInputTwoChange}
                  searchValue={productName}
                />
              )}
            </Box>
          </div>
        </div>
        <Tabs tabs={tabs} />
        <MasterDrawer
          isPageSidebarOpen={openDrawer}
          drawerWidth={pageDrawerWidth}
          onSidebarClose={toggleDrawer(false)}
          heading={"Product"}
          postError={postError}
          setStateValue={setjob_titleName}
          setValue={job_titleName}
          onCreateClick={handleSubmit}
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
        <AlertDialog
          onsubmit={toggleDrawer(true)}
          open={createConfirmModel}
          handleClose={HandleCloseCreateModel}
          text={`Do you want to Create a New Product?`}
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
          <Alert onClose={handleClose} severity={error.status}>
            {error.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};
export default OrderList;
