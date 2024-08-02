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
                    `sales_invoice_details_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
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


    const [salesmanMaster, setsalesmanMaster] = useState([]);

    const HandleSalesmanMaster = () => {
        const fetchData = async (
            access_token,
            searchValue,
            createdStartDate,
            createdEndDate
        ) => {
            axiosGet
                .get(
                    `salesman_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
                )
                .then((res) => {
                    if (res.data.action == "success") {
                        setsalesmanMaster(res.data.data);
                    }
                });
        };
        fetchData(ACCESS_TOKEN, "", "", "");
    };

    const [subAccountMaster, setsubAccountMaster] = useState([]);

    const HandleSubAccountHeadeMaster = (value) => {
        const fetchData = async (
            access_token,
            searchValue,
            createdStartDate,
            createdEndDate
        ) => {
            axiosGet
                .get(
                    `sub_account_head_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}&account_head_id=${value}`
                )
                .then((res) => {
                    console.log(res, 'resv');
                    if (res.data.action == "success") {
                        setsubAccountMaster(res.data.data);
                    }
                });
        };
        fetchData(ACCESS_TOKEN, "", "", "");
    };

    const [accountTypeMaster, setaccountTypeMaster] = useState([]);

    const HandleAccountTypeMaster = () => {
        const fetchData = async (
            access_token,
            searchValue,
            createdStartDate,
            createdEndDate
        ) => {
            axiosGet
                .get(
                    `account_head_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
                )
                .then((res) => {
                    if (res.data.action == "success") {
                        setaccountTypeMaster(res.data.data);
                    }
                });
        };
        fetchData(ACCESS_TOKEN, "", "", "");
    };

    useEffect(() => {
        HandleSalesmanMaster();
        HandleSalesMaster();
        HandleAccountTypeMaster();
    }, []);

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

    const handleProductChange = (event, value, index) => {
        const newfield = [...cashTypeTable];
        if (event !== undefined) {
            if (!isNaN(event.target.value) && Number(event.target.value) >= 0) {
                const total_amount = Number(event.target.value) * Number(newfield[index].label);
                const totalSum = cashTypeTable.reduce((sum, item) => sum + item.total, 0);
                const balanceAmount = Number(transeAmount) - totalSum;
                const balanceAmount2 = balanceAmount + Number(newfield[index].total);
                if (total_amount <= balanceAmount2) {
                    newfield[index].value = Number(event.target.value);
                    const tot = Number(event.target.value) * Number(newfield[index].label);
                    newfield[index].total = tot;
                    setcashTypeTable(newfield);
                }
            }
        }
    };

    const router = useRouter();

    const [invoiceDate, setinvoiceDate] = useState(
        moment(new Date()).format("YYYY-MM-DD")
    );

    const handleInvoiceDateChange = (event) => {
        const formattedDate = moment(event.target.value).format("YYYY-MM-DD");
        setinvoiceDate(formattedDate);
    };

    const [creditStatus, setcreditStatus] = useState();

    const [transeAmount, settranseAmount] = useState("");

    const HandleAmount = (event) => {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            settranseAmount(event.target.value);
            setcashTypeTable([
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
                }])
        }
    }

    const [subAccountID, setsubAccountID] = useState("");

    const [subAccountName, setsubAccountName] = useState("");


    const handleDayBookTypeChange = (event, value) => {
        if (value != null) {
            setsubAccountID(value.data_uniq_id);
            setsubAccountName(value.sub_account_head_type);
        } else {
            setsubAccountID("");
            setsubAccountName("");
        }
    };

    const [salesInvoiceID, setsalesInvoiceID] = useState("");

    const [salesInvoiceNumber, setsalesInvoiceNumber] = useState("");


    const handleSalesInvoiceChange = (event, value) => {
        if (value != null) {
            setsalesInvoiceID(value.data_uniq_id);
            setsalesInvoiceNumber(value.sales_invoice_number);
        } else {
            setsalesInvoiceID("");
            setsalesInvoiceNumber("");
        }
    };

    const [salesmanId, setsalesmanId] = useState("");

    const [salesmanName, setsalesmanName] = useState("");


    const handleSalesmanChange = (event, value) => {
        if (value != null) {
            setsalesmanId(value.data_uniq_id);
            setsalesmanName(value.full_name);
        } else {
            setsalesmanId("");
            setsalesmanName("");
        }
    };

    const [accountTypeID, setaccountTypeID] = useState("");

    const [accountTypeName, setaccountTypeName] = useState("");

    const handleAccountTypeChange = (event, value) => {
        console.log(value);
        if (value != null) {
            setaccountTypeID(value.data_uniq_id);
            setaccountTypeName(value.account_head_type);
            setsalesmanId("");
            setsalesmanName("");
            setsalesInvoiceID("");
            setsalesInvoiceNumber("");
            setsubAccountID("");
            setsubAccountName("");
            setcreditStatus(value.employee_status);
            HandleSubAccountHeadeMaster(value.data_uniq_id);
        } else {
            setaccountTypeID("");
            setaccountTypeName("");
            setsalesmanId("");
            setsalesmanName("");
            setsalesInvoiceID("");
            setsalesInvoiceNumber("");
            setsubAccountID("");
            setsubAccountName("");
            setcreditStatus();
            HandleSubAccountHeadeMaster('');
        }
    };


    const [loadingPage, setloadingPage] = useState(false);

    const EmployeeCreateMaster = async () => {
        // setloadingPage(true);
        const totalSum = cashTypeTable.reduce((sum, item) => sum + item.total, 0);
        if (transeAmount == totalSum) {
            const mdata = {
                access_token: ACCESS_TOKEN,
                employee_id: salesmanId,
                employee_name: salesmanName,
                transaction_amount: transeAmount,
                voucher_date: invoiceDate,
                account_type_id: accountTypeID,
                account_type: accountTypeName,
                narration_notes: subAccountName,
                narration_notes_id: subAccountID,
                sales_invoice_id: salesInvoiceID,
                sales_invoice_number: salesInvoiceNumber,
                cash_details: cashTypeTable,
                employee_status: creditStatus == undefined ? "" : creditStatus
            };
            console.log(creditStatus);
            console.log(mdata);
            axiosPost.post(`day_book_entry_api`, mdata).then((res) => {
                setloadingPage(false);
                console.log(res);
                if (res.data.action_status === "Error") {
                    setError({ status: "error", message: res.data.message });
                } else {
                    const successMessage = "Day Book Entry Created Successfully";
                    setError({ status: "success", message: successMessage });
                    setTimeout(() => {
                        router.push("/day_book_entry");
                    }, 200);
                }
            });
        } else {
            setError({ status: "error", message: "Amount Mismatch" });
        }

    };

    const handleListClaim = () => {
        router.push(`/day_book_entry`);
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
                        Voucher Details
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
                        Day Book Details
                    </Typography>
                </Box>
                <Box sx={{ margin: "18px 0px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "8px" }}
                        options={accountTypeMaster}
                        value={
                            accountTypeMaster.find(
                                (year) => year.account_head_type === accountTypeName
                            ) || null
                        }
                        onChange={(e, value) => handleAccountTypeChange(e.target.value, value)}
                        getOptionLabel={(val) => val.account_head_type}
                        required
                        id="day_book"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={accountTypeName}
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
                                label="Account Head"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>
                <Box sx={{ margin: "18px 0px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "8px" }}
                        options={salesmanMaster}
                        value={
                            salesmanMaster.find(
                                (year) => year.full_name === salesmanName
                            ) || null
                        }
                        onChange={(e, value) => handleSalesmanChange(e.target.value, value)}
                        getOptionLabel={(val) => val.full_name}
                        required
                        id="salesman_id"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={salesmanName}
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
                                label="Employee Name"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>
                <Box sx={{ margin: "18px 0px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "8px" }}
                        options={subAccountMaster}
                        value={
                            subAccountMaster.find(
                                (year) => year.sub_account_head_type === subAccountName
                            ) || null
                        }
                        onChange={(e, value) => handleDayBookTypeChange(e.target.value, value)}
                        getOptionLabel={(val) => val.sub_account_head_type}
                        required
                        id="sub_account_head_type"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={subAccountName}
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
                                label="Narration"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>
                <Box sx={{ margin: "18px 0px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "8px" }}
                        options={salesMaster}
                        value={
                            salesMaster.find(
                                (year) => year.sales_invoice_number === salesInvoiceNumber
                            ) || null
                        }
                        onChange={(e, value) => handleSalesInvoiceChange(e.target.value, value)}
                        getOptionLabel={(val) => val.sales_invoice_number}
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
                <Box sx={{ margin: "8px 0px" }}>
                    <TextField
                        id="outlined-basic"
                        label="Amount"
                        variant="outlined"
                        size="small"
                        style={{ marginTop: "8px" }}
                        fullWidth
                        value={transeAmount}
                        onChange={(e) => HandleAmount(e)}
                        name="notes"
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

    const ProductCreateComponent = () => {
        return (
            <Paper
                sx={{ p: 1, mr: 1, width: "75%", height: "83vh", overflow: "auto" }}
            >
                <Box sx={{ mb: 1, mt: 2 }}>
                    <Typography
                        variant="p"
                        fontSize={"14px"}
                        fontWeight={"bold"}
                        color={"primary"}
                    >
                        Cash Challan
                    </Typography>
                </Box>
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
                                            SNO.
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            CASH NOTES
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            COUNT
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ padding: "6px", border: "1px solid #ffffff5e" }}
                                    >
                                        <Typography className="table_cell_white" variant="h5">
                                            ₹ RS
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cashTypeTable.map((row, index) => (
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
                                            {index + 1}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.label} ( {row.cash_type} ) X
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            <TextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={row.value}
                                                onChange={(event, value) =>
                                                    handleProductChange(event, value, index)
                                                }
                                                name="value"
                                                inputProps={{
                                                    style: {
                                                        fontSize: "12px",
                                                        width: "100%",
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    style: {
                                                        fontSize: "12px",
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                padding: "6px",
                                                border: "1px solid rgb(119 119 119 / 20%)",
                                                width: '30%'
                                            }}

                                            align="center"
                                        >
                                            {row.total}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                        Create New Day Book Entry
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
