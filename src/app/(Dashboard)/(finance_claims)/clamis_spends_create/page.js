"use client";
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    TextField,
    Autocomplete,
    Modal,
    Stack,
    TableContainer,
    TableBody,
    Table,
    TableCell,
    TableHead,
    TableRow
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
import PurchaseLayout from "../../components/createlayout/FinanceLayout";

const EmployeeCreate = () => {
    const ACCESS_TOKEN = Cookies.get("token");
    const currentYear = new Date().getFullYear();
    const [error, setError] = useState({ status: "", message: "" });
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
    };

    const [salesMaster, setsalesMaster] = useState([]);

    const HandleSalesMaster = () => {
        const fetchData = async (
            access_token,
            searchValue,
            createdStartDate,
            createdEndDate
        ) => {
            axiosGet
                .get(
                    `invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
                )
                .then((res) => {
                    console.log(res, 'res');
                    if (res.data.action == "success") {
                        setsalesMaster(res.data.data);
                    }
                });
        };
        fetchData(ACCESS_TOKEN, "", "", "");
    };

    useEffect(() => {
        HandleSalesMaster();
    }, []);

    const router = useRouter();

    const [invoiceDate, setinvoiceDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

    const handleInvoiceDateChange = (event) => {
        const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
        setinvoiceDate(formattedDate);
    };

    const [salesInvoiceID, setsalesInvoiceID] = useState("");

    const [salesInvoiceNumber, setsalesInvoiceNumber] = useState("");

    const [supplierDetails, setsupplierDetails] = useState();

    const [supplierID, setsupplierID] = useState("");

    const [supplierName, setsupplierName] = useState("");

    const [orderMaterials, setorderMaterials] = useState();


    const handleSalesInvoiceChange = (event, value) => {
        if (value != null) {
            setsalesInvoiceID(value.pur_invoice_id);
            setsalesInvoiceNumber(value.pur_invoice_number);
            setsupplierDetails(value.supplier_data);
            setsupplierID(value.supplier_id);
            setsupplierName(value.supplier_name);
            setorderMaterials(value.invoice_material_details);
        } else {
            setsalesInvoiceID("");
            setsalesInvoiceNumber("");
            setsupplierDetails();
            setsupplierID("");
            setsupplierName("");
            setorderMaterials();
        }
    };




    const [loadingPage, setloadingPage] = useState(false);

    const totalSum = orderMaterials?.reduce((sum, item) => sum + item.invoice_discount_value, 0);

    const totalPer = orderMaterials?.reduce((sum, item) => sum + item.invoice_discount, 0);

    const EmployeeCreateMaster = async () => {
        // setloadingPage(true);
        const mdata = {
            access_token: ACCESS_TOKEN,
            claims_ccis_type: 1,
            investment_per: totalPer,
            claims_date: invoiceDate,
            investment_amount: totalSum,
            purchase_number: salesInvoiceNumber,
            purchase_id: salesInvoiceID,
            sales_number: "",
            sales_id: "",
            customer_id: "",
            customer_name: "",
            supplier_id: supplierID,
            supplier_name: supplierName
        };
        console.log(mdata);
        axiosPost.post(`claims_ccis_create_api`, mdata).then((res) => {
            setloadingPage(false);
            console.log(res);
            if (res.data.action_status === "Error") {
                setError({ status: "error", message: res.data.message });
            } else {
                const successMessage = "Day Book Entry Created Successfully";
                setError({ status: "success", message: successMessage });
                setTimeout(() => {
                    router.push("/claims_ccis_k4_list");
                }, 200);
            }
        });
    };

    const handleListClaim = () => {
        router.push(`/claims_ccis_k4_list`);
    };

    const SupplierDetailsComponent = () => {
        return (
            <Paper
                sx={{ p: 1, mr: 1, width: "25%", height: "83vh", overflow: "auto" }}
            >
                <Box sx={{ mb: 1, mt: 2 }}>
                    <Typography
                        variant="p"
                        fontSize={"14px"}
                        fontWeight={"bold"}
                        color={"primary"}
                    >
                        Claim Details
                    </Typography>
                </Box>
                <Box sx={{ margin: "18px 0px" }}>
                    <TextField
                        id="outlined-basic"
                        label="Voucher Date"
                        disabled
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
                <Box sx={{ mb: 1, mt: 2 }}>
                    <Typography
                        variant="p"
                        fontSize={"14px"}
                        fontWeight={"bold"}
                        color={"primary"}
                    >
                        Purchase Details
                    </Typography>
                </Box>

                <Box sx={{ margin: "18px 0px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "8px" }}
                        options={salesMaster}
                        value={
                            salesMaster.find(
                                (year) => year.pur_invoice_number === salesInvoiceNumber
                            ) || null
                        }
                        onChange={(e, value) => handleSalesInvoiceChange(e.target.value, value)}
                        getOptionLabel={(val) => val.pur_invoice_number}
                        required
                        id="sal_invoice_number"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={salesInvoiceNumber}
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
                                label="Bill Number"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>

                {salesInvoiceNumber !== "" &&
                    <Box sx={{ mb: 1, mt: 2 }}>
                        <Typography
                            variant="p"
                            fontSize={"14px"}
                            fontWeight={"bold"}
                            color={"primary"}
                        >
                            Supplier Details
                        </Typography>
                    </Box>}

                {salesInvoiceNumber !== "" && <div style={{ borderRadius: "10px", border: "2px solid rgb(222 222 222)" }}><Box sx={{ padding: "8px 10px" }}>
                    <Typography className="table_cell_2">
                        {supplierName} ( {supplierDetails?.contact_no} ),
                    </Typography>
                    <Typography className="table_cell_2">
                        {supplierDetails?.email_id},
                    </Typography>
                    <Typography className="table_cell_2">
                        {supplierDetails?.address?.flatStreet},
                    </Typography>
                    <Typography className="table_cell_2">
                        {supplierDetails?.address?.district},{supplierDetails?.address?.state} - {supplierDetails?.address?.pincode}.
                    </Typography>
                </Box></div>}



                {salesInvoiceNumber !== "" &&
                    <Box sx={{ mb: 1, mt: 2 }}>
                        <Typography
                            variant="p"
                            fontSize={"14px"}
                            fontWeight={"bold"}
                            color={"primary"}
                        >
                            Bank Details
                        </Typography>
                    </Box>}
                {salesInvoiceNumber !== "" && <div style={{ borderRadius: "10px", border: "2px solid rgb(222 222 222)" }}><Box sx={{ padding: "8px 10px" }}>
                    <Typography className="table_cell_2 displey_space_between">
                        <span className="label">Account Number</span> <span className="colon"> : </span><span className="value">{supplierDetails?.bank_details?.accountNo}</span>
                    </Typography>
                    <Typography className="table_cell_2 displey_space_between">
                        <span className="label">IFSC Code</span> <span className="colon"> : </span><span className="value">{supplierDetails?.bank_details?.ifsc}</span>
                    </Typography>
                    <Typography className="table_cell_2 displey_space_between">
                        <span className="label">Bank Name</span> <span className="colon"> : </span><span className="value">{supplierDetails?.bank_details?.bankName}</span>
                    </Typography>
                    <Typography className="table_cell_2 displey_space_between">
                        <span className="label">Branch</span> <span className="colon"> : </span><span className="value">{supplierDetails?.bank_details?.branch}</span>
                    </Typography>
                </Box></div>}
            </Paper>
        );
    };



    const ProductCreateComponent = () => {
        return (
            <Paper
                sx={{ p: 1, mr: 1, width: "75%", height: "83vh", overflow: "auto" }}
            >
                <Box sx={{ margin: "8px 0px" }}>
                    <TableContainer
                        sx={{
                            width: {
                                xs: "274px",
                                sm: "100%",
                            },
                            height: "73.5vh",
                            overflow: "auto",
                        }}
                    >
                        <Table
                            aria-label="customized table"
                            sx={{
                                whiteSpace: "nowrap",
                                width: "100%",
                            }}
                        >
                            <TableHead sx={{ background: "#185AA6" }}>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Material Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Material Code
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Batch Number
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Material Quantity
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Base Value
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Total Amount
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Invoice Discount ( % )
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            Invoice Discount ( Amount )
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderMaterials?.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        style={{ border: "1px solid rgb(119 119 119 / 20%)" }}
                                    >
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '10%'
                                            }}

                                            align="center"
                                        >
                                            {row.material_name}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.material_code}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.batch_number}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.material_qty}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.base_value}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.total_amount}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.invoice_discount}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.invoice_discount_value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="display_flex_end" style={{ width: "100%", padding: "3px" }}>
                        <Typography
                            className="table_cell_2"
                        >
                            Total Investment Amount : {parseFloat(totalSum || 0).toFixed(0)}
                        </Typography>
                    </div>
                </Box>
            </Paper>
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
                        Create New Claims Spent
                    </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                        className="nunito_font_width create_button"
                        onClick={() => EmployeeCreateMaster()}
                    >
                        Create
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
