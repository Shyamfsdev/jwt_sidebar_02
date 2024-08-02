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
import ProductCreate from "../../components/product_view/PicklistView";
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


  const [startingKiloMeter,setstartingKiloMeter] = useState("");

  const [endingKiloMeter,setendingKiloMeter] = useState("");


  const GetFetData = () => {
    setloadingPage(true);
    const fetchData = async (access_token, data_uniq_id) => {
      axiosGet
        .get(
          `pick_list_get?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
        )
        .then((response) => {
          console.log(response);
          setsupplierID(response.data.data[0]?.salesman_id);
          setsupplierName(response.data.data[0]?.salesman_name);
          setrouteName(response.data.data[0]?.route_name);
          setrouteID(response.data.data[0]?.route_id);
          setinvoiceNumber(response.data.data[0]?.pick_list_number);
          setinvoiceDate(response.data.data[0]?.delivery_date);
          setdeliveryStatus(response.data.data[0]?.delivery_pick_list);
          setvehicleDetails(response.data.data[0]?.vehicle_details);
          setstartingKiloMeter(response.data.data[0]?.starting_kilo_meter);
          setendingKiloMeter(response.data.data[0]?.ending_kilo_meter);
          const order_material = [];
          response.data.data[0]?.invoice_material_details.map((item) => {
            const order_list = {
              material_code: item.material_code,
              material_id: item.material_id,
              material_name: item.material_name,
              division_id: item.division_id,
              division_name: item.division,
              uom: item.new_sub_uom,
              batch_number: item.batch_number,
              batch_id: item.batch_id,
              batch_list: item.batch_list,
              free_stock: item.free_stock === undefined ? 0:item.free_stock,
              new_batch_value: item.new_batch_value,
              hsn_code: item.hsn_code,
              cfc_value:item.cfc_value,
              material_qty: item.new_material_quantity,
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
              additional_cess_value: item.additional_cess_value,
              total_tax: item.total_tax,
              tcs_rate: item.tcs_rate,
              tcs_value: item.tcs_value,
              total_payable: item.total_amount,
              stict_status: item.stict_status,
              cfc_weight: item.cfc_value,
              new_material_qty:item.new_material_quantity,
              mrp_price:item.mrp_price,
              expiry_days:item.expiry_days
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
    { th: "Batch No.", id: "batch_number", weigh: "12%", sub_item: [] },
    { th: "MRP Price", id: "mrp_price", weigh: "12%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "6%", sub_item: [] },
    { th: "CFC Quantity", id: "cfc_value", weigh: "8%", sub_item: [] },
    { th: "Material Quantity", id: "division", weigh: "8%", sub_item: [] },
    { th: "Total Amount", id: "total_amount", weigh: "10%", sub_item: [] }
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
      cfc_value: "",
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
      stict_status: "",
      cfc_weight: "",
      new_material_qty:"",
      mrp_price:"",
      expiry_days:""
    },
  ]);

  console.log(orderMaterial);

  const [supplierID, setsupplierID] = useState("");

  const [supplierName, setsupplierName] = useState("");

  const [routeID, setrouteID] = useState("");

  const [routeName, setrouteName] = useState("");

  const [deliveryStatus,setdeliveryStatus] = useState(0);

  const [vehicleDetails, setvehicleDetails] = useState();

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleRouterHomePage = () => {
    Cookies.remove("invoice_id");
    router.push("/pick_list_page");
  };

  const [loadingPage, setloadingPage] = useState(false);
  

  if (loadingPage) {
    return <Loader />;
  }

  let totalPayable = 0;
  orderMaterial.forEach((item) => {
    totalPayable += item.total_payable || 0;
  });
  const formattedTotalPayable = parseFloat(totalPayable.toFixed(2));

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
            View {deliveryStatus === 1 && 'Delivery '}Pick List
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
                      Pick List Details
                    </Typography>
                  </Box>

                  <div className="display_flex">
                    <span className="fontInput2">
                      Sales Man : {supplierName},
                    </span>
                  </div>
                  <div className="display_flex">
                    <span className="fontInput2">
                      Route : {routeName},
                    </span>
                  </div>
                  <div className="display_flex">
                  <span className="fontInput2">
                    Pick List Number : {invoiceNumber}
                  </span>
                </div>
                {deliveryStatus === 1 && <div className="display_flex" style={{marginTop:'5px'}}>
                  <span className="fontInput2">
                    Delivery Date : {invoiceDate}
                  </span>
                </div>}
                </Box>
                {deliveryStatus === 1 && 
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
                    {vehicleDetails?.vehicle_number}.
                  </span>
                </div>
                <div className="display_flex">
                  <span className="fontInput2">
                    Starting Kilometers : {startingKiloMeter}
                  </span>
                </div>
                <div className="display_flex">
                  <span className="fontInput2">
                    Ending Kilometers : {endingKiloMeter}
                  </span>
                </div>
              </Box>}
                
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
                <TotalAmount amount={(formattedTotalPayable || 0).toFixed(2)} />
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
