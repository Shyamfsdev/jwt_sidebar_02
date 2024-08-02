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
import SalesCreate from "../../components/product_view/SalesReturnList";
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

  const [vehicleDetails, setvehicleDetails] = useState();

  const GetFetData = () => {
    setloadingPage(true);
    const fetchData = async (access_token, data_uniq_id) => {
      axiosGet
        .get(
          `sales_return_master_list?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
        )
        .then((response) => {
          setcustomerID(response.data.data[0]?.customer_id);
          setcustomerName(response.data.data[0]?.customer_name);
          setcustomerAddress(response.data.data[0]?.customer_data?.address);
          setcustomerGst(response.data.data[0]?.customer_data?.gst_no);
          setcustomerMobile(response.data.data[0]?.customer_data?.contact_number);
          setinvoiceNumber(response.data.data[0]?.sales_return_number);
          setinvoiceDate(response.data.data[0]?.return_date);
          setvehicleDetails(response.data.data[0]?.vehicle_details);
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
              free_stock: item.free_stock,
              new_batch_value: item.new_batch_value,
              hsn_code: item.hsn_code,
              material_qty: item.material_qty,
              base_value: item.base_value,
              trade_discount: item.trade_discount,
              route_name: item.route_name,
              sales_man_name: item.sales_man_name,
              trade_discount_value: item.trade_discount_value,
              cgst_rate: item.cgst_rate,
              cgst_value: item.cgst_value,
              sgst_rate: item.sgst_rate,
              sgst_value: item.sgst_value,
              cess_rate: item.cess_rate,
              cess_value: item.cess_value,
              additional_cess_value: item.additional_cess_value,
              total_tax: item.total_tax,
              tcs_rate: item.tcs_rate,
              tcs_value: item.tcs_value,
              total_payable: item.total_amount,
              return_qty : item.return_qty
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
    { th: "Return Quantity", id: "return_qty", weigh: "10%", sub_item: [] },
    { th: "Sales Value", id: "base_value", weigh: "8%", sub_item: [] },
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
  ];

  const [orderMaterial, setorderMaterial] = useState([
    {
      material_code: "",
      material_id: "",
      material_name: "",
      division_id: "",
      division_name: "",
      route_name: "",
      route_id: "",
      sales_man_id: "",
      sales_man_name: "",
      uom: "",
      batch_number: "",
      batch_id: "",
      batch_list: [],
      free_stock: 0,
      new_batch_value: false,
      hsn_code: "",
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
      return_qty: ""
    },
  ]);

  const [customerID, setcustomerID] = useState("");

  const [customerName, setcustomerName] = useState("");

  const [customerMobile, setcustomerMobile] = useState("+91 ");

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [customerGst, setcustomerGst] = useState("");

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [customerAddress, setcustomerAddress] = useState({
    flatStreet: "",
    pincode: "",
    state: "",
    district: "",
  });

  const handleRouterHomePage = () => {
    Cookies.remove("invoice_id");
    router.push("/invoice_return");
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
            View Invoice Return
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
                      Customer Details
                    </Typography>
                  </Box>

                  <div className="display_flex">
                    <span className="fontInput2">
                    Customer Name : {customerName}
                    </span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2"> Customer Name : {customerMobile}</span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">Gst No : {customerGst}</span>
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
                      {customerAddress?.flatStreet},
                    </span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">
                      {customerAddress?.district},
                      {customerAddress?.state} -
                      {customerAddress?.pincode}.
                    </span>
                  </div>
                </Box>
              </Stack>
              <Stack direction={"row"} gap={2}>
              <Box
                className="master_create_style_withOut_P"
                sx={{ px: 1, width: "50%", marginTop: "10px" }}
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
                <div className="display_flex">
                  <span className="fontInput2">
                    Invoice Return Number : {invoiceNumber}
                  </span>
                </div>
                <div className="display_flex">
                  <span className="fontInput2">
                    Return Date : {invoiceDate}
                  </span>
                </div>
              </Box>
              <Box
                className="master_create_style_withOut_P"
                sx={{ px: 1, width: "50%", marginTop: "10px" }}
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
                <SalesCreate
                  product_table={product_table}
                  orderMaterial={orderMaterial}
                />
                <TotalAmount amount={totalPayable} />
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
