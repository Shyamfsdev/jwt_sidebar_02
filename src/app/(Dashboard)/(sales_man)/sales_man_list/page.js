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
  Autocomplete,
  Divider,
  TextField,
  Stack,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Badge,
  Collapse,
  Drawer,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import CreateButton from "../../components/buttons/CreateButton";
import WithoutCreateButton from "../../components/buttons/WithoutCreateButton";
import EmployeeFilter from "../../components/filter_list/EmployeeFilter";
import FilterButton from "../../components/buttons/FilterButton";
import ExportButton from "../../components/buttons/ExportButton";
import SearchFilter from "../../components/buttons/SearchFilter";
import Cookies from "js-cookie";
import AlertDialog from "../../components/container/AlertDialog";
import { axiosGet, axiosPost } from "../../../../lib/api";
import UserTable from "../../components/dashboard/SalesmanTable";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import DateFilter from "../../../(Dashboard)/components/buttons/DateFilter";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";

const EmployeeList = () => {
  const ACCESS_TOKEN = Cookies.get("token");
  const USERID = Cookies.get("user_id");

  const [data, setData] = useState([]);
  const [singleData, setSingleData] = useState([]);

  const [salesmanDetails, setsalesmanDetails] = useState();


  const [createdStartDate, setCreatedStartDate] = useState("");
  const [createdEndDate, setCreatedEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState(""); // State variable to store search input

  const [tableName, setTableName] = useState("");
  const [tableDetails, settableDetails] = useState(null);
  const [pageCount, setPageCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [limitEnd, setlimitEnd] = useState("30");
  const [dataCount, setdataCount] = useState(0);

  const handleLimitChange = (event) => {
    setlimitEnd(event.target.value);
    handleRefresh();
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

  const handleOpen = () => {
    setOpen(true);
    handleClose2();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClaim = () => {
    Cookies.set("uuid", singleData?.id);
    router.push(`/adjuster-edit`);
  };

  // Function to update searchValue when input changes
  const handleSearchInputChange = (input) => {
    setSearchValue(input);
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
    status,
  ) => {
    axiosGet
      .get(
        `salesman_master_list?access_token=${access_token}&page=${limit}&items_per_page=${end}&search_input=${searchValue}&from_date=${createdStartDate}&to_date=${createdEndDate}&order_type=${order_type}&order_field=${order_field}&status=${status}&user_type=${"salesman_user"}`
      )
      .then((response) => {
        setData(response.data.data);
        setdataCount(response.data.total_items);
        setPageCount(response.data.total_pages);
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
      orderField,
      employeeStatus,
    );
  };

  const [userType, setUserType] = useState("");

  const [UserAccess, setUserAccess] = useState([]);

  const list_menu = [];

  const list_menu_2 = [];

  const fetchDataUser = async () => {
    axiosGet
      .get(`valid_token?user_token=${ACCESS_TOKEN}`)
      .then((response) => {
        if (response.data.status === 200) {
          setUserType(response.data.data.user_type);
          if (
            response.data.data?.privilages != undefined &&
            response.data.data?.user_type == "salesman_user"
          ) {
            const filteredPrivileges = response.data.data?.privilages.filter(
              (privilege) =>
                response.data.data.useraccesslist.includes(
                  Object.keys(privilege)[0]
                )
            );
            setUserAccess(filteredPrivileges);
          }
        } else {
          Cookies.remove("token");
          Cookies.remove("ip");
          Cookies.remove("user_id");
          router.push("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (userType == "salesman_user") {
    const departments = UserAccess.filter((item) => "download_payslip" in item)
      .map((item) => item.download_payslip)
      .filter(Boolean);

    departments.map((val) => {
      val.map((res) => {
        list_menu.push(res);
      });
    });
  }

  if (userType != "salesman_user") {
    list_menu.push("download", "list");
  }

  if (userType == "salesman_user") {
    const departments = UserAccess.filter(
      (item) => "active_status_edit" in item
    )
      .map((item) => item.active_status_edit)
      .filter(Boolean);

    departments.map((val) => {
      val.map((res) => {
        list_menu_2.push(res);
      });
    });
  }

  if (userType != "salesman_user") {
    list_menu_2.push("list");
  }
  useEffect(() => {
    fetchDataUser();
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      searchValue,
      createdStartDate,
      createdEndDate,
      orderType,
      orderField,
      employeeStatus,
    );
  }, [
    ACCESS_TOKEN,
    pageNumber,
    limitEnd,
    searchValue,
    createdStartDate,
    createdEndDate,
  ]);

  const router = useRouter();

  const handleCreateEmployee = () => {
    router.push("/sales_man_create");
  };

  const onCreatedDateChange = (data) => {
    const formattedStartDate = formatDate(data[0].startDate);
    const formattedEndDate = formatDate(data[0].endDate);
    setCreatedStartDate(formattedStartDate);
    setCreatedEndDate(formattedEndDate);
    setDateTitle(`${formattedStartDate} - ${formattedEndDate}`);
    setIsDateSelected(true);
  };

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const tableHead = [
    {
      id: 1,
      label: "Salesman ID",
      value: "salesman_code",
    },
    {
      id: 2,
      label: "Salesman Name",
      value: "full_name",
    },
    {
      id: 3,
      label: "Contact No.",
      value: "mobile_number",
    },
    {
      id: 7,
      label: "DOJ",
      value: "date_of_join",
    },
  ];

  const td_data_set = [];
  console.log(data, "rftrftr")
  data?.map((item, index) => {
    const array_data = {
      id: item.data_uniq_id,
      data: [
        { td: item.salesman_code, type: "text", id: 1, alian: "left" },
        {
          td: item.full_name,
          type: "text",
          id: 2,
          alian: "left",
        },
        {
          td: item.mobile_number,
          type: "text",
          id: 3,
          alian: "left",
        },
        {
          td: item.job_essentials?.doj,
          type: "text",
          id: 7,
          alian: "left",
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
    setCreatedEndDate("");
    setCreatedStartDate("");
    setemployeeStatus("");
    setDateTitle("Created Date");
    setIsDateSelected(false);
    fetchData(
      ACCESS_TOKEN,
      pageNumber,
      limitEnd,
      "",
      "",
      "",
      "desc",
      "created_date",
      "",
    );
  };

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };
  const handleActiveStatusChange = () => {
    activeStatusChange();
  };

  console.log(singleData, 'singleData');

  const singleDataGet = (data) => {
    setSingleData(data);
    setsalesmanDetails(data?.json[0]);
  };

  const activeStatusChange = () => {
    let status;
    if (singleData.active === "Active") {
      status = 0;
    } else {
      status = 1;
    }
    axiosGet
      .get(
        `active_status?access_token=${ACCESS_TOKEN}&status=${status}&table_name=${tableName}&field_id=${singleData?.id}&field_name=${tableDetails.status_field}&id_field=${tableDetails.id_field}`
      )
      .then((response) => {
        // window.location.reload();
        fetchData(
          ACCESS_TOKEN,
          pageNumber,
          limitEnd,
          searchValue,
          createdStartDate,
          createdEndDate,
          orderType,
          orderField,
          employeeStatus,
        );
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const employee_status = [
    { id: 1, label: "Active", value: 1 },
    { id: 2, label: "Inactive", value: 2 },
    { id: 3, label: "Suspend", value: 3 },
    { id: 4, label: "Resigned", value: 4 },
    { id: 5, label: "Abscond", value: 5 },
  ];

  const [employeeStatus, setemployeeStatus] = useState("");
  const EmployeeStatusValue = (event) => {
    if (event != null && event != undefined) {
      setemployeeStatus(event);
      fetchData(
        ACCESS_TOKEN,
        pageNumber,
        limitEnd,
        searchValue,
        createdStartDate,
        createdEndDate,
        orderType,
        orderField,
        event
      );
    } else {
      setemployeeStatus("");
    }
  };

  const [filtersList, setfiltersList] = useState(false);
  const HandleChangeFilter = () => {
    setfiltersList(!filtersList);
  };

  const ActionComponent = () => {
    return (
      <Autocomplete
        margin="normal"
        variant="outlined"
        options={employee_status}
        style={{ width: "40%" }}
        value={
          employee_status.find((option) => option.label === actionData) || null
        }
        onChange={(event, value) => handleChange(event.target.value, value)}
        getOptionLabel={(val) => val.label}
        required
        id="employee_status"
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            value={actionData === undefined ? "" : actionData}
            style={{ margin: "2px" }} // Align label to center
            InputLabelProps={{
              className: "textfieldstylefont",
            }}
            InputProps={{
              ...params.InputProps,
              autoComplete: "off",
              className: "fontInput",
            }}
            placeholder="Employee Status"
          />
        )}
        clearIcon={null}
      />
    );
  };

  const EmployeeDetailsRoute = () => {
    router.push("/sales_man_details");
    Cookies.set("data_uniq_id", singleData.id, {
      expires: 7,
    });
  };

  const [incentiveHistory, setincentiveHistory] = useState(false);

  const HandleOpenHistory = () => {
    setincentiveHistory(!incentiveHistory);
    handleClose2();
  };


  const [incentiveEntry, setincentiveEntry] = useState(false);

  const HandleIncentive = () => {
    setincentiveEntry(!incentiveEntry);
    setcurrentMonth("");
    setcurrentMonthID(0);
    setcurrentYear("");
    setincentiveAmount("");
    handleClose2();
  };

  const EmployeeCreateMaster = async () => {
    const mdata = {
      access_token: ACCESS_TOKEN,
      salesman_id: salesmanDetails?.data_uniq_id,
      incentive_month: currentMonth,
      incentive_year: currentYear,
      incentive_date: currentDate,
      amount: incentiveAmount
    };
    axiosPost.post(`salesman_incentive_api`, mdata).then((res) => {
      console.log(res)
      if (res.data.action_status === "Error") {
        setError({ status: "error", message: res.data.message });
      } else {
        const successMessage = "Created Successfully";
        setError({ status: "success", message: successMessage });
        setTimeout(() => {
          HandleIncentive();
        }, 200);
      }
    });

  };


  const Item = styled("div")(({ theme }) => ({
    padding: theme.spacing(1.5),
    textAlign: "left",
    borderRadius: 8,
    border: 0.5,
  }));


  const MenuComponent = () => {
    return (
      <List sx={{ p: 0, fontSize: "12px" }}>
        <ListItemButton onClick={() => EmployeeDetailsRoute()}>
          <Typography variant="p">Employee Details</Typography>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => HandleIncentive()}>
          <Typography variant="p">Incentive Entry</Typography>
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={() => HandleOpenHistory()}>
          <Typography variant="p">Incentive History</Typography>
        </ListItemButton>
        {/* {userType == "super_admin" && (
          <ListItemButton onClick={() => handleOnclick4()}>
            <Typography variant="p">Privilege</Typography>
          </ListItemButton>
        )} */}
      </List>
    );
  };

  const handleOnActionClick = (e, data) => {
    setSingleData(data);
    setsalesmanDetails(data?.json[0]);
    setAnchorEl2(e.currentTarget);
  };

  const [actionData, setActionData] = useState("");
  const [openMulitiStatus, setOpenMultistatus] = useState(false);
  const handleChange = (event, value) => {
    if (value != null) {
      setActionData(value.label);
      setOpenMultistatus(true);
    } else {
      setActionData("");
      setOpenMultistatus(false);
    }
  };
  const [selectedItems, setSelectedItems] = useState([]);
  // Funtion for change status of single data


  const handleMulitiStatusChange = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: selectedItems,
      status: actionData,
    };
    axiosPost
      .post(`active_status_update`, jsonData)
      .then((response) => {
        setSelectedItems([]);
        setActionData("");
        handleClose2();
        fetchData(
          ACCESS_TOKEN,
          pageNumber,
          limitEnd,
          searchValue,
          createdStartDate,
          createdEndDate,
          orderType,
          orderField,
          employeeStatus
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCloseMultiStatus = () => {
    setOpenMultistatus(false);
  };

  const [isDateSelected, setIsDateSelected] = useState(false);

  const [dateTitle, setDateTitle] = useState("Created Date");



  const [error, setError] = useState({ status: "", message: "" });
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };


  const [showModel4, setshowModel4] = useState(false);

  const handleOnclick4 = () => {
    setshowModel4(true);
    handleClose2();
  };

  const [activeStatusName, setactiveStatusName] = useState([]);
  const [activeStatusBody, setactiveStatusBody] = useState([]);
  const [activeStatusNamePrivilege, setactiveStatusNamePrivilege] = useState(
    []
  );

  const handleCloseclick4 = () => {
    setshowModel4(false);
    setactiveStatusBody([]);
    setactiveStatusName([]);
    setactiveStatusNamePrivilege([]);
    setuserAccessTitle([]);
    setuserAccessBody([]);
    setUserAccessHead([]);
  };

  const UserPrivilagerList = [
    {
      id: 0,
      outbut: "Employee",
      suboutbut: [
        {
          id: 40,
          val: "Employee Details",
          final: "employee_details",
          subdomain: [
            { id: 401, inbut: "employee_info", inputval: "Employee Info" },
            { id: 402, inbut: "job_essentials", inputval: "Job Essentials" },
            {
              id: 403,
              inbut: "salary_and_bank_details",
              inputval: "Salary & Bank Details",
            },
            { id: 404, inbut: "credentials", inputval: "Credentials" },
            { id: 405, inbut: "list", inputval: "List" },

          ],
        },
        {
          id: 41,
          val: "Download Payslip",
          final: "download_payslip",
          subdomain: [
            { id: 411, inbut: "download", inputval: "Download" },
            { id: 412, inbut: "list", inputval: "List" },
          ],
        },
        {
          id: 42,
          val: "Active Status Edit",
          final: "active_status_edit",
          subdomain: [{ id: 421, inbut: "list", inputval: "List" }],
        },
      ],
    },
    {
      id: 1,
      outbut: "Target",
      suboutbut: [
        {
          id: 50,
          val: "Target Edit",
          final: "target_edit",
          subdomain: [{ id: 501, inbut: "list", inputval: "List" }],
        },
        {
          id: 51,
          val: "Add Cumulative Achievement",
          final: "add_cumulative_achievement",
          subdomain: [{ id: 511, inbut: "list", inputval: "List" }],
        },
        {
          id: 52,
          val: "Cumulative Achievement History",
          final: "cumulative_achievement_history",
          subdomain: [{ id: 521, inbut: "list", inputval: "List" }],
        },
      ],
    },
  ];

  const [userAccessHead, setUserAccessHead] = useState([]);

  const UserAccessHeadFun = (event, value) => {
    if (!userAccessHead.includes(value)) {
      setUserAccessHead((prevPermissions) => [...prevPermissions, value]);
      UserPrivilagerList.map((res) => {
        if (value == res.id) {
          res.suboutbut.map((val) => {
            setuserAccessTitle((prevPermissions) => [
              ...prevPermissions,
              val.id,
            ]);
            setactiveStatusName((prevPermissions) => [
              ...prevPermissions,
              val.final,
            ]);
            val.subdomain.map((fer) => {
              setuserAccessBody((prevPermissions) => [
                ...prevPermissions,
                fer.id,
              ]);
            });
          });
        }
      });
      if (value == 0) {
        setactiveStatusNamePrivilege((prevPermissions) => [
          ...prevPermissions,
          {
            employee_details: [
              "employee_info",
              "job_essentials",
              "salary_and_bank_details",
              "credentials",
              "list",
            ],
          },
          {
            download_payslip: ["download", "list"],
          },
          {
            active_status_edit: ["list"],
          },
        ]);
      }
      if (value == 1) {
        setactiveStatusNamePrivilege((prevPermissions) => [
          ...prevPermissions,
          { target_edit: ["list"] },
          { add_cumulative_achievement: ["list"] },
          { cumulative_achievement_history: ["list"] },
        ]);
      }
    } else {
      UserPrivilagerList.map((res) => {
        if (value == res.id) {
          res.suboutbut.map((val) => {
            setuserAccessTitle((prevPermissions) =>
              prevPermissions.filter((permission) => permission !== val.id)
            );
            setactiveStatusName((prevPermissions) =>
              prevPermissions.filter((permission) => permission !== val.final)
            );
            val.subdomain.map((fer) => {
              setuserAccessBody((prevPermissions) =>
                prevPermissions.filter((permission) => permission !== fer.id)
              );
            });
          });
        }
      });

      if (value === 0) {
        setactiveStatusNamePrivilege((prevPermissions) =>
          prevPermissions.filter(
            (permission) =>
              !(
                permission.employee_details &&
                permission.employee_details.includes(
                  "employee_info",
                  "job_essentials",
                  "salary_and_bank_details",
                  "credentials",
                  "list"
                )
              ) &&
              !(
                permission.download_payslip &&
                permission.download_payslip.includes("download", "list")
              ) &&
              !(
                permission.active_status_edit &&
                permission.active_status_edit.includes("list")
              )
          )
        );
      }

      if (value === 1) {
        setactiveStatusNamePrivilege((prevPermissions) =>
          prevPermissions.filter(
            (permission) =>
              !(
                permission.target_edit &&
                permission.target_edit.includes("list")
              ) &&
              !(
                permission.add_cumulative_achievement &&
                permission.add_cumulative_achievement.includes("list")
              ) &&
              !(
                permission.cumulative_achievement_history &&
                permission.cumulative_achievement_history.includes("list")
              )
          )
        );
      }

      const uniquePermissions = new Set(userAccessHead);
      uniquePermissions.delete(value);
      setUserAccessHead([...uniquePermissions]);
      setuserAccessAllBool(false);
    }
  };

  const [userAccessTitle, setuserAccessTitle] = useState([]);

  const UserAccessTitleFun = (event, value, index) => {
    if (!userAccessTitle.includes(value)) {
      setuserAccessTitle((prevPermissions) => [...prevPermissions, value]);
      setactiveStatusName((prevPermissions) => [...prevPermissions, index]);
      UserPrivilagerList.map((res) => {
        res.suboutbut.map((val) => {
          if (value == val.id) {
            val.subdomain.map((fer) => {
              if (fer.inbut == "list") {
                setuserAccessBody((prevPermissions) => [
                  ...prevPermissions,
                  fer.id,
                ]);
              }
            });
          }
        });
      });
      setactiveStatusNamePrivilege((prevPermissions) => [
        ...prevPermissions,
        { [index]: ["list"] },
      ]);
    } else {
      const uniquePermissions = new Set(userAccessTitle);
      uniquePermissions.delete(value);
      setuserAccessTitle([...uniquePermissions]);
      UserPrivilagerList.map((res) => {
        res.suboutbut.map((val) => {
          if (value == val.id) {
            val.subdomain.map((fer) => {
              setuserAccessBody((prevPermissions) =>
                prevPermissions.filter((permission) => permission !== fer.id)
              );
            });
          }
        });
      });
      const uniquePermissionsname = new Set(activeStatusName);
      uniquePermissionsname.delete(index);
      setactiveStatusName([...uniquePermissionsname]);
      setactiveStatusNamePrivilege((prevPrivileges) => {
        const updatedPrivileges = prevPrivileges.filter(
          (privilege) => Object.keys(privilege)[0] !== index
        );
        return updatedPrivileges;
      });

      setuserAccessAllBool(false);
    }
  };

  const [userAccessBody, setuserAccessBody] = useState([]);

  const UserAccessBodyFun = (event, value, index, index2, value2) => {
    if (!userAccessBody.includes(value)) {
      setuserAccessBody((prevPermissions) => [...prevPermissions, value]);
      setactiveStatusBody((prevPermissions) => [...prevPermissions, index]);

      if (userAccessTitle.includes(value2)) {
        const updatedPrivilege = {
          [index2]: [index],
        };

        setactiveStatusNamePrivilege((prevPrivileges) => {
          const updatedPrivileges = [...prevPrivileges];
          const existingIndex = updatedPrivileges.findIndex(
            (privilege) => Object.keys(privilege)[0] === index2
          );
          if (existingIndex > -1) {
            updatedPrivileges[existingIndex][index2] = [
              ...updatedPrivileges[existingIndex][index2],
              index,
            ];
          } else {
            updatedPrivileges.push(updatedPrivilege);
          }
          return updatedPrivileges;
        });
      }
    } else {
      const uniquePermissions = new Set(userAccessBody);
      uniquePermissions.delete(value);
      setuserAccessBody([...uniquePermissions]);

      const uniquePermissionsname = new Set(activeStatusBody);
      uniquePermissionsname.delete(index);
      setactiveStatusBody([...uniquePermissionsname]);

      UserPrivilagerList.map((res) => {
        res.suboutbut.map((val) => {
          if (value2 == val.id) {
            setuserAccessTitle((prevPermissions) =>
              prevPermissions.filter((permission) => permission !== res.id)
            );
          }
        });
      });

      if (userAccessTitle.includes(value2)) {
        const updatedPrivilege = {
          [index2]: [index],
        };

        setactiveStatusNamePrivilege((prevPrivileges) => {
          const updatedPrivileges = [...prevPrivileges];
          const existingIndex = updatedPrivileges.findIndex(
            (privilege) => Object.keys(privilege)[0] === index2
          );
          if (existingIndex > -1) {
            updatedPrivileges[existingIndex][index2] = updatedPrivileges[
              existingIndex
            ][index2].filter((val) => val !== index);

            if (updatedPrivileges[existingIndex][index2].length === 0) {
              updatedPrivileges.splice(existingIndex, 1);
            }
          } else {
            updatedPrivileges.push(updatedPrivilege);
          }
          return updatedPrivileges;
        });
      }

      setuserAccessAllBool(false);
    }
  };

  const [userAccessAllBool, setuserAccessAllBool] = useState(false);

  const UserAccessAll = (event, value, index) => {
    if (value == true) {
      setUserAccessHead([]);
      setuserAccessTitle([]);
      setactiveStatusName([]);
      setuserAccessBody([]);
      setactiveStatusNamePrivilege([]);
      setuserAccessAllBool(true);
      setUserAccessHead([0, 1]);
      UserPrivilagerList.map((res) => {
        res.suboutbut.map((val) => {
          setuserAccessTitle((prevPermissions) => [...prevPermissions, val.id]);
          setactiveStatusName((prevPermissions) => [
            ...prevPermissions,
            val.final,
          ]);
          val.subdomain.map((fer) => {
            setuserAccessBody((prevPermissions) => [
              ...prevPermissions,
              fer.id,
            ]);
          });
        });
      });
      setactiveStatusNamePrivilege((prevPermissions) => [
        ...prevPermissions,
        {
          employee_details: [
            "employee_info",
            "job_essentials",
            "salary_and_bank_details",
            "credentials",
            "list",
          ],
        },
        {
          download_payslip: ["download", "list"],
        },
        {
          active_status_edit: ["list"],
        },
        {
          target_edit: ["list"],
        },
        { add_cumulative_achievement: ["list"] },
        { cumulative_achievement_history: ["list"] },
      ]);
    } else {
      setuserAccessAllBool(false);
      setUserAccessHead([]);
      setuserAccessTitle([]);
      setactiveStatusName([]);
      setuserAccessBody([]);
      setactiveStatusNamePrivilege([]);
    }
  };

  const handleupdateprivileges = (e) => {
    e.preventDefault();
    const data = {
      user_token: ACCESS_TOKEN,
      privilages: activeStatusNamePrivilege,
      useraccesslist: activeStatusName,
      userprivilege_id: userAccessBody,
      user_id: singleData?.id,
    };
    axiosPost.post("update_privileges", data).then((res) => {
      if (res.data.status === 400) {
        setError({ status: "error", message: res.data.message });
      } else {
        setError({ status: "success", message: res.data.message });
        setTimeout(() => {
          handleCloseclick4();
          setUserAccessHead([]);
          setuserAccessTitle([]);
          setactiveStatusName([]);
          setuserAccessBody([]);
          setactiveStatusNamePrivilege([]);
        }, 200);
      }
    });
  };

  const CustomLabel = ({ label }) => (
    <span className="font_sytles_css_light_user_priveleg">{label}</span>
  );

  const theme = useTheme();
  const [isStatusSelected, setIsStatusSelected] = useState(false);

  const handlefilterBadgeVisible = () => {
    if (isStatusSelected || isDateSelected) {
      return true;
    } else {
      return false;
    }
  };

  const months = [
    { id: 1, label: 'January' },
    { id: 2, label: 'February' },
    { id: 3, label: 'March' },
    { id: 4, label: 'April' },
    { id: 5, label: 'May' },
    { id: 6, label: 'June' },
    { id: 7, label: 'July' },
    { id: 8, label: 'August' },
    { id: 9, label: 'September' },
    { id: 10, label: 'October' },
    { id: 11, label: 'November' },
    { id: 12, label: 'December' }
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = 0; i <= 100; i++) {
      years.push({ label: currentYear - i });
    }

    return years;
  };

  const years = generateYears();

  const [currentDate, setcurrentDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  console.log(currentDate, 'currentDate');

  const [currentMonth, setcurrentMonth] = useState("");
  const [currentMonthID, setcurrentMonthID] = useState(0);


  const [currentYear, setcurrentYear] = useState("");

  // function convert_dateformat(year,month,date) {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }

  const ChangeMonth = (event, value) => {
    if (value != null) {
      setcurrentMonth(value.label);
      setcurrentMonthID(value.id);
      if (currentYear === "") {
        const year = moment(currentDate).year();
        const month = String(value.id).padStart(2, '0');
        const newDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
        const formattedDate = newDate.format('YYYY-MM-DD');
        setcurrentDate(formattedDate);
      } else {
        const year = Number(currentYear);
        const month = String(value.id).padStart(2, '0');
        const newDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
        const formattedDate = newDate.format('YYYY-MM-DD');
        setcurrentDate(formattedDate);
      }
    } else {
      setcurrentMonth("");
      setcurrentMonthID(0);
    }
  }

  const ChangeYear = (event, value) => {
    if (value != null) {
      setcurrentYear(value.label);
      if (currentMonthID === 0) {
        const year = Number(value.label);
        const month = moment(currentDate).month();
        const newDate = moment(`${year}-${month+1}-01`, 'YYYY-MM-DD');
        const formattedDate = newDate.format('YYYY-MM-DD');
        setcurrentDate(formattedDate);
      } else {
        const year = Number(value.label);
        const month = String(currentMonthID).padStart(2, '0');
        const newDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
        const formattedDate = newDate.format('YYYY-MM-DD');
        setcurrentDate(formattedDate);
      }
    } else {
      setcurrentYear("");
    }
  }

  const [incentiveAmount, setincentiveAmount] = useState("");

  const HandleChangeAmount = (event) => {
    if (!isNaN(event) && event >= 0) {
      setincentiveAmount(event);
    }
  }

  const FilterComponent = () => {
    return (
      <Box
        sx={{
          m: 2,
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
            value={employeeStatus}
            label={"Status"}
            onChange={(e, value) => EmployeeStatusValue(e.target.value)}
          >
            {employee_status.map((val) => (
              <MenuItem key={val.id} sx={{ fontSize: "14px" }} value={val.label}>
                {val.label}
              </MenuItem>
            ))}
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
    <div>
      <div className="dispatch_do_flex">
        <CreateButton
          heading={"Sales Man"}
          onAddClick={() => handleCreateEmployee()}
          pagecount={dataCount}
        />
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
      <div
        className="table_css"
        style={
          filtersList == false
            ? { height: "calc(100vh - 100px)", transition: "all 0.3s" }
            : { height: "calc(100vh - 144px)" }
        }
      >
        <div style={{ padding: "10px" }}>
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
            list_menu_2={list_menu_2}
          />
        </div>
      </div>
      <AlertDialog
        onsubmit={handleActiveStatusChange}
        open={open}
        handleClose={handleClose}
        text={"Are you sure want to change the status?"}
      ></AlertDialog>
      <AlertDialog
        onsubmit={handleMulitiStatusChange}
        open={openMulitiStatus}
        handleClose={handleCloseMultiStatus}
        text={`Are you sure you want to add ${selectedItems.length} salesmans for ${actionData}?`}
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

      <Drawer anchor="right" open={incentiveEntry} onClose={HandleIncentive}>
        <Box sx={{ width: 500 }} role="presentation">
          <Box
            display={"flex"}
            alignItems={"center"}
            padding={1}
            justifyContent={"space-between"}
            spacing={0.5}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Item onClick={HandleIncentive}>
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
                  Incentive For {salesmanDetails?.full_name}
                </Box>
              </Item>
            </Stack>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                className="nunito_font_width create_button"
                onClick={() => EmployeeCreateMaster()}
              >
                Save
              </Button>
            </div>
          </Box>
          <Box sx={{ my: 1, padding: "5px" }}>
            <div className="master_create_style">
              <Stack direction={"row"} gap={2}>
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "10px", width: '50%' }}
                  options={months}
                  value={
                    months.find(
                      (year) => year.label === currentMonth
                    ) || null
                  }
                  onChange={(e, value) =>
                    ChangeMonth(e.target.value, value)
                  }
                  getOptionLabel={(val) => val.label}
                  required
                  id="label"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={currentMonth}
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
                      label="Choose Month"
                    />
                  )}
                  clearIcon={null}
                />
                <Autocomplete
                  margin="normal"
                  variant="outlined"
                  style={{ marginTop: "10px", width: '50%' }}
                  options={years}
                  value={
                    years.find(
                      (year) => year.label === currentYear
                    ) || null
                  }
                  onChange={(e, value) =>
                    ChangeYear(e.target.value, value)
                  }
                  getOptionLabel={(val) => String(val.label)}
                  required
                  id="years"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      value={currentYear}
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
                      label="Choose Year"
                    />
                  )}
                  clearIcon={null}
                />
              </Stack>
              <TextField
                id="outlined-basic"
                label="Amount"
                variant="outlined"
                name="amount"
                value={incentiveAmount}
                onChange={(event) => HandleChangeAmount(event.target.value)}
                size="small"
                fullWidth
                placeholder="Amount"
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
            </div>
          </Box>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={incentiveHistory} onClose={HandleOpenHistory}>
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
                  {salesmanDetails?.full_name}
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
                Incentive History
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
                        Incentive Month
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                      Incentive Year
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                      Incentive Amount (₹)
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: "5px" }}>
                      <Typography className="table_cell" variant="h5">
                        Created By
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesmanDetails?.incentive_history?.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.incentive_month}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.incentive_year}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.amount || 0}
                      </TableCell>
                      <TableCell sx={{ padding: "4px 8px" }} align="center">
                        {row.created_by?.first_name} {row.created_by?.last_name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Drawer>

      <Modal
        open={showModel4}
        onClose={handleCloseclick4}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "15px",
            height: "80vh",
            overflow: "auto",
            p: 2,
          }}
        >
          <Box
            onSubmit={handleupdateprivileges}
            component="form"
            noValidate
            sx={{ padding: "10px 10px 10px" }}
          >
            <Stack spacing={3} direction="row">
              <Typography
                component="h3"
                className="font_sytles_css_light display_eeven_center"
                variant="h6"
                sx={{ fontWeight: 600, textAlign: "left", width: "100%" }}
              >
                Update User Privilege
              </Typography>
              <IconButton onClick={handleCloseclick4} className="loginBut1">
                <CloseIcon />
              </IconButton>
            </Stack>
            <FormControlLabel
              className="calenter_flexend"
              control={
                <Checkbox
                  checked={userAccessAllBool}
                  onChange={(e, v) => UserAccessAll(e, v, "select")}
                />
              }
              label={<CustomLabel label="All" />}
            />
            {UserPrivilagerList.map((val, index) => (
              <FormGroup className="hea" key={val.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userAccessHead.includes(val.id)}
                      onChange={(e) => UserAccessHeadFun(e, val.id)}
                    />
                  }
                  label={<CustomLabel label={val.outbut} />}
                />
                {userAccessHead.map((key) => (
                  <div key={key}>
                    {index == key ? (
                      <div className="perivilagepaddingleft">
                        {val.suboutbut.map((res) => (
                          <FormGroup key={res.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={userAccessTitle.includes(res.id)}
                                  onChange={(e) =>
                                    UserAccessTitleFun(e, res.id, res.final)
                                  }
                                />
                              }
                              label={<CustomLabel label={res.val} />}
                            />
                            {userAccessTitle.map((key2) => (
                              <div key={key2}>
                                {res.id == key2 ? (
                                  <div className="userfix_display">
                                    {res.subdomain.map((inr, index) => (
                                      <div
                                        key={inr.id}
                                        className="userfix_display"
                                      >
                                        <Box>
                                          <FormGroup
                                            style={{ display: "block" }}
                                          >
                                            {inr.inbut == "list" ? (
                                              <FormControlLabel
                                                sx={{ opacity: "0.3" }}
                                                control={
                                                  <Checkbox
                                                    checked={userAccessBody.includes(
                                                      inr.id
                                                    )}
                                                  />
                                                }
                                                label={
                                                  <CustomLabel
                                                    label={inr.inputval}
                                                  />
                                                }
                                              />
                                            ) : (
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={userAccessBody.includes(
                                                      inr.id
                                                    )}
                                                    onChange={(e) =>
                                                      UserAccessBodyFun(
                                                        e,
                                                        inr.id,
                                                        inr.inbut,
                                                        res.final,
                                                        res.id
                                                      )
                                                    }
                                                  />
                                                }
                                                label={
                                                  <CustomLabel
                                                    label={inr.inputval}
                                                  />
                                                }
                                              />
                                            )}
                                          </FormGroup>
                                        </Box>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            ))}
                          </FormGroup>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </FormGroup>
            ))}
            <div className="display_flex_end">
              <Button
                type="submit"
                className="nunito_font_width userprivillagebutton"
                sx={{ fontSize: "12px", fontWeight: "300" }}
                variant="contained"
              >
                Create
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EmployeeList;
