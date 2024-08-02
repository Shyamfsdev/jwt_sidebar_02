"use client";
import {
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Badge,
  TableBody,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Menu,
  List,
  ListItemButton,
  Divider,
  Autocomplete,
  TextField,
  Drawer,
  Stack,
  Button,
} from "@mui/material";
import { debounce } from 'lodash';
import { axiosGet, axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Cookies from "js-cookie";
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import ListTable from "../../components/dashboard/InstockTable";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";

const EmployeeList = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));

  const [error, setError] = useState({ status: "", message: "" });
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };

  // Data Toggle/Dialog State and Funtions -----
  const [openDrawer, setOpenDrawer] = useState(false);
  const [effectToggle, setEffectToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMulitiStatus, setOpenMultistatus] = useState(false);
  const [openMulitiDelete, setOpenMultiDelete] = useState(false);
  const [filtersList, setfiltersList] = useState(false);
  const [actionData, setActionData] = React.useState("");
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handlefilterBadgeVisible = () => {
    if (isStatusSelected || isDateSelected) {
      return true;
    } else {
      return false;
    }
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

  // Pagination State and Funtions -----
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

  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [BatchID, setBatchID] = useState("");
  const fetchDataDebounced = debounce(async () => {
    console.log("fetchData called with BatchID:", BatchID);
    setIsLoading(true);
    try {
      const response = await axiosGet.get(
        `inventory_master_list?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter
        }&product_id=${ProductID}&batch_id=${BatchID}&division_id=${DivisionID}`
      );
      setData(response.data.data);
      setdataCount(response.data.total_items);
      setPageCount(response.data.total_pages);
      settableName(response.data.table_name);
      setidField(response.data.id_field);
      setPageNumber(pageNumber === 0 ? 1 : pageNumber);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }, 300);

  const [ProductID, setProductID] = useState("");

  const [ProductName, setProductName] = useState("");
  const handleProductChange = (event, value) => {
    if (value != null) {
      setBatchName("");
      setBatchID("");
      setProductID(value.data_uniq_id);
      setProductName(value.product_name);
    } else {
      setProductID("");
      setProductName("");
    }
  };
  const [ProductMaster, setProductMaster] = useState([]);


  const fetchData = async (access_token, searchValue, createdStartDate, createdEndDate) => {
    try {
      const response = await axiosGet.get(
        `product_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
      );
      if (response.data.action === "success") {
        setProductMaster(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product master:", error);
    }
  };
  
  const HandleProductMaster = () => {
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  

 
  const [BatchName, setBatchName] = useState("");
  console.log(BatchID,"BAtch ID")
  console.log(BatchName,"NATCH NAME")
  const handleBatchChange = (event, value) => {
    if (value != null) {
      setBatchID(value.batch_id);
      setBatchName(value.batch_number);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        ProductID,
        value.batch_id,
        DivisionID
      );
    } else {
      setBatchID("");
      setBatchName("");
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        ProductID,
        "",
        DivisionID
      );
    }
  };

  const [BatchMaster, setBatchMaster] = useState([]);
  const HandleBatchMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `batch_number_get?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setBatchMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  const [DivisionID, setDivisionID] = useState("");
  const [DivisionName, setDivisionName] = useState("");
  const handleDivisionChange = (event, value) => {
    if (value != null) {
      setDivisionID(value.data_uniq_id);
      setDivisionName(value.division);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        ProductID,
        BatchID,
        value.data_uniq_id
      );
    } else {
      setDivisionID("");
      setDivisionName("");
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        ProductID,
        BatchID,
        ""
      );
    }
  };
  const [DivisionMaster, setDivisionMaster] = useState([]);
  const HandleDivisionMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      try {
        const res = await axiosGet.get(
          `division_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}`
        );
        if (res.data.action === "success") {
          setDivisionMaster(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  

 useEffect(() => {
  console.log("useEffect triggered");
  fetchDataDebounced();
  HandleProductMaster();
  HandleBatchMaster();
  HandleDivisionMaster();
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
  ProductID,
  BatchID,
  DivisionID
]);

  const title = "Inventory ";

  const tableHead = [
    {
      id: 1,
      label: `Product Name`,
      value: "product_id",
      sub_item: [],
      align: 'center',
      width: '14%'
    },
    {
      id: 3,
      label: `Item Number`,
      value: "item_code",
      sub_item: [],
      align: 'center',
      width: '8%'
    },
    {
      id: 4,
      label: `Batch No.`,
      value: "created_date",
      sub_item: [],
      align: 'center',
      width: '8%'
    },
    // {
    //   id: 5,
    //   label: `Cost Price`,
    //   value: "uom",
    //   sub_item: [],
    //   align:'left'
    // },
    {
      id: 6,
      label: `UOM`,
      value: "uom",
      sub_item: [],
      align: 'center',
      width: '5%'
    },
    {
      id: 7,
      label: `Saleable  Stock`,
      value: "id",
      sub_item: [{ tl: "CFC", id: "cfc" }, { tl: "Pack", id: "pack" }, { tl: "Value", id: "value" }],
      align: 'center',
      width: '18%'
    },
    {
      id: 9,
      label: `D&D Stock`,
      value: "uom",
      sub_item: [{ tl: "CFC", id: "cfc" }, { tl: "Pack", id: "pack" }, { tl: "Value", id: "value" }],
      align: 'center',
      width: '14%'
    },
    {
      id: 10,
      label: `DC Stock`,
      value: "inventory_id",
      sub_item: [{ tl: "CFC", id: "cfc" }, { tl: "Pack", id: "pack" }, { tl: "Value", id: "value" }],
      align: 'center',
      width: '14%'
    },
    {
      id: 8,
      label: `Total Stock`,
      value: "total_stock",
      sub_item: [],
      align: 'center',
      action: true,
      width: '9%'
    }, {
      id: 9,
      label: `Stock Value`,
      value: "total_stock",
      sub_item: [],
      align: 'center',
      action: true,
      width: '10%'
    },
    // {
    //   id: 11,
    //   label: "Action",
    //   action: true,
    //   align: "center",
    // },
  ];

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setavailableStock(data.available_stock);
    setdamageStock(data.damage_stock);
    setdcStock(data.dc_stock);
    setAnchorEl2(e.currentTarget);
  };

  const td_data_set = [];

  data?.map((item, index) => {
    item?.batch_details.map((val) => {
      const array_data = {
        id: item.data_uniq_id,
        data: [
          {
            comp: (
              <Typography className="table_cell_4">
                {item.product_list?.product_name}
              </Typography>
            ),
            id: 1,
            align: 'center'
          },
          {
            comp: (
              <Typography className="table_cell_4">{item.item_code}</Typography>
            ),
            id: 3,
            align: 'center'
          },
          {
            comp: (
              <Typography className="table_cell_4">
                {val.batch_number}
              </Typography>
            ),
            id: 4,
            align: 'center'
          },
          // {
          //   comp: (
          //     <Typography className="table_cell_4">
          //       {val?.base_value}
          //     </Typography>
          //   ),
          //   id: 5,
          //   align:'left'
          // },
          {
            comp: <Typography className="table_cell_4">{item.uom}</Typography>,
            id: 6,
            align: 'center'
          },
          {
            comp: (
              <Box sx={{
                display: "flex",
                justifyContent: "space-around",
              }}>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.cfc_available_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.available_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.base_available_stock)?.toFixed(0) || 0}
                </Typography>
              </Box>
            ),
            id: 7,
            align: 'center'
          },
          {
            comp: (
              <Box sx={{
                display: "flex",
                justifyContent: "space-around",
              }}>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.cfc_damage_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.damage_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.base_damage_stock)?.toFixed(0) || 0}
                </Typography>
              </Box>
            ),
            id: 9,
            align: 'center'
          },
          {
            comp: (
              <Box sx={{
                display: "flex",
                justifyContent: "space-around",
              }}>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.cfc_dc_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.dc_stock)?.toFixed(0) || 0}
                </Typography>
                <Typography className="table_cell_4">
                  {(val?.Inventory_details?.base_dc_stock)?.toFixed(0) || 0}
                </Typography>
              </Box>
            ),
            id: 10,
            align: 'center'
          },
          {
            comp: (
              <Typography className="table_cell_4">
                {(val?.Inventory_details?.total_stock)?.toFixed(0)}
              </Typography>
            ),
            id: 8,
            align: 'center'
          }, {
            comp: (
              <Typography className="table_cell_4">
                {Number((val?.Inventory_details?.base_available_stock)?.toFixed(0) || 0) + Number((val?.Inventory_details?.base_damage_stock)?.toFixed(0) || 0) + Number((val?.Inventory_details?.base_dc_stock)?.toFixed(0) || 0)}
              </Typography>
            ),
            id: 9,
            align: 'center'
          },
          // {
          //   comp: (
          //     <IconButton
          //       size="small"
          //       onClick={(e) => handleOnActionClick(e, val?.inventory_data)}
          //       title="Click to Action"
          //     >
          //       <MoreVertOutlined></MoreVertOutlined>
          //     </IconButton>
          //   ),
          //   id: 11,
          //   align: "center",
          // },
        ],
        json: [item],
        active: item.active_status,
        active_name: item.status,
      };
      td_data_set.push(array_data);
    });
  });

  const handleRefresh = () => {
    setSearchValue("");
    setActiveStatusFilter(3);
    setDateTitle("Created date");
    setIsDateSelected(false);
    setIsStatusSelected(false);
    setCreatedEndDate("");
    setCreatedStartDate("");
    setProductID("");
    setProductName("");
    setBatchID("");
    setBatchName("");
    setDivisionID("");
    setDivisionName("");
    fetchData();
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
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={ProductMaster}
            value={
              ProductMaster.find((year) => year.product_name === ProductName) ||
              null
            }
            onChange={(e, value) => handleProductChange(e.target.value, value)}
            getOptionLabel={(val) => val.product_name}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={ProductName}
                style={{ margin: "0px" }}
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Product Name"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={BatchMaster}
            value={
              BatchMaster.find((year) => year.batch_number === BatchName) ||
              null
            }
            onChange={(e, value) => handleBatchChange(e.target.value, value)}
            getOptionLabel={(val) => val.batch_number}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={BatchName}
                style={{ margin: "0px" }}
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Batch Number"
              />
            )}
            clearIcon={null}
          />
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <Autocomplete
            margin="normal"
            variant="outlined"
            style={{ marginTop: "0px" }}
            options={DivisionMaster}
            value={
              DivisionMaster.find((year) => year.division === DivisionName) ||
              null
            }
            onChange={(e, value) => handleDivisionChange(e.target.value, value)}
            getOptionLabel={(val) => val.division}
            required
            id="supplier"
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                value={DivisionName}
                style={{ margin: "0px" }}
                InputLabelProps={{
                  className: "textfieldstylefont",
                  style: { top: "-7px", fontSize: "12px" },
                }}
                InputProps={{
                  ...params.InputProps,
                  autoComplete: "off",
                  className: "fontInput",
                }}
                label="Division"
              />
            )}
            clearIcon={null}
          />
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

  const [batchHistory, setbatchHistory] = useState(false);

  const HandleOpenHistory = () => {
    setbatchHistory(!batchHistory);
    handleClose2();
  };

  const [availableStock, setavailableStock] = useState("");

  const [damageStock, setdamageStock] = useState("");

  const [dcStock, setdcStock] = useState("");

  const ChangeStockValue = (event, ref) => {
    if (event != null) {
      if (!isNaN(event) && event >= 0) {
        if (ref == "available") {
          setavailableStock(event);
        } else if (ref == "damage") {
          setdamageStock(event);
        } else {
          setdcStock(event);
        }
      } else {
        if (ref == "available") {
          setavailableStock("");
        } else if (ref == "damage") {
          setdamageStock("");
        } else {
          setdcStock("");
        }
      }
    } else {
      if (ref == "available") {
        setavailableStock("");
      } else if (ref == "damage") {
        setdamageStock("");
      } else {
        setdcStock("");
      }
    }
  };

  const handleSubmit = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      ware_invendory_id: singleData?.ware_invendory_id,
      available_stock: availableStock,
      damage_stock: damageStock,
      dc_stock: dcStock,
    };
    try {
      axiosPost
        .post(`inventory_stock_adjustment`, jsonData)
        .then((response) => {
          if (response.data.action_status === "Success") {
            setbatchHistory(false);
            setavailableStock("");
            setdamageStock("");
            setdcStock("");
            fetchData();
          } else {
            setError({ status: "error", message: response.data.message });
          }
        })
        .catch((error) => {
          // Handle POST errors here
          console.error("POST Error:", error);
        });
    } catch (error) {
      console.error("An error occurred:", error);
      setbatchHistory(false);
      setavailableStock("");
      setdamageStock("");
      setdcStock("");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="displey_space_between"
      >
        <Typography
          variant="h4"
          className="nunito_font"
          style={{ fontSize: "16px", fontWeight: "700", color: "#185AA6" }}
        >
          {title} [{dataCount}]{" "}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <SearchFilter
            onSearchButtonClick={handleSearchInputChange}
            searchValue={searchValue}
          />
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
        <ListTable
          pageCount={pageCount}
          tableHead={tableHead}
          onPageChange={handlePageChange}
          tableRow={td_data_set}
          order={orderType}
          orderBy={orderField}
          setOrder={setOrderType}
          setOrderBy={setOrderField}
          ActionComponent={ActionComponent}
          setSelected={setSelectedItems}
          selected={selectedItems}
          onDelete={() => setOpenMultiDelete(true)}
        />
        {/* )} */}
      </div>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            minWidth: "100px",
            boxShadow: "0px 4px 7px 0px #00000024",
          },
        }}
      >
        <List sx={{ p: 0, fontSize: "12px" }}>
          <ListItemButton onClick={() => HandleOpenHistory()}>
            <Typography variant="p">Stock Adjustment</Typography>
          </ListItemButton>
          {/* <Divider />
          <ListItemButton>
            <Typography variant="p">Stock Adjustment History</Typography>
          </ListItemButton> */}
        </List>
      </Menu>

      <Drawer anchor="right" open={batchHistory} onClose={HandleOpenHistory}>
        <Box sx={{ width: 700 }} role="presentation">
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
                  Stock Adjustment
                </Box>
              </Item>
            </Stack>
            <div>
              <Button
                className="nunito_font_width"
                sx={{ fontSize: "12px", marginTop: "1px", fontWeight: "300" }}
                variant="contained"
                onClick={() => handleSubmit()}
              >
                <span>Update</span>
              </Button>
            </div>
          </Box>
          <div style={{ padding: "10px" }}>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Available Stock"
                  disabled
                  variant="outlined"
                  value={singleData?.available_stock}
                  size="small"
                  fullWidth
                  placeholder="Available Stock"
                  sx={{ pb: 1 }}
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
                <TextField
                  id="outlined-basic"
                  label="Update Stock"
                  variant="outlined"
                  value={availableStock}
                  onChange={(e) =>
                    ChangeStockValue(e.target.value, "available")
                  }
                  size="small"
                  fullWidth
                  placeholder="Update Stock"
                  sx={{ pb: 1 }}
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
              </Stack>
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Damage Stock"
                  disabled
                  variant="outlined"
                  value={singleData?.damage_stock}
                  size="small"
                  fullWidth
                  placeholder="Damage Stock"
                  sx={{ pb: 1 }}
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
                <TextField
                  id="outlined-basic"
                  label="Update Stock"
                  variant="outlined"
                  value={damageStock}
                  onChange={(e) => ChangeStockValue(e.target.value, "damage")}
                  size="small"
                  fullWidth
                  placeholder="Update Stock"
                  sx={{ pb: 1 }}
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
              </Stack>
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="DC Stock"
                  disabled
                  variant="outlined"
                  value={singleData?.dc_stock}
                  size="small"
                  fullWidth
                  placeholder="DC Stock"
                  sx={{ pb: 1 }}
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
                <TextField
                  id="outlined-basic"
                  label="Update Stock"
                  variant="outlined"
                  value={dcStock}
                  onChange={(e) => ChangeStockValue(e.target.value, "dc")}
                  size="small"
                  fullWidth
                  placeholder="Update Stock"
                  sx={{ pb: 1 }}
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
              </Stack>
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
