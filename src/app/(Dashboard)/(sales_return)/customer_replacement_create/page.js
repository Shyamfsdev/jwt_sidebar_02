"use client";
import {
  Grid,
  Box,
  Typography,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  Avatar,
  Paper,
  IconButton,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Divider,
  Menu,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRouter } from "next/navigation";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosPost, axiosGet } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProductCreate from "../../components/product_create/SalesReturnCreate";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import TotalAmount from "../../components/buttons/TotalAmount";
import moment from "moment";
import VehicleCreate from "../../components/histroy/VehicleReturns";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PurchaseLayout from "../../components/createlayout/PurchaseLayout";
import PurchaseInvoiceTax from "../../components/tax_components/PurchaseInvoiceTax";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const DATA_UNIQ_ID = Cookies.get("data_uniq_id");
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };
  const handleRouteChange = (event, value, type) => {
    if (type === "route") {
      setRouteName(value?.routeName || null);
    } else if (type === "salesman") {
      setsalesManName(value?.salesManName || null);
    }
  };
  const [companyName, setCompanyName] = useState("");
  const [driverNo, setDriverNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [drivernameDetails, setdriverDetails] = useState("");
  const [routeName, setRouteName] = useState("");
  const [routeID, setRouteID] = useState("");
  const [salesManName, setsalesManName] = useState("");
  const [salesManID, setsalesManID] = useState("");

  const [returnDate, setreturnDate] = useState("");

  const GetFetData = () => {
    setloadingPage(true);
    const fetchData = async (access_token, data_uniq_id) => {
      axiosGet
        .get(
          `sales_invoice_details_get?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
        )
        .then((response) => {
          const data =
            response.data.data[0]?.customer_data?.route_details || [];
          setcustomerID(response.data.data[0]?.customer_id);
          setcustomerName(response.data.data[0]?.customer_name);
          setcustomerDataValue(response.data.data[0]?.customer_data);
          setcustomerAddress(response.data.data[0]?.customer_data?.address);
          setcustomerEmail(response.data.data[0]?.customer_data?.email_id);
          setcustomerGst(response.data.data[0]?.customer_data?.gst_no);
          setcustomerMobile(
            response.data.data[0]?.customer_data?.contact_number
          );
          setinvoiceNumber(response.data.data[0]?.sal_invoice_number);
          setreturnDate(response.data.data[0]?.invoice_date);
          setsifyinvoiceNumber(response.data.data[0]?.sify_invoice_number);
          setsifydocNumber(response.data.data[0]?.sify_doc_number);
          setRouteName(response.data.data[0]?.route_name);
          setRouteID(response.data.data[0]?.route_id);
          setsalesManName(response.data.data[0]?.sales_man_name);
          setsalesManID(response.data.data[0]?.sales_man_id);
          const unique_route_data = data.filter(
            (route, index, self) =>
              index === self.findIndex((r) => r.routeName === route.routeName)
          );
          setrouteData(unique_route_data);
          setcustomerSalesName(
            response.data.data[0]?.customer_data?.route_details[0]?.salesManName
          );
          setcustomerRoute(
            response.data.data[0]?.customer_data?.route_details[0]?.routeName
          );
          setDivision(
            response.data.data[0]?.customer_data?.route_details[0]?.divisionName
          );
          const order_material = [];
          response.data.data[0]?.invoice_material_details.map((item) => {
            const order_list = {
              material_code: item.material_code,
              material_id: item.material_id,
              material_name: item.material_name,
              division_id: item.division_id,
              division_name: item.division,
              division_id: item.division_id,
              route_id: item.route_id,
              route_name: item.route_name,
              uom: item.uom,
              uom_list: item.uom_list === undefined ? [] : item.uom_list,
              batch_number: item.batch_number,
              batch_id: item.batch_id === undefined ? "" : item.batch_id,
              batch_list: item.batch_list === undefined ? [] : item.batch_list,
              free_stock: item.free_stock === undefined ? 0 : item.free_stock,
              new_batch_value:
                item.new_batch_value === undefined ? "" : item.new_batch_value,
              hsn_code: item.hsn_code,
              material_qty: item.material_qty,
              base_value: item.base_value,
              trade_discount:
                item.trade_discount === undefined ? "" : item.trade_discount,
              cgst_rate: item.cgst_rate,
              cgst_value: item.cgst_value,
              sgst_rate: item.sgst_rate,
              sgst_value: item.sgst_value,
              cess_rate: item.cess_rate,
              cess_value: item.cess_value,
              additional_cess_rate:
                item.additional_cess_value / item.material_qty,
              additional_cess_value: item.additional_cess_value,
              total_tax: item.total_tax,
              tcs_rate: item.tcs_rate,
              tcs_value: item.tcs_value,
              total_payable: item.total_amount,
              return_qty: "",
            };
            order_material.push(order_list);
          });
          if (order_material.length !== 0) {
            setorderMaterial(order_material);
          }
          setloadingPage(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData(ACCESS_TOKEN, DATA_UNIQ_ID);
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

  const [routeMaster, setrouteMaster] = useState([]);

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
            setrouteMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [salesmanMaster, setsalesmanMaster] = useState([]);

  const HandlesalesmanMaster = () => {
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
            setsalesmanMaster(res.data.data);
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

  const [customerMaster, setcustomerMaster] = useState([]);

  const HandleCustomerMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `customer_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setcustomerMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  useEffect(() => {
    HandleProductMaster();
    HandleCustomerMaster();
    HandleDivisionMaster();
    HandlesalesmanMaster();
    HandleRouteMaster();
    GetFetData();
  }, []);

  const router = useRouter();

  const [vehicleDetails, setvehicleDetails] = useState({
    company_name: "",
    vehicle_number: "",
    driver_name: "",
    driver_mobile: "+91 ",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const [isRouteEditing, setIsRouteEditing] = useState(false);

  const handleRouteEditClick = () => {
    setIsRouteEditing(true);
  };
  const handleCloseClick = () => {
    setIsEditing(false);
  };

  const handleVehicleDetailsChange = (event) => {
    const { name, value } = event.target;
    setvehicleDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const HandleVehicleDetails = (event) => {
    if (event.target.name == "driver_mobile") {
      const regex = /^\+91\s\d{0,10}?$/;
      if (regex.test(event.target.value)) {
        setvehicleDetails((prevState) => ({
          ...prevState,
          [event.target.name]: event.target.value,
        }));
      }
    } else {
      setvehicleDetails((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const product_table = [
    { th: "#", id: "id", weigh: "3%", sub_item: [] },
    { th: "Material Code", id: "material_code", weigh: "15%", sub_item: [] },
    { th: "Material Name", id: "material_name", weigh: "20%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "12%", sub_item: [] },
    { th: "Batch No.", id: "batch_number", weigh: "17%", sub_item: [] },
    { th: "Material Qty", id: "qty", weigh: "14%", sub_item: [] },
    { th: "Replacement Quantity", id: "return_qty", weigh: "6%", sub_item: [] },
    { th: "Sales Value", id: "base_value", weigh: "12%", sub_item: [] },
    { th: "Trade Discount", id: "trade_discount", weigh: "8%", sub_item: [] },
    { th: "Remove", id: "action", weigh: "3%", sub_item: [] },
  ];

  const [orderMaterial, setorderMaterial] = useState([
    {
      material_code: "",
      material_id: "",
      material_name: "",
      division_id: "",
      division_name: "",
      route_id: "",
      route_name: "",
      sales_man_name: "",
      sales_man_id: "",
      uom: "",
      uom_list: [],
      batch_number: "",
      batch_id: "",
      batch_list: [],
      free_stock: 0,
      hsn_code: "",
      new_batch_value: false,
      material_qty: "",
      base_value: "",
      trade_discount: "",
      trade_discount_value: "",
      cgst_rate: "",
      cgst_value: "",
      sgst_rate: "",
      sgst_value: "",
      cess_rate: "",
      cess_value: "",
      additional_cess_rate: "",
      additional_cess_value: "",
      total_tax: "",
      tcs_rate: "",
      tcs_value: "",
      total_payable: "",
      return_qty: "",
    },
  ]);

  const handleAddProductDetails = () => {
    setorderMaterial([
      ...orderMaterial,
      {
        material_code: "",
        material_id: "",
        material_name: "",
        division_id: "",
        division_name: "",
        route_id: "",
        route_name: "",
        sales_man_name: "",
        sales_man_id: "",
        uom: "",
        uom_list: [],
        batch_number: "",
        batch_id: "",
        batch_list: [],
        free_stock: 0,
        hsn_code: "",
        new_batch_value: false,
        material_qty: "",
        base_value: "",
        trade_discount: "",
        trade_discount_value: "",
        cgst_rate: "",
        cgst_value: "",
        sgst_rate: "",
        sgst_value: "",
        cess_rate: "",
        cess_value: "",
        additional_cess_rate: "",
        additional_cess_value: "",
        total_tax: "",
        tcs_rate: "",
        tcs_value: "",
        total_payable: "",
        return_qty: "",
      },
    ]);
  };

  const handleRemoveProductDetails = (index) => {
    if (orderMaterial.length > 1) {
      const newErningDetails = [...orderMaterial];
      newErningDetails.splice(index, 1);
      setorderMaterial(newErningDetails);
      setfocusIndexNumber(0);
    }
  };

  const HandleProductMasterCode = (index, value) => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate,
      material_code
    ) => {
      axiosGet
        .get(
          `product_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}&material_code=${material_code}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setproductMaster(res.data.data);
            if (
              res.data?.data.length !== 0 &&
              value !== "" &&
              value !== undefined
            ) {
              const value = res.data?.data[0];
              const newfield = [...orderMaterial];
              newfield[index].material_id = value.data_uniq_id;
              newfield[index].material_name = value.product_name;
              newfield[index].uom = value.uom;
              newfield[index].division_name = value.division_list?.division;
              newfield[index].division_id = value.division;
              newfield[index].batch_list = value.batch_details;
              newfield[index].hsn_code = value.hsn_code;
              newfield[index].base_value = value.base_value;
              newfield[index].free_stock = value.free_stock;
              const base_value = Number(newfield[index].base_value) || 0;
              const material_qty = Number(newfield[index].material_qty) || 0;
              const trade_discount =
                Number(newfield[index].trade_discount) || 0;
              const gst_tax_value = value.tax / 2;
              newfield[index].cgst_rate = gst_tax_value;
              newfield[index].sgst_rate = gst_tax_value;
              newfield[index].cess_rate = value.cess;
              newfield[index].additional_cess_rate = value.addtional_cess_value;
              const additional_cess_rate =
                value.addtional_cess_value * material_qty;
              newfield[index].additional_cess_value = additional_cess_rate;
              newfield[index].tcs_rate = 0;
              newfield[index].tcs_value = 0;
              const total_amount = base_value * material_qty - trade_discount;
              const gst_value = (Number(gst_tax_value) / 100) * total_amount;
              const cess_value = (Number(value.cess) / 100) * total_amount;
              newfield[index].sgst_value = gst_value;
              newfield[index].cgst_value = gst_value;
              newfield[index].cess_value = cess_value.toFixed(2);
              const invoice_tax =
                gst_value +
                gst_value +
                cess_value +
                Number(additional_cess_rate) +
                0;
              newfield[index].total_tax = invoice_tax;
              if (newfield[index].free_stock === 0) {
                newfield[index].total_payable =
                  total_amount + Number(invoice_tax);
              } else {
                newfield[index].total_payable = 0;
              }
              let seen = new Set();
              let filteredUOMData = value?.uom_details?.filter((item) => {
                if (item.uomName && !seen.has(item.uomName)) {
                  seen.add(item.uomName);
                  return true;
                }
                return false;
              });
              if (filteredUOMData.length === 0) {
                newfield[index].uom_list = [
                  { uomName: value.uom, per_value: 1 },
                ];
              } else {
                newfield[index].uom_list = filteredUOMData;
              }

              setorderMaterial(newfield);
            } else {
              const value = res.data?.data[0];
              const newfield = [...orderMaterial];
              newfield[index].material_id = "";
              newfield[index].material_name = "";
              newfield[index].uom = "";
              newfield[index].division_name = "";
              newfield[index].division_id = "";
              newfield[index].batch_list = [];
              newfield[index].hsn_code = "";
              newfield[index].base_value = "";
              newfield[index].free_stock = 0;
              const base_value = Number(newfield[index].base_value) || 0;
              const material_qty = Number(newfield[index].material_qty) || 0;
              const trade_discount =
                Number(newfield[index].trade_discount) || 0;
              const gst_tax_value = 0;
              newfield[index].cgst_rate = gst_tax_value;
              newfield[index].sgst_rate = gst_tax_value;
              newfield[index].cess_rate = 0;
              newfield[index].additional_cess_value = 0;
              newfield[index].additional_cess_rate = 0;
              newfield[index].tcs_rate = 0;
              newfield[index].tcs_value = 0;
              const total_amount = base_value * material_qty - trade_discount;
              const gst_value = (Number(gst_tax_value) / 100) * total_amount;
              const cess_value = (Number(0) / 100) * total_amount;
              newfield[index].sgst_value = gst_value;
              newfield[index].cgst_value = gst_value;
              newfield[index].cess_value = cess_value;
              const invoice_tax =
                gst_value + gst_value + cess_value + Number(0) + 0;
              newfield[index].total_tax = invoice_tax;
              if (newfield[index].free_stock === 0) {
                newfield[index].total_payable =
                  total_amount + Number(invoice_tax);
              } else {
                newfield[index].total_payable = 0;
              }
              newfield[index].uom_list = [];
              setorderMaterial(newfield);
            }
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "", value);
  };

  const handleProductChange = (event, value, index, ref) => {
    const newfield = [...orderMaterial];
    if (value !== undefined && value !== null) {
      if (ref == "material_name") {
        newfield[index].material_id = value.data_uniq_id;
        newfield[index].material_name = value.product_name;
        newfield[index].uom = value.uom;
        newfield[index].material_code = value.item_code;
        newfield[index].division_name = value.division_list?.division;
        newfield[index].division_id = value.division;
        newfield[index].batch_list = value.batch_details;
        newfield[index].hsn_code = value.hsn_code;
        newfield[index].base_value = value.base_value;
        newfield[index].free_stock = value.free_stock;
        const base_value = Number(newfield[index].base_value) || 0;
        const material_qty = Number(newfield[index].material_qty) || 0;
        const trade_discount = Number(newfield[index].trade_discount) || 0;
        const gst_tax_value = value.tax / 2;
        newfield[index].cgst_rate = gst_tax_value;
        newfield[index].sgst_rate = gst_tax_value;
        newfield[index].cess_rate = value.cess;
        newfield[index].additional_cess_rate = value.addtional_cess_value;
        const additional_cess_rate = value.addtional_cess_value * material_qty;
        newfield[index].additional_cess_value = additional_cess_rate;
        newfield[index].tcs_rate = 0;
        newfield[index].tcs_value = 0;
        const total_amount = base_value * material_qty - trade_discount;
        const gst_value = (Number(gst_tax_value) / 100) * total_amount;
        const cess_value = (Number(value.cess) / 100) * total_amount;
        newfield[index].sgst_value = gst_value;
        newfield[index].cgst_value = gst_value;
        newfield[index].cess_value = cess_value.toFixed(2);
        const invoice_tax =
          gst_value + gst_value + cess_value + Number(additional_cess_rate) + 0;
        newfield[index].total_tax = invoice_tax;
        if (newfield[index].free_stock === 0) {
          newfield[index].total_payable = total_amount + Number(invoice_tax);
        } else {
          newfield[index].total_payable = 0;
        }
        let seen = new Set();
        let filteredUOMData = value?.uom_details?.filter((item) => {
          if (item.uomName && !seen.has(item.uomName)) {
            seen.add(item.uomName);
            return true;
          }
          return false;
        });

        if (filteredUOMData.length === 0) {
          newfield[index].uom_list = [{ uomName: value.uom, per_value: 1 }];
        } else {
          newfield[index].uom_list = filteredUOMData;
        }
        setorderMaterial(newfield);
      }
      if (ref == "route") {
        newfield[index].route_id = value.data_uniq_id;
        newfield[index].route_name = value.route;
        setorderMaterial(newfield);
      }
      if (ref == "salesman_name") {
        newfield[index].sales_man_name = value.full_name;
        newfield[index].sales_man_id = value.data_uniq_id;
        setorderMaterial(newfield);
      }
      if (ref == "division") {
        newfield[index].division_id = value.data_uniq_id;
        newfield[index].division_name = value.division;
        setorderMaterial(newfield);
      }
      if (ref == "batch_number") {
        newfield[index].batch_id = value.batch_id;
        newfield[index].batch_number = value.batch_number;
        newfield[index].base_value = value.base_value;
        const total_amount =
          Number(value.base_value) *
            Number(newfield[index].material_qty) -
          Number(newfield[index].trade_discount);

        newfield[index].cgst_rate = newfield[index].cgst_rate;
        newfield[index].cgst_value =
          (Number(newfield[index].cgst_rate) / 100) * total_amount;
        newfield[index].sgst_rate = newfield[index].sgst_rate;
        newfield[index].sgst_value =
          (Number(newfield[index].sgst_rate) / 100) * total_amount;
        newfield[index].cess_rate = newfield[index].cess_rate;
        newfield[index].cess_value = (
          (Number(newfield[index].cess_rate) / 100) *
          total_amount
        ).toFixed(2);
        newfield[index].tcs_rate = 0;
        newfield[index].tcs_value = 0;
        newfield[index].additional_cess_value =
          newfield[index].additional_cess_value;

        const total_tax =
          (Number(newfield[index].cgst_rate) / 100) * total_amount +
          (Number(newfield[index].sgst_rate) / 100) * total_amount +
          (Number(newfield[index].cess_rate) / 100) * total_amount +
          0 +
          Number(newfield[index].additional_cess_value);

        newfield[index].total_tax = total_tax;

        if (newfield[index].free_stock === 0) {
          newfield[index].total_payable = total_amount + total_tax;
        } else {
          newfield[index].total_payable = 0;
        }
        setorderMaterial(newfield);
      }
      if (ref == "new_batch_value") {
        newfield[index].new_batch_value = !newfield[index].new_batch_value;
        setorderMaterial(newfield);
      }
      if (ref == "uom_list") {
        newfield[index].uom = value.uomName;
        setorderMaterial(newfield);
      }
    } else if (event !== undefined) {
      if (ref === "material_code") {
        newfield[index].material_code = event.target.value;
        HandleProductMasterCode(index, event.target.value);
        setorderMaterial(newfield);
      } else if (ref === "return_qty") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          if (newfield[index].material_qty >= event.target.value) {
            newfield[index].return_qty = event.target.value;
            const total_amount =
              Number(event.target.value) * Number(newfield[index].base_value) -
              Number(newfield[index].trade_discount);
            newfield[index].cgst_rate = newfield[index].cgst_rate;
            newfield[index].cgst_value =
              (Number(newfield[index].cgst_rate) / 100) * total_amount;
            newfield[index].sgst_rate = newfield[index].sgst_rate;
            newfield[index].sgst_value =
              (Number(newfield[index].sgst_rate) / 100) * total_amount;
            newfield[index].cess_rate = newfield[index].cess_rate;
            newfield[index].cess_value = (
              (Number(newfield[index].cess_rate) / 100) *
              total_amount
            ).toFixed(2);
            newfield[index].tcs_rate = 0;
            newfield[index].tcs_value = 0;
            const additional_cess_value =
              Number(newfield[index].additional_cess_rate) *
              Number(event.target.value);
            newfield[index].additional_cess_value = additional_cess_value;
            const total_tax =
              (Number(newfield[index].cgst_rate) / 100) * total_amount +
              (Number(newfield[index].sgst_rate) / 100) * total_amount +
              (Number(newfield[index].cess_rate) / 100) * total_amount +
              0 +
              additional_cess_value;

            newfield[index].total_tax = total_tax;

            if (newfield[index].free_stock === 0) {
              newfield[index].total_payable = total_amount + total_tax;
            } else {
              newfield[index].total_payable = 0;
            }
            setorderMaterial(newfield);
          }
        }
      } else if (ref === "material_qty") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          newfield[index].material_qty = event.target.value;
          const total_amount =
            Number(event.target.value) * Number(newfield[index].base_value) -
            Number(newfield[index].trade_discount);
          newfield[index].cgst_rate = newfield[index].cgst_rate;
          newfield[index].cgst_value =
            (Number(newfield[index].cgst_rate) / 100) * total_amount;
          newfield[index].sgst_rate = newfield[index].sgst_rate;
          newfield[index].sgst_value =
            (Number(newfield[index].sgst_rate) / 100) * total_amount;
          newfield[index].cess_rate = newfield[index].cess_rate;
          newfield[index].cess_value = (
            (Number(newfield[index].cess_rate) / 100) *
            total_amount
          ).toFixed(2);
          newfield[index].tcs_rate = 0;
          newfield[index].tcs_value = 0;
          const additional_cess_value =
            Number(newfield[index].additional_cess_rate) *
            Number(event.target.value);
          newfield[index].additional_cess_value = additional_cess_value;
          const total_tax =
            (Number(newfield[index].cgst_rate) / 100) * total_amount +
            (Number(newfield[index].sgst_rate) / 100) * total_amount +
            (Number(newfield[index].cess_rate) / 100) * total_amount +
            0 +
            additional_cess_value;

          newfield[index].total_tax = total_tax;

          if (newfield[index].free_stock === 0) {
            newfield[index].total_payable = total_amount + total_tax;
          } else {
            newfield[index].total_payable = 0;
          }
          setorderMaterial(newfield);
        }
      } else if (ref == "base_value") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          newfield[index].base_value = event.target.value;
          const total_amount =
            Number(event.target.value) * Number(newfield[index].material_qty) -
            Number(newfield[index].trade_discount);

          newfield[index].cgst_rate = newfield[index].cgst_rate;
          newfield[index].cgst_value =
            (Number(newfield[index].cgst_rate) / 100) * total_amount;
          newfield[index].sgst_rate = newfield[index].sgst_rate;
          newfield[index].sgst_value =
            (Number(newfield[index].sgst_rate) / 100) * total_amount;
          newfield[index].cess_rate = newfield[index].cess_rate;
          newfield[index].cess_value = (
            (Number(newfield[index].cess_rate) / 100) *
            total_amount
          ).toFixed(2);
          newfield[index].tcs_rate = 0;
          newfield[index].tcs_value = 0;
          newfield[index].additional_cess_value =
            newfield[index].additional_cess_value;

          const total_tax =
            (Number(newfield[index].cgst_rate) / 100) * total_amount +
            (Number(newfield[index].sgst_rate) / 100) * total_amount +
            (Number(newfield[index].cess_rate) / 100) * total_amount +
            0 +
            Number(newfield[index].additional_cess_value);

          newfield[index].total_tax = total_tax;

          if (newfield[index].free_stock === 0) {
            newfield[index].total_payable = total_amount + total_tax;
          } else {
            newfield[index].total_payable = 0;
          }
          setorderMaterial(newfield);
        }
      } else if (ref == "trade_discount") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          newfield[index].trade_discount_value = event.target.value;
          const invoice_tax = Number(event.target.value);

          const total_amount =
            Number(newfield[index].base_value) *
              Number(newfield[index].material_qty) -
            Number(invoice_tax);

          newfield[index].cgst_rate = newfield[index].cgst_rate;
          newfield[index].cgst_value =
            (Number(newfield[index].cgst_rate) / 100) * total_amount;
          newfield[index].sgst_rate = newfield[index].sgst_rate;
          newfield[index].sgst_value =
            (Number(newfield[index].sgst_rate) / 100) * total_amount;
          newfield[index].cess_rate = newfield[index].cess_rate;
          newfield[index].cess_value = (
            (Number(newfield[index].cess_rate) / 100) *
            total_amount
          ).toFixed(2);
          newfield[index].tcs_rate = 0;
          newfield[index].tcs_value = 0;
          newfield[index].additional_cess_value =
            newfield[index].additional_cess_value;

          const total_tax =
            (Number(newfield[index].cgst_rate) / 100) * total_amount +
            (Number(newfield[index].sgst_rate) / 100) * total_amount +
            (Number(newfield[index].cess_rate) / 100) * total_amount +
            0 +
            Number(newfield[index].additional_cess_value);

          newfield[index].total_tax = total_tax;

          newfield[index].trade_discount = event.target.value;
          if (newfield[index].free_stock === 0) {
            newfield[index].total_payable = total_amount + Number(total_tax);
          } else {
            newfield[index].total_payable = 0;
          }
          setorderMaterial(newfield);
        }
      } else {
        newfield[index][event.target.name] = event.target.value;
        setorderMaterial(newfield);
      }
    }
  };

  const [customerID, setcustomerID] = useState("");

  const [customerName, setcustomerName] = useState("");

  const [customerMobile, setcustomerMobile] = useState("+91 ");

  const [customerEmail, setcustomerEmail] = useState("");

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [customerGst, setcustomerGst] = useState("");

  const [receiverCustomerID, setreceiverCustomerID] = useState("");

  const [receiverCustomerName, setreceiverCustomerName] = useState("");

  const [receiverCustomerMobile, setreceiverCustomerMobile] = useState("+91 ");

  const [receiverCustomerGst, setreceiverCustomerGst] = useState("");

  const [receiverCustomerdata, setreceiverCustomerdata] = useState();

  const [receiverCustomerAddress, setreceiverCustomerAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const removePerValue = (obj) => {
    const { last_sales_invoice_details, ...rest } = obj;
    return rest;
  };
  const [routeData, setrouteData] = useState([]);
  const handlecustomerChange = (event, value) => {
    if (value != null) {
      setreceiverCustomerID(value.data_uniq_id);
      setreceiverCustomerName(value.customer_name);
      setreceiverCustomerMobile(value.contact_number);
      setreceiverCustomerGst(value.gst_no);
      setreceiverCustomerAddress(value.address);
      setreceiverCustomerdata(removePerValue(value));
    } else {
      setreceiverCustomerID("");
      setreceiverCustomerName("");
      setreceiverCustomerMobile("+91 ");
      setreceiverCustomerGst("");
      setreceiverCustomerdata();
      setreceiverCustomerAddress({
        flatStreet: "",
        pincode: "",
        state: "",
        district: "",
      });
    }
  };

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleInvoiceDateChange = (event) => {
    const value = event.target.value;
    const formattedDate = moment(value).format("YYYY-MM-DD");
    setinvoiceDate(formattedDate);
  };

  const [customerAddress, setcustomerAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const [customerRoute, setcustomerRoute] = useState([]);
  const [customerSalesName, setcustomerSalesName] = useState([]);
  const [customerDivision, setDivision] = useState("");
  const [sifydocNumber, setsifydocNumber] = useState("");
  const [sifyinvoiceNumber, setsifyinvoiceNumber] = useState("");
  const [customerDataValue, setcustomerDataValue] = useState();

  const handleCustomerChange = (event, value) => {
    if (value != null) {
      setcustomerID(value.data_uniq_id);
      setcustomerName(value.customer_name);
      setcustomerMobile(value.contact_no);
      setcustomerEmail(value.email_id);
      setcustomerGst(value.gst_no);
      setcustomerAddress(value.address);
      setcustomerDataValue(value);
    } else {
      setcustomerID("");
      setcustomerName("");
      setcustomerMobile("+91 ");
      setcustomerEmail("");
      setcustomerGst("");
      setcustomerDataValue();
      setcustomerAddress({
        flatStreet: "",
        pincode: "",
        state: "",
        district: "",
      });
    }
  };

  const handleRouterHomePage = () => {
    Cookies.remove("data_uniq_id");
    router.push("/customer_replacement");
  };

  const [loadingPage, setloadingPage] = useState(false);
  const [returnTypeMethod, setreturnTypeMethod] = useState("");
  const EmployeeCreateMaster = async () => {
    const filteredOrderMaterial = orderMaterial.filter(
      (row) => row.material_code !== ""
    );
    if (filteredOrderMaterial.length !== 0) {
      setloadingPage(true);
      let returnMethodValue = 0;
      if (returnTypeMethod === "Vehicle Return") {
        returnMethodValue = 1;
      } else if (returnTypeMethod === "Salesman Return") {
        returnMethodValue = 2;
      }
      const mdata = {
        access_token: ACCESS_TOKEN,
        sales_invoice_id: DATA_UNIQ_ID,
        customer_id: customerID,
        customer_name: customerName,
        customer_data: customerDataValue,
        order_material: filteredOrderMaterial,
        return_date: invoiceDate,
        return_method: 1,
        return_type_method: returnMethodValue,
        route_name: routeName,
        route_id: routeID,
        sales_man_id: salesManID,
        sales_man_name: salesManName,
        vehicle_details: vehicleDetails,
        sales_return_status: "invoice_return",
        ref_customer_id: receiverCustomerID,
        ref_customer_name: receiverCustomerName,
        ref_customer_data: receiverCustomerdata,
      };
      axiosPost.post(`sales_return_entry`, mdata).then((res) => {
        setloadingPage(false);
        if (res.data.action_status === "Error") {
          const successMessage = res.data.message;
          setError({ status: "error", message: successMessage });
        } else {
          const successMessage = "Created Successfully";
          setError({ status: "success", message: successMessage });
          setTimeout(() => {
            handleRouterHomePage();
          }, 200);
        }
      });
    } else {
      setloadingPage(false);
      setError({ status: "error", message: "Material Code is Required" });
    }
  };

  const SupplierDetailsComponent = () => {
    return (
      <Paper
        sx={{ p: 1, mr: 1, width: "15%", height: "83vh", overflow: "auto" }}
      >
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Sales Return Type
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "8px" }}
            options={["Vehicle Return", "Salesman Return"]}
            getOptionLabel={(val) => val}
            required
            id="return-type"
            onChange={(event, value) => setreturnTypeMethod(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={customerName}
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
                label="Return Type"
              />
            )}
            clearIcon={null}
          />
        </Box>
        {returnTypeMethod === "Salesman Return" && (
          <>
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography
                variant="p"
                fontSize={"12px"}
                fontWeight={"bold"}
                color={"primary"}
              >
                Route Details
              </Typography>
              
              

            </Box>

            <Box sx={{ margin: "8px 0px" }}>
              {/* {!isRouteEditing ? (
                <TextField
                  id="outlined-basic"
                  label="Route Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="route"
                  // disabled
                  value={routeName}
                  style={{ marginTop: "8px" }}
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
              ) : ( */}
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "8px" }}
                  options={routeData}
                  value={
                    routeData?.find((route) => route.routeName === routeName) || null
                  }
                  onChange={(event, value) =>
                    handleRouteChange(event, value, "route")
                  }
                  getOptionLabel={(option) => option.routeName}
                  required
                  id="customer"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={routeName}
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
                      label="Route"
                    />
                  )}
                  clearIcon={null}
                />
              {/* )} */}
            </Box>

            <Box sx={{ margin: "8px 0px" }}>
              {/* {!isRouteEditing ? (
                <TextField
                  id="outlined-basic"
                  label="Sales Man Name"
                  variant="outlined"
                  size="small"
                  style={{ marginTop: "8px" }}
                  name="state"
                  value={salesManName}
                  // disabled
                  fullWidth
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
              ) : ( */}
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "16px" }}
                  options={routeData}
                  value={
                    routeData?.find(
                      (sales) => sales.salesManName === salesManName
                    ) || null
                  }
                  onChange={(event, value) =>
                    handleRouteChange(event, value, "salesman")
                  }
                  getOptionLabel={(option) => option.salesManName}
                  required
                  id="customer"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={salesManName}
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
                      label="Sales Man"
                    />
                  )}
                  clearIcon={null}
                />
              {/* )} */}
            </Box>
          </>
        )}

        {returnTypeMethod === "Vehicle Return" && (
          <Box sx={{ mb: 2, mt: 1, position: "relative" }}>
            {isEditing ? (
              <Box>
                <VehicleCreate
                  vehicleDetails={vehicleDetails}
                  HandleVehicleDetails={handleVehicleDetailsChange}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    marginLeft: 12,
                    height: 10,
                    width: 10,
                  }}
                  onClick={handleCloseClick}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <Typography
                  variant="body2"
                  fontSize="14px"
                  fontWeight="bold"
                  color="primary"
                >
                  Vehicle Details
                </Typography>
                <IconButton
                  sx={{
                    position: "relative",
                    bottom: 1,
                    right: 2,
                    marginLeft: 1,
                    height: 18,
                    width: 18,
                    padding: 0,
                  }}
                  component="span"
                  onClick={handleEditClick}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18, color: "black" }} />
                </IconButton>
              </Box>
            )}
            {!isEditing && (
            <Box sx={{ margin: "8px 0px" }}>
              <TextField
                id="outlined-basic"
                label="Company Name"
                variant="outlined"
                size="small"
                disabled
                fullWidth
                name="company_name"
                value={companyName}
                onChange={HandleVehicleDetails}
                style={{ marginTop: "8px" }}
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
            </Box>
          )}
          {!isEditing && (
            <Box sx={{ margin: "8px 0px" }}>
              <TextField
                id="outlined-basic"
                label="Vehicle No."
                variant="outlined"
                size="small"
                fullWidth
                name="route"
                disabled
                value={vehicleNo}
                onChange={HandleVehicleDetails}
                style={{ marginTop: "8px" }}
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
            </Box>
          )}
          {!isEditing && (
            <Box sx={{ margin: "8px 0px" }}>
              <TextField
                id="outlined-basic"
                label="Driver Name"
                variant="outlined"
                size="small"
                fullWidth
                name="route"
                disabled
                value={drivernameDetails}
                onChange={HandleVehicleDetails}
                style={{ marginTop: "8px" }}
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
            </Box>
          )}
          {!isEditing && (
            <Box sx={{ margin: "8px 0px" }}>
              <TextField
                id="outlined-basic"
                label="Driver Mobile No."
                variant="outlined"
                size="small"
                fullWidth
                name="route"
                disabled
                value={driverNo}
                onChange={HandleVehicleDetails}
                style={{ marginTop: "8px" }}
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
            </Box>
          )}
          </Box>
          
        )}


        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Invoice Return Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Return Date"
            variant="outlined"
            type="date"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
            name="Return Date"
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
        </Box>
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Sender Customer Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "8px" }}
            disabled
            options={customerMaster}
            value={
              customerMaster.find(
                (year) => year.customer_name === customerName
              ) || null
            }
            getOptionLabel={(val) => val.customer_name}
            required
            id="customer"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={customerName}
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
                label="Customer Name"
              />
            )}
            clearIcon={null}
          />
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Contact No."
            variant="outlined"
            style={{ marginTop: "8px" }}
            disabled
            size="small"
            fullWidth
            value={customerMobile}
            name="contact_no"
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
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="GST No."
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            disabled
            fullWidth
            inputProps={{
              style: {
                fontSize: "12px",
              },
            }}
            value={customerGst}
            name="gst_no"
            InputLabelProps={{
              style: {
                fontSize: "12px",
              },
            }}
          />
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Flat No. / Street"
            variant="outlined"
            size="small"
            fullWidth
            name="flatStreet"
            disabled
            value={customerAddress.flatStreet}
            style={{ marginTop: "8px" }}
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
        </Box>

        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Receiver Customer Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "8px" }}
            options={customerMaster}
            value={
              customerMaster.find(
                (year) => year.customer_name === receiverCustomerName
              ) || null
            }
            onChange={(e, value) => handlecustomerChange(e.target.value, value)}
            getOptionLabel={(val) => val.customer_name}
            required
            id="customer"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={receiverCustomerName}
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
                label="Customer Name"
              />
            )}
            clearIcon={null}
          />
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Contact No."
            variant="outlined"
            style={{ marginTop: "8px" }}
            disabled
            size="small"
            fullWidth
            value={receiverCustomerMobile}
            name="contact_no"
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
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="GST No."
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            disabled
            fullWidth
            inputProps={{
              style: {
                fontSize: "12px",
              },
            }}
            value={receiverCustomerGst}
            name="gst_no"
            InputLabelProps={{
              style: {
                fontSize: "12px",
              },
            }}
          />
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Flat No. / Street"
            variant="outlined"
            size="small"
            fullWidth
            name="flatStreet"
            disabled
            value={receiverCustomerAddress?.flatStreet}
            style={{ marginTop: "8px" }}
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
        </Box>

        {/* <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"12px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Route Details
          </Typography>
          {returnTypeMethod === "Salesman Return" ? (
            <IconButton
              sx={{
                position: "relative",
                bottom: 1,
                right: 2,
                marginLeft: 1,
                height: 18,
                width: 18,
                padding: 0,
              }}
              component="span"
              onClick={handleRouteEditClick}
            >
              <EditOutlinedIcon sx={{ fontSize: 18, color: "black" }} />
            </IconButton>
          ) : (
            <Typography
              variant="body2"
              fontSize="12px"
              color="error"
            ></Typography>
          )}
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          {!isRouteEditing ? (
            <TextField
              id="outlined-basic"
              label="Route Name"
              variant="outlined"
              size="small"
              fullWidth
              name="route"
              disabled
              value={routeName}
              style={{ marginTop: "8px" }}
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
          ) : (
            <Autocomplete
              margin="normal"
              variant="outlined"
              style={{ marginTop: "8px" }}
              options={routeData}
              value={
                routeData?.find((route) => route.routeName === routeName) ||
                null
              }
              onChange={(event, value) =>
                handleRouteChange(event, value, "route")
              }
              getOptionLabel={(option) => option.routeName}
              required
              id="customer"
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
                  label="Route"
                />
              )}
              clearIcon={null}
            />
          )}
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          {!isRouteEditing ? (
            <TextField
              id="outlined-basic"
              label="Sales Man Name"
              variant="outlined"
              size="small"
              style={{ marginTop: "8px" }}
              name="state"
              value={salesManName}
              disabled
              fullWidth
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
          ) : (
            <Autocomplete
              margin="normal"
              variant="outlined"
              style={{ marginTop: "16px" }}
              options={routeData}
              value={
                routeData?.find(
                  (sales) => sales.salesManName === salesManName
                ) || null
              }
              onChange={(event, value) =>
                handleRouteChange(event, value, "salesman")
              }
              getOptionLabel={(option) => option.salesManName}
              required
              id="customer"
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  value={salesManName}
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
                  label="Sales Man"
                />
              )}
              clearIcon={null}
            />
          )}
        </Box> */}

        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"12px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Reference Sales Invoice Details
          </Typography>
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Sify Invoice No"
            variant="outlined"
            disabled
            size="small"
            style={{ marginTop: "8px", width: "100%" }}
            value={sifyinvoiceNumber}
            name="Sify Invoice No"
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
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Sify Document No"
            variant="outlined"
            disabled
            style={{ marginTop: "8px", width: "100%" }}
            size="small"
            value={sifydocNumber}
            name="Sify Document No"
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
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Invoice Date"
            variant="outlined"
            type="date"
            disabled
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={returnDate}
            name="Invoice Date"
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
        </Box>
        {/* <Box sx={{ mb: 2, mt: 1, position: "relative" }}>
          {isEditing ? (
            <Box>
              <VehicleCreate
                vehicleDetails={vehicleDetails}
                HandleVehicleDetails={handleVehicleDetailsChange}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  marginLeft: 12,
                  height: 10,
                  width: 10,
                }}
                onClick={handleCloseClick}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                fontSize="14px"
                fontWeight="bold"
                color="primary"
              >
                Vehicle Details
              </Typography>
              {returnTypeMethod === "Vehicle Return" ? (
                <IconButton
                  sx={{
                    position: "relative",
                    bottom: 1,
                    right: 2,
                    marginLeft: 1,
                    height: 18,
                    width: 18,
                    padding: 0,
                  }}
                  component="span"
                  onClick={handleEditClick}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18, color: "black" }} />
                </IconButton>
              ) : (
                <Typography
                  variant="body2"
                  fontSize="12px"
                  color="error"
                ></Typography>
              )}
            </Box>
          )}
        </Box>
        {!isEditing && (
          <Box sx={{ margin: "8px 0px" }}>
            <TextField
              id="outlined-basic"
              label="Company Name"
              variant="outlined"
              size="small"
              disabled
              fullWidth
              name="company_name"
              value={companyName}
              onChange={HandleVehicleDetails}
              style={{ marginTop: "8px" }}
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
          </Box>
        )}
        {!isEditing && (
          <Box sx={{ margin: "8px 0px" }}>
            <TextField
              id="outlined-basic"
              label="Vehicle No."
              variant="outlined"
              size="small"
              fullWidth
              name="route"
              disabled
              value={vehicleNo}
              onChange={HandleVehicleDetails}
              style={{ marginTop: "8px" }}
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
          </Box>
        )}
        {!isEditing && (
          <Box sx={{ margin: "8px 0px" }}>
            <TextField
              id="outlined-basic"
              label="Driver Name"
              variant="outlined"
              size="small"
              fullWidth
              name="route"
              disabled
              value={drivernameDetails}
              onChange={HandleVehicleDetails}
              style={{ marginTop: "8px" }}
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
          </Box>
        )}
        {!isEditing && (
          <Box sx={{ margin: "8px 0px" }}>
            <TextField
              id="outlined-basic"
              label="Driver Mobile No."
              variant="outlined"
              size="small"
              fullWidth
              name="route"
              disabled
              value={driverNo}
              onChange={HandleVehicleDetails}
              style={{ marginTop: "8px" }}
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
          </Box>
        )} */}
      </Paper>
    );
  };

  const [focusIndexNumber, setfocusIndexNumber] = useState(0);

  const handleFocus = (index) => {
    setfocusIndexNumber(index);
  };

  let totalPayable = 0;
  orderMaterial.forEach((item) => {
    totalPayable += item.total_payable || 0;
  });

  let totalQunatity = 0;
  orderMaterial.forEach((item) => {
    totalQunatity += Number(item.material_qty) || 0;
  });

  const ProductCreateComponent = () => {
    return (
      <ProductCreate
        product_table={product_table}
        orderMaterial={orderMaterial}
        handleProductChange={handleProductChange}
        productMaster={productMaster}
        divisionMaster={divisionMaster}
        handleRemoveProductDetails={handleRemoveProductDetails}
        handleFocus={handleFocus}
      />
    );
  };

  const InvoiceTaxComponent = () => {
    return (
      <PurchaseInvoiceTax
        orderMaterial={orderMaterial}
        index={focusIndexNumber}
      />
    );
  };

  const TotalComponent = () => {
    return (
      <TotalAmount
        amount={totalPayable.toFixed(2)}
        qty={totalQunatity.toFixed(2)}
      />
    );
  };

  if (loadingPage) {
    return <Loader />;
  }

  return (
    <div>
      <div
        className="displey_space_between global_padding"
        style={{ padding: "10px" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => handleRouterHomePage()}>
            <KeyboardBackspaceIcon style={{ color: "black" }} />
          </IconButton>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "18px", fontWeight: "700", color: "#185AA6" }}
          >
            Invoice Replacement Return
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            className="nunito_font_width create_button"
            onClick={() => EmployeeCreateMaster()}
          >
            Save
          </Button>
        </div>
      </div>
      <PurchaseLayout
        SupplierDetailsComponent={SupplierDetailsComponent}
        ProductCreateComponent={ProductCreateComponent}
        InvoiceTaxComponent={InvoiceTaxComponent}
        TotalComponent={TotalComponent}
      />

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
    </div>
  );
};

export default EmployeeCreate;
