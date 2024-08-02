"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tabs from "../../components/container/ReportsTab";
import SearchFilter from "../../../(Dashboard)/components/buttons/ComponentSearch";
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
} from "@mui/material";
import Cookies from "js-cookie";
import UserTable from "../../../(Dashboard)/components/dashboard/ReportsTable";
import ProductCreate from "../../components/product_view/BilledReport";
import PurchaseItemReport from "../../components/product_view/BilledItem";
import moment from "moment";

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

  const [purchaseItemData, setpurchaseItemData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [limitEnd, setlimitEnd] = useState("10000000");

  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");

  const [createdItemStartDate, setcreatedItemStartDate] = useState("");
  const [createdItemEndDate, setcreatedItemEndDate] = useState("");

  const [searchValue, setSearchValue] = useState(""); // State variable to store search input

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
    supplier_id,
    pur_entry_number
  ) => {
    axiosGet
      .get(
        `mismatch_report?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&supplier_id=${supplier_id}&pur_entry_number=${pur_entry_number}&inwaed_entry_method=${5}&`
      )
      .then((response) => {
        setData(response.data.data);
        setloadingPage(false);
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
    supplier_id,
    invoice_date,
    material_name,
    item_code,
    hsn_code,
    division
  ) => {
    axiosGet
      .get(
        `billed_report_item?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&supplier_id=${supplier_id}&invoice_date=${invoice_date}&material_name=${material_name}&item_code=${item_code}&hsn_code=${hsn_code}&division=${division}`
      )
      .then((response) => {
        setpurchaseItemData(response.data.data);
        setloadingPage(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    HandleSupplierMaster();
    HandlePurchaseInvoice();
    HandleProductMaster();
    HandleDivisionMaster();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      SupplierID,
      invoiceName
    );
    fetchData2(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      invoiceTabTwoName,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      SupplierTabTwoID,
      invoiceTabTwoDate,
      productName,
      materialCode,
      hsnCode,
      divisionName
    );
  }, []);

  const [loadingPage, setloadingPage] = useState(true);

  const [tabsValue, settabsValue] = useState(1);


  const [SupplierMaster, setSupplierMaster] = useState([]);

  const HandleSupplierMaster = () => {
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
            setSupplierMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
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
          `mismatch_report?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&inwaed_entry_method=${5}`
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

  const [SupplierID, setSupplierID] = useState("");
  const [SupplierName, setSupplierName] = useState("");

  const handleSupplierChange = (event, value) => {
    if (value != null) {
      setSupplierID(value.data_uniq_id);
      setSupplierName(value.supplier_name);
    } else {
      setSupplierID("");
      setSupplierName("");
    }
  };

  const [invoiceName, setinvoiceName] = useState("");
  const handleInvoiceChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.pur_entry_number);
    } else {
      setinvoiceName("");
    }
  };

  const [invoiceDate, setinvoiceDate] = useState(
    moment("YYYY-MM-DD").format("YYYY-MM-DD")
  );

  const product_table = [
    { th: "#", id: "id", weigh: "2%", sub_item: [] },
    { th: "Supplier Name", id: "Supplier_name", weigh: "15%", sub_item: [] },
    { th: "Supplier Mobile", id: "Supplier_id", weigh: "12%", sub_item: [] },
    { th: "Location", id: "pur_invoice_id", weigh: "12%", sub_item: [] },
    {
      th: "Billed Number",
      id: "pur_entry_number",
      weigh: "6%",
      sub_item: [],
    },
    { th: "Invoice Date", id: "invoice_date", weigh: "8%", sub_item: [] },
    { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
    { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
    { th: "Status", id: "pur_invoice_status_org", weigh: "10%", sub_item: [] },
    { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
    { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
  ];

  const HandleOnSubmit = () => {
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      SupplierID,
      invoiceName
    );
  };

  const [dateTitle, setDateTitle] = useState("Invoice Date");

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
    setinvoiceName("");
    setSupplierID("");
    setSupplierName("");
    setinvoiceDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
    setCreatedStartDate("");
    setCreatedEndDate("");
    setIsDateSelected(false);
    setDateTitle("Invoice Date");
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      orderType,
      orderField,
      "",
      ""
    );
  };

  // Tab 2

  const [productName, setproductName] = useState("");

  const [hsnCode, sethsnCode] = useState("");

  const [materialCode, setmaterialCode] = useState("");

  const handleProductChange = (event, value) => {
    if (value != null) {
      setproductName(value.product_name);
      sethsnCode(value.hsn_code)
      setmaterialCode(value.item_code);
    } else {
      setproductName("");
      sethsnCode("")
      setmaterialCode("");
    }
  };

  const [divisionName, setdivisionName] = useState("");

  const handleDivisionChange = (event, value) => {
    if (value != null) {
      setdivisionName(value.division);
    } else {
      setdivisionName("");
    }
  };

  const [SupplierTabTwoID, setSupplierTabTwoID] = useState("");

  const [SupplierTabTwoName, setSupplierTabTwoName] = useState("");

  const handleSupplierTabTwoChange = (event, value) => {
    if (value != null) {
      setSupplierTabTwoID(value.data_uniq_id);
      setSupplierTabTwoName(value.supplier_name);
    } else {
      setSupplierTabTwoID("");
      setSupplierTabTwoName("");
    }
  };

  const [invoiceTabTwoName, setinvoiceTabTwoName] = useState("");

  const handleInvoiceTabTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTabTwoName(value.pur_entry_number);
    } else {
      setinvoiceTabTwoName("");
    }
  };

  const [invoiceTabTwoDate, setinvoiceTabTwoDate] = useState(
    moment("YYYY-MM-DD").format("YYYY-MM-DD")
  );


  const product_table_purchase_item = [
    { th: "#", id: "id", weigh: "2%", sub_item: [] },
    {
      th: "Supplier Name",
      id: "pur_invoice_material_id",
      weigh: "15%",
      sub_item: [],
    },
    { th: "Supplier Mobile", id: "pur_invoice_id", weigh: "12%", sub_item: [] },
    { th: "Location", id: "material_qty", weigh: "12%", sub_item: [] },
    { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
    { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
    { th: "Division", id: "division", weigh: "6%", sub_item: [] },
    { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
    { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
    { th: "Billed Number", id: "tcs_value", weigh: "6%", sub_item: [] },
    { th: "Invoice Date", id: "base_value", weigh: "8%", sub_item: [] },
    { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
    { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
    { th: "Status", id: "total_tax", weigh: "10%", sub_item: [] },
    { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
    { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
  ];

  const HandleOnSubmitItem = () => {
    setloadingPage(true);
    fetchData2(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      invoiceTabTwoName,
      createdItemStartDate,
      createdItemEndDate,
      orderType,
      orderField,
      SupplierTabTwoID,
      invoiceTabTwoDate,
      productName,
      materialCode,
      hsnCode,
      divisionName
    );
  };

  const [dateItemTitle, setDateItemTitle] = useState("Invoice Date");

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
    setinvoiceTabTwoName("");
    setproductName("");
    setSupplierTabTwoID("");
    setSupplierTabTwoName("");
    setinvoiceTabTwoDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
    setloadingPage(true);
    setcreatedItemStartDate("");
    setcreatedItemEndDate("");
    setIsDateItemSelected(false);
    setDateItemTitle("Invoice Date");
    setmaterialCode("");
    sethsnCode("");
    setdivisionName("");
    fetchData2(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      orderType,
      orderField,
      "",
      moment("YYYY-MM-DD").format("YYYY-MM-DD"),
      "",
      "",
      "",
      ""
    );
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
                  options={SupplierMaster}
                  value={
                    SupplierMaster.find(
                      (year) => year.supplier_name === SupplierName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleSupplierChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.supplier_name}
                  required
                  id="Supplier"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={SupplierName}
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
                      label="SupplierName"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={invoiceData}
                  value={
                    invoiceData?.find(
                      (year) => year.pur_entry_number === invoiceName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleInvoiceChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.pur_entry_number}
                  required
                  id="Supplier"
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
                      label="Billed Number"
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
            <ProductCreate product_table={product_table} orderMaterial={data} />
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
                  options={SupplierMaster}
                  value={
                    SupplierMaster.find(
                      (year) => year.supplier_name === SupplierTabTwoName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleSupplierTabTwoChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.supplier_name}
                  required
                  id="Supplier"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={SupplierTabTwoName}
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
                      label="SupplierName"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={invoiceData}
                  value={
                    invoiceData?.find(
                      (year) => year.pur_entry_number === invoiceTabTwoName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleInvoiceTabTwoChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.pur_entry_number}
                  required
                  id="Supplier"
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
                      label="Billed Number"
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
                  options={productMaster}
                  value={
                    productMaster.find(
                      (year) => year.product_name === productName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleProductChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.product_name}
                  required
                  id="Supplier"
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
                      label="Material Name"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={productMaster}
                  value={
                    productMaster.find(
                      (year) => year.item_code === materialCode
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleProductChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.item_code}
                  required
                  id="Supplier"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={materialCode}
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
                      label="Item Code"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={productMaster}
                  value={
                    productMaster.find(
                      (year) => year.hsn_code === hsnCode
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleProductChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.hsn_code}
                  required
                  id="Supplier"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={hsnCode}
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
                      label="HSN Code"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={divisionMaster}
                  value={
                    divisionMaster.find(
                      (year) => year.division === divisionName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleDivisionChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.division}
                  required
                  id="Supplier"
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
              </Box>
            </Stack>
          </Stack>
          <Box sx={{ padding: "10px" }}>
            <PurchaseItemReport
              product_table={product_table_purchase_item}
              orderMaterial={purchaseItemData}
            />
          </Box>
        </Box>
      );
    }
  };

  const TabContext = ({ value }) => {
    settabsValue(value);
    return <UserTable TableComponents={TableComponents} />;
  };

  const tabs = [
    {
      value: 1,
      name: "Billed Reports",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Billed Item Reports",
      content: <TabContext value={2} />,
    },
  ];

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
              Billed Reports
            </Typography>
          </div>
        </div>
        <Tabs tabs={tabs} />
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
