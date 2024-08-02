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
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import MasterTable from "../../components/dashboard/MasterTable";
import MasterDrawer from "../../../(Dashboard)/components/MasterDrawer/Sidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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

  // Data Toggle/Dialog State and Funtions -----
  const [openDrawer, setOpenDrawer] = useState(false);
  const [effectToggle, setEffectToggle] = useState(false);
  const [openDrawerType, setOpenDrawerType] = useState(1);
  const [open, setOpen] = useState(false);
  const [openMulitiStatus, setOpenMultistatus] = useState(false);
  const [openMulitiDelete, setOpenMultiDelete] = useState(false);
  const [dltOpen, setDltOpen] = useState(false);
  const [filtersList, setfiltersList] = useState(false);
  const [actionData, setActionData] = React.useState("");
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [filterBadgeVisible, setFilterBadgeVisible] = useState(false);

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
      if (type == 1) {
        setOpenDrawer(newOpen);
        setOpenDrawerType(type);
        setpageDrawerWidth(500);
        setjob_titleName("");
        setDataUniqId("");
        setitemCode("");
        sethsnCode("");
        setdivisionID("");
        setproductID("");
        setproductName("");
        setdivisionName("");
        setexpiryDaysvalue("");
        setfreeStockValue(0);
        setuomValue("");
        setuomMasterSUB([]);
        setcfcWeightValue("");
        setuomDetails([
          {
            uomName: "",
            per_value: "",
            total_qty: "",
            sales_uom_value: "",
            sales_cfc_value: "",
            sales_sub_uom_value: "",
            purchase_uom_value: "",
            purchase_cfc_value: "",
            purchase_sub_uom_value: ""
          },
        ]);
        settaxDetails({
          baseValue: "",
          taxValue: "" || 0,
          cessValue: "" || 0,
          additionalCessValue: "" || 0,
          sales_price: "",
          mrp_price: "",
          salvage_value: "",
        });
        setstickStatus(0);
        setTotalValue();
        setcategoryDetails({
          categoryHandlerName: [],
        });
        setCfcPrice(0);
        setsubUOMPrice(0);
        setCfcbasePrice(0);
        setsubUOMPrice(0);
        setrfaDivisionID("");
        setrfaDivisionName("");
      } else {
        setOpenDrawer(newOpen);
        setOpenDrawerType(type);
        setpageDrawerWidth(500);
        setjob_titleName(singleData.product_name);
        setDataUniqId(singleData.data_uniq_id);
        setitemCode(singleData?.item_code);
        sethsnCode(singleData?.hsn_code);
        setdivisionID(singleData?.division);
        setdivisionName(singleData?.division_list?.division);
        setproductID(singleData?.free_stock_item_code);
        setproductName(singleData?.free_stock_product_details?.item_code);
        setexpiryDaysvalue(singleData?.expiry_days);
        setfreeStockValue(singleData?.free_stock);
        settaxDetails({
          baseValue: singleData?.base_value,
          taxValue: singleData?.tax,
          cessValue: singleData?.cess,
          additionalCessValue: singleData?.addtional_cess_value,
          sales_price: singleData?.sales_price,
          mrp_price: singleData?.mrp_price,
          salvage_value: singleData?.salvage_value
        });
        setuomDetails(singleData?.org_uom_details);
        setuomValue(singleData?.uom);
        setuomMasterSUB(singleData?.subuom_details);
        setcfcWeightValue(singleData?.cfc_weight);
        handleClose2();
        setstickStatus(singleData?.stick_status);
        setTotalValue(singleData?.inversement_value)
        setcategoryDetails({
          categoryHandlerName: singleData.category_handler
        });
        setCfcPrice(singleData?.cfc_value);
        setsubUOMPrice(singleData?.sub_uom_price);
        setCfcbasePrice(singleData?.cfc_basevalue);
        setsubbaseUOMPrice(singleData?.subUOMbasePrice);
        setrfaDivisionID(singleData?.rfa_division_id);
        setrfaDivisionName(singleData?.rfa_division);
      }
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


  const [salvageHistory, setsalvageHistory] = useState(false);

  const HandlesalvageHistory = () => {
    setsalvageHistory(!salvageHistory);
    handleClose2();
  };

  // Open Status change warning box
  const handleOpen = () => {
    setOpen(true);
    handleClose2();
  };

  const handleClose = () => {
    setOpen(false);
    handleClose2();
  };

  // Close delete warning box
  const handleCloseDlt = () => {
    setDltOpen(false);
  };

  // Close multi status change warning box
  const handleCloseMultiStatus = () => {
    setOpenMultistatus(false);
  };

  // Close multi delete warning box
  const handleCloseMultiDelete = () => {
    setOpenMultiDelete(false);
  };

  // Open single delete warning box
  const handleDelteOpen = () => {
    setDltOpen(true);
  };
  const singleDataGet = (data) => {
    setSingleData(data);
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

  // Funtion to change active status for filter
  const handleActiveStatusChange = (value) => {
    setActiveStatusFilter(value);
    setIsStatusSelected(true);
    // handlefilterBadgeVisible(true)
  };

  // Page action's state and funtions (create, Edit, Status change, Delete) ----
  const [job_titleName, setjob_titleName] = useState("");
  const [dataUniqId, setDataUniqId] = useState("");
  const [dataStatus, setDataStatus] = useState(1);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [postError, setPostError] = useState([]);

  // Funtion for create new data or edit existing data
  const handleSubmit = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: dataUniqId,
      product_name: job_titleName,
      hsn_code: hsnCode,
      expiry_days: expiryDaysvalue,
      free_stock: freeStockValue,
      uom: uomValue,
      division: divisionID,
      free_stock_item_code: productID,
      base_value: taxDetails?.baseValue,
      tax: taxDetails?.taxValue,
      cess: taxDetails?.cessValue,
      addtional_cess_value: taxDetails?.additionalCessValue,
      item_code: itemCode,
      uom_details: uomDetails,
      subuom_details: uomMasterSUB,
      active_status: dataStatus,
      cfc_weight: cfcWeightValue,
      sales_price: taxDetails?.sales_price,
      mrp_price: Number(taxDetails?.mrp_price),
      stick_status: stickStatus,
      inversement_value: totalValue,
      category_handler: categoryDetails?.categoryHandlerName,
      salvage_value: Number(taxDetails?.salvage_value),
      cfc_value: cfcPrice,
      sub_uom_price: subUOMPrice,
      cfc_basevalue: cfcbasePrice,
      subuom_basevalue: subUOMbasePrice,
      rfa_division_id: rfaDivisionID,
      rfa_division: rfaDivisionName
    };
    console.log(jsonData, "DATA")
    try {
      if (openDrawerType == 1) {
        axiosPost
          .post(`product_master`, jsonData)
          .then((response) => {
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
              setError({ status: "success", message: response.data.message });
            } else {
              setError({ status: "error", message: response.data.message });
            }
          })
          .catch((error) => {
            // Handle POST errors here
            console.error("POST Error:", error);
          });
      } else {
        axiosPost
          .put(`product_master`, jsonData)
          .then((response) => {
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
              setError({ status: "success", message: response.data.message });
            } else {
              setError({ status: "error", message: response.data.message });
            }
          })
          .catch((error) => {
            // Handle POST errors here
            setOpenDrawer(false);
            console.error("POST Error:", error);
          });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setOpenDrawer(false);
    }
  };

  // Funtion for delete single data
  const handleDelete = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: [singleData.data_uniq_id],
      table_name: tableName,
      id_field: idField,
    };
    axiosPost
      .post(`delete_data`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        handleClose2();
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for change status of single data
  const handleStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: [singleData.data_uniq_id],
      table_name: tableName,
      id_field: idField,
      status: singleData.active_status === 1 ? 0 : 1,
      field_name: "active_status",
    };
    axiosPost
      .post(`active_status`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        setIsLoading(false);

        handleClose2();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for change status of multiple data
  const handleMulitiStatusChange = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: selectedItems,
      table_name: tableName,
      id_field: idField,
      status: actionData,
      field_name: "active_status",
    };
    axiosPost
      .post(`active_status`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        setIsLoading(false);
        handleClose2();
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  // Funtion for delete multiple data
  const handleMulitiDelete = () => {
    setIsLoading(true);
    const jsonData = {
      access_token: ACCESS_TOKEN,
      field_id: selectedItems,
      table_name: tableName,
      id_field: idField,
    };
    axiosPost
      .post(`delete_data`, jsonData)
      .then((response) => {
        setEffectToggle(!effectToggle);
        setSelectedItems([]);
        setActionData("");
        handleClose2();
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const fetchData = async () => {
    setIsLoading(true);
    axiosGet
      .get(
        `product_master_list?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${activeStatusFilter === 3 ? "" : activeStatusFilter
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
    HandleDivisionMaster();
    HandleUomMaster();
    HandleProductMaster();
    HandleCategoryHandlerMaster();
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

  const title = "Product";

  const tableHead = [
    {
      id: 1,
      label: `${title} Name`,
      value: "product_name",
    },
    {
      id: 2,
      label: `${title} Code`,
      value: "item_code",
    },
    {
      id: 3,
      label: `UOM`,
      value: "uom",
    },
    {
      id: 4,
      label: `Division`,
      value: "division",
    },
    {
      id: 5,
      label: "Created Date",
      value: "created_date",
    },
    {
      id: 6,
      label: "Status",
      value: "active_status",
    },
    {
      id: 7,
      label: "Action",
      action: true,
      align: "center",
    },
  ];

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setAnchorEl2(e.currentTarget);
  };
  const td_data_set = [];

  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.product_name}
            </Typography>
          ),
          id: 1,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.item_code}
            </Typography>
          ),
          id: 2,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.uom}
            </Typography>
          ),
          id: 3,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.division_list?.division}
            </Typography>
          ),
          id: 4,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.created_f_date}
            </Typography>
          ),
          id: 5,
        },
        {
          comp: (
            <Box sx={{ padding: "5px 16px" }}>
              <Button
                className={`table_body_style_fab arrival_${item.active_status} flex_display`}
                sx={{ width: "20%" }}
              >
                {item.active_status == 1 ? "Active" : "Inactive"}
              </Button>
            </Box>
          ),
          id: 6,
        },
        {
          comp: (
            <IconButton
              size="small"
              onClick={(e) => handleOnActionClick(e, item)}
              title="Click to Action"
            >
              <MoreVertOutlined></MoreVertOutlined>
            </IconButton>
          ),
          id: 7,
          align: "center",
        },
      ],
      json: [item],
      active: item.active_status,
      active_name: item.status,
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

  const [itemCode, setitemCode] = useState("");
  const [hsnCode, sethsnCode] = useState("");

  const [taxDetails, settaxDetails] = useState({
    baseValue: "",
    taxValue: "",
    cessValue: "",
    additionalCessValue: "",
    sales_price: "",
    mrp_price: "",
    salvage_value: ""
  });
  const [errors, setErrors] = useState({
    baseValue: "",
    sales_price: "",
    mrp_price: "",
  });
  const validateTaxValue = (value) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= 0 && number <= 100;
  };

  const handleTaxFormChange = (event,ref) => {
    const { name, value } = event.target;
    if (!isNaN(value) && value >= 0) {
      let newTaxDetails = { ...taxDetails, [name]: value };
      let newErrors = { ...errors };
      if (validateTaxValue(value)) {
        const newfields = [...uomDetails];
        if(ref === 'sales'){
          newfields[0].sales_uom_value = value;
        }
        else if(ref === 'purchase'){
          newfields[0].purchase_uom_value = value;
        }
        setuomDetails(newfields)
        settaxDetails({
          ...taxDetails,
          [name]: value,
        });
      }

      if (name === "baseValue") {
        if (Number(value) > Number(newTaxDetails.sales_price)) {
          newErrors.baseValue = "Base Value should be lower than Sales Price";
        } else {
          newErrors.baseValue = "";
        }
      }

      settaxDetails(newTaxDetails);
      setErrors(newErrors);
    }
  };

  const [uomDetails, setuomDetails] = useState([
    {
      uomName: "",
      per_value: "",
      total_qty: "",
      sales_uom_value: "",
      sales_cfc_value: "",
      sales_sub_uom_value: "",
      purchase_uom_value: "",
      purchase_cfc_value: "",
      purchase_sub_uom_value: ""
    },
  ]);

  const [uomMasterSUB, setuomMasterSUB] = useState([]);

  const [uomValue, setuomValue] = useState("");
  const HandleUpdateUOM = (event, value) => {
    if (value != null) {
      const newfields = [...uomDetails];
      newfields[0].uomName = "";
      newfields[0].per_value = "";
      newfields[0].total_qty = "";
      setuomDetails(newfields);
      setcfcWeightValue("");
      setuomValue(value.uom);
      const validTaxDetails = value.subuom_details.filter(
        (detail) => detail.uom_name !== ""
      );
      setuomMasterSUB(validTaxDetails);
    } else {
      setuomValue("");
      setuomMasterSUB([]);
    }
  };

  const [freeStockValue, setfreeStockValue] = useState(0);

  const ChangeFreeStock = (event, value) => {
    if (value === 0) {
      setfreeStockValue(1);
    } else {
      setfreeStockValue(0);
    }
  };

  const [productMaster, setproductMaster] = useState([]);

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
            setproductMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [divisionMaster, setdivisionMaster] = useState([]);

  const HandleDivisionMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `division_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setdivisionMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [divisionID, setdivisionID] = useState("");
  const [divisionName, setdivisionName] = useState("");
  const [cigrateDivisionValue, setcigrateDivisionValue] = useState(0);

  const [subDivisionList, setsubDivisionList] = useState([]);

  const HandleChangeDivision = (event, value) => {
    console.log(value);
    setstickStatus(Number(value.stick_status));
    if (value != null) {
      const newfields = [...uomDetails];
      newfields[0].uomName = "";
      newfields[0].per_value = "";
      newfields[0].total_qty = "";
      setuomDetails(newfields);
      setcfcWeightValue("");
      setdivisionID(value.data_uniq_id);
      setdivisionName(value.division);
      setcigrateDivisionValue(value.cigarette_division);
      setsubDivisionList(value.sub_division_list);
    } else {
      setdivisionID("");
      setdivisionName("");
      setcigrateDivisionValue(0);
      setsubDivisionList([]);
    }
  };

  const [rfaDivisionID, setrfaDivisionID] = useState("");
  const [rfaDivisionName, setrfaDivisionName] = useState("");

  const HandleChangeRFADivision = (event, value) => {
    if (value != null) {
      setrfaDivisionID(value.data_uniq_id);
      setrfaDivisionName(value.sub_division);
    } else {
      setrfaDivisionID("");
      setrfaDivisionName("");
    }
  };

  const [productID, setproductID] = useState("");
  const [productName, setproductName] = useState("");
  const HandleChangeProduct = (event, value) => {
    if (value != null) {
      setproductID(value.data_uniq_id);
      setproductName(value.item_code);
    } else {
      setproductID("");
      setproductName("");
    }
  };

  const [expiryDaysvalue, setexpiryDaysvalue] = useState("");

  const HandleExpiryValue = (e) => {
    if (!isNaN(e) && e >= 0) {
      setexpiryDaysvalue(e);
    }
  };

  ///////////////////////CATEGORY MASTER////////////////////////////
  const [categoryHandlerMaster, setcategoryHandlerMaster] = useState([]);

  const [categoryDetails, setcategoryDetails] = useState({
    categoryHandlerName: null,
  });
  const HandleCategoryHandlerMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `category_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setcategoryHandlerMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };
  const HandleUpdateCategoryHandler = (event, value) => {
    setcategoryDetails((prevState) => ({
      ...prevState,
      categoryHandlerName: value,
    }));
  };
  ///////////////////////CATEGORY MASTER////////////////////////////

  ///////////////////////UOM MASTER////////////////////////////
  const [uomMaster, setuomMaster] = useState([]);

  const [cfcWeightValue, setcfcWeightValue] = useState("");

  const HandleUomMaster = () => {
    const fetchData = async (
      access_token,
      searchValue,
      createdStartDate,
      createdEndDate
    ) => {
      axiosGet
        .get(
          `uom_master_list?access_token=${access_token}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&active_status=${1}`
        )
        .then((res) => {
          if (res.data.action == "success") {
            setuomMaster(res.data.data);
          }
        });
    };
    fetchData(ACCESS_TOKEN, "", "", "");
  };

  const [stickStatus, setstickStatus] = useState(0);
  /////////////////////////////UOM MASTER/////////////////////////////////
  const HandleChangeUOMDetails = (event, value, index, ref) => {
    const newfields = [...uomDetails];
    if (ref == "sub_uom") {
      if (value != null) {
        newfields[index].uomName = value.uom_name;
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      } else {
        newfields[index].uomName = "";
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      }
    } else {
      if (event != null) {
        if (!isNaN(event) && event >= 0) {
          newfields[index].per_value = event;
          if (cigrateDivisionValue == 0) {
            newfields[index].total_qty =
              Number(cfcWeightValue) / (event / 1000);
          } else {
            newfields[index].total_qty = Number(cfcWeightValue) * event;
          }
          setuomDetails(newfields);
        }
      } else {
        newfields[index].per_value = "";
        newfields[index].total_qty = "";
        setuomDetails(newfields);
      }
    }
  };

  const HandleChangeCfcWeight = (event) => {
    if (event != null) {
      if (!isNaN(event) && event >= 0) {
        setcfcWeightValue(event);
        const newfields = [...uomDetails];
        if (cigrateDivisionValue == 0) {
          newfields[0].total_qty =
            Number(event) / (newfields[0].per_value / 1000);
        } else {
          newfields[0].total_qty = Number(event) * newfields[0].per_value;
        }
        setuomDetails(newfields);
      }
    } else {
      setcfcWeightValue("");
    }
  };


  useEffect(() => {
    const calculateTotalValue = () => {
      const base = parseFloat(taxDetails.baseValue) || 0;
      const taxPercentage = parseFloat(taxDetails.taxValue) || 0;
      const tax = ((base * taxPercentage) / 100);
      const cessPercentage = parseFloat(taxDetails.cessValue) || 0;
      const cess = ((base * cessPercentage) / 100);
      const additionalCess = parseFloat(taxDetails.additionalCessValue) || 0;
      return base + tax + cess + additionalCess;
    };

    setTotalValue(calculateTotalValue());

  }, [taxDetails]);

  const [cfcPrice, setCfcPrice] = useState(0);
  useEffect(() => {
    const calculatedPrice = parseFloat(taxDetails.sales_price) * parseFloat(cfcWeightValue);
    setCfcPrice(calculatedPrice);
    const newfields = [...uomDetails];
    newfields[0].sales_cfc_value = calculatedPrice;
    setuomDetails(newfields)
  }, [taxDetails.sales_price, cfcWeightValue]);

  const [subUOMPrice, setsubUOMPrice] = useState(0);
  useEffect(() => {
    const calculatedsubUOMPrice = parseFloat(cfcPrice) / parseFloat(uomDetails[0]?.total_qty);
    setsubUOMPrice(calculatedsubUOMPrice);
    const newfields = [...uomDetails];
    newfields[0].sales_sub_uom_value = calculatedsubUOMPrice;
    setuomDetails(newfields)
  }, [cfcPrice, uomDetails[0]?.total_qty]);

  const [cfcbasePrice, setCfcbasePrice] = useState(0);
  useEffect(() => {
    const calculatedPrice = parseFloat(taxDetails.baseValue) * parseFloat(cfcWeightValue);
    setCfcbasePrice(calculatedPrice);
    const newfields = [...uomDetails];
    newfields[0].purchase_cfc_value = calculatedPrice;
    setuomDetails(newfields)
  }, [taxDetails.baseValue, cfcWeightValue]);

  const [subUOMbasePrice, setsubbaseUOMPrice] = useState(0);
  useEffect(() => {
    const calculatedsubUOMPrice = parseFloat(cfcbasePrice) / parseFloat(uomDetails[0]?.total_qty);
    setsubbaseUOMPrice(calculatedsubUOMPrice);
    const newfields = [...uomDetails];
    newfields[0].purchase_sub_uom_value = calculatedsubUOMPrice;
    setuomDetails(newfields)
  }, [cfcbasePrice, uomDetails[0]?.total_qty]);

  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));
  const [totalValue, setTotalValue] = useState("");
  const CreateCompannet = () => {
    return (
      <div style={{ height: "85vh", overflow: "auto" }}>
        <Box sx={{ my: 1, padding: "5px" }}>
          <div className="master_create_style">
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              Product Details
            </Typography>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Product Name"
                  variant="outlined"
                  value={job_titleName}
                  onChange={(e) => setjob_titleName(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Product Name"
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
                  label="Item Code"
                  variant="outlined"
                  disabled={openDrawerType !== 1 ? true : false}
                  value={itemCode}
                  onChange={(e) => setitemCode(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Item Code"
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
                  label="HSN Code"
                  variant="outlined"
                  disabled={openDrawerType !== 1 ? true : false}
                  value={hsnCode}
                  onChange={(e) => sethsnCode(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="HSN Code"
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
            <Box>
              <Stack direction={"row"} gap={2} style={{ alignItems: "center" }}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  disabled={openDrawerType !== 1 ? true : false}
                  style={{ marginTop: "10px" }}
                  options={divisionMaster}
                  value={
                    divisionMaster.find(
                      (year) => year.division === divisionName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeDivision(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.division}
                  required
                  id="division"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={divisionName}
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
                      label="Division"
                    />
                  )}
                  clearIcon={null}
                />

                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  disabled={openDrawerType !== 1 ? true : false}
                  style={{ marginTop: "10px" }}
                  options={subDivisionList}
                  value={
                    subDivisionList.find(
                      (year) => year.sub_division === rfaDivisionName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeRFADivision(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.sub_division}
                  required
                  id="sub_division"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={rfaDivisionName}
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
                      label="RFA Division"
                    />
                  )}
                  clearIcon={null}
                />

                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  disabled={openDrawerType !== 1 ? true : false}
                  style={{ marginTop: "10px" }}
                  options={uomMaster}
                  value={
                    uomMaster.find((year) => year.uom === uomValue) || null
                  }
                  onChange={(e, value) =>
                    HandleUpdateUOM(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.uom}
                  required
                  id="UOM"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={uomValue}
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
                      label="UOM"
                    />
                  )}
                  clearIcon={null}
                />

              </Stack>
            </Box>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2} style={{ alignItems: "center" }}>
                <div style={{ width: '30%' }}>
                  <Checkbox
                    onChange={(event) => ChangeFreeStock(event, freeStockValue)}
                    checked={freeStockValue == 0 ? false : true}
                    style={{ padding: "0px", color: "#c3c3c3" }}
                  />
                  <Typography
                    variant="p"
                    fontSize={"12px"}
                    fontWeight={"bold"}
                    style={{ color: "black" }}
                  >
                    Free Stock
                  </Typography>
                </div>
                <TextField
                  id="outlined-basic"
                  label={stickStatus === 1 || cigrateDivisionValue === 1 ? "M For CFC" : "CFC Weight"}
                  variant="outlined"
                  value={cfcWeightValue}
                  onChange={(e) => HandleChangeCfcWeight(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder={stickStatus === 1 || cigrateDivisionValue === 1 ? "M For CFC" : "CFC Weight"}
                  sx={{ pb: 1, width: '35%' }}
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
                  label="Expiry Days"
                  variant="outlined"
                  value={expiryDaysvalue}
                  onChange={(e) => HandleExpiryValue(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Expiry Days"
                  sx={{ pb: 1, width: '35%' }}
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
            {freeStockValue !== 0 && (
              <Box>
                <Stack
                  direction={"row"}
                  gap={2}
                  style={{ alignItems: "center" }}
                >
                  <Autocomplete
                    margin="normal"
                    variant="outlined"
                    style={{ marginTop: "20px", width: "100%" }}
                    options={productMaster}
                    value={
                      productMaster.find(
                        (year) => year.item_code === productName
                      ) || null
                    }
                    onChange={(e, value) =>
                      HandleChangeProduct(e.target.value, value)
                    }
                    getOptionLabel={(val) => val.item_code}
                    required
                    id="item_code"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        value={productName}
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
                        label="Free Stock Item Code"
                      />
                    )}
                    clearIcon={null}
                  />
                </Stack>
              </Box>
            )}
          </div>

          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <Typography
              variant="p"
              fontSize={"14px"}
              fontWeight={"bold"}
              style={{ color: "#185AA6" }}
            >
              UOM Details
            </Typography>
            <Box sx={{ my: 2 }}>
              <Stack direction={"row"} gap={2}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "0px", width: "35%" }}
                  options={uomMasterSUB}
                  value={
                    uomMasterSUB?.find(
                      (year) => year.uom_name === uomDetails[0]?.uomName
                    ) || null
                  }
                  onChange={(e, value) =>
                    HandleChangeUOMDetails(e.target.value, value, 0, "sub_uom")
                  }
                  getOptionLabel={(val) => val.uom_name}
                  required
                  id="sub_uom"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={uomDetails[0]?.uomName}
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
                      label="Sub UOM"
                    />
                  )}
                  clearIcon={null}
                />
                <TextField
                  id="outlined-basic"
                  label={stickStatus === 1 || cigrateDivisionValue === 1 ? "Stick Per Pack" : "Per UOM Value"}
                  variant="outlined"
                  value={uomDetails[0]?.per_value}
                  onChange={(e, value) =>
                    HandleChangeUOMDetails(
                      e.target.value,
                      value,
                      0,
                      "per_value"
                    )
                  }
                  size="small"
                  fullWidth
                  placeholder={stickStatus === 1 || cigrateDivisionValue === 1 ? "Stick Per Pack" : "Per UOM Value"}
                  sx={{ pb: 1, width: "35%" }}
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
                  label={
                    stickStatus === 0
                      ? "Total Quantity Of CFC"
                      : "Total Quantity Of Box"
                  }
                  variant="outlined"
                  disabled
                  value={uomDetails[0]?.total_qty}
                  size="small"
                  fullWidth
                  placeholder={
                    stickStatus === 0
                      ? "Total Quantity Of CFC"
                      : "Total Quantity Of Box"
                  }
                  sx={{ pb: 1, width: "30%" }}
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
            <Stack direction={"row"} gap={2}>
              <Autocomplete
                margin="normal"
                variant="outlined"
                multiple={false}  // Changed to single select
                style={{ width: "33%", fontSize: '12px' }}
                options={categoryHandlerMaster}
                value={categoryDetails.categoryHandlerName || null}
                onChange={HandleUpdateCategoryHandler}
                getOptionLabel={(option) => option.category_type || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                required
                id="category_handler"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
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
                    label="Category Handler"
                  />
                )}
                clearIcon={null}
              />
            </Stack>

          </div>
          <div className="master_create_style" style={{ marginTop: "10px" }}>
            <div>
              <Typography
                variant="p"
                fontSize={"14px"}
                fontWeight={"bold"}
                style={{ color: "#185AA6" }}
              >
                Price & Tax Details
              </Typography>
            </div>
            <Box sx={{ marginTop: "10px" }}>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="MRP Price"
                  variant="outlined"
                  name="mrp_price"
                  value={taxDetails.mrp_price}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="MRP Price"
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
                  error={Boolean(errors.mrp_price)}
                  helperText={errors.mrp_price}
                />
                <TextField
                  id="outlined-basic"
                  label="Salvage Value"
                  variant="outlined"
                  name="salvage_value"
                  value={taxDetails.salvage_value}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="Salvage Value"
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


              </Stack>
              <Stack direction={"row"} gap={2}>

                <TextField
                  id="outlined-basic"
                  label="Sales Price"
                  variant="outlined"
                  name="sales_price"
                  value={taxDetails.sales_price}
                  onChange={(event) => handleTaxFormChange(event,'sales')}
                  size="small"
                  fullWidth
                  placeholder="Sales Price"
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
                  error={Boolean(errors.sales_price)}
                  helperText={errors.sales_price}
                />
                <TextField
                  id="outlined-basic"
                  label="Cfc Price"
                  variant="outlined"
                  value={(isNaN(cfcPrice) ? 0 : cfcPrice).toFixed(2)}
                  disabled
                  size="small"
                  placeholder="Cfc Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />

                <TextField
                  id="outlined-basic"
                  label="Sub UOM Price"
                  variant="outlined"
                  value={(isNaN(subUOMPrice) ? 0 : subUOMPrice).toFixed(2)}
                  disabled
                  size="small"
                  placeholder="Sub UOM Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>

                <TextField
                  id="outlined-basic"
                  label="Base Value"
                  variant="outlined"
                  name="baseValue"
                  value={taxDetails.baseValue}
                  onChange={(event) => handleTaxFormChange(event,'purchase')}
                  size="small"
                  fullWidth
                  placeholder="Base Value"
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
                  error={Boolean(errors.baseValue)}
                  helperText={errors.baseValue}
                />
                <TextField
                  id="outlined-basic"
                  label="Cfc Base Price"
                  variant="outlined"
                  value={(isNaN(cfcbasePrice) ? 0 : cfcbasePrice).toFixed(2)}
                  disabled
                  size="small"
                  placeholder="Cfc Base Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />

                <TextField
                  id="outlined-basic"
                  label="Sub UOM  Base Price"
                  variant="outlined"
                  value={(isNaN(subUOMbasePrice) ? 0 : subUOMbasePrice).toFixed(2)}
                  disabled
                  size="small"
                  placeholder="Sub UOM Price"
                  sx={{ pb: 1, marginTop: '10px', width: '50%' }}
                  inputProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: '12px',
                    },
                  }}
                />
              </Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  id="outlined-basic"
                  label="Tax %"
                  variant="outlined"
                  name="taxValue"
                  value={taxDetails?.taxValue}
                  onChange={(event) => handleTaxFormChange(event,'null')}
                  size="small"
                  fullWidth
                  placeholder="Tax %"
                  sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                  label="Inversement Value"
                  variant="outlined"
                  value={(totalValue || 0).toFixed(0)}
                  disabled
                  size="small"
                  placeholder="Inversement Value"
                  sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
              <Stack direction={"row"} gap={2}>
                {cigrateDivisionValue !== 0 && (
                  <TextField
                    id="outlined-basic"
                    label="Cess %"
                    variant="outlined"
                    name="cessValue"
                    value={taxDetails.cessValue}
                    onChange={(event) => handleTaxFormChange(event,'null')}
                    size="small"
                    fullWidth
                    placeholder="Cess %"
                    sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                )}
                {cigrateDivisionValue !== 0 && (
                  <TextField
                    id="outlined-basic"
                    label="Additional Cess"
                    variant="outlined"
                    name="additionalCessValue"
                    value={taxDetails.additionalCessValue}
                    onChange={(event) => handleTaxFormChange(event,'null')}
                    size="small"
                    fullWidth
                    placeholder="Additional Cess"
                    sx={{ pb: 1, marginTop: "10px", width: "50%" }}
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
                )}
              </Stack>
            </Box>
          </div>
        </Box>
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
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
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
      {/* {filtersList && ( */}
      <Collapse in={filtersList} timeout="auto" unmountOnExit>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {FilterComponent()}
        </Box>
      </Collapse>
      <div>
        <MasterTable
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
      <MasterDrawer
        isPageSidebarOpen={openDrawer}
        drawerWidth={pageDrawerWidth}
        onSidebarClose={toggleDrawer(false)}
        heading={"Product"}
        postError={postError}
        setStateValue={setjob_titleName}
        setValue={job_titleName}
        onCreateClick={handleSubmit}
        CreateCompannet={CreateCompannet}
      />

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
          <ListItemButton onClick={HandleOpenHistory}>
            <Typography variant="p">Batch History</Typography>
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={HandlesalvageHistory}>
            <Typography variant="p">Salvage History</Typography>
          </ListItemButton>
          <Divider />
          <Divider />
          <ListItemButton onClick={handleOpen}>
            <Typography variant="p"> Change Status</Typography>
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={toggleDrawer(true, 2)}>
            <Typography variant="p">Edit</Typography>
          </ListItemButton>
          <Divider />
          <ListItemButton
            sx={{ bgcolor: "#dfc4cd69" }}
            onClick={handleDelteOpen}
          >
            <Typography variant="p">Delete</Typography>
          </ListItemButton>
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
                  {singleData.product_name}
                </Box>
              </Item>
            </Stack>
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
                Batch History
              </Box>
            </div>
            <TableContainer
              sx={{
                width: {
                  xs: "274px",
                  sm: "100%",
                },
                height: "80vh",
                overflow: "auto",
                marginTop: "10px",
              }}
            >
              <Table
                stickyHeader
                aria-label="customized table"
                sx={{
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                <TableHead sx={{ background: "#F0F0F0" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Batch Number
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Invoice Number
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Invoice Date
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Sales Price (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Pervious BaseValue (₹)
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Current BaseValue (₹)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {singleData?.batch_details?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.batch_number}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.invoice_number === null
                          ? "NA"
                          : row.invoice_number}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.invoice_date === null ? "NA" : row.invoice_date}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.base_value}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.base_value}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.current_base_value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Drawer>

      {/* <Drawer anchor="right" open={batchHistory} onClose={HandlesalvageHistory}>
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
                  {singleData.product_name}
                </Box>
              </Item>
            </Stack>
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
                Batch History
              </Box>
            </div>
            <TableContainer
              sx={{
                width: {
                  xs: "274px",
                  sm: "100%",
                },
                height: "80vh",
                overflow: "auto",
                marginTop: "10px",
              }}
            >
              <Table
                stickyHeader
                aria-label="customized table"
                sx={{
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                <TableHead sx={{ background: "#F0F0F0" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Batch Number
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Invoice Number
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Invoice Date
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Sales Price (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Pervious BaseValue (₹)
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Current BaseValue (₹)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {singleData?.batch_details?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.batch_number}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.invoice_number === null
                          ? "NA"
                          : row.invoice_number}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.invoice_date === null ? "NA" : row.invoice_date}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.base_value}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.base_value}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.current_base_value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Drawer> */}


      <Drawer anchor="right" open={salvageHistory} onClose={HandlesalvageHistory}>
        <Box sx={{ width: 700 }} role="presentation">
          <Box
            display={"flex"}
            alignItems={"center"}
            padding={1}
            justifyContent={"space-between"}
            spacing={0.5}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Item onClick={HandlesalvageHistory}>
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
                  {singleData.product_name}
                </Box>
              </Item>
            </Stack>
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
                Salvage History
              </Box>
            </div>
            <TableContainer
              sx={{
                width: {
                  xs: "274px",
                  sm: "100%",
                },
                height: "80vh",
                overflow: "auto",
                marginTop: "10px",
              }}
            >
              <Table
                stickyHeader
                aria-label="customized table"
                sx={{
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                <TableHead sx={{ background: "#F0F0F0" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Division
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        UOM
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Current Salvage Value (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Pervious Salvage Value (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        CFC Price (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Sub UOM Price (₹)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {singleData?.salvage_history?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.division_data}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.uom === null
                          ? "NA"
                          : row.uom}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.current_salvage_value || 0}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.previous_salvage_value || 0}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.cfc_value || 0}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.sub_uom_price || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Drawer>

      <AlertDialog
        onsubmit={handleDelete}
        open={dltOpen}
        handleClose={handleCloseDlt}
        text={"Are you sure want to Delete?"}
      ></AlertDialog>
      <AlertDialog
        onsubmit={handleStatusChange}
        open={open}
        handleClose={handleClose}
        text={"Are you sure want to change status?"}
      ></AlertDialog>
      <AlertDialog
        onsubmit={handleMulitiStatusChange}
        open={openMulitiStatus}
        handleClose={handleCloseMultiStatus}
        text={`Are you sure want to ${actionData === 0 ? "Inactive" : "Active"
          } ${selectedItems.length} items?`}
      ></AlertDialog>

      <AlertDialog
        onsubmit={handleMulitiDelete}
        open={openMulitiDelete}
        handleClose={handleCloseMultiDelete}
        text={`Are you sure want to delete ${selectedItems.length} items?`}
      ></AlertDialog>
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
