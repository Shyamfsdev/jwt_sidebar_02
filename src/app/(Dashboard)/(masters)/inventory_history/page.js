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
  Autocomplete,
  TextField
} from "@mui/material";
import { axiosGet, axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import FilterButton from "../../../(Dashboard)/components/buttons/FilterButton";
import SearchFilter from "../../../(Dashboard)/components/buttons/SearchFilter";
import Cookies from "js-cookie";
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";
import {
  RefreshOutlined,
} from "@mui/icons-material";
import ListTable from "../../components/dashboard/HistoryInvoice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const EmployeeList = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const [isLoading, setIsLoading] = useState(true);

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
 

  // Filter/Sort State and Funtions ------
  const [orderField, setOrderField] = useState("id");
  const [dateTitle, setDateTitle] = useState("Invoice Date");
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

  // Function to update searchValue when input changes
  const handleSearchInputChange = (input) => {
    setSearchValue(input);
  };

  // Funtion to change created date for filter
  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateSelected(true);
    // handlefilterBadgeVisible(true)
  };
  // Function to Mouse Enter Show the details Move Leave show the table content
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleMouseEnter = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };
  const handleMouseLeave = () => {
    setSelectedItem(null);
    setShowPopup(false);
  };
  // Function end

  //  PRODUCT LIST //
  const [ProductID, setProductID] = useState("");

  const [ProductName, setProductName] = useState("");
  const handleProductChange = (event, value) => {
    if (value != null) {
      setBatchName("");
      setBatchID("");
      setProductID(value.data_uniq_id);
      setProductName(value.product_name);
      // setBatchMaster(value.batch_details);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        value.data_uniq_id,
        ""
      );
    } else {
      setProductID("");
      setProductName("");
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        "",
        BatchID
      );
    }
  };
  const [ProductMaster, setProductMaster] = useState([]);

  const HandleProductMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `product_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setProductMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  // PRODUCT LIST //
  //  BATCH LIST //
  const [BatchID, setBatchID] = useState("");
 
  const [BatchName, setBatchName] = useState("");

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
        value.batch_id
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
        ""
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

  // BATCH LIST //
  // Page action's state and funtions (create, Edit, Status change, Delete) ----
  const [job_titleName, setjob_titleName] = useState("");
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);


  const fetchData = async (
    access_token,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
    orderType,
    orderField,
    product_id,
    batch_id
  ) => {
    setIsLoading(true);
    axiosGet
      .get(
        `inventory_master_history_list?access_token=${access_token}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&product_id=${product_id}&batch_id=${batch_id}`
      )
      .then((response) => {
        setData(response.data.data);
        setdataCount(response.data.total_items);
        setPageCount(response.data.total_pages);
        settableName(response.data.table_name);
        setidField(response.data.id_field);
        setPageNumber(pageNumber === 0 ? 1 : pageNumber);
        setIsLoading(false);
        console.log(response,"DATTAAAAAA")
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
    fetchData(
      ACCESS_TOKEN,
      value,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      ProductID,
      BatchID
    );
  };

  useEffect(() => {
    HandleProductMaster();
    HandleBatchMaster();
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
      BatchID
    );
  }, [
  ]);

  const title = "Inventory History";

  const tableHead = [
    {
      label: `Product Name`,
      value: "product_id",
      sub_item: [],
    },
    {
      id: 2,
      label: 'Product Details',
      sub_item: [
        { tl: 'Uom', id: 'uom', align: 'left' },
        { tl: 'Item No.', id: 'item_code', align: 'left' },
        { tl: 'Batch No.', id: 'batch_number', align: 'left' },
      ],
      value: 'id',
      align: 'center',
      width: '30%',
    },
    {
      id: 5,
      label: `Invoice Details`,
      value: "id",
      sub_item: [{ tl: "Number", id: "invoice_number" }, { tl: "Date", id: "date" }],
      align: 'center',
      width: '14%'
    },   
    {
      id: 6,
      label: `Available Stock`,
      value: "id",
      sub_item: [{ tl: "Previous", id: "per_available_stock" }, { tl: "Current", id: "cur_available_stock" }],
      align: 'center',
      width: '10%'
    },
    {
      id: 7,
      label: `Total Stock`,
      value: "id",
      sub_item: [{ tl: "Previous", id: "per_total_stock" }, { tl: "Current", id: "cur_total_stock" }],
      align: 'center',
      width: '10%'
    },
    {
      id: 8,
      label: `Damage Stock`,
      value: "id",
      sub_item: [{ tl: "Previous", id: "per_damage_stock" }, { tl: "Current", id: "cur_damage_stock" }],
      align: 'center',
      width: '10%'
    },
    {
      id: 9,
      label: `DC Stock`,
      value: "id",
      sub_item: [{ tl: "Previous", id: "per_dc_stock" }, { tl: "Current", id: "cur_dc_stock" }],
      align: 'center',
      width: '10%'
    }
  ];

  const td_data_set = [];

  data?.map((item, index) => {

    const array_data = {
      id: item.data_uniq_id,
      data: [
        {
          comp: (
              <Typography className="table_cell_4">
              {item.product_list?.product_name || 'NA'}
              </Typography>            
          ),
          id: 1,
        }, 
        {
          comp: (
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end", 
              textAlign: "center" 
            }}>
              <Typography className="table_cell_4" sx={{ width: '33%' }}>
              {item.uom}
              </Typography>
              <Typography className="table_cell_4" sx={{ width: '33%' }}>
              {item.product_list?.item_code || 'NA'}
              </Typography>
              <Typography className="table_cell_4" sx={{ width: '33%' }}>
              {item.batch_number || 'NA'}
              </Typography>
            </Box>
          ),
          id: 2,
          align: 'center'
        }, 
        {
          comp: (
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end", 
              textAlign: "center",
              width: "100%",
              gap: 2 
            }}>
              <Typography className="table_cell_4"  sx={{ width: '50%' }}>
                {item.invoice_number || 'NA'}
              </Typography>
              <Typography className="table_cell_4"  sx={{ width: '50%' }}>
                {item.invoice_date || 'NA'}
              </Typography>
            </Box>
          ),
          id: 5,
          align: 'center'
        },
       {
          comp: (
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end", 
              textAlign: "center",
              width: "100%",
              gap: 2 
            }}>
              <Typography className="table_cell_4" sx={{ width: '50%' }}>
                {item?.per_available_stock.toFixed(2) || 0}
              </Typography>
              <Typography className="table_cell_4" sx={{ width: '50%' }}>
                {item?.cur_available_stock.toFixed(2) || 0}
              </Typography>
            </Box>
          ),
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
                {item?.per_total_stock.toFixed(2) || 0}
              </Typography>
              <Typography className="table_cell_4">
                {item?.cur_total_stock.toFixed(2) || 0}
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
                {item.per_damage_stock.toFixed(2) || 0} 
              </Typography>
              <Typography className="table_cell_4">
                {item?.cur_damage_stock.toFixed(2) || 0}
              </Typography>
            </Box>
          ),
          id: 8,
          align: 'center'
        }, 
        {
          comp: (
            <Box sx={{
              display: "flex",
              justifyContent: "space-around",
            }}>
              <Typography className="table_cell_4">
                {item?.per_dc_stock.toFixed(2) || 0}
              </Typography>
              <Typography className="table_cell_4">
                {item?.cur_dc_stock.toFixed(2) || 0}
              </Typography>
            </Box>
          ),
          id: 9,
          align: 'center'
        }
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
    };
    td_data_set.push(array_data);
  });


  const handleRefresh = () => {
    console.log("Refresh button clicked");
    
    setSearchValue("");
    setDateTitle("Invoice Date");
    setIsDateSelected(false);
    setIsStatusSelected(false);
    setCreatedEndDate("");
    setCreatedStartDate("");
    setProductID("");
    setProductName("");
    setBatchID("");
    setBatchName("");
  
    console.log({
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      ProductID,
      BatchID
    });
  
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
      BatchID
    );
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
              BatchMaster?.find((year) => year.batch_number === BatchName) ||
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
    <div style={{ padding: "10px" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="displey_space_between"
      >
        <Typography variant="h4" className="nunito_font" style={{ fontSize: '16px', fontWeight: "700", color: '#185AA6' }}>{title} [{dataCount}] </Typography>

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