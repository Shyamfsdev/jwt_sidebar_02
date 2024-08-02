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
import PurchaseLayout from "../../components/createlayout/PurchaseLayout";
import ProductCreate from "../../components/product_create/PurchaseInvoiceCreate";
import TotalAmount from "../../components/buttons/TotalAmount";
import PurchaseInvoiceTax from "../../components/tax_components/PurchaseInvoiceTax";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const currentYear = new Date().getFullYear();
  const DATA_UNIQ_ID = Cookies.get("data_uniq_id");
  const ITEM_CODE = Cookies.get("item_code");

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

  const [totalAmount, settotalAmount] = useState(0);

  const GetFetData = (value) => {
    setloadingPage(true);
    const fetchData = async (access_token, pur_invoice_id) => {
      axiosGet
        .get(
          `invoice_details_get?access_token=${access_token}&pur_invoice_id=${pur_invoice_id}`
        )
        .then((response) => {
          setsupplierID(response.data.data[0]?.supplier_id);
          setsupplierName(response.data.data[0]?.supplier_name);
          setsupplierDataValue(response.data.data[0]?.supplier_data);
          setsupplierAddress(response.data.data[0]?.supplier_data?.address);
          setsupplierEmail(response.data.data[0]?.supplier_data?.email_id);
          setsupplierGst(response.data.data[0]?.supplier_data?.gst_no);
          setsupplierMobile(response.data.data[0]?.supplier_data?.contact_no);
          setinvoiceNumber(response.data.data[0]?.pur_invoice_number);
          settotalAmount(response.data.data[0]?.sub_total);
          const order_material = [];
          response.data.data[0]?.invoice_material_details.map((item) => {
            if (item.balance_qty !== 0 && ITEM_CODE === item.material_code) {
              const order_list = {
                material_code: item.material_code,
                material_id: item.material_id,
                material_name: item.material_name,
                division_id: item.division_id,
                division_name: item.division,
                uom: item.uom,
                batch_number: item.batch_number,
                batch_id: item.batch_id,
                batch_list: item.batch_list,
                free_stock: item.free_stock === undefined ? 0 : item.free_stock,
                new_batch_value: item.new_batch_value,
                hsn_code: item.hsn_code,
                material_qty: item.material_qty,
                base_value: item.base_value,
                invoice_discount: item.invoice_discount,
                other_discount: item.other_discount,
                invoice_discount_per: item.invoice_discount_value,
                other_discount_per: item.other_discount_value,
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
                balance_qty: item.balance_qty,
                ref_material_id: item.pur_invoice_material_id,
              };
              order_material.push(order_list);
            }
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
    fetchData(ACCESS_TOKEN, value);
  };

  const [invoiceOrderDetails, setinvoiceOrderDetails] = useState([]);

  const HandleInvoiceMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate,
      supplier_id,
      item_code
    ) => {
      axiosGet
        .get(
          `invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&sal_entry_status=${"picklist not generated"}&return_status=0&supplier_id=${supplier_id}&item_code=${item_code}`
        )
        .then((response) => {
          if (response.data.action == "success") {
            setinvoiceOrderDetails(response.data.data);
            setsupplierID(response.data.data[0]?.supplier_id);
            setsupplierName(response.data.data[0]?.supplier_name);
            setsupplierDataValue(response.data.data[0]?.supplier_data);
            setsupplierAddress(response.data.data[0]?.supplier_data?.address);
            setsupplierEmail(response.data.data[0]?.supplier_data?.email_id);
            setsupplierGst(response.data.data[0]?.supplier_data?.gst_no);
            setsupplierMobile(response.data.data[0]?.supplier_data?.contact_no);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "", DATA_UNIQ_ID, ITEM_CODE);
  };

  const [invoiceOrderNumber, setinvoiceOrderNumber] = useState("");
  const [invoiceOrderID, setinvoiceOrderID] = useState("");

  const handleInvoiceOrderChange = (event, value) => {
    if (value != null) {
      setinvoiceOrderID(value.pur_invoice_id);
      setinvoiceOrderNumber(value.pur_invoice_number);
      GetFetData(value.pur_invoice_id);
    } else {
      setinvoiceOrderID("");
      setinvoiceOrderNumber("");
    }
  };

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

  const [supplierMaster, setsupplierMaster] = useState([]);

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
            setsupplierMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [orderMaterial, setorderMaterial] = useState([
    {
      material_code: "",
      material_id: "",
      material_name: "",
      division_id: "",
      division_name: "",
      uom: "",
      batch_number: "",
      batch_id: "",
      batch_list: [],
      free_stock: 0,
      new_batch_value: false,
      hsn_code: "",
      material_qty: "",
      base_value: "",
      invoice_discount: 0,
      other_discount: 0,
      invoice_discount_per: 0,
      other_discount_per: 0,
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
      balance_qty: "",
      ref_material_id: "",
    },
  ]);

  const HandleTotal = () => {
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item.total_payable || 0;
    });
    settotalAmount(total);
  };

  useEffect(() => {
    HandleProductMaster();
    HandleSupplierMaster();
    HandleDivisionMaster();
    HandleInvoiceMaster();
    let total = 0;
    orderMaterial.forEach((item) => {
      total += item.total_payable || 0;
    });
    settotalAmount(total);
  }, []);

  const router = useRouter();

  const product_table = [
    { th: "#", id: "id", weigh: "3%", sub_item: [] },
    { th: "Material Code", id: "material_code", weigh: "15%", sub_item: [] },
    { th: "Material Name", id: "material_name", weigh: "19%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "12%", sub_item: [] },
    { th: "Batch No.", id: "batch_number", weigh: "17%", sub_item: [] },
    { th: "Material Qty", id: "qty", weigh: "14%", sub_item: [] },
    { th: "Return Quantity", id: "balance_qty", weigh: "12%", sub_item: [] },
    { th: "Base Value", id: "base_value", weigh: "12%", sub_item: [] },
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
        batch_number: "",
        batch_id: "",
        batch_list: [],
        free_stock: 0,
        new_batch_value: false,
        hsn_code: "",
        material_qty: "",
        base_value: "",
        invoice_discount: 0,
        other_discount: 0,
        invoice_discount_per: 0,
        other_discount_per: 0,
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
        balance_qty: "",
        ref_material_id: "",
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
              newfield[index].batch_list = value.batch_details || [];
              newfield[index].hsn_code = value.hsn_code;
              newfield[index].base_value = value.base_value;
              newfield[index].free_stock = value.free_stock;
              const base_value = Number(newfield[index].base_value) || 0;
              const material_qty = Number(newfield[index].material_qty) || 0;
              const other_discount =
                Number(newfield[index].other_discount) || 0;
              const invoice_discount =
                Number(newfield[index].invoice_discount) || 0;
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
              const total_amount =
                base_value * material_qty - other_discount - invoice_discount;
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
              const other_discount =
                Number(newfield[index].other_discount) || 0;
              const invoice_discount =
                Number(newfield[index].invoice_discount) || 0;
              const gst_tax_value = 0;
              newfield[index].cgst_rate = gst_tax_value;
              newfield[index].sgst_rate = gst_tax_value;
              newfield[index].cess_rate = 0;
              newfield[index].additional_cess_value = 0;
              newfield[index].additional_cess_rate = 0;
              newfield[index].tcs_rate = 0;
              newfield[index].tcs_value = 0;
              const total_amount =
                base_value * material_qty - other_discount - invoice_discount;
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
        newfield[index].batch_list = value.batch_details || [];
        newfield[index].hsn_code = value.hsn_code;
        newfield[index].base_value = value.base_value;
        newfield[index].free_stock = value.free_stock;
        const base_value = Number(newfield[index].base_value) || 0;
        const material_qty = Number(newfield[index].material_qty) || 0;
        const other_discount = Number(newfield[index].other_discount) || 0;
        const invoice_discount = Number(newfield[index].invoice_discount) || 0;
        const gst_tax_value = value.tax / 2;
        newfield[index].cgst_rate = gst_tax_value;
        newfield[index].sgst_rate = gst_tax_value;
        newfield[index].cess_rate = value.cess;
        newfield[index].additional_cess_rate = value.addtional_cess_value;
        const additional_cess_rate = value.addtional_cess_value * material_qty;
        newfield[index].additional_cess_value = additional_cess_rate;
        newfield[index].tcs_rate = 0;
        newfield[index].tcs_value = 0;
        const total_amount =
          base_value * material_qty - other_discount - invoice_discount;
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
          Number(newfield[index].invoice_discount) -
          Number(newfield[index].other_discount);

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
            Number(newfield[index].invoice_discount) -
            Number(newfield[index].other_discount);
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
            Number(newfield[index].invoice_discount) -
            Number(newfield[index].other_discount);

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
      } else if (ref == "invoice_discount") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          newfield[index].invoice_discount_per = event.target.value;
          const invoice_tax = Number(event.target.value);

          const total_amount =
            Number(newfield[index].base_value) *
            Number(newfield[index].material_qty) -
            Number(invoice_tax) -
            Number(newfield[index].other_discount);

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

          newfield[index].invoice_discount = event.target.value;
          if (newfield[index].free_stock === 0) {
            newfield[index].total_payable = total_amount + Number(total_tax);
          } else {
            newfield[index].total_payable = 0;
          }
          setorderMaterial(newfield);
        }
      } else if (ref == "other_discount") {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
          newfield[index].other_discount_per = event.target.value;
          const invoice_tax = Number(event.target.value);
          const total_amount =
            Number(newfield[index].base_value) *
            Number(newfield[index].material_qty) -
            Number(newfield[index].invoice_discount) -
            Number(invoice_tax);

          newfield[index].cgst_rate = newfield[index].cgst_rate;
          newfield[index].cgst_value =
            (Number(newfield[index].cgst_rate) / 100) * total_amount;
          newfield[index].sgst_rate = newfield[index].sgst_rate;
          newfield[index].sgst_value =
            (Number(newfield[index].sgst_rate) / 100) * total_amount;
          newfield[index].cess_rate = newfield[index].cess_rate;
          newfield[index].cess_value =
            (Number(newfield[index].cess_rate) / 100) * total_amount;
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

          newfield[index].other_discount = event.target.value;
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

  const [supplierMobile, setsupplierMobile] = useState("+91 ");

  const [supplierEmail, setsupplierEmail] = useState("");

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [supplierGst, setsupplierGst] = useState("");

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleInvoiceDateChange = (event) => {
    const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
    setinvoiceDate(formattedDate);
  };

  const [supplierAddress, setsupplierAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const [supplierDataValue, setsupplierDataValue] = useState();

  const handleSupplierChange = (event, value) => {
    if (value != null) {
      setsupplierID(value.data_uniq_id);
      setsupplierName(value.supplier_name);
      setsupplierMobile(value.contact_no);
      setsupplierEmail(value.email_id);
      setsupplierGst(value.gst_no);
      setsupplierAddress(value.address);
      setsupplierDataValue(value);
    } else {
      setsupplierID("");
      setsupplierName("");
      setsupplierMobile("+91 ");
      setsupplierEmail("");
      setsupplierGst("");
      setsupplierDataValue();
      setsupplierAddress({
        flatStreet: "",
        pincode: "",
        state: "",
        district: "",
      });
    }
  };

  const [loadingPage, setloadingPage] = useState(false);

  const EmployeeCreateMaster = async () => {
    const filteredOrderMaterial = orderMaterial.filter(
      (row) => row.material_code !== ""
    );
    if (filteredOrderMaterial.length !== 0) {
      setloadingPage(true);
      const mdata = {
        access_token: ACCESS_TOKEN,
        purchase_entry_return_againt: "purchase_entry",
        supplier_id: supplierID,
        supplier_name: supplierName,
        supplier_data: supplierDataValue,
        purchase_entry_id: invoiceOrderID,
        return_date: invoiceDate,
        order_material: filteredOrderMaterial,
        delivery_challan: 0,
      };
      axiosPost.post(`purchase_return_entry`, mdata).then((res) => {
        setloadingPage(false);
        if (res.data.action_status === "Error") {
          setError({ status: "error", message: res.data.message });
        } else {
          const successMessage = "Purchase Return Created Successfully";
          setError({ status: "success", message: successMessage });
          setTimeout(() => {
            Cookies.remove("data_uniq_id");
            Cookies.remove("item_code");
            router.push("/purchase_return");
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
    router.push(`/purchase_return`);
    Cookies.remove("data_uniq_id");
    Cookies.remove("item_code");
  };

  const SupplierDetailsComponent = () => {
    return (
      <Paper
        sx={{ p: 1, mr: 1, width: "15%", height: "83vh", overflow: "auto" }}
      >
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Invoice Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "8px" }}
            options={invoiceOrderDetails}
            value={
              invoiceOrderDetails.find(
                (year) => year.pur_invoice_number === invoiceOrderNumber
              ) || null
            }
            onChange={(e, value) =>
              handleInvoiceOrderChange(e.target.value, value)
            }
            getOptionLabel={(val) => val.pur_invoice_number}
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
                label="Purchase Invoice"
              />
            )}
            clearIcon={null}
          />
        </Box>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Supplier Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "8px" }}
            options={supplierMaster}
            disabled
            value={
              supplierMaster.find(
                (year) => year.supplier_name === supplierName
              ) || null
            }
            getOptionLabel={(val) => val.supplier_name}
            required
            id="supplier"
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
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Contact No."
            variant="outlined"
            disabled
            size="small"
            fullWidth
            style={{ marginTop: "8px" }}
            value={supplierMobile}
            name="contact_no"
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
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Email ID"
            variant="outlined"
            disabled
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={supplierEmail}
            name="email_id"
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
            value={supplierGst}
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
            style={{ marginTop: "8px" }}
            fullWidth
            name="flatStreet"
            disabled
            value={supplierAddress.flatStreet}
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
            label="Pincode"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            disabled
            fullWidth
            name="pincode"
            value={supplierAddress.pincode}
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
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="State"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            name="state"
            value={supplierAddress.state}
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
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="District"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            name="district"
            value={supplierAddress.district}
            disabled
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
        <Box sx={{ mb: 1, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Return Entry Date
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Return Date"
            type="date"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
            name="invoice_date"
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
      </Paper>
    );
  };

  const [focusIndexNumber, setfocusIndexNumber] = useState(0);

  const handleFocus = (index) => {
    setfocusIndexNumber(index);
  };

  let totalPayable = 0;
  orderMaterial.forEach((item) => {
    totalPayable += Number(item.total_payable) || 0;
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
            Purchase Return
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

      {invoiceOrderDetails.length !== 0 ? (
        <PurchaseLayout
          SupplierDetailsComponent={SupplierDetailsComponent}
          ProductCreateComponent={ProductCreateComponent}
          InvoiceTaxComponent={InvoiceTaxComponent}
          TotalComponent={TotalComponent}
        />
      ) : (
        <Box
          className="master_create_style_withOut_P flex_display"
          sx={{ px: 1 }}
        >
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography
              variant="p"
              fontSize={"12px"}
              fontWeight={"bold"}
              color={"primary"}
            >
              NO RECORDS FOUND.
            </Typography>
          </Box>
        </Box>
      )}

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
