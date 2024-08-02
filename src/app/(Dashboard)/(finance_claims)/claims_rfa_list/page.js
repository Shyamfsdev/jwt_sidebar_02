"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { axiosPost, axiosGet } from "../../../../lib/api";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import {
    Modal,
    CircularProgress,
    List,
    ListItemButton,
    Badge,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FormControl, Typography } from "@mui/material";
import CreateButton from "../../../(Dashboard)/components/buttons/CreateButton";
import Cookies from "js-cookie";
import UserTable from "../../../(Dashboard)/components/dashboard/ClaimsTable";
import moment from "moment";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Collapse from "@mui/material/Collapse";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import {
    ArrowBack,
    DeleteForeverOutlined,
    EditOutlined,
    MoreVertOutlined,
    RefreshOutlined,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const OrderList = () => {
    const fileInputRef = useRef(null);

    const [error, setError] = useState({ status: "", message: "" });
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
    };

    const router = useRouter();

    const ACCESS_TOKEN = Cookies.get("token");

    const [data, setData] = useState([]);
    const [singleData, setSingleData] = useState([]);

    const [pageCount, setPageCount] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [limitEnd, setlimitEnd] = useState("30");
    const [dataCount, setdataCount] = useState(0);

    const [createdStartDate, setCreatedStartDate] = useState("");
    const [createdEndDate, setCreatedEndDate] = useState("");

    const [searchValue, setSearchValue] = useState(""); // State variable to store search input

    const handleSearchInputChange = (input) => {
        setSearchValue(input);
    };

    const handleLimitChange = (event) => {
        setlimitEnd(event.target.value);
        handleRefresh();
    };

    const [orderType, setOrderType] = useState("desc");
    const [orderField, setOrderField] = useState("created_date");
    const fetchData = async (
        access_token,
        limit,
        end,
        searchValue,
        createdStartDate,
        createdEndDate,
        order_type,
        order_field,
        claims_ccis_type
    ) => {
        axiosGet
            .get(
                `claims_ccis_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&claims_ccis_type=${2}`
            )
            .then((response) => {
                setData(response.data.data);
                setdataCount(response.data.total_items);
                setPageCount(response.data.total_pages);
                setloadingPage(false);
                setPageNumber(pageNumber === 0 ? 1 : pageNumber);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
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
            orderField
        );
    };

    useEffect(() => {
        fetchData(
            ACCESS_TOKEN,
            pageNumber,
            limitEnd,
            searchValue,
            createdStartDate,
            createdEndDate,
            orderType,
            orderField
        );
    }, [
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
    ]);

    const tableHead = [
        {
            id: 1,
            label: "Claims Number",
            value: "claims_ccis_number",
            width: '10%'
        },
        {
            id: 2,
            label: "RFA Division",
            value: "sales_id",
            width: '10%'
        },{
            id: 3,
            label: "Claim Month",
            value: "claims_date",
            width: '10%'
        },
        {
            id: 4,
            label: "Claim Year",
            value: "created_date",
            width: '10%'
        },
        {
            id: 5,
            label: "Customer Name",
            value: "customer_name",
            width: '10%'
        },
        {
            id: 6,
            label: "Trading Type",
            value: "claims_ccis_type",
            width: '10%'
        },
        {
            id: 7,
            label: "RFA Amount",
            value: "investment_amount",
            width: '10%'
        },
        {
            id: 8,
            label: "Invoice Number",
            value: "sales_number",
            width: '10%'
        },
    ];

    console.log(data);

    const td_data_set = [];

    data?.map((item, index) => {
        const array_data = {
            id: item.data_uniq_id,
            data: [
                { td: item.claims_ccis_number, type: "text", id: 1, alian: "left" },
                {
                    td: item.rfa_list?.length == 0 ? 'NA':item.rfa_list,
                    type: "text",
                    id: 2,
                    alian: "left",
                },
                {
                    td: moment(item.claims_date).format("MMMM"),
                    type: "text",
                    id: 3,
                    alian: "left",
                },
                {
                    td: moment(item.claims_date).format("YYYY"),
                    type: "text",
                    id: 4,
                    alian: "left",
                },
                {
                    td: item.customer_name,
                    type: "text",
                    id: 5,
                    alian: "left",
                },{
                    td: item.customer_list?.length == 0 ? 'NA':item.customer_list?.trading_type,
                    type: "text",
                    id: 6,
                    alian: "left",
                },
                {
                    td: (
                        <Box sx={{ padding: "8px 0px" }}>
                            {(item.investment_amount).toFixed(2)}
                        </Box>
                    ),
                    type: "text",
                    id: 7,
                    alian: "left",
                },
                {
                    td: item.sales_number,
                    type: "text",
                    id: 8,
                    alian: "left",
                },
            ],
            json: [item],
            active_status: item.claims_type
        };
        td_data_set.push(array_data);

    });

    const [dateTitle, setDateTitle] = useState("Created Date");

    const handleRefresh = () => {
        setSearchValue("");
        setCreatedEndDate("");
        setCreatedStartDate("");
        setDateTitle("Created Date");
        fetchData(
            ACCESS_TOKEN,
            pageNumber,
            limitEnd,
            "",
            "",
            "",
            "desc",
            "created_date"
        );
    };
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageChange = (event, value) => {
        setPageNumber(value);
    };

    const singleDataGet = (data) => {
        setSingleData(data);
    };

    const [filtersList, setfiltersList] = useState(false);
    const HandleChangeFilter = () => {
        setfiltersList(!filtersList);
    };

    const [anchorEl2, setAnchorEl2] = useState(null);

    const handleClose2 = () => {
        setAnchorEl2(null);
    };

    const ActionComponent = () => {
        return <div></div>;
    };


    const MenuComponent = () => {
        return (
            <List sx={{ p: 0, fontSize: "12px" }}>
                <ListItemButton onClick={() => HandleOpenViewInvoice()}>
                    <Typography variant="p">View Claims</Typography>
                </ListItemButton>
            </List>
        );
    };

    const handleOnActionClick = (e, data) => {
        setSingleData(data.json[0]);
        Cookies.set("data_uniq_id", data.id);
        setAnchorEl2(e.currentTarget);
    };

    const HandleOpenViewInvoice = () => {
        router.push("/view_claims_rfa");
        handleClose2();
    };



    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const [loadingPage, setloadingPage] = useState(true);

    const [selectedItems, setSelectedItems] = useState([]);


    const [isStatusSelected, setIsStatusSelected] = useState(false);

    const [isDateSelected, setIsDateSelected] = useState(false);

    const handlefilterBadgeVisible = () => {
        if (isStatusSelected || isDateSelected) {
            return true;
        } else {
            return false;
        }
    };

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const onCreatedDateChange = (data) => {
        const formattedStartDate = formatDate(data[0].startDate);
        const formattedEndDate = formatDate(data[0].endDate);
        setCreatedStartDate(formattedStartDate);
        setCreatedEndDate(formattedEndDate);
        setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
        setIsDateSelected(true);
    };

    const Item = styled("div")(({ theme }) => ({
        padding: theme.spacing(1.5),
        textAlign: "left",
        borderRadius: 8,
        border: 0.5,
    }));

    const FilterComponent = () => {
        return (
            <Box
                sx={{
                    m: 2,
                    display: "flex",
                    gap: 1,
                }}
            >
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

    return (
        <>
            <Box sx={{ px: 2, height: "1" }}>
                <div className="dispatch_do_flex">
                    <div className="display_flex global_padding" style={{ width: '50%' }}>
                        <Typography variant="h4" className="nunito_font" style={{ fontSize: '16px', fontWeight: "700", color: '#185AA6' }}>Claims RFA [{dataCount}] </Typography>
                    </div>
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
                <UserTable
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

                <Modal open={loadingPage}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100vh",
                        }}
                    >
                        <CircularProgress />
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
            </Box>
        </>
    );
};
export default OrderList;