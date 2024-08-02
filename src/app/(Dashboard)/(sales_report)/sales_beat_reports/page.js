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
import SalesProductCreate from "../../components/sales_view/SaleReportCreate";
import PickProductCreate from "../../components/sales_view/PicklistReport";
import SalesInvoiceReturn from "../../components/sales_view/SalesReturnReports";
import SalesItemReport from "../../components/sales_view/SalesItemReport";
import PickItemsReport from "../../components/sales_view/PickItemsReport";
import SalesReturnItemReport from "../../components/sales_view/SalesReturnItemReport";
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

  const [requestMethod, setrequestMethod] = useState("sales_report");

  const [requestTwoMethod, setrequestTwoMethod] = useState("sales_report");

  const fetchData = async (
    access_token,
    limit,
    end,
    searchValue,
    createdStartDate,
    createdEndDate,
    order_type,
    order_field,
    salesman_id,
    table_name
  ) => {
    axiosGet
      .get(
        `beat_reports_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&sales_man_id=${salesman_id}&table_name=${table_name}`
      )
      .then((response) => {
        setData(response.data.data);
        setrequestMethod(RouteID);
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
    sales_man_id,
    table_name,
    material_name,
    item_code,
    hsn_code,
    division
  ) => {
    axiosGet
      .get(
        `beat_item_reports_get?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&sales_man_id=${sales_man_id}&table_name=${table_name}&material_name=${material_name}&item_code=${item_code}&hsn_code=${hsn_code}&division=${division}`
      )
      .then((response) => {
        setpurchaseItemData(response.data.data);
        setrequestTwoMethod(RouteTwoID);
        setloadingPage(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    HandleSalesmanMaster();
    HandlePurchaseInvoice();
    HandleInvoiceReplacement();
    HandleDamageGoods();
    HandleInvoiceReturn();
    HandlePickInvoice();
    HandleProductMaster();
    HandleDivisionMaster();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      invoiceName,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      SalesmanID,
      RouteID
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
      SalesmanTabTwoID,
      RouteTwoID,
      productName,
      materialCode,
      hsnCode,
      divisionName
    );
  }, []);

  const [loadingPage, setloadingPage] = useState(true);

  const [tabsValue, settabsValue] = useState(1);

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
          `route_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setSalesmanMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  const [RouteID, setRouteID] = useState("sales_report");

  const [routeName, setRoueName] = useState("Sales Report");

  const handleRouteChange = (event, value) => {
    if (value != null) {
      setRouteID(value.value);
      setRoueName(value.lable);
    } else {
      setRouteID("sales_report");
      setRoueName("Sales Report");
    }
  };

  const Salesman_Reports = [
    { lable: "Sales Report", value: "sales_report" },
    { lable: "Picklist Report", value: "picklist_report" },
    { lable: "Return Report", value: "invoice_return_report" },
    {
      lable: "Replacement Report",
      value: "invoice_replacement_report",
    },
    { lable: "D&D Report", value: "damage_goods_report" },
  ];

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
          `sales_invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
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

  const [pickListData, setpickListData] = useState([]);

  const HandlePickInvoice = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate,
      pick_list_number
    ) => {
      axiosGet
        .get(
          `sales_pick_list_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&pick_list_number=${pick_list_number}`
        )
        .then((response) => {
          setpickListData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [invoiceReturnData, setinvoiceReturnData] = useState([]);

  const HandleInvoiceReturn = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `sales_return_reports_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&return_method=${0}`
        )
        .then((response) => {
          setinvoiceReturnData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [invoiceReplacementData, setinvoiceReplacementData] = useState([]);

  const HandleInvoiceReplacement = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `sales_return_reports_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&return_method=${1}`
        )
        .then((response) => {
          setinvoiceReplacementData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [damageGoodsData, setdamageGoodsData] = useState([]);

  const HandleDamageGoods = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `sales_return_reports_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&return_method=${2}`
        )
        .then((response) => {
          setdamageGoodsData(response.data.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [SalesmanID, setSalesmanID] = useState("");

  const [salesmanName, setSalesmanName] = useState("");

  const handleSalesmanChange = (event, value) => {
    if (value != null) {
      setSalesmanID(value.data_uniq_id);
      setSalesmanName(value.route);
    } else {
      setSalesmanID("");
      setSalesmanName("");
    }
  };

  const [invoiceName, setinvoiceName] = useState("");

  const handleInvoiceChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.sales_invoice_number);
    } else {
      setinvoiceName("");
    }
  };

  const handlePickListChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.pick_list_number);
    } else {
      setinvoiceName("");
    }
  };

  const handleReturnChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.sales_return_number);
    } else {
      setinvoiceName("");
    }
  };

  const [invoiceNameChance, setinvoiceNameChance] = useState("");

  const handleDamgeChange = (event, value) => {
    if (value != null) {
      setinvoiceName(value.data_uniq_id);
      setinvoiceNameChance(value.sales_return_number);
    } else {
      setinvoiceName("");
      setinvoiceNameChance("");
    }
  };

  const [invoiceDate, setinvoiceDate] = useState(
    moment("YYYY-MM-DD").format("YYYY-MM-DD")
  );

  let product_table = [];

  if (requestMethod === "sales_report") {
    product_table = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      { th: "Customer Name", id: "customer_name", weigh: "15%", sub_item: [] },
      { th: "Customer Mobile", id: "customer_id", weigh: "12%", sub_item: [] },
      { th: "Location", id: "sal_invoice_id", weigh: "12%", sub_item: [] },
      {
        th: "GST Number",
        id: "sal_invoice_status",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      {
        th: "Invoice Number",
        id: "sales_invoice_number",
        weigh: "6%",
        sub_item: [],
      },
      { th: "Invoice Date", id: "invoice_date", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      {
        th: "Status",
        id: "sal_invoice_status_org",
        weigh: "10%",
        sub_item: [],
      },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestMethod === "picklist_report") {
    product_table = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      { th: "Salesman Name", id: "salesman_id", weigh: "15%", sub_item: [] },
      { th: "Salesman Mobile", id: "salesman_no", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      {
        th: "Picklist Number",
        id: "pick_list_number",
        weigh: "12%",
        sub_item: [],
      },
      {
        th: "Vehicle Number",
        id: "vechicle_no",
        weigh: "6%",
        sub_item: [],
      },
      { th: "Driver Name", id: "driver_name", weigh: "8%", sub_item: [] },
      { th: "Driver No", id: "driver_no", weigh: "12%", sub_item: [] },
      { th: "Delivery Date", id: "delivery_date", weigh: "12%", sub_item: [] },
      { th: "Created Date", id: "created_date", weigh: "10%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "10%", sub_item: [] },
      { th: "Status", id: "status", weigh: "8%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestMethod === "invoice_return_report") {
    product_table = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      { th: "Customer Name", id: "customer_name", weigh: "15%", sub_item: [] },
      { th: "Customer Mobile", id: "customer_id", weigh: "12%", sub_item: [] },
      { th: "Location", id: "sal_invoice_id", weigh: "12%", sub_item: [] },
      {
        th: "GST Number",
        id: "gst_no",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      {
        th: "Return Number",
        id: "sales_return_number",
        weigh: "6%",
        sub_item: [],
      },
      { th: "Return Date", id: "return_date", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestMethod === "invoice_replacement_report") {
    product_table = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      { th: "Customer Name", id: "customer_name", weigh: "15%", sub_item: [] },
      { th: "Customer Mobile", id: "customer_id", weigh: "12%", sub_item: [] },
      { th: "Location", id: "sal_invoice_id", weigh: "12%", sub_item: [] },
      {
        th: "GST Number",
        id: "gst_no",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      {
        th: "Return Number",
        id: "sales_return_number",
        weigh: "6%",
        sub_item: [],
      },
      { th: "Return Date", id: "return_date", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestMethod === "damage_goods_report") {
    product_table = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      { th: "Customer Name", id: "customer_name", weigh: "15%", sub_item: [] },
      { th: "Customer Mobile", id: "customer_id", weigh: "12%", sub_item: [] },
      { th: "Location", id: "sal_invoice_id", weigh: "12%", sub_item: [] },
      {
        th: "GST Number",
        id: "gst_no",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      {
        th: "Return Number",
        id: "sales_return_number",
        weigh: "6%",
        sub_item: [],
      },
      { th: "Return Date", id: "return_date", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "sub_total", weigh: "8%", sub_item: [] },
    ];
  }

  const HandleOnSubmit = () => {
    if (requestMethod === RouteID) {
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        invoiceName,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        SalesmanID,
        RouteID
      );
    } else {
      setinvoiceName("");
      setSalesmanID("");
      setSalesmanName("");
      setinvoiceDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
      setCreatedStartDate(""), setCreatedEndDate("");
      setIsDateSelected(false);
      setinvoiceNameChance("");
      setDateTitle("Date");
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
        RouteID
      );
    }
  };

  const [dateTitle, setDateTitle] = useState("Date");

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
    setSalesmanID("");
    setSalesmanName("");
    setinvoiceDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
    setCreatedStartDate(""), setCreatedEndDate("");
    setIsDateSelected(false);
    setinvoiceNameChance("");
    setDateTitle("Date");
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
      RouteID
    );
  };

  // Tab 2

  const [RouteTwoID, setRouteTwoID] = useState("sales_report");

  const [routeTwoName, setrouteTwoName] = useState("Sales Report");

  const handleRouteTwoChange = (event, value) => {
    if (value != null) {
      setRouteTwoID(value.value);
      setrouteTwoName(value.lable);
    } else {
      setRouteTwoID("sales_report");
      setrouteTwoName("Sales Report");
    }
  };

  const [productName, setproductName] = useState("");

  const [hsnCode, sethsnCode] = useState("");

  const [materialCode, setmaterialCode] = useState("");

  const handleProductChange = (event, value) => {
    if (value != null) {
      setproductName(value.product_name);
      sethsnCode(value.hsn_code);
      setmaterialCode(value.item_code);
    } else {
      setproductName("");
      sethsnCode("");
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

  const [SalesmanTabTwoID, setSalesmanTabTwoID] = useState("");

  const [SalesmanTabTwoName, setSalesmanTabTwoName] = useState("");

  const handleSalesmanTabTwoChange = (event, value) => {
    if (value != null) {
      setSalesmanTabTwoID(value.data_uniq_id);
      setSalesmanTabTwoName(value.route);
    } else {
      setSalesmanTabTwoID("");
      setSalesmanTabTwoName("");
    }
  };

  const [invoiceTabTwoName, setinvoiceTabTwoName] = useState("");

  const handleInvoiceTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTabTwoName(value.sales_invoice_number);
    } else {
      setinvoiceTabTwoName("");
    }
  };

  const handlePickListTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTabTwoName(value.pick_list_number);
    } else {
      setinvoiceTabTwoName("");
    }
  };

  const handleReturnTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTabTwoName(value.sales_return_number);
    } else {
      setinvoiceTabTwoName("");
    }
  };

  const [invoiceNameTwoChance, setinvoiceNameTwoChance] = useState("");

  const handleDamgeTwoChange = (event, value) => {
    if (value != null) {
      setinvoiceTabTwoName(value.data_uniq_id);
      setinvoiceNameTwoChance(value.sales_return_number);
    } else {
      setinvoiceTabTwoName("");
      setinvoiceNameTwoChance("");
    }
  };

  const [invoiceTabTwoDate, setinvoiceTabTwoDate] = useState(
    moment("YYYY-MM-DD").format("YYYY-MM-DD")
  );

  let product_table_purchase_item = [];

  if (requestTwoMethod === "sales_report") {
    product_table_purchase_item = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      {
        th: "Customer Name",
        id: "data_uniq_id",
        weigh: "15%",
        sub_item: [],
      },
      {
        th: "Customer Mobile",
        id: "sal_invoice_id",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Location", id: "material_qty", weigh: "12%", sub_item: [] },
      { th: "GST Number", id: "igst_value", weigh: "12%", sub_item: [] },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
      { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
      { th: "Division", id: "division", weigh: "6%", sub_item: [] },
      { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
      { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
      { th: "Invoice Number", id: "tcs_value", weigh: "6%", sub_item: [] },
      { th: "Invoice Date", id: "base_value", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Status", id: "total_tax", weigh: "10%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestTwoMethod === "picklist_report") {
    product_table_purchase_item = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      {
        th: "Salesman Name",
        id: "pur_invoice_material_id",
        weigh: "15%",
        sub_item: [],
      },
      {
        th: "Salesman Mobile",
        id: "sal_invoice_id",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Route", id: "material_qty", weigh: "12%", sub_item: [] },
      { th: "Picklist Number", id: "igst_value", weigh: "12%", sub_item: [] },
      { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
      { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
      { th: "Division", id: "division", weigh: "6%", sub_item: [] },
      { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
      { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
      { th: "Vehicle Number", id: "tcs_value", weigh: "6%", sub_item: [] },
      { th: "Delivery Date", id: "base_value", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Status", id: "total_tax", weigh: "10%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestTwoMethod === "invoice_return_report") {
    product_table_purchase_item = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      {
        th: "Customer Name",
        id: "pur_invoice_material_id",
        weigh: "15%",
        sub_item: [],
      },
      {
        th: "customer Mobile",
        id: "sal_invoice_id",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Location", id: "material_qty", weigh: "12%", sub_item: [] },
      { th: "GST Number", id: "igst_value", weigh: "12%", sub_item: [] },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
      { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
      { th: "Division", id: "division", weigh: "6%", sub_item: [] },
      { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
      { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
      { th: "Return Number", id: "tcs_value", weigh: "6%", sub_item: [] },
      { th: "Return Date", id: "base_value", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestTwoMethod === "invoice_replacement_report") {
    product_table_purchase_item = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      {
        th: "Customer Name",
        id: "pur_invoice_material_id",
        weigh: "15%",
        sub_item: [],
      },
      {
        th: "customer Mobile",
        id: "sal_invoice_id",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Location", id: "material_qty", weigh: "12%", sub_item: [] },
      { th: "GST Number", id: "igst_value", weigh: "12%", sub_item: [] },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
      { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
      { th: "Division", id: "division", weigh: "6%", sub_item: [] },
      { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
      { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
      { th: "Return Number", id: "tcs_value", weigh: "6%", sub_item: [] },
      { th: "Return Date", id: "base_value", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
    ];
  }

  if (requestTwoMethod === "damage_goods_report") {
    product_table_purchase_item = [
      { th: "#", id: "id", weigh: "2%", sub_item: [] },
      {
        th: "Customer Name",
        id: "pur_invoice_material_id",
        weigh: "15%",
        sub_item: [],
      },
      {
        th: "customer Mobile",
        id: "sal_invoice_id",
        weigh: "12%",
        sub_item: [],
      },
      { th: "Location", id: "material_qty", weigh: "12%", sub_item: [] },
      { th: "GST Number", id: "igst_value", weigh: "12%", sub_item: [] },
      { th: "Salesman Name", id: "sales_man_name", weigh: "12%", sub_item: [] },
      { th: "Route", id: "route_id", weigh: "12%", sub_item: [] },
      { th: "Material Name", id: "material_name", weigh: "6%", sub_item: [] },
      { th: "Item Code", id: "material_code", weigh: "6%", sub_item: [] },
      { th: "Division", id: "division", weigh: "6%", sub_item: [] },
      { th: "HSN Number", id: "hsn_code", weigh: "6%", sub_item: [] },
      { th: "Batch Number", id: "batch_number", weigh: "6%", sub_item: [] },
      { th: "Return Number", id: "tcs_value", weigh: "6%", sub_item: [] },
      { th: "Return Date", id: "base_value", weigh: "8%", sub_item: [] },
      { th: "Created Date", id: "created_f_date", weigh: "12%", sub_item: [] },
      { th: "Created By", id: "created_by", weigh: "12%", sub_item: [] },
      { th: "Total Quantity", id: "total_qty", weigh: "8%", sub_item: [] },
      { th: "Total Amount", id: "total_amount", weigh: "8%", sub_item: [] },
    ];
  }

  const HandleOnSubmitItem = () => {
    setloadingPage(true);
    if (requestTwoMethod === RouteTwoID) {
      fetchData2(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        invoiceTabTwoName,
        createdItemStartDate,
        createdItemEndDate,
        orderType,
        orderField,
        SalesmanTabTwoID,
        RouteTwoID,
        productName,
        materialCode,
        hsnCode,
        divisionName
      );
    } else {
      setinvoiceTabTwoName("");
      setproductName("");
      setSalesmanTabTwoID("");
      setSalesmanTabTwoName("");
      setinvoiceNameTwoChance("");
      setinvoiceTabTwoDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
      setloadingPage(true);
      setcreatedItemStartDate(""), setcreatedItemEndDate("");
      setIsDateItemSelected(false);
      setDateItemTitle("Date");
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
        RouteTwoID,
        "",
        "",
        "",
        ""
      );
    }
  };

  const [dateItemTitle, setDateItemTitle] = useState("Date");

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
    setSalesmanTabTwoID("");
    setSalesmanTabTwoName("");
    setinvoiceNameTwoChance("");
    setinvoiceTabTwoDate(moment("YYYY-MM-DD").format("YYYY-MM-DD"));
    setloadingPage(true);
    setcreatedItemStartDate(""), setcreatedItemEndDate("");
    setIsDateItemSelected(false);
    setDateItemTitle("Date");
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
      RouteTwoID,
      "",
      "",
      "",
      ""
    );
  };

  let totalPayable = 0;
  data?.forEach((item) => {
    totalPayable += item.sub_total || 0;
  });

  let totalQuantity = 0;
  data?.forEach((item) => {
    totalQuantity += item.total_qty || 0;
  });

  let totalTwoPayable = 0;
  purchaseItemData?.forEach((item) => {
    totalTwoPayable += item.total_amount || 0;
  });

  let totalTwoQuantity = 0;
  purchaseItemData?.forEach((item) => {
    totalTwoQuantity += item.total_qty || 0;
  });

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
                  options={SalesmanMaster}
                  value={
                    SalesmanMaster.find(
                      (year) => year.route === salesmanName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleSalesmanChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.route}
                  required
                  id="Salesman"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={salesmanName}
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
                      label="Route Name"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              {requestMethod === "sales_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceData}
                    value={
                      invoiceData.find(
                        (year) => year.sales_invoice_number === invoiceName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleInvoiceChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_invoice_number}
                    required
                    id="customer"
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
              )}
              {requestMethod === "picklist_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={pickListData}
                    value={
                      pickListData?.find(
                        (year) => year.pick_list_number === invoiceName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handlePickListChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.pick_list_number}
                    required
                    id="Salesman"
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
                </Box>
              )}
              {requestMethod === "invoice_return_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceReturnData}
                    value={
                      invoiceReturnData?.find(
                        (year) => year.sales_return_number === invoiceName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleReturnChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
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
                        label="Return Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              {requestMethod === "invoice_replacement_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceReplacementData}
                    value={
                      invoiceReplacementData?.find(
                        (year) => year.sales_return_number === invoiceName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleReturnChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
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
                        label="Replacement Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              {requestMethod === "damage_goods_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={damageGoodsData}
                    value={
                      damageGoodsData?.find(
                        (year) => year.sales_return_number === invoiceNameChance
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleDamgeChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceNameChance}
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
                        label="D&D Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={Salesman_Reports}
                  value={
                    Salesman_Reports.find((year) => year.lable === routeName) ||
                    null
                  }
                  onChange={(e, value) =>
                    handleRouteChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.lable}
                  required
                  id="Salesman"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={routeName}
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
                      label="Report Method"
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
            {requestMethod === "sales_report" && (
              <SalesProductCreate
                product_table={product_table}
                orderMaterial={data}
                total_amount={totalPayable}
                total_quantity={totalQuantity}
              />
            )}
            {requestMethod === "picklist_report" && (
              <PickProductCreate
                product_table={product_table}
                orderMaterial={data}
                total_amount={totalPayable}
                total_quantity={totalQuantity}
              />
            )}
            {requestMethod === "invoice_return_report" && (
              <SalesInvoiceReturn
                product_table={product_table}
                orderMaterial={data}
                total_amount={totalPayable}
                total_quantity={totalQuantity}
              />
            )}
            {requestMethod === "invoice_replacement_report" && (
              <SalesInvoiceReturn
                product_table={product_table}
                orderMaterial={data}
                total_amount={totalPayable}
                total_quantity={totalQuantity}
              />
            )}
            {requestMethod === "damage_goods_report" && (
              <SalesInvoiceReturn
                product_table={product_table}
                orderMaterial={data}
                total_amount={totalPayable}
                total_quantity={totalQuantity}
              />
            )}
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
                  options={SalesmanMaster}
                  value={
                    SalesmanMaster.find(
                      (year) => year.route === SalesmanTabTwoName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleSalesmanTabTwoChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.route}
                  required
                  id="Salesman"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={SalesmanTabTwoName}
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
                      label="Route Name"
                    />
                  )}
                  clearIcon={null}
                />
              </Box>
              {requestTwoMethod === "sales_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceData}
                    value={
                      invoiceData.find(
                        (year) =>
                          year.sales_invoice_number === invoiceTabTwoName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleInvoiceTwoChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_invoice_number}
                    required
                    id="customer"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceTabTwoName}
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
              )}
              {requestTwoMethod === "picklist_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={pickListData}
                    value={
                      pickListData?.find(
                        (year) => year.pick_list_number === invoiceTabTwoName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handlePickListTwoChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.pick_list_number}
                    required
                    id="Salesman"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceTabTwoName}
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
                </Box>
              )}
              {requestTwoMethod === "invoice_return_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceReturnData}
                    value={
                      invoiceReturnData?.find(
                        (year) => year.sales_return_number === invoiceTabTwoName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleReturnTwoChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceTabTwoName}
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
                        label="Return Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              {requestTwoMethod === "invoice_replacement_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={invoiceReplacementData}
                    value={
                      invoiceReplacementData?.find(
                        (year) => year.sales_return_number === invoiceTabTwoName
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleReturnTwoChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceTabTwoName}
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
                        label="Replacement Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              {requestTwoMethod === "damage_goods_report" && (
                <Box sx={{ mt: 1 }}>
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "0px" }}
                    options={damageGoodsData}
                    value={
                      damageGoodsData?.find(
                        (year) =>
                          year.sales_return_number === invoiceNameTwoChance
                      ) || null
                    }
                    onChange={(e, value) =>
                      handleDamgeTwoChange(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.sales_return_number}
                    required
                    id="Salesman"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={invoiceNameTwoChance}
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
                        label="D&D Number"
                      />
                    )}
                    clearIcon={null}
                  />
                </Box>
              )}
              <Box sx={{ mt: 1 }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px" }}
                  options={Salesman_Reports}
                  value={
                    Salesman_Reports.find(
                      (year) => year.lable === routeTwoName
                    ) || null
                  }
                  onChange={(e, value) =>
                    handleRouteTwoChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.lable}
                  required
                  id="Salesman"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={routeTwoName}
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
                      label="Report Method"
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
                  id="Salesman"
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
                  id="Salesman"
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
                    productMaster.find((year) => year.hsn_code === hsnCode) ||
                    null
                  }
                  onChange={(e, value) =>
                    handleProductChange(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.hsn_code}
                  required
                  id="Salesman"
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
                  id="Salesman"
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
            {requestTwoMethod === "sales_report" && (
              <SalesItemReport
                product_table={product_table_purchase_item}
                orderMaterial={purchaseItemData}
                total_amount={totalTwoPayable}
                total_quantity={totalTwoQuantity}
              />
            )}
            {requestTwoMethod === "picklist_report" && (
              <PickItemsReport
                product_table={product_table_purchase_item}
                orderMaterial={purchaseItemData}
                total_amount={totalTwoPayable}
                total_quantity={totalTwoQuantity}
              />
            )}
            {requestTwoMethod === "invoice_return_report" && (
              <SalesReturnItemReport
                product_table={product_table_purchase_item}
                orderMaterial={purchaseItemData}
                total_amount={totalTwoPayable}
                total_quantity={totalTwoQuantity}
              />
            )}
            {requestTwoMethod === "invoice_replacement_report" && (
              <SalesReturnItemReport
                product_table={product_table_purchase_item}
                orderMaterial={purchaseItemData}
                total_amount={totalTwoPayable}
                total_quantity={totalTwoQuantity}
              />
            )}
            {requestTwoMethod === "damage_goods_report" && (
              <SalesReturnItemReport
                product_table={product_table_purchase_item}
                orderMaterial={purchaseItemData}
                total_amount={totalTwoPayable}
                total_quantity={totalTwoQuantity}
              />
            )}
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
      name: "Beat Reports",
      content: <TabContext value={1} />,
    },
    {
      value: 2,
      name: "Beat Item Reports",
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
              Beat Reports
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
