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
import ProductCreate from "../../components/product_view/DayBookEntryView";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Loader from "../../loading";
import TotalAmount from "../../components/buttons/ViewTotalAmount";
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
                    `day_book_entry_list?access_token=${access_token}&data_uniq_id=${data_uniq_id}`
                )
                .then((response) => {
                    console.log(response);
                    setaccountTypeID(response.data.data[0]?.account_type_id);
                    setaccountTypeName(response.data.data[0]?.account_type);
                    setsalesmanId(response.data.data[0]?.employee_id);
                    setsalesmanName(response.data.data[0]?.employee_name);
                    setsalesInvoiceID(response.data.data[0]?.sales_invoice_id);
                    setsalesInvoiceNumber(response.data.data[0]?.sales_invoice_number);
                    setsubAccountID(response.data.data[0]?.narration_notes_id);
                    setsubAccountName(response.data.data[0]?.narration_notes);
                    setcreditStatus(response.data.data[0]?.employee_status);
                    settranseAmount(response.data.data[0]?.transaction_amount);
                    setcashTypeTable(response.data.data[0]?.cash_details);
                    setinvoiceDate(response.data.data[0]?.voucher_date);
                    setinvoiceNumber(response.data.data[0]?.voucher_entry_number);
                    setloadingPage(false);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        };
        fetchData(ACCESS_TOKEN, INVOICE_ID);
    };

    const [accountTypeID, setaccountTypeID] = useState("");

    const [accountTypeName, setaccountTypeName] = useState("");

    const [salesmanId, setsalesmanId] = useState("");

    const [salesmanName, setsalesmanName] = useState("");

    const [salesInvoiceID, setsalesInvoiceID] = useState("");

    const [salesInvoiceNumber, setsalesInvoiceNumber] = useState("");

    const [subAccountID, setsubAccountID] = useState("");

    const [subAccountName, setsubAccountName] = useState("");

    const [creditStatus, setcreditStatus] = useState();

    const [transeAmount, settranseAmount] = useState("");

    const [cashTypeTable, setcashTypeTable] = useState([
        {
            id: 9,
            label: 1,
            value: '',
            total: 0,
            cash_type: 'Coins'
        },
        {
            id: 10,
            label: 2,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 1,
            label: 5,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 2,
            label: 10,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 3,
            label: 20,
            value: '',
            total: 0,
            cash_type: 'Coins'
        }, {
            id: 12,
            label: 10,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 13,
            label: 20,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 4,
            label: 50,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 5,
            label: 100,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 6,
            label: 200,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }, {
            id: 7,
            label: 500,
            value: '',
            total: 0,
            cash_type: 'Notes'
        }]);


    useEffect(() => {
        GetFetData();
    }, []);

    const router = useRouter();

    const product_table = [
        { th: "#", id: "id", weigh: "10%", sub_item: [] },
        { th: "CASH NOTES", id: "material_code", weigh: "30%", sub_item: [] },
        { th: "COUNT", id: "material_name", weigh: "30%", sub_item: [] },
        { th: "₹ RS", id: "uom", weigh: "30%", sub_item: [] },
    ];

    const [invoiceNumber, setinvoiceNumber] = useState("")

    const [invoiceDate, setinvoiceDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

    const handleRouterHomePage = () => {
        Cookies.remove("data_uniq_id");
        router.push("/day_book_entry");
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
                        View Day Book Entry
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
                                            Day Book Entry Details
                                        </Typography>
                                    </Box>

                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            No : {invoiceNumber}
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">Date : {invoiceDate},</span>
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
                                            Voucher Details
                                        </Typography>
                                    </Box>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Account Heading : {accountTypeName},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Employee Name : {salesmanName === '' || salesmanName === undefined ? 'NA':salesmanName},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Narration : {subAccountName === '' || subAccountName === undefined ? 'NA':subAccountName},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Invoice Number : {salesInvoiceNumber === '' || salesInvoiceNumber === undefined ? 'NA':salesInvoiceNumber},
                                        </span>
                                    </div>
                                    <div className="display_flex">
                                        <span className="fontInput2">
                                            Amount : {transeAmount},
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
                                    Voucher Details
                                </Typography>
                                <ProductCreate
                                    product_table={product_table}
                                    orderMaterial={cashTypeTable}
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
