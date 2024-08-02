"use client";
import {
    Box,
    Typography,
    List,
    ListItemButton,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Menu,
    Button,
    IconButton,
    Drawer,
    TextField,
    Divider,
    Badge,
    Stack,
    Autocomplete,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TableHead,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { axiosGet, axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import CreateButton from "../../../(Dashboard)/components/buttons/CreateButton";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Cookies from "js-cookie";
import {
    ArrowBack,
    DeleteForeverOutlined,
    EditOutlined,
    MoreVertOutlined,
    RefreshOutlined,
} from "@mui/icons-material";
import MasterTable from "../../components/dashboard/UserTable";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";

const EmployeeList = () => {
    const ACCESS_TOKEN = Cookies.get("token");
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState({ status: "", message: "" });
    const handleCloseError = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
    };
    const [openDrawerType, setOpenDrawerType] = useState(1);

    const [openDrawer, setOpenDrawer] = useState(false);
    const [effectToggle, setEffectToggle] = useState(false);
    const [filtersList, setfiltersList] = useState(false);
    const [actionData, setActionData] = React.useState("");

    const handlefilterBadgeVisible = () => {
        if (isStatusSelected || isDateSelected) {
            // setFilterBadgeVisible(true);
            return true;
        } else {
            // setFilterBadgeVisible(false);
            return false;
        }
    };

    // Menu component element
    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const [pageDrawerWidth, setpageDrawerWidth] = useState(0);

    // Toggel Drawer
    const toggleDrawer = (newOpen, type) => () => {
        if (newOpen === true) {
            setOpenDrawer(newOpen);
            setOpenDrawerType(type);
            setpageDrawerWidth(500);
            setledgerID("");
            setledgerName("");
            setcustomerID("");
            setcustomerName("");
            setsupplierID("");
            setsupplierName("");
        } else {
            setOpenDrawer(newOpen);
            setOpenDrawerType(type);
            setpageDrawerWidth(0);
        }
    };


    const [batchHistory, setbatchHistory] = useState(false);

    const HandleOpenHistory = () => {
        setbatchHistory(!batchHistory);
        handleClose2();
    };

    // Toggel filter component
    const HandleChangeFilter = () => {
        setfiltersList(!filtersList);
    };

    // opne multi status waring
    const handleChange = (event) => {
        setActionData(event.target.value);
        setOpenMultistatus(true);
    };

    const [pageCount, setPageCount] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [limitEnd, setlimitEnd] = useState("15");
    const [dataCount, setdataCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [tableName, settableName] = useState("");
    const [idField, setidField] = useState("");

    const handleLimitChange = (event) => {
        setlimitEnd(event.target.value);
        handleRefresh();
    };

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const APIRecall = () => {
        fetchData(
            ACCESS_TOKEN,
            pageNumber,
            limitEnd,
            searchValue,
            createdStartDate,
            createdEndDate,
            orderType,
            orderField,
            activeStatusFilter
        );
    };


    // Filter/Sort State and Funtions ------
    const [orderField, setOrderField] = useState("created_date");
    const [dateTitle, setDateTitle] = useState("Created Date");
    const [isDateSelected, setIsDateSelected] = useState(false);
    const [isStatusSelected, setIsStatusSelected] = useState(false);
    const [orderType, setOrderType] = useState("desc");
    const [createdStartDate, setCreatedStartDate] = useState("");
    const [createdEndDate, setCreatedEndDate] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [activeStatusFilter, setActiveStatusFilter] = useState(3);

    // Funtion for format date
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    const handleSearchInputChange = (input) => {
        setSearchValue(input);
    };


    const onCreatedDateChange = (data) => {
        const formattedStartDate = formatDate(data[0].startDate);
        const formattedEndDate = formatDate(data[0].endDate);
        setCreatedStartDate(formattedStartDate);
        setCreatedEndDate(formattedEndDate);
        setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
        setIsDateSelected(true);
    };


    const handleActiveStatusChange = (value) => {
        setActiveStatusFilter(value);
        setIsStatusSelected(true);
    };

    const [dataStatus, setDataStatus] = useState(1);
    const [data, setData] = useState([]);
    const [singleData, setSingleData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [postError, setPostError] = useState([]);

    console.log(singleData, 'singleData');

    // Funtion for create new data or edit existing data
    const handleSubmit = () => {
        const jsonData = {
            access_token: ACCESS_TOKEN,
            ledger_type: ledgerID,
            ledger_type_name: ledgerName,
            customer_id: customerID,
            customer_number: customerName,
            supplier_id: supplierID,
            supplier_name: supplierName
        };
        console.log(jsonData, "ledger_master_api");
        try {
            axiosPost.post(`ledger_master_api`, jsonData)
                .then((response) => {
                    console.log(response);
                    if (response.data.action_status === "Success") {
                        setOpenDrawer(false);
                        setpageDrawerWidth(0);
                        setError({ status: "success", message: response.data.message });
                    } else {
                        setError({ status: "error", message: response.data.message });
                    }
                })
                .catch((error) => {
                    console.error("POST Error:", error);
                });

        } catch (error) {
            console.error("An error occurred:", error);
            setOpenDrawer(false);
        }
    };

    const handleUpdateOpening = () => {
        const jsonData = {
            access_token: ACCESS_TOKEN,
            data_uniq_id: singleData?.data_uniq_id,
            opening_balance: openingBalance,
            opening_status: 1
        };
        console.log(jsonData);
        try {
            axiosPost.post(`ledger_opening_balance_api`, jsonData)
                .then((response) => {
                    console.log(response);
                    if (response.data.action_status === "Success") {
                        HandleOpenHistory();
                        setopeningBalance('');
                        fetchData();
                        setError({ status: "success", message: response.data.message });
                    } else {
                        setError({ status: "error", message: response.data.message });
                    }
                })
                .catch((error) => {
                    console.error("POST Error:", error);
                });

        } catch (error) {
            console.error("An error occurred:", error);
            setOpenDrawer(false);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        axiosGet
            .get(
                `ledger_master_list?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter
                }`
            )
            .then((response) => {
                setData(response.data.data);
                setdataCount(response.data.total_items);
                setPageCount(response.data.total_pages);
                settableName(response.data.table_name);
                setidField(response.data.id_field);
                setPageNumber(pageNumber === 0 ? 1 : pageNumber);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        fetchData();
        HandleSupplierMaster();
        HandleCustomerMaster();
    }, [
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderField,
        orderType,
        openDrawer,
        effectToggle,
        activeStatusFilter,
    ]);

    const title = "Ledger";

    const tableHead = [
        {
            id: 1,
            label: `${title} Number`,
            value: "ledger_number",
        },
        {
            id: 3,
            label: `Ledger Type`,
            value: "ledger_type",
        },
        {
            id: 4,
            label: `Customer Name`,
            value: "customer_number",
        },
        {
            id: 5,
            label: "Supplier Name",
            value: "supplier_name",
        },
        {
            id: 6,
            label: "Current Balance",
            value: "current_balance",
        },
    ];

    const handleOnActionClick = (e, data) => {
        console.log(data);
        setSingleData(data?.json[0]);
        setAnchorEl2(e.currentTarget);
    };

    const td_data_set = [];

    data?.map((item, index) => {
        const array_data = {
            id: item.data_uniq_id,
            data: [
                {
                    td: item.ledger_number,
                    id: 1,
                    type: "text",
                    alian: "left",
                },
                {
                    td: item.ledger_type_name,
                    id: 2,
                    type: "text",
                    alian: "left",
                },
                {
                    td: item.ledger_type == 2 ? item.customer_number : 'NA',
                    id: 3,
                    type: "text",
                    alian: "left",
                },
                {
                    td: item.ledger_type == 1 ? item.supplier_name : 'NA',
                    id: 4,
                    type: "text",
                    alian: "left",
                },
                {
                    td: (
                        <Box sx={{ padding: "5px 16px" }}>
                            {item.current_balance}
                        </Box>
                    ),
                    id: 5,
                    type: "text",
                    alian: "left",
                },
            ],
            json: [item],
            active: item.opening_statuss
        };
        td_data_set.push(array_data);
    });

    const handleRefresh = () => {
        setSearchValue("");
        setActiveStatusFilter(3);
        setDateTitle("Created date");
        setIsDateSelected(false);
        setIsStatusSelected(false);
        setCreatedEndDate("");
        setCreatedStartDate("");
        fetchData();
    };

    const [anchorEl2, setAnchorEl2] = useState(null);

    const singleDataGet = (data) => {
        setSingleData(data);
    };

    // Action Component
    const ActionComponent = () => {
        return (
            <FormControl size="small" sx={{ minWidth: "150px" }}>
                <InputLabel
                    sx={{ fontSize: "12px" }}
                    id="demo-simple-select-label"
                    className="nunito_font"
                >
                    {"Change Status"}
                </InputLabel>
                <Select
                    sx={{ fontSize: "14px" }}
                    placeholder={"Change Status"}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={actionData}
                    label={"Change Status"}
                    onChange={handleChange}
                >
                    <MenuItem sx={{ fontSize: "14px" }} value={1}>
                        Active
                    </MenuItem>
                    <MenuItem sx={{ fontSize: "14px" }} value={0}>
                        Inactive
                    </MenuItem>
                </Select>
            </FormControl>
        );
    };


    const ledgerTypeMaster = [
        { id: 1, label: "Sundry Creditors", value: 1 },
        { id: 2, label: "Sundry Debtors", value: 2 }
    ];

    const [customerMaster, setcustomerMaster] = useState([]);

    const HandleCustomerMaster = () => {
        const fetchData = async (
            access_token,
            searchValue,
            createdStartDate,
            createdEndDate
        ) => {
            axiosGet
                .get(
                    `customer_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&opening_status=${0}`
                )
                .then((res) => {
                    if (res.data.action == "success") {
                        setcustomerMaster(res.data.data);
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
                    `supplier_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&opening_status=${0}`
                )
                .then((res) => {
                    if (res.data.action == "success") {
                        setsupplierMaster(res.data.data);
                    }
                });
        };
        fetchData(ACCESS_TOKEN, "", "", "");
    };

    const [ledgerID, setledgerID] = useState("");
    const [ledgerName, setledgerName] = useState("");

    const HandleChangeLedger = (event, value) => {
        if (value != null) {
            setledgerID(value.value);
            setledgerName(value.label);
            setcustomerID("");
            setcustomerName("");
            setsupplierID("");
            setsupplierName("");
        } else {
            setledgerID("");
            setledgerName("");
            setsupplierID("");
            setsupplierName("");
            setcustomerID("");
            setcustomerName("");
        }
    };

    const [supplierID, setsupplierID] = useState("");
    const [supplierName, setsupplierName] = useState("");

    const HandleChangeSupplier = (event, value) => {
        if (value != null) {
            setsupplierID(value.data_uniq_id);
            setsupplierName(value.supplier_name);
        } else {
            setsupplierID("");
            setsupplierName("");
        }
    };

    const [customerID, setcustomerID] = useState("");
    const [customerName, setcustomerName] = useState("");

    const HandleChangeCustomer = (event, value) => {
        if (value != null) {
            setcustomerID(value.data_uniq_id);
            setcustomerName(value.customer_name);
        } else {
            setcustomerID("");
            setcustomerName("");
        }
    };

    const Item = styled("div")(({ theme }) => ({
        padding: theme.spacing(1.5),
        textAlign: "left",
        borderRadius: 8,
        border: 0.5,
    }));

    const CreateCompannet = () => {
        return (
            <div style={{ height: "85vh", overflow: "auto" }}>
                <Box sx={{ my: 1, padding: "10px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ marginTop: "20px", width: "100%" }}
                        options={ledgerTypeMaster}
                        value={
                            ledgerTypeMaster.find(
                                (year) => year.label === ledgerName
                            ) || null
                        }
                        onChange={(e, value) =>
                            HandleChangeLedger(e.target.value, value)
                        }
                        getOptionLabel={(val) => val.label}
                        required
                        id="label"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={ledgerName}
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
                                label="Ledger Type"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>
                {ledgerID == 1 && <Box sx={{ my: 0, padding: "10px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                        options={supplierMaster}
                        value={
                            supplierMaster.find(
                                (year) => year.supplier_name === supplierName
                            ) || null
                        }
                        onChange={(e, value) =>
                            HandleChangeSupplier(e.target.value, value)
                        }
                        getOptionLabel={(val) => val.supplier_name}
                        required
                        id="supplier_name"
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
                </Box>}
                {ledgerID == 2 && <Box sx={{ my: 0, padding: "10px" }}>
                    <Autocomplete
                        margin="normal"
                        variant="outlined"
                        style={{ width: "100%" }}
                        options={customerMaster}
                        value={
                            customerMaster.find(
                                (year) => year.customer_name === customerName
                            ) || null
                        }
                        onChange={(e, value) =>
                            HandleChangeCustomer(e.target.value, value)
                        }
                        getOptionLabel={(val) => val.customer_name}
                        required
                        id="customer_name"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="normal"
                                value={customerName}
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
                                label="Customer Name"
                            />
                        )}
                        clearIcon={null}
                    />
                </Box>}
            </div>
        );
    };

    // Filter component
    const FilterComponent = () => {
        return (
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    gap: 1,
                }}
            >
                <FormControl size="small" sx={{ minWidth: "150px" }}>
                    <InputLabel sx={{ fontSize: "14px" }} id="demo-simple-select-label">
                        {"Status"}
                    </InputLabel>
                    <Select
                        sx={
                            isStatusSelected
                                ? { fontSize: "14px", bgcolor: " #185aa617", height: "34px" }
                                : { fontSize: "14px", height: "34px" }
                        }
                        placeholder={"Status"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activeStatusFilter}
                        label={"Status"}
                        onChange={(e) => handleActiveStatusChange(e.target.value)}
                    >
                        <MenuItem sx={{ fontSize: "14px" }} value={3}>
                            All
                        </MenuItem>
                        <MenuItem sx={{ fontSize: "14px" }} value={1}>
                            Active
                        </MenuItem>
                        <MenuItem sx={{ fontSize: "14px" }} value={0}>
                            Inactive
                        </MenuItem>
                    </Select>
                </FormControl>
                <Box fullWidth>
                    <DateFilter
                        title={dateTitle}
                        buttonType={1}
                        onDateRangeChange={onCreatedDateChange}
                        isSelected={isDateSelected}
                    ></DateFilter>
                </Box>
                <IconButton
                    onClick={handleRefresh}
                    size="small"
                    style={{ marginTop: "-4px" }}
                    className="flex_display"
                >
                    <RefreshOutlined />
                </IconButton>
            </Box>
        );
    };

    const [openingBalance, setopeningBalance] = useState('');

    const handleTaxFormChange = (event) => {
        if (!isNaN(event.target.value) && event.target.value >= 0) {
            setopeningBalance(event.target.value);
        }
    };

    const MenuComponent = () => {
        return (
            <List sx={{ p: 0, fontSize: "12px" }}>
                {singleData?.opening_status == 1 ?
                    <ListItemButton style={{ opacity: '0.4' }}>
                        <Typography variant="p">Update Opening Balance</Typography>
                    </ListItemButton> :
                    <ListItemButton onClick={() => HandleOpenHistory()}>
                        <Typography variant="p">Update Opening Balance</Typography>
                    </ListItemButton>}
            </List>
        );
    };

    return (
        <div style={{ padding: "10px" }}>
            <div
                style={{ display: "flex", justifyContent: "space-between",padding:'10px 0px' }}
                className="displey_space_between"
            >
                <CreateButton
                    heading={title}
                    pagecount={dataCount}
                    onAddClick={toggleDrawer(true, 1)}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                    <SearchFilter
                        onSearchButtonClick={handleSearchInputChange}
                        searchValue={searchValue}
                    />
                    {/* <ExportButton /> */}
                    <Badge
                        color="secondary"
                        variant="dot"
                        invisible={!handlefilterBadgeVisible()}
                        sx={{ marginRight: "15px" }}
                    >
                        <FilterButton
                            HandleChangeFilter={HandleChangeFilter}
                            filtersList={filtersList}
                        />
                    </Badge>
                </Box>
            </div>
            <Collapse in={filtersList} timeout="auto" unmountOnExit>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    {FilterComponent()}
                </Box>
            </Collapse>
            <div>
                <MasterTable
                    pageCount={pageCount}
                    limitEnd={limitEnd}
                    pageNumber={pageNumber}
                    onLimitChange={handleLimitChange}
                    tableHead={tableHead}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    tableRow={td_data_set}
                    dataCount={dataCount}
                    onRefresh={handleRefresh}
                    onMenuClick={singleDataGet}
                    anchorEl2={anchorEl2}
                    setAnchorEl2={setAnchorEl2}
                    handleClose2={handleClose2}
                    ActionComponent={ActionComponent}
                    setSelected={setSelectedItems}
                    selected={selectedItems}
                    order={orderType}
                    orderBy={orderField}
                    setOrder={setOrderType}
                    setOrderBy={setOrderField}
                    APIRecall={APIRecall}
                    handleOnActionClick={handleOnActionClick}
                    MenuComponent={MenuComponent}
                />
            </div>
            <MasterDrawer
                isPageSidebarOpen={openDrawer}
                drawerWidth={pageDrawerWidth}
                onSidebarClose={toggleDrawer(false)}
                heading={"Ledger"}
                postError={postError}
                setStateValue={setledgerName}
                setValue={ledgerName}
                onCreateClick={handleSubmit}
                CreateCompannet={CreateCompannet}
            />

            <Drawer anchor="right" open={batchHistory} onClose={HandleOpenHistory}>
                <Box sx={{ width: 400 }} role="presentation">
                    <Box
                        display={"flex"}
                        alignItems={"center"}
                        padding={1}
                        justifyContent={"space-between"}
                        spacing={0.5}
                    >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Item onClick={HandleOpenHistory}>
                                <IconButton
                                    type="button"
                                    sx={{ p: 0, m: 0, height: 10 }}
                                    aria-label="search"
                                >
                                    <ArrowBackIcon sx={{ color: "black" }} />
                                </IconButton>
                            </Item>
                            <Item>
                                <Box
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        color: "#185AA6",
                                        m: 0,
                                    }}
                                >
                                    {singleData.ledger_number}
                                </Box>
                            </Item>
                        </Stack>
                        <Button className="nunito_font_width" sx={{ fontSize: '12px', marginTop: "1px", fontWeight: '300' }} variant="contained" onClick={() => handleUpdateOpening()}>
                            <span>Update</span>
                        </Button>
                    </Box>
                    <div style={{ padding: "10px" }}>
                        <div>
                            <Box
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    color: "#185AA6",
                                    m: 0,
                                }}
                            >
                                Opening Balance
                            </Box>
                        </div>
                        <Box sx={{ my: 1, padding: "10px" }}>
                            <TextField
                                id="outlined-basic"
                                label="Opening Balance"
                                variant="outlined"
                                name="opening_balance"
                                value={openingBalance}
                                onChange={(event) => handleTaxFormChange(event)}
                                size="small"
                                fullWidth
                                placeholder="Opening Balance"
                                sx={{ pb: 1, marginTop: "10px" }}
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
                    </div>
                </Box>
            </Drawer>

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
                <Alert onClose={handleCloseError} severity={error.status}>
                    {error.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default EmployeeList;
