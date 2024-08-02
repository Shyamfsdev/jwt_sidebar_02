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
import ProductCreate from "../../components/product_view/DeliveryPickList";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import VehicleCreate from "../../components/histroy/PickListVehicleCreate";
import PurchaseLayout from "../../components/createlayout/PickListLayout";
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
    const fetchData = async (access_token, data_uniq_id) => {
      axiosGet
        .get(
          `pick_list_get?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
        )
        .then((response) => {
          setsupplierID(response.data.data[0]?.salesman_id);
          setsupplierName(response.data.data[0]?.salesman_name);
          setrouteName(response.data.data[0]?.route_name);
          setrouteID(response.data.data[0]?.route_id);
          setinvoiceNumber(response.data.data[0]?.pick_list_number);
          setdeliveryStatus(response.data.data[0]?.delivery_pick_list);
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
              batch_id:
                item.batch_id === undefined || item.batch_id === null
                  ? ""
                  : item.batch_id,
              batch_list:
                item.batch_list === undefined || item.batch_list === null
                  ? []
                  : item.batch_list,
              free_stock: item.free_stock === undefined ? 0 : item.free_stock,
              hsn_code: item.hsn_code,
              material_qty: item.new_material_quantity,
              base_value: item.base_value,
              total_payable: item.total_amount,
              stict_status: item.stict_status,
              cfc_weight: item.cfc_value,
              new_material_qty:item.new_material_quantity,
              mrp_price:item.mrp_price,
              expiry_days:item.expiry_days,
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
    { th: "Expiry Days", id: "expiry_days", weigh: "12%", sub_item: [] },
    { th: "UOM", id: "uom", weigh: "6%", sub_item: [] },
    { th: "CFC Quantity", id: "division", weigh: "8%", sub_item: [] },
    { th: "Material Quantity", id: "material_qty", weigh: "10%", sub_item: [] }
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
      hsn_code: "",
      material_qty: "",
      base_value: "",
      total_payable: "",
      stict_status: "",
      cfc_weight: "",
      new_material_qty:"",
      mrp_price:"",
      expiry_days:""
    },
  ]);

  const [supplierID, setsupplierID] = useState("");

  const [supplierName, setsupplierName] = useState("");

  const [routeID, setrouteID] = useState("");

  const [routeName, setrouteName] = useState("");

  const [deliveryStatus, setdeliveryStatus] = useState(0);

  const [vehicleDetails, setvehicleDetails] = useState({
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

  const [invoiceNumber, setinvoiceNumber] = useState("");

  const [invoiceDate, setinvoiceDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleInvoiceDateChange = (event) => {
    const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
    setinvoiceDate(formattedDate);
  };

  const handleRouterHomePage = () => {
    Cookies.remove("invoice_id");
    router.push("/pick_list_page");
  };

  const EmployeeCreateMaster = async () => {
    const filteredOrderMaterial = orderMaterial.filter(
      (row) => row.material_code !== ""
    );
    if (filteredOrderMaterial.length !== 0) {
      setloadingPage(true);
      const mdata = {
        access_token: ACCESS_TOKEN,
        data_uniq_id: INVOICE_ID,
        delivery_date: invoiceDate,
        order_material: filteredOrderMaterial,
        vehicle_details: vehicleDetails,
        starting_kilo_meter:startingKiloMeter,
        ending_kilo_meter:endingKiloMeter
      };

      axiosPost.post(`delivery_pick_list_master`, mdata).then((res) => {
        setloadingPage(false);
        if (res.data.action_status === "Error") {
          setError({ status: "error", message: res.data.message });
        } else {
          const successMessage = "Created Successfully";
          setError({ status: "success", message: successMessage });
          setTimeout(() => {
            Cookies.remove("invoice_id");
            router.push("/pick_list_page");
          }, 200);
        }
      });
    } else {
      setloadingPage(false);
      setError({ status: "error", message: "Material Code is Required" });
    }
  };

  const [loadingPage, setloadingPage] = useState(false);

  const [startingKiloMeter,setstartingKiloMeter] = useState("");

  const [endingKiloMeter,setendingKiloMeter] = useState("");

  const ChangeKiloMeter = (event,ref) => {
    if (!isNaN(event.target.value) && event.target.value >= 0){
      if(ref === 'start_kilo'){
        setstartingKiloMeter(event.target.value)
      }else{
        setendingKiloMeter(event.target.value)
      }
    }else{
      if(ref === 'start_kilo'){
        setstartingKiloMeter("")
      }else{
        setendingKiloMeter("")
      }
    }
  }

  const SupplierDetailsComponent = () => {
    return (
      <Paper
        sx={{ p: 1, mr: 1, width: "20%", height: "83vh", overflow: "auto" }}
      >
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            PickList Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Sales Man"
            variant="outlined"
            disabled
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={supplierName}
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
            label="Route"
            variant="outlined"
            disabled
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={routeName}
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
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography
            variant="p"
            fontSize={"12px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Reference PickList Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Picklist Number"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            disabled
            value={invoiceNumber}
            name="purchase_entry_number"
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
            label="Delivery Date"
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
        <VehicleCreate
          vehicleDetails={vehicleDetails}
          HandleVehicleDetails={HandleVehicleDetails}
        />
        <Box sx={{ mb: 2, mt: 2 }}>
          <Typography
            variant="p"
            fontSize={"14px"}
            fontWeight={"bold"}
            color={"primary"}
          >
            Delivery Details
          </Typography>
        </Box>
        <Box sx={{ margin: "8px 0px" }}>
          <TextField
            id="outlined-basic"
            label="Starting Kilometers"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={startingKiloMeter}
            onChange={(event) => ChangeKiloMeter(event,'start_kilo')}
            name="start_kilo"
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
            label="Ending Kilometers"
            variant="outlined"
            size="small"
            style={{ marginTop: "8px" }}
            fullWidth
            value={endingKiloMeter}
            onChange={(event) => ChangeKiloMeter(event,'end_kilo')}
            name="end_kilo"
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

  const ProductCreateComponent = () => {
    return (
      <ProductCreate
        product_table={product_table}
        orderMaterial={orderMaterial}
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
            Create Delivery Picklist
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            className="nunito_font_width create_button"
            onClick={() => EmployeeCreateMaster()}
          >
            Generate
          </Button>
        </div>
      </div>
      <PurchaseLayout
        SupplierDetailsComponent={SupplierDetailsComponent}
        ProductCreateComponent={ProductCreateComponent}
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
