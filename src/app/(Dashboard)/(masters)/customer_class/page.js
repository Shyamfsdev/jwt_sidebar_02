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
  Checkbox,
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
        const newTaxDetails = Array.from({ length: data.length }, () => ({
          uom_id: "",
          uom_name: "",
        }));
        setDataUniqId("");
      } else {
        setOpenDrawer(newOpen);
        setOpenDrawerType(type);
        setpageDrawerWidth(500);
        setjob_titleName(singleData.customer_class);
        setDataUniqId(singleData.data_uniq_id);
        handleClose2();
      }
    } else {
      setOpenDrawer(newOpen);
      setOpenDrawerType(type);
      setpageDrawerWidth(0);
    }
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

  // Page action's state and funtions (create, Edit, Status change, Delete) ----
  const [job_titleName, setjob_titleName] = useState("");
  const [dataUniqId, setDataUniqId] = useState("");
  const [dataStatus, setDataStatus] = useState(1);
  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [postError, setPostError] = useState([]);


  const handleSubmit = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: dataUniqId,
      customer_class: job_titleName,
      active_status: dataStatus,
    };
    try {
      if (openDrawerType == 1) {
        axiosPost
          .post(`customer_class_master`, jsonData)
          .then((response) => {
            // Handle the successful POST response here
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
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
          .put(`customer_class_master`, jsonData)
          .then((response) => {
            if (response.data.action === "success") {
              setOpenDrawer(false);
              setpageDrawerWidth(0);
              setjob_titleName("");
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
        `customer_class_master_list?access_token=${ACCESS_TOKEN}&page=${pageNumber}&items_per_page=${limitEnd}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${orderType}&order_field=${orderField}&active_status=${
          activeStatusFilter === 3 ? "" : activeStatusFilter
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

  const title = "Customer Class";

  const tableHead = [
    {
      id: 1,
      label: `${title}`,
      value: "customer_class",
    },
    {
      id: 2,
      label: "Created Date",
      value: "created_date",
    },
    {
      id: 3,
      label: "Status",
      value: "active_status",
    },
    {
      id: 4,
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
              {item.customer_class}
            </Typography>
          ),
          id: 1,
        },
        {
          comp: (
            <Typography className="table_cell_3" px={2}>
              {item.created_f_date}
            </Typography>
          ),
          id: 2,
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
          id: 3,
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
          id: 4,
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



 

  const CreateCompannet = () => {
    return (
      <div style={{ height: "85vh", overflow: "auto" }}>
        <Box sx={{ my: 1, padding: "10px" }}>
          <TextField
            id="outlined-basic"
            label="Customer Class"
            variant="outlined"
            value={job_titleName}
            onChange={(e) => setjob_titleName(e.target.value)}
            size="small"
            fullWidth
            placeholder="Customer Class"
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
            helperText={postError?.occupeion}
            error={postError?.occupeion}
          />
          <p>{postError.customer_class}</p>
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
        heading={"Customer Class"}
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
        anchorOrigin={{ horizontal: "right", vertical: "right" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            minWidth: "100px",
            boxShadow: "0px 4px 7px 0px #00000024 !important",
          },
        }}
      >
        <List sx={{ p: 0, fontSize: "12px" }}>
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
        text={`Are you sure want to ${
          actionData === 0 ? "Inactive" : "Active"
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
