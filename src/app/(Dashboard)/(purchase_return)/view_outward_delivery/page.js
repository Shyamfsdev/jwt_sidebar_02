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
import ProductCreate from "../../components/product_view/DeliveryChallanTable";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import TotalAmount from "../../components/buttons/ViewTotalAmount";
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
          `purchase_return_master_list?access_token=${access_token}&pur_invoice_id=${pur_invoice_id}`
        )
        .then((response) => {
          setsupplierID(response.data.data[0]?.supplier_id);
          setsupplierName(response.data.data[0]?.supplier_name);
          setsupplierAddress(response.data.data[0]?.supplier_data?.address);
          setsupplierEmail(response.data.data[0]?.supplier_data?.email_id);
          setsupplierGst(response.data.data[0]?.supplier_data?.gst_no);
          setsupplierMobile(response.data.data[0]?.supplier_data?.contact_no);
          setinvoiceNumber(response.data.data[0]?.pur_return_number);
          setvehicleDetails(response.data.data[0]?.vehicle_details);
          setinvoiceDate(response.data.data[0]?.return_date);
          const order_material = [];
          response.data.data[0]?.material_list.map((item) => {
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
              free_stock: item.free_stock === undefined ? 0:item.free_stock,
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

  useEffect(() => {
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
      invoice_discount: "",
      other_discount: "",
      invoice_discount_per: "",
      other_discount_per: "",
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

  const [supplierID, setsupplierID] = useState("");

  const [supplierName, setsupplierName] = useState("");

  const [supplierMobile, setsupplierMobile] = useState("+91 ");

  const [supplierEmail, setsupplierEmail] = useState("");

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [supplierGst, setsupplierGst] = useState("");

  const [vehicleDetails, setvehicleDetails] = useState();

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [supplierAddress, setsupplierAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const handleRouterHomePage = () => {
    Cookies.remove("invoice_id");
    router.push("/purchase_return_entry");
  };

  const [loadingPage, setloadingPage] = useState(false);

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
            View Outward Entry
          </Typography>
        </div>
      </div>
      <Box sx={{ margin: "8px" }}>
        <Box sx={{ height: "83vh", overflow: "auto", padding: "8px" }}>
          <>
            <Paper sx={{ p: 1, mb: 1 }}>
              <Stack direction={"row"} gap={2}>
                <Box
                  className="master_create_style_withOut_P"
                  sx={{ px: 1, width: "50%" }}
                >
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

                  <div className="display_flex">
                    <span className="fontInput2">
                      {supplierName},{supplierMobile},
                    </span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">Email : {supplierEmail},</span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">Gst No : {supplierGst}</span>
                  </div>
                </Box>
                <Box
                  className="master_create_style_withOut_P"
                  sx={{ px: 1, width: "50%" }}
                >
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
                  <div className="display_flex">
                    <span className="fontInput2">
                      {supplierAddress.flatStreet},
                    </span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">
                      {supplierAddress.district},{supplierAddress.state} -{" "}
                      {supplierAddress.pincode}.
                    </span>
                  </div>
                </Box>
              </Stack>
              <Stack direction={"row"} gap={2}>
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
                    Reference Outward Entry Details
                  </Typography>
                </Box>
                <div className="display_flex">
                  <span className="fontInput2">
                  Outward Entry Number : {invoiceNumber}
                  </span>
                </div>
                <div className="display_flex" style={{marginTop:'5px'}}>
                  <span className="fontInput2">
                  Outward Entry Date : {invoiceDate}
                  </span>
                </div>
              </Box>
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
                    Vehicle Details
                  </Typography>
                </Box>
                <div className="display_flex" style={{marginTop:'5px'}}>
                  <span className="fontInput2">
                    {vehicleDetails?.driver_name},{vehicleDetails?.driver_mobile},
                  </span>
                </div>
                <div className="display_flex">
                  <span className="fontInput2">
                    {vehicleDetails?.company_name},
                  </span>
                </div>
                <div className="display_flex">
                  <span className="fontInput2">
                    {vehicleDetails?.vehicle_number}.
                  </span>
                </div>
              </Box>
              </Stack>
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
                />
                {/* <TotalAmount amount={totalPayable} /> */}
              </Box>
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
