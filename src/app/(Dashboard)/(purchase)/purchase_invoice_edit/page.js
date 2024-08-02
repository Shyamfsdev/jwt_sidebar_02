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
import ProductCreate from "../../components/product_create/ProductCreate";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import TotalAmount from "../../components/buttons/TotalAmount";
import moment from "moment";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const INVOICE_ID = Cookies.get("invoice_id");
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState({ status: "", message: "" });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  const GetFetData = () => {
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
          setinvoiceDate(response.data.data[0]?.invoice_date);
          const order_material = [];
          response.data.data[0]?.invoice_material_details.map((item) => {
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
              free_stock: item.free_stock,
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
              additional_cess_rate: (item.additional_cess_value / item.material_qty),
              additional_cess_value: item.additional_cess_value,
              total_tax: item.total_tax,
              tcs_rate: item.tcs_rate,
              tcs_value: item.tcs_value,
              total_payable: item.total_amount,
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
    fetchData(ACCESS_TOKEN, INVOICE_ID);
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

  useEffect(() => {
    HandleProductMaster();
    HandleSupplierMaster();
    HandleDivisionMaster();
    GetFetData();
  }, []);

  const router = useRouter();

  const product_table = [
    { th: "#", id: "id", weigh: "2%", sub_item: [] },
    { th: "Material Code", id: "material_code", weigh: "15%", sub_item: [] },
    { th: "Material Name", id: "material_name", weigh: "12%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "6%", sub_item: [] },
    { th: "Division", id: "division", weigh: "8%", sub_item: [] },
    { th: "Batch No.", id: "batch_number", weigh: "12%", sub_item: [] },
    { th: "HSN Code", id: "hsn_code", weigh: "12%", sub_item: [] },
    { th: "Material Qty", id: "qty", weigh: "10%", sub_item: [] },
    { th: "Base Value", id: "base_value", weigh: "8%", sub_item: [] },
    {
      th: "Invoice Discount",
      id: "invoice_discount",
      weigh: "8%",
      sub_item: [],
    },
    { th: "Other Discount", id: "other_discount", weigh: "8%", sub_item: [] },
    {
      th: "GST Values",
      id: "gst_value",
      weigh: "8%",
      sub_item: [
        { tl: "CGST Rate", id: "cgst_rate" },
        { tl: "CGST Value", id: "cgst_value" },
        { tl: "SGST Rate", id: "sgst_rate" },
        { tl: "SGST Value", id: "sgst_value" },
      ],
    },
    { th: "Cess Rate", id: "cess_rate", weigh: "10%", sub_item: [] },
    { th: "Cess Value", id: "cess_value", weigh: "4%", sub_item: [] },
    {
      th: "Additional Cess Value",
      id: "additional_cess_value",
      weigh: "10%",
      sub_item: [],
    },
    { th: "Total Tax", id: "total_tax", weigh: "4%", sub_item: [] },
    { th: "TCS Rate", id: "tcs_rate", weigh: "10%", sub_item: [] },
    { th: "TCS Value", id: "tcs_value", weigh: "4%", sub_item: [] },
    { th: "Total Payable", id: "amount", weigh: "6%", sub_item: [] },
    { th: "Action", id: "action", weigh: "2%", sub_item: [] },
  ];

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
      },
    ]);
  };

  const handleRemoveProductDetails = (index) => {
    if (orderMaterial.length > 1) {
      const newErningDetails = [...orderMaterial];
      newErningDetails.splice(index, 1);
      setorderMaterial(newErningDetails);
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
              const total_amount = base_value * material_qty - other_discount - invoice_discount;
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
              const other_discount = Number(newfield[index].other_discount) || 0;
              const invoice_discount = Number(newfield[index].invoice_discount) || 0;
              const gst_tax_value = 0;
              newfield[index].cgst_rate = gst_tax_value;
              newfield[index].sgst_rate = gst_tax_value;
              newfield[index].cess_rate = 0;
              newfield[index].additional_cess_value = 0;
              newfield[index].additional_cess_rate = 0;
              newfield[index].tcs_rate = 0;
              newfield[index].tcs_value = 0;
              const total_amount = base_value * material_qty - other_discount - invoice_discount;
              const gst_value = (Number(gst_tax_value) / 100) * total_amount;
              const cess_value = (Number(0) / 100) * total_amount;
              newfield[index].sgst_value = gst_value;
              newfield[index].cgst_value = gst_value;
              newfield[index].cess_value = cess_value;
              const invoice_tax =
                gst_value +
                gst_value +
                cess_value +
                Number(0) +
                0;
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
        newfield[index].batch_list = value.batch_details;
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
        const total_amount = base_value * material_qty - other_discount - invoice_discount;
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
          Number(value.base_value) * Number(newfield[index].material_qty) -
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
          newfield[index].cess_value =
            ((Number(newfield[index].cess_rate) / 100) * total_amount).toFixed(2);
          newfield[index].tcs_rate = 0;
          newfield[index].tcs_value = 0;
          const additional_cess_value = Number(newfield[index].additional_cess_rate) * Number(event.target.value)
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
          newfield[index].cess_value =
            ((Number(newfield[index].cess_rate) / 100) * total_amount).toFixed(2);
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
          newfield[index].cess_value =
            ((Number(newfield[index].cess_rate) / 100) * total_amount).toFixed(2);
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

  const handleRouterHomePage = () => {
    Cookies.remove("invoice_id");
    router.push("/purchase-invoice");
  };

  const [loadingPage, setloadingPage] = useState(false);

  const EmployeeCreateMaster = async () => {
    setloadingPage(true);
    const mdata = {
      access_token: ACCESS_TOKEN,
      supplier_id: supplierID,
      supplier_name: supplierName,
      supplier_data: supplierDataValue,
      pur_invoice_id: INVOICE_ID,
      invoice_date: invoiceDate,
      order_material: orderMaterial,
    };
    axiosPost.post(`purchase_invoice_api`, mdata).then((res) => {
      setloadingPage(false);
      if (res.data.action === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          handleRouterHomePage();
        }, 200);
      }
    });
  };

  if (loadingPage) {
    return <Loader />;
  }

  let totalPayable = 0;
  orderMaterial.forEach((item) => {
    totalPayable += item.total_payable || 0;
  });

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
            Edit Invoice
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
      <Box sx={{ margin: "8px" }}>
        <Box sx={{ height: "83vh", overflow: "auto", padding: "8px" }}>
          <>
            <Paper sx={{ p: 1, mb: 1 }}>
              <Stack direction={"row"} gap={2}>
                <Box className="master_create_style_withOut_P" sx={{ px: 1 }}>
                  <Box sx={{ mb: 2, mt: 1 }}>
                    <Typography
                      variant="p"
                      fontSize={"12px"}
                      fontWeight={"bold"}
                      color={"primary"}
                    >
                      Supplier Details
                    </Typography>
                  </Box>

                  <Stack direction={"row"} gap={1}>
                    <Box sx={{ my: 1 }}>
                      <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "0px" }}
                        disabled
                        options={supplierMaster}
                        value={
                          supplierMaster.find(
                            (year) => year.supplier_name === supplierName
                          ) || null
                        }
                        // onChange={(e, value) =>
                        //   handleSupplierChange(e.target.value, value)
                        // }
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

                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="Contact No."
                        variant="outlined"
                        disabled
                        size="small"
                        fullWidth
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
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="Email ID"
                        variant="outlined"
                        disabled
                        size="small"
                        sx={{ pb: 1 }}
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
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="GST No."
                        variant="outlined"
                        size="small"
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
                  </Stack>
                </Box>
                <Box className="master_create_style_withOut_P" sx={{ px: 1 }}>
                  <Box sx={{ mb: 2, mt: 1 }}>
                    <Typography
                      variant="p"
                      fontSize={"12px"}
                      fontWeight={"bold"}
                      color={"primary"}
                    >
                      Address
                    </Typography>
                  </Box>
                  <Stack direction={"row"} gap={1}>
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="Flat No. / Street"
                        variant="outlined"
                        size="small"
                        fullWidth
                        name="flatStreet"
                        disabled
                        value={supplierAddress.flatStreet}
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
                    </Box>
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="Pincode"
                        variant="outlined"
                        size="small"
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
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="State"
                        variant="outlined"
                        size="small"
                        sx={{ pb: 1 }}
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
                    <Box sx={{ my: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label="District"
                        variant="outlined"
                        size="small"
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
                  </Stack>
                </Box>
              </Stack>
              <Box
                className="master_create_style_withOut_P"
                sx={{ px: 1, width: "45%", marginTop: "10px" }}
              >
                <Box sx={{ mb: 2, mt: 1 }}>
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    color={"primary"}
                  >
                    Reference Invoice Details
                  </Typography>
                </Box>

                <Stack direction={"row"} gap={1}>
                  <Box sx={{ my: 1, width: "40%" }}>
                    <TextField
                      id="outlined-basic"
                      label="Invoice No."
                      variant="outlined"
                      disabled
                      size="small"
                      fullWidth
                      value={invoiceNumber}
                      // onChange={(e) => setinvoiceNumber(e.target.value)}
                      name="invoice_no"
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
                  <Box sx={{ my: 1 }}>
                    <TextField
                      id="outlined-basic"
                      label="Invoice Date"
                      type="date"
                      variant="outlined"
                      size="small"
                      sx={{ pb: 1 }}
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
                </Stack>
              </Box>
            </Paper>
            <Paper sx={{ p: 1, mb: 1 }}>
              <Box sx={{ px: 1 }}>
                <Typography
                  variant="p"
                  fontSize={"12px"}
                  fontWeight={"bold"}
                  color={"primary"}
                  my={1}
                >
                  Product Details
                </Typography>
                <ProductCreate
                  product_table={product_table}
                  orderMaterial={orderMaterial}
                  handleProductChange={handleProductChange}
                  productMaster={productMaster}
                  divisionMaster={divisionMaster}
                  handleRemoveProductDetails={handleRemoveProductDetails}
                />
              </Box>
              <TotalAmount amount={totalPayable} />
              <Button
                onClick={handleAddProductDetails}
                sx={{ mx: 1 }}
                size="small"
                variant="outlined"
              >
                Add
              </Button>
            </Paper>
          </>
        </Box>
      </Box>
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
