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
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosPost, axiosGet } from "../../../../lib/api";
import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import moment from "moment";
import ProductCreate from "../../components/product_create/ProductDraftCreate";
import TotalAmount from "../../components/buttons/TotalAmount";
import VehicleCreate from "../../components/histroy/VehicleCreate";

const EmployeeCreate = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const currentYear = new Date().getFullYear();

  const INVOICE_ID = Cookies.get("invoice_id");
  const DISPATCH_NUMBER = Cookies.get("dispatch_number");
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

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const [totalAmount, settotalAmount] = useState(0);

  const [invoiceCount, setinvoiceCount] = useState(0);

  const [dispatchNumber, setdispatchNumber] = useState("");

  const fetchData = async (
    access_token,
    dispatch_order_number,
    purchase_entry_id,
    limit,
    items_per_page
  ) => {
    axiosGet
      .get(
        `purchase_entry_dispatch_get_draft?access_token=${access_token}&dispatch_order_number=${dispatch_order_number}&purchase_entry_id=${purchase_entry_id}&page=${limit}&items_per_page=${items_per_page}`
      )
      .then((response) => {
        const newField = response?.data?.data[0];
        setinvoiceCount(newField?.invoice_count);
        setdispatchNumber(newField?.dispatch_order_number);
        setsupplierID(newField.supplier_data?.data_uniq_id);
        setsupplierName(newField.supplier_data?.supplier_name);
        setsupplierMobile(newField.supplier_data?.contact_no);
        setsupplierEmail(newField.supplier_data?.email_id);
        setsupplierGst(newField.supplier_data?.gst_no);
        setsupplierAddress(newField.supplier_data?.address);
        setsupplierDataValue(newField.supplier_data);
        setvehicleDetails(newField.vehicle_details);
        setinvoiceDate(newField.invoice_date);
        const invoice_list = [];
        newField.Purchase_Invoice_Data.map((res) => {
          const invoice_set = {
            invoice_number: res.pur_invoice_number,
            invoice_date: res.invoice_date,
            invoice_id: res.pur_invoice_id,
            invoice_status: false,
            total_amount: 0,
            order_material: [],
          };
          res.Purchase_Materials_Data.map((val) => {
            const invoice_material = {
              material_code: val.material_code,
              material_id: val.material_id,
              material_name: val.material_name,
              division_id: val.division_id,
              division_name: val.division,
              uom: val.uom,
              batch_number: val.batch_number,
              batch_id: val.batch_id === undefined ? "" : val.batch_id,
              batch_list: val.batch_list === undefined ? [] : val.batch_list,
              free_stock: val.free_stock === undefined ? 0 : val.free_stock,
              new_batch_value:
                val.new_batch_value === undefined ? "" : val.new_batch_value,
              hsn_code: val.hsn_code,
              material_qty: val.material_qty,
              base_value: val.base_value,
              invoice_discount: val.invoice_discount,
              other_discount: val.other_discount,
              invoice_discount_per:
                val.invoice_discount_value === undefined
                  ? ""
                  : val.invoice_discount_value,
              other_discount_per:
                val.invoice_discount_value === undefined
                  ? ""
                  : val.invoice_discount_value,
              cgst_rate: val.cgst_rate,
              cgst_value: val.cgst_value,
              sgst_rate: val.sgst_rate,
              sgst_value: val.sgst_value,
              cess_rate: val.cess_rate,
              cess_value: val.cess_value,
              additional_cess_value: val.additional_cess_value,
              total_tax: val.total_tax,
              tcs_rate: val.tcs_rate,
              tcs_value: val.tcs_value,
              total_payable: val.total_amount,
              balance_qty: val.balance_qty,
              ref_material_id: val.pur_invoice_material_id,
              pur_invoice_number: res.pur_invoice_id,
              invoice_date: res.invoice_date
            };
            invoice_set.order_material.push(invoice_material);
          });
          let totalPayable = 0;
          invoice_set.order_material.forEach((item) => {
            totalPayable += item.total_payable || 0;
          });
          invoice_set.total_amount = totalPayable;
          invoice_list.push(invoice_set);
        });

        const filteredInvoiceDetails = invoiceDetails.filter(
          (item) => item.invoice_id !== ""
        );
        const InvoiceField = [
          ...filteredInvoiceDetails,
          ...invoice_list.flat(),
        ];
        InvoiceField.forEach((invoiceDetail) => {
          invoiceDetail.order_material.forEach((order_material) => {
            const replacement = newField.entry_material?.find(
              (val) => val.ref_material_id === order_material?.ref_material_id
            );
            if (replacement) {
              order_material.material_code = replacement.material_code;
              order_material.material_id = replacement.material_id;
              order_material.material_name = replacement.material_name;
              order_material.division_id = replacement.division_id;
              order_material.division_name = replacement.division;
              order_material.uom = replacement.uom;
              order_material.batch_number = replacement.batch_number;
              order_material.batch_id = replacement.batch_id === undefined ? "" : replacement.batch_id;
              order_material.batch_list = replacement.batch_list === undefined ? [] : replacement.batch_list;
              order_material.free_stock = replacement.free_stock === undefined ? 0 : replacement.free_stock;
              order_material.new_batch_value = replacement.new_batch_value === undefined ? "" : replacement.new_batch_value;
              order_material.hsn_code = replacement.hsn_code;
              order_material.material_qty = replacement.material_qty;
              order_material.base_value = replacement.base_value;
              order_material.invoice_discount = replacement.invoice_discount;
              order_material.other_discount = replacement.other_discount;
              order_material.invoice_discount_per = replacement.invoice_discount_value;
              order_material.other_discount_per = replacement.invoice_discount_value;
              order_material.cgst_rate = replacement.cgst_rate;
              order_material.cgst_value = replacement.cgst_value;
              order_material.sgst_rate = replacement.sgst_rate;
              order_material.sgst_value = replacement.sgst_value;
              order_material.cess_rate = replacement.cess_rate;
              order_material.cess_value = replacement.cess_value;
              order_material.additional_cess_value = replacement.additional_cess_value;
              order_material.total_tax = replacement.total_tax;
              order_material.tcs_rate = replacement.tcs_rate;
              order_material.tcs_value = replacement.tcs_value;
              order_material.total_payable = replacement.total_amount;
              order_material.balance_qty = replacement.balance_qty;
              order_material.ref_material_id = replacement.ref_material_id;
              order_material.pur_invoice_number = replacement.ref_invoice_id;
              order_material.invoice_date = replacement.ref_invoice_date;
            }
          });
        });
        if (InvoiceField.length !== 0) {
          InvoiceField[0].invoice_status = true;
        }
        setinvoiceDetails(InvoiceField);
        setloadingPage(false);
        setspinnerPage(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const bottomRef = useRef(null);

  const scrollableRef = useRef(null);

  const handleScroll = () => {
    const scrollableElement = scrollableRef.current;
    if (scrollableElement && invoiceDetails[0].invoice_id !== "") {
      const { scrollTop, scrollHeight, clientHeight } = scrollableElement;

      const triggerPosition = bottomRef.current.offsetTop;


      if (
        parseInt((scrollTop + clientHeight).toFixed(0)) >= scrollHeight &&
        !loadingPage
      ) {
        setspinnerPage(true);
        const page_number = pageNumber + 1;
        setPageNumber(page_number);
        fetchData(
          ACCESS_TOKEN,
          DISPATCH_NUMBER,
          INVOICE_ID,
          pageNumber,
          pageSize
        );
      }
    }
  };

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollableRef?.current, pageNumber]);

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

  const [invoiceDetails, setinvoiceDetails] = useState([
    {
      invoice_number: "",
      invoice_date: moment(new Date()).format("YYYY-MM-DD"),
      invoice_status: false,
      invoice_id: "",
      total_amount: 0,
      order_material: [
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
          pur_invoice_number: '',
          invoice_date: ''
        },
      ],
    },
  ]);

  useEffect(() => {
    HandleProductMaster();
    HandleSupplierMaster();
    HandleDivisionMaster();
    fetchData(ACCESS_TOKEN, DISPATCH_NUMBER, INVOICE_ID, pageNumber, pageSize);
  }, [pageNumber]);

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

  const handleAddProductDetails = (index) => {
    const newField = [...invoiceDetails];
    newField[index].order_material = [
      ...newField[index].order_material,
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
        pur_invoice_number: '',
        invoice_date: ''
      },
    ];
    setinvoiceDetails(newField);
  };

  const handleRemoveProductDetails = (index, index2) => {
    const newField = [...invoiceDetails];
    if (newField[index].order_material.length > 1) {
      const newOrderMaterial = [...newField[index].order_material];
      newOrderMaterial.splice(index2, 1);
      newField[index].order_material = newOrderMaterial;
      setinvoiceDetails(newField);
    }
  };

  const [materialData, setmaterialData] = useState();
  const [materialDataIndex, setmaterialDataIndex] = useState();
  const [materialDataBool, setmaterialDataBool] = useState(false);

  const [batchNumber, setbatchNumber] = useState("");

  const HandleAddBatch = (index) => {
    setError({ status: "error", message: "Material is Required" });
  };

  const HandleCloseBatch = () => {
    setbatchNumber("");
    setmaterialDataIndex();
    setmaterialDataBool(false);
    setmaterialData();
  };

  const HandleProductMasterCode = (index, ordindex, value) => {
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
              const order_material_list = [...invoiceDetails];
              const order_material = order_material_list[ordindex].order_material;
              const newfield = [...order_material];
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
              setinvoiceDetails(order_material_list);
            } else {
              const value = res.data?.data[0];
              const order_material_list = [...invoiceDetails];
              const order_material = order_material_list[ordindex].order_material;
              const newfield = [...order_material];
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
              setinvoiceDetails(order_material_list);
            }
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "", value);
  };

  const handleProductChange = (event, value, index, ordindex, ref) => {
    const order_material_list = [...invoiceDetails];
    const order_material = order_material_list[ordindex].order_material;
    const newfield = [...order_material];
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
      }
      if (ref == "division") {
        newfield[index].division_id = value.data_uniq_id;
        newfield[index].division_name = value.division;
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
      }
      if (ref == "new_batch_value") {
        newfield[index].new_batch_value = !newfield[index].new_batch_value;
      }
      setinvoiceDetails(order_material_list);
    } else if (event !== undefined) {
      if (ref === "material_code") {
        newfield[index].material_code = event.target.value;
        HandleProductMasterCode(index, ordindex, event.target.value);
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
      }
      setinvoiceDetails(order_material_list);
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

  const [loadingPage, setloadingPage] = useState(true);

  const [spinnerPage, setspinnerPage] = useState(false);

  const orderMaterial = invoiceDetails.reduce((acc, invoiceDetail) => {
    return acc.concat(invoiceDetail.order_material);
  }, []);

  const EmployeeCreateMaster = async () => {
    setloadingPage(true);
    const mdata = {
      access_token: ACCESS_TOKEN,
      method_type: "draft_update",
      supplier_id: supplierID,
      supplier_name: supplierName,
      supplier_data: supplierDataValue,
      data_uniq_id: INVOICE_ID,
      order_material: orderMaterial,
      vehicle_details: vehicleDetails,
      invoice_date: invoiceDate,
      draft_status: 0,
    };
    axiosPost.post(`purchase_entry_master`, mdata).then((res) => {
      setloadingPage(false);
      if (res.data.action_status === "Error") {
        setError({ status: "error", message: res.data.message });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          Cookies.remove("invoice_id");
          Cookies.remove("dispatch_number");
          router.push("/purchase-entry");
        }, 200);
      }
    });
  };

  const EmployeeCreateMasterDraft = async () => {
    setloadingPage(true);
    const mdata = {
      access_token: ACCESS_TOKEN,
      method_type: "draft_update",
      supplier_id: supplierID,
      supplier_name: supplierName,
      supplier_data: supplierDataValue,
      data_uniq_id: INVOICE_ID,
      order_material: orderMaterial,
      vehicle_details: vehicleDetails,
      invoice_date: invoiceDate,
      draft_status: 1,
    };
    axiosPost.post(`purchase_entry_master`, mdata).then((res) => {
      setloadingPage(false);
      if (res.data.action === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          Cookies.remove("invoice_id");
          Cookies.remove("dispatch_number");
          router.push("/purchase-entry");
        }, 200);
      }
    });
  };

  const EmployeeRemoveMasterDraft = async () => {
    setloadingPage(true);
    const mdata = {
      access_token: ACCESS_TOKEN,
      method_type: "remove_draft",
      data_uniq_id: INVOICE_ID,
    };
    axiosPost.post(`purchase_entry_master`, mdata).then((res) => {
      setloadingPage(false);
      if (res.data.action === "Error") {
        setError({ status: "error", message: "Data Error" });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          Cookies.remove("invoice_id");
          Cookies.remove("dispatch_number");
          router.push("/purchase-entry");
        }, 200);
      }
    });
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
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          HandleCloseBatch();
        }, 200);
      }
    });
  };

  const handleListClaim = () => {
    router.push(`/purchase-entry`);
    Cookies.remove("invoice_id");
    Cookies.remove("dispatch_number");
  };

  const [invoiceIndexNumber, setinvoiceIndexNumber] = useState(0);

  const HandleOpenInvoice = (index) => {
    setinvoiceIndexNumber(index);
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
            Create New Entry
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "14px", fontWeight: "700", marginRight: "10px" }}
          >
            Total Invoice - {invoiceDetails.length} Out of {invoiceCount}
          </Typography>
          <Button
            className="nunito_font_width create_button_remove"
            style={{ marginRight: "10px" }}
            onClick={() => EmployeeRemoveMasterDraft()}
          >
            Remove
          </Button>
          <Button
            className="nunito_font_width create_button_draft"
            style={{ marginRight: "10px" }}
            onClick={() => EmployeeCreateMasterDraft()}
          >
            Draft
          </Button>
          <Button
            className="nunito_font_width create_button"
            onClick={() => EmployeeCreateMaster()}
          >
            Save
          </Button>
        </div>
      </div>
      <Box sx={{ margin: "8px" }}>
        <Box
          ref={scrollableRef}
          sx={{ height: "83vh", overflow: "auto", padding: "8px" }}
        >
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
                        disabled
                        style={{ marginTop: "0px" }}
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
            </Paper>
            <Paper sx={{ p: 1, mb: 1 }}>
              <VehicleCreate
                vehicleDetails={vehicleDetails}
                HandleVehicleDetails={HandleVehicleDetails}
              />
              <Box
                className="master_create_style_withOut_P"
                sx={{
                  px: 1,
                  width: "45%",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Box sx={{ mb: 2, mt: 1 }}>
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    color={"primary"}
                  >
                    Reference Entry Details
                  </Typography>
                </Box>

                <Stack direction={"row"} gap={1}>
                  <Box sx={{ my: 1 }}>
                    <TextField
                      id="outlined-basic"
                      label="Entry Date"
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
            <Paper sx={{ p: 1, mb: 1, backgroundColor: "#8b8b8b59" }}>
              <Stack direction={"row"} gap={2} style={{ width: "100%" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="p"
                    fontSize={"16px"}
                    fontWeight={"bold"}
                    color={"primary"}
                  >
                    Product Details
                  </Typography>
                </Box>
              </Stack>
            </Paper>
            {invoiceDetails.map((res, index) => (
              <Paper sx={{ p: 1, mb: 1 }} key={res.invoice_id}>
                <Box sx={{ px: 1 }}>
                  <Stack
                    direction={"row"}
                    gap={1}
                    sx={{
                      justifyContent: "space-between",
                      alignContent: "center",
                    }}
                  >
                    <Box
                      className="master_create_style_withOut_P"
                      sx={{
                        px: 1,
                        width: "45%",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
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
                            disabled
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={res.invoice_number}
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
                            disabled
                            type="date"
                            variant="outlined"
                            size="small"
                            sx={{ pb: 1 }}
                            fullWidth
                            value={res.invoice_date}
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
                    {invoiceIndexNumber !== index && (
                      <Button
                        className="nunito_font_width create_button_open"
                        onClick={() => HandleOpenInvoice(index)}
                      >
                        View
                      </Button>
                    )}
                  </Stack>

                  {invoiceIndexNumber === index && (
                    <ProductCreate
                      product_table={product_table}
                      orderMaterial={res.order_material}
                      handleProductChange={handleProductChange}
                      productMaster={productMaster}
                      divisionMaster={divisionMaster}
                      handleRemoveProductDetails={handleRemoveProductDetails}
                      index={index}
                      HandleAddBatch={HandleAddBatch}
                    />
                  )}
                </Box>
                {invoiceIndexNumber === index && (
                  <TotalAmount
                    amount={res.order_material.reduce(
                      (innerAcc, innerCurr) =>
                        innerAcc + (innerCurr.total_payable || 0),
                      0
                    )}
                  />
                )}
                {invoiceIndexNumber === index && (
                  <Button
                    onClick={() => handleAddProductDetails(index)}
                    sx={{ mx: 1 }}
                    size="small"
                    variant="outlined"
                  >
                    Add
                  </Button>
                )}
              </Paper>
            ))}
            <div ref={bottomRef}></div>
            {spinnerPage === true && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  zIndex: "99999999",
                }}
              >
                <CircularProgress />
              </div>
            )}
          </>
        </Box>
      </Box>
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
