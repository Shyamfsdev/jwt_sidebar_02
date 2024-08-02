"use client";
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosPost, axiosGet } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProductCreate from "../../components/product_view/ClaimsView";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import moment from "moment";

const EmployeeCreate = () => {
    const ACCESS_TOKEN = Cookies.get("token");
    const INVOICE_ID = Cookies.get("data_uniq_id");
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
                    `claims_ccis_list?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
                )
                .then((response) => {
                    console.log(response);
                    setsupplierDetails(response.data.data[0]?.supplier_list);
                    setsupplierName(response.data.data[0]?.supplier_name);
                    setpurchaseNumber(response.data.data[0]?.purchase_number);
                    settranseAmount(response.data.data[0]?.investment_amount);
                    setinvoiceDate(response.data.data[0]?.claims_date);
                    setinvoiceNumber(response.data.data[0]?.claims_ccis_number);
                    setorderMaterial(response.data.data[0]?.invoice_data?.order_material);
                    setloadingPage(false);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
        fetchData(ACCESS_TOKEN, INVOICE_ID);
    };

    const [supplierDetails, setsupplierDetails] = useState();

    const [supplierName, setsupplierName] = useState("");

    const [purchaseNumber, setpurchaseNumber] = useState("");

    const [orderMaterial, setorderMaterial] = useState([]);

    const [transeAmount, settranseAmount] = useState("");

    useEffect(() => {
        GetFetData();
    }, []);

    const router = useRouter();

    const product_table = [
        { th: "#", id: "id", weigh: "10%", sub_item: [] },
        { th: "Material Code", id: "material_code", weigh: "30%", sub_item: [] },
        { th: "Material Name", id: "material_name", weigh: "30%", sub_item: [] },
        { th: "UOM", id: "uom", weigh: "30%", sub_item: [] },
        { th: "Batch Number", id: "batch_number", weigh: "30%", sub_item: [] },
        { th: "Division", id: "division", weigh: "30%", sub_item: [] },
        { th: "RFA Division", id: "division_id", weigh: "30%", sub_item: [] },
        { th: "Material Quantity", id: "material_qty", weigh: "30%", sub_item: [] },
        { th: "Base Value", id: "base_value", weigh: "30%", sub_item: [] },
        { th: "Other Discount", id: "other_discount_value", weigh: "30%", sub_item: [] },
        { th: "Total Tax", id: "total_tax", weigh: "30%", sub_item: [] },
        { th: "Total Payable", id: "total_payable", weigh: "30%", sub_item: [] },
    ];

    const [invoiceNumber, setinvoiceNumber] = useState("")

    const [invoiceDate, setinvoiceDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

    const handleRouterHomePage = () => {
        Cookies.remove("data_uniq_id");
        router.push("/claims_k4_list");
    };

    const [loadingPage, setloadingPage] = useState(false);

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
                        View Claims K4
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
                                            K4 Details
                                        </Typography>
                                    </Box>

                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Claim Number : {invoiceNumber}
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">Claim Date : {invoiceDate},</span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Amount : {transeAmount},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Invoice Number : {purchaseNumber}
                                        </span>
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
                                            Supplier Details
                                        </Typography>
                                    </Box>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            {supplierName} - ( {supplierDetails?.contact_no} ),
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                        {supplierDetails?.email_id} ,
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            {supplierDetails?.address?.flatStreet},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                        {supplierDetails?.address?.district},{supplierDetails?.address?.state} - {supplierDetails?.address?.pincode} .
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
                                    product_type = {"purchase"}
                                />
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
