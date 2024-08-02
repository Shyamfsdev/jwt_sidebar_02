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
  Modal,
} from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosPost, axiosGet } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import moment from "moment";
import ProductCreate from "../../components/product_create/DeliveryChallan";
import TotalAmount from "../../components/buttons/TotalAmount";
import VehicleCreate from "../../components/histroy/VehicleCreate";
import PurchaseLayout from "../../components/createlayout/PurchaseLayout";
import PurchaseInvoiceTax from "../../components/tax_components/PurchaseInvoiceTax";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const currentYear = new Date().getFullYear();

  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
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

  const HandlecustomerMaster = () => {
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

  const [totalAmount, settotalAmount] = useState(0);

  const HandleTotal = () => {
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item.total_payable || 0;
    });
    settotalAmount(total);
  };

  const [orderMaterial, setorderMaterial] = useState([
    {
      material_code: "",
      material_id: "",
      material_name: "",
      division_id: "",
      division_name: "",
      uom: "",
      uom_list: [],
      batch_number: "",
      batch_id: "",
      batch_list: [],
      free_stock: 0,
      new_batch_value: false,
      hsn_code: "",
      material_qty: "",
      base_value: "",
      org_base_value: "",
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
    },
  ]);

  useEffect(() => {
    HandleProductMaster();
    HandlecustomerMaster();
    HandleDivisionMaster();
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item.total_payable || 0;
    });
    settotalAmount(total);
  }, [orderMaterial]);

  const router = useRouter();

  const product_table = [
    { th: "#", id: "id", weigh: "3%", sub_item: [] },
    { th: "Material Code", id: "material_code", weigh: "15%", sub_item: [] },
    { th: "Material Name", id: "material_name", weigh: "20%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "12%", sub_item: [] },
    { th: "Batch No.", id: "batch_number", weigh: "17%", sub_item: [] },
    { th: "Material Qty", id: "qty", weigh: "14%", sub_item: [] },
    { th: "Sales Value", id: "base_value", weigh: "12%", sub_item: [] },
    { th: "Remove", id: "action", weigh: "3%", sub_item: [] },
  ];

  const handleAddProductDetails = () => {
    setorderMaterial([
      ...orderMaterial,
      {
        material_code: "",
        material_id: "",
        material_name: "",
        division_id: "",
        division_name: "",
        uom: "",
        uom_list: [],
        division_list: [],
        route_list: [],
        salesman_list: [],
        batch_number: "",
        batch_id: "",
        batch_list: [],
        free_stock: 0,
        hsn_code: "",
        new_batch_value: false,
        material_qty: "",
        base_value: "",
        org_base_value: "",
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

  const [materialData, setmaterialData] = useState();
  const [materialDataIndex, setmaterialDataIndex] = useState();
  const [materialDataBool, setmaterialDataBool] = useState(false);

  const [batchNumber, setbatchNumber] = useState("");

  const HandleAddBatch = (index) => {
    if (orderMaterial[index].material_id !== "") {
      setmaterialDataIndex(index);
      setmaterialDataBool(true);
      setmaterialData(orderMaterial[index]);
    } else {
      setmaterialDataIndex();
      setmaterialDataBool(false);
      setmaterialData();
      setError({ status: "error", message: "Material is Required" });
    }
  };

  const HandleCloseBatch = () => {
    setbatchNumber("");
    setmaterialDataIndex();
    setmaterialDataBool(false);
    setmaterialData();
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
              newfield[index].batch_list = value.sales_batch_details || [];
              newfield[index].hsn_code = value.hsn_code;
              newfield[index].base_value = value.sales_price;
              newfield[index].org_base_value = value.sales_price;
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
              handleAddProductDetails()
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
              newfield[index].org_base_value = "";
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
        newfield[index].batch_list = value.sales_batch_details || [];
        newfield[index].hsn_code = value.hsn_code;
        newfield[index].base_value = value.sales_price;
        newfield[index].org_base_value = value.sales_price;
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
        handleAddProductDetails()
      }
      if (ref == "route") {
        newfield[index].route_id = value.data_uniq_id;
        newfield[index].route_name = value.route;
        setorderMaterial(newfield);
      }
      if (ref == "salesman_name") {
        newfield[index].sales_man_name = value ? value.full_name : "";
        newfield[index].sales_man_id = value ? value.data_uniq_id : "";
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
        newfield[index].org_base_value = value.base_value;
        newfield[index].uom = "";
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
        const base_amount = 1 / value.total_qty
        const base_value = newfield[index].org_base_value || 0;
        const sales_value = base_value * base_amount;
        newfield[index].base_value = sales_value;
        const total_amount =
          Number(sales_value) *
          Number(newfield[index].material_qty || 1) -
          Number(newfield[index].trade_discount || 0);

        if (newfield[index].free_stock === 0) {
          newfield[index].total_payable = total_amount + newfield[index].total_tax;
        } else {
          newfield[index].total_payable = 0;
        }
        setorderMaterial(newfield);
      }
    } else if (event !== undefined) {
      if (ref === "material_code") {
        newfield[index].material_code = event.target.value;
        HandleProductMasterCode(index, event.target.value);
        setorderMaterial(newfield);
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

  const [supplierID, setsupplierID] = useState("");

  const [supplierName, setsupplierName] = useState("");

  const [vehicleDetails, setvehicleDetails] = useState({
    company_name: "",
    vehicle_number: "",
    driver_name: "",
    driver_mobile: "+91 ",
  });

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

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleInvoiceDateChange = (event) => {
    const value = event.target.value;
    const formattedDate = moment(value).format("YYYY-MM-DD");
    setinvoiceDate(formattedDate);
  };

  const [customerID, setcustomerID] = useState("");

  const [customerName, setcustomerName] = useState("");

  const [customerMobile, setcustomerMobile] = useState("+91 ");

  const [customerEmail, setcustomerEmail] = useState("");

  const [customerGst, setcustomerGst] = useState("");

  const [customerAddress, setcustomerAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const [routeName, setRouteName] = useState("");
  const [routeID, setRouteID] = useState("");
  const [salesManName, setsalesManName] = useState("");
  const [salesManID, setsalesManID] = useState("");

  const [customerRoute, setcustomerRoute] = useState([
    {
      divisionID: "",
      divisionName: "",
      routeID: "",
      routeName: "",
      salesManID: "",
      salesManName: "",
    },
  ]);

  const [customerDataValue, setcustomerDataValue] = useState();

  const [customerPerData, setcustomerPerData] = useState([]);

  const removePerValue = (obj) => {
    const { last_sales_invoice_details, ...rest } = obj;
    return rest;
  };
  const handleRouteChange = (event, value, ref) => {
    if (value != null) {
      const unique_route_data = routeData.filter(
        (route, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.routeName === route.routeName &&
              r.salesManName === route.salesManName
          )
      );
      if (unique_route_data.length > 1) {
        if (ref == "route") {
          setRouteName(value.routeName);
          setRouteID(value.routeID);
        } else {
          setsalesManName(value.salesManName);
          setsalesManID(value.salesManID);
        }
      } else {
        setRouteName(value.routeName);
        setRouteID(value.routeID);
        setsalesManName(value.salesManName);
        setsalesManID(value.salesManID);
      }
    } else {
      setRouteName("");
      setRouteID("");
      setsalesManName("");
      setsalesManID("");
    }
  };

  const [routeData, setrouteData] = useState([]);

  const handlecustomerChange = (event, value) => {
    if (value != null) {
      setcustomerID(value.data_uniq_id);
      setcustomerName(value.customer_name);
      setcustomerMobile(value.contact_number);
      setcustomerEmail(value.email_id);
      setcustomerGst(value.gst_no);
      setcustomerAddress(value.address);
      setcustomerPerData(value?.last_sales_invoice_details);
      setRouteName("");
      setRouteID("");
      setsalesManName("");
      setsalesManID("");
      const routeDetails = value.route_details.map((route) => ({
        divisionID: route.divisionID,
        divisionName: route.divisionName,
        routeID: route.routeID,
        routeName: route.routeName,
        salesManID: route.salesManID,
        salesManName: route.salesManName,
      }));

      const route_data = value.route_details.map((route) => ({
        routeID: route.routeID,
        routeName: route.routeName,
        salesManID: route.salesManID,
        salesManName: route.salesManName,
      }));

      const unique_route_data = route_data.filter(
        (route, index, self) =>
          index === self.findIndex((r) => r.routeName === route.routeName)
      );
      setrouteData(unique_route_data);
      setcustomerRoute(routeDetails);
      setcustomerDataValue(removePerValue(value));
    } else {
      setcustomerID("");
      setcustomerName("");
      setcustomerMobile("+91 ");
      setcustomerEmail("");
      setcustomerGst("");
      setcustomerDataValue(null);
      setRouteName("");
      setRouteID("");
      setsalesManName("");
      setsalesManID("");
      setcustomerAddress({
        flatStreet: "",
        pincode: "",
        state: "",
        district: "",
      });
      setcustomerPerData([]);
      setcustomerRoute([]);
      setRouteName("");
      setRouteID("");
      setsalesManName("");
      setsalesManID("");
      setrouteData([]);
    }
  };

  const [loadingPage, setloadingPage] = useState(false);

  const EmployeeCreateMaster = async () => {
    const filteredOrderMaterial = orderMaterial.filter(
      (row) => row.material_code !== ""
    );
    if (filteredOrderMaterial.length !== 0) {
      setloadingPage(true);
      console.log(filteredOrderMaterial);
      const mdata = {
        access_token: ACCESS_TOKEN,
        purchase_entry_return_againt: "direct_purchase_entry_return",
        customer_id: customerID,
        customer_name: customerName,
        route_id: routeID,
        route_name: routeName,
        sales_man_name: salesManName,
        sales_man_id: salesManID,
        return_date: invoiceDate,
        order_material: filteredOrderMaterial,
        vehicle_details: vehicleDetails,
        delivery_challan: 1,
      };
      console.log(mdata);
      axiosPost.post(`purchase_return_entry`, mdata).then((res) => {
        setloadingPage(false);
        if (res.data.action_status === "Error") {
          setError({ status: "error", message: res.data.message });
        } else {
          const successMessage = "Return Created Successfully";
          setError({ status: "success", message: successMessage });
          setTimeout(() => {
            router.push("/purchase_delivery_challan");
          }, 200);
        }
      });
    } else {
      setloadingPage(false);
      setError({ status: "error", message: "Material Code is Required" });
    }
  };

  const BatchCreateMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      material_id: materialData?.material_id,
      hsn_code: materialData?.hsn_code,
      item_code: materialData?.material_code,
      batch_number: batchNumber,
    };
    axiosPost.post(`batch_create_api`, mdata).then((res) => {
      if (res.data.action_status === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Batch No Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          const newfield = [...orderMaterial];
          newfield[materialDataIndex].batch_list = res.data.response;
          setorderMaterial(newfield);
          HandleCloseBatch();
        }, 200);
      }
    });
  };

  const handleListClaim = () => {
    router.push(`/purchase_delivery_challan`);
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
            Customer Details
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
                (year) => year.customer_name === customerName
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
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "16px" }}
            options={routeData}
            value={
              routeData?.find((sales) => sales.salesManName === salesManName) ||
              null
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
        </Box>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"12px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Delivery Challan Details
          </Typography>
        </Box>

        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Delivery Challan Date"
            variant="outlined"
            type="date"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
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
        <VehicleCreate
          vehicleDetails={vehicleDetails}
          HandleVehicleDetails={HandleVehicleDetails}
        />
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
        HandleAddBatch={HandleAddBatch}
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
        order_material={orderMaterial} state_user={1}
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
          <IconButton onClick={() => handleListClaim()}>
            <KeyboardBackspaceIcon style={{ color: "black" }} />
          </IconButton>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "18px", fontWeight: "700", color: "#185AA6" }}
          >
            Delivery Challan
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
      <Modal
        open={materialDataBool}
        onClose={HandleCloseBatch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "15px",
            p: 2,
          }}
        >
          <Box
            onSubmit={() => BatchCreateMaster()}
            component="form"
            noValidate
            sx={{ padding: "10px 10px 10px" }}
          >
            <TextField
              id="outlined-basic"
              label="New Batch No."
              variant="outlined"
              size="small"
              fullWidth
              value={batchNumber}
              onChange={(event) => setbatchNumber(event.target.value)}
              name="batch_no"
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
            <div className="display_flex_end" style={{ marginTop: "10px" }}>
              <Button
                type="submit"
                className="nunito_font_width userprivillagebutton"
                sx={{ fontSize: "12px", fontWeight: "300" }}
                variant="contained"
              >
                Create
              </Button>
            </div>
          </Box>
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
    </div>
  );
};

export default EmployeeCreate;
