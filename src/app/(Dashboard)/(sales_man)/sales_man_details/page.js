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
  Table,
  TableRow,
  TableCell,
  DialogTitle,
  TableBody,
} from "@mui/material";
import EmployeeEdit from "./EmployeeEdit";
import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { axiosGet,axiosPost } from "../../../../lib/api";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Tabs from "../../components/container/CustomeTab";
import Drawer from "@mui/material/Drawer";
import Loading from "../../loading";
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from "../../../(Dashboard)/components/container/AlertDialog";

const Tables = () => {
  const ACCESS_TOKEN = Cookies.get("token");

  const router = useRouter();

  const EMPLOYEEID = Cookies.get("data_uniq_id");

  const [singleEmployeeData, setSingleEmployeeData] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const getSingleEmployeeData = () => {
    setIsloading(true);
    axiosGet
      .get(
        `salesman_master_list?access_token=${ACCESS_TOKEN}&employee_id=${EMPLOYEEID}`
      )
      .then((response) => {
        setIsloading(false);
        setSingleEmployeeData(response.data.data[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getSingleEmployeeData();
    fetchDataUser();
  }, []);

  const [tabValue, setTabValue] = useState(1);
  const [compName, setCompName] = useState([]);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [employeeImage, setEmployeeImage] = useState(
    singleEmployeeData?.salesman_image || "/images/users/7.jpg"
  );

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const toggleDrawerEdit = (value, open) => () => {
    setCompName(value);
    setOpenDrawer(open);
  };

  const basicData = {
    id: "basic",
    api: "basic_details_edit",
    data: [
      {
        name: singleEmployeeData?.full_name,
        aadhaar_number: singleEmployeeData?.aadhaar_number,
        pf_number: singleEmployeeData?.pf_number,
        gender: singleEmployeeData?.gender?.toUpperCase(),
        genderData: singleEmployeeData?.gender,
        dob: singleEmployeeData?.date_of_birth,
        age: singleEmployeeData?.age,
        salesman_image:singleEmployeeData?.salesman_image,
      },
    ],
  };

  const contactData = {
    id: "contact",
    api: "contact_details_edit",
    data: [
      {
        mobile: singleEmployeeData?.mobile_number,
        whatsApp: singleEmployeeData?.whatsapp_number,
        mail: singleEmployeeData?.email_address,
        isSame:
          singleEmployeeData?.mobile_number ===
          singleEmployeeData?.whatsapp_number
            ? true
            : false,
      },
    ],
  };

  function areAddressesSame(address1, address2) {
    return (
      address1?.flatStreet === address2?.flatStreet &&
      address1?.state === address2?.state &&
      address1?.district === address2?.district &&
      address1?.pincode === address2?.pincode
    );
  }

  const addressData = {
    id: "address",
    api: "address_details_edit",
    data: {
      permanentAddress: singleEmployeeData?.permanent_address,
    },
  };
 

  const jobDetails = {
    id: "job",
    api: "job_details_edit",
    data: {
      doj: singleEmployeeData?.job_essentials?.doj,
      employmentType: singleEmployeeData?.job_essentials?.employmentType,
      employee_type: singleEmployeeData?.job_essentials?.employee_type,
      Department: singleEmployeeData?.job_essentials?.Department,
      Designation: singleEmployeeData?.job_essentials?.Designation,
      department: singleEmployeeData?.job_essentials?.department_type?.department_name,
      designation: singleEmployeeData?.job_essentials?.designation_type?.desig_name,
      mail: singleEmployeeData?.job_essentials?.mail,
      phone: singleEmployeeData?.job_essentials?.phone,
    },
  };

  const bankDetails = {
    id: "bank",
    api: "bank_details_edit",
    data: {
      accountNo: singleEmployeeData?.bank_details?.accountNo,
      holder: singleEmployeeData?.bank_details?.holder,
      ifsc: singleEmployeeData?.bank_details?.ifsc,
      bankName: singleEmployeeData?.bank_details?.bankName,
      branch: singleEmployeeData?.bank_details?.branch,
    },
  };
 
  const salaryDetails = {
    id: "salary",
    api: "salary_details_edit",
    data: [
      {
      itcSalary: singleEmployeeData?.itc_salary,
      kmManagementSalary: singleEmployeeData?.kilometer_management_salary,
      managementSalary: singleEmployeeData?.management_salary,
      kilometerItcSalary: singleEmployeeData?.kilometer_itc_salary,
      peta: singleEmployeeData?.peta
      },
  ],
  };
  console.log(singleEmployeeData?.peta,"tftgft")

  const userDetails = {
    id: "user",
    api: "user_details_edit",
    data: {
      username: singleEmployeeData?.user_data?.user_name,
      password: singleEmployeeData?.user_data?.show_password,
      confirm_password: singleEmployeeData?.user_data?.show_password,
    },
  };

  const routeDetails = {
    id: "route",
    api: "route_details_edit",
    data: singleEmployeeData.route?.map(route => ({
      routeName: route.routeName,
      day: route.day,
    })),
  };


  const TabContext = ({ value }) => {
    if (value === 1) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            {basicData?.data?.map((item) => (
              <Paper key={item} sx={{ position: "relative" }}>
                <Box sx={{ p: 2 }}>
                  <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                    {" "}
                    Basic details
                  </Typography>
                  <Table size="small">
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Name
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.name}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          PF NO
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.pf_number}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          AADHAR NO
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.aadhaar_number}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Gender
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.gender}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          DOB
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.dob}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Age
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.age}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </Table>
                </Box>

                <Button
                  size="small"
                  sx={{
                    width: 25,
                    height: 25,
                    minWidth: 25,
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(basicData, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
              </Paper>
            ))}

            {contactData?.data?.map((item) => (
              <Paper key={item} sx={{ position: "relative" }}>
                <Box sx={{ p: 2 }}>
                  <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                    {" "}
                    Contact details
                  </Typography>

                  <Table size="small">
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Mobile Number
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                          {item.mobile}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          WhatsApp Number
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                          {item.whatsApp}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Email ID
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                          {item.mail}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </Table>
                </Box>

                <Button
                  size="small"
                  sx={{
                    width: 25,
                    height: 25,
                    minWidth: 25,
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(contactData, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
              </Paper>
            ))}

            <Paper sx={{ position: "relative" }}>
              <Box>
                <Box sx={{ p: 2 }}>
                  <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                    {" "}
                    Permanent Address
                  </Typography>
                  <Typography className="table_cell_2" whiteSpace={"pre-wrap"}>
                    {addressData?.data?.permanentAddress?.flatStreet},{" "}
                    {addressData?.data?.permanentAddress?.state},{" "}
                    {addressData?.data?.permanentAddress?.district},{" "}
                    {addressData?.data?.permanentAddress?.pincode}
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                sx={{
                  width: 25,
                  height: 25,
                  minWidth: 25,
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
                variant="outlined"
                onClick={toggleDrawerEdit(addressData, true)}
              >
                <EditOutlinedIcon sx={{ width: "1rem" }} />
              </Button>
            </Paper>
          </Box>
        </Box>
      );
    } else if (value === 2) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                  {" "}
                  Job Essentials
                </Typography>
                <Button
                  size="small"
                  sx={{ width: 25, height: 25, minWidth: 25, mx: 1 }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(jobDetails, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
                <Table size="small">
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Employment Type
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.employee_type}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        DOJ
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.doj}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Department
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.department}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Designation
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.designation}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Work Mail
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.mail}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Work Mobile
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {jobDetails?.data?.phone}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Paper>
          </Box>
        </Box>
      );
    } else if (value === 3) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                  {" "}
                  Bank Details
                </Typography>
                <Button
                  size="small"
                  sx={{ width: 25, height: 25, minWidth: 25, mx: 1 }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(bankDetails, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
                <Table size="small">
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Account Number
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                    <Typography fontSize={"12px"} className="table_cell_2">
                        {bankDetails?.data?.accountNo}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Holder Name
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {bankDetails?.data?.holder}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        IFSC Code
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {bankDetails?.data?.ifsc}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Bank Name
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {bankDetails?.data?.bankName}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Brandch Name
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {bankDetails?.data?.branch}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Paper>
          </Box>
        </Box>
      );
    }else if (value === 4) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            {salaryDetails?.data?.map((item) => (
              <Paper key={item} sx={{ position: "relative" }}>
                <Box sx={{ p: 2 }}>
                  <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                    {" "}
                    Salary Details
                  </Typography>
                  <Table size="small">
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          ITC Salary
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.itcSalary}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                         KM ITC Cost
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.kilometerItcSalary}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Management Salary
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.managementSalary}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          KM Management Cost
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.kmManagementSalary}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ borderBottom: 0 }}>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography
                          fontSize={"12px"}
                          className="table_cell_2"
                          style={{ fontWeight: 500 }}
                        >
                          Peta
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                        :
                      </TableCell>
                      <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                        <Typography fontSize={"12px"} className="table_cell_2">
                          {item.peta}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </Table>
                </Box>

                <Button
                  size="small"
                  sx={{
                    width: 25,
                    height: 25,
                    minWidth: 25,
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(salaryDetails, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
              </Paper>
            ))}

          </Box>
        </Box>
      );
    } else if (value === 5) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
         
            <Paper  sx={{ position: "relative" }}>
              <Box sx={{ p: 2 }}>
                <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                  Route Details
                </Typography>
                <Button
                  size="small"
                  sx={{ width: 25, height: 25, minWidth: 25, mx: 1 }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(routeDetails, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
                
                <Table size="small">
               
                  <TableRow sx={{ borderBottom: 0 }} gap={2}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0, textAlign: 'center' }}>
                      <Typography
                        fontSize={"12px"}
                        className="table_cell_2"
                        style={{ fontWeight: 500}}
                      >
                        Day
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0, textAlign: 'center' }}>
                      <Typography
                        fontSize={"12px"}
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Route
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {routeDetails?.data?.map((item, index) => (
                  <TableRow key={index} sx={{ borderBottom: 0,marginBottom: 2  }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2" sx={{ margin: '0 8px' }}>
                        {item.day}  
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2" sx={{ margin: '0 8px' }}>
                        {item.routeName}
                      </Typography>
                    </TableCell>
                  </TableRow>
                   ))}
                
                </Table>
               
              </Box>
            </Paper>
          
          </Box>
        </Box>
      );
    }else if (value === 6) {
      return (
        <Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography color={"primary"} variant="p" fontWeight={"bold"}>
                  {" "}
                  Credentials
                </Typography>
                <Button
                  size="small"
                  sx={{ width: 25, height: 25, minWidth: 25, mx: 1 }}
                  variant="outlined"
                  onClick={toggleDrawerEdit(userDetails, true)}
                >
                  <EditOutlinedIcon sx={{ width: "1rem" }} />
                </Button>
                <Table size="small">
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Username
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {userDetails?.data?.username}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography
                        className="table_cell_2"
                        style={{ fontWeight: 500 }}
                      >
                        Password
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0, px: 2, borderBottom: 0 }}>
                      :
                    </TableCell>
                    <TableCell sx={{ px: 0, py: 0.2, borderBottom: 0 }}>
                      <Typography fontSize={"12px"} className="table_cell_2">
                        {userDetails?.data?.password}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Paper>
          </Box>
        </Box>
      );
    }
  };

  const handleClickTab = (value) => {
    setTabValue(value);
  };

  const [userType, setUserType] = useState("");

  const [UserAccess, setUserAccess] = useState([]);

  const list_menu = [];

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
      const departments = UserAccess.filter(
        (item) => "employee_details" in item
      )
        .map((item) => item.employee_details)
        .filter(Boolean);

      departments.map((val) => {
        val.map((res) => {
          list_menu.push(res);
        });
      });

  }

  if (userType != "salesman_user") {
    list_menu.push(
      "employee_info",
      "job_essentials",
      "salary_and_bank_details",
      "credentials",
      "list"
    );
  }

  const tabs = [];

  if (list_menu.includes("employee_info")) {
    tabs.push({
      value: 1,
      name: "Salesman Info",
      content: <TabContext value={1} />,
    });
  }

  if (list_menu.includes("job_essentials")) {
    tabs.push({ value: 2, name: "Job Essentials", content: <TabContext value={2} /> });
  }

  if (list_menu.includes("salary_and_bank_details")) {
    tabs.push({
      value: 3,
      name: "Bank Details",
      content: <TabContext value={3} />,
    });
  }

  if (list_menu.includes("salary_and_bank_details")) {
    tabs.push({
      value: 4,
      name: "Salary Details",
      content: <TabContext value={4} />,
    });
  }

  if (list_menu.includes("credentials")) {
    tabs.push({
      value: 5,
      name: "Route Details",
      content: <TabContext value={5} />,
    });
  } 

  if (list_menu.includes("credentials")) {
    tabs.push({
      value: 6,
      name: "Credentials",
      content: <TabContext value={6} />,
    });
  }

  const EmployeeDetailsRoute = () => {
    router.push("/sales_man_list");
    Cookies.remove("data_uniq_id");
  };

  const[deleteConfirm,setdeleteConfirm] = useState(false)

  const HandleChangeDelete = () =>{
    setdeleteConfirm(!deleteConfirm);
  }

  const handleMulitiDelete = () => {
    const jsonData = {
      access_token: ACCESS_TOKEN,
      data_uniq_id: singleEmployeeData?.data_uniq_id,
    };
    axiosPost
      .post(`salesman_details_image_delete`, jsonData)
      .then((response) => {
        setdeleteConfirm(false);
        getSingleEmployeeData();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div
        className="display_flex global_padding"
        style={{
          backgroundColor: "#eef5f9",
          position: "sticky",
          zIndex: 2,
          paddingBottom: "7px",
          paddingTop: "7px",
        }}
      >
        <IconButton
          style={{ padding: "1px 5px", marginTop: "-3px" }}
          onClick={() => EmployeeDetailsRoute()}
        >
          <KeyboardBackspaceIcon style={{ color: "black" }} />
        </IconButton>
        <Typography
          variant="h4"
          className="nunito_font"
          style={{ fontSize: "14px", fontWeight: 700, color: "#185AA6" }}
        >
          Salesman Details{" "}
          <span>
            #{singleEmployeeData?.full_name} -{" "}
            {singleEmployeeData?.salesman_code}
          </span>
        </Typography>
      </div>
      <Box sx={{ m: 1, p: 1, overflow: "auto", height: "87vh" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ position: "relative", width: 100, height: 100 }}>
            <Avatar
              src={singleEmployeeData?.salesman_image || "/images/users/7.jpg"}
              sx={{ width: 100, height: 100 }}
            ></Avatar>
            <IconButton
                  className="image_upload_button"
                  component="span"
                  onClick={() => HandleChangeDelete()}
                >
                  <DeleteIcon style={{ color: "black" }} />
                </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Table>
              <TableBody>
                <TableRow sx={{ padding: 0, borderBottom: 0 }}>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                    <Typography className="table_cell_2">Department</Typography>
                  </TableCell>
                  <TableCell
                    sx={{ py: 0, px: 2, borderBottom: 0 }}
                    className="table_cell_2"
                  >
                    :
                  </TableCell>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                  <Typography fontSize={"12px"} className="table_cell_2">
                      {singleEmployeeData?.job_essentials?.department_type?.department_name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ padding: 0, borderBottom: 0 }}>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                    <Typography className="table_cell_2">
                      Desingantion
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ py: 0, px: 2, borderBottom: 0 }}
                    className="table_cell_2"
                  >
                    :
                  </TableCell>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                  <Typography fontSize={"12px"} className="table_cell_2">
                      {" "}
                      {singleEmployeeData?.job_essentials?.designation_type?.desig_name}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ padding: 0, borderBottom: 0 }}>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                    <Typography className="table_cell_2">
                      Contact Number
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ py: 0, px: 2, borderBottom: 0 }}
                    className="table_cell_2"
                  >
                    :
                  </TableCell>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                  <Typography fontSize={"12px"} className="table_cell_2">
                      {singleEmployeeData?.mobile_number}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ padding: 0, borderBottom: 0 }}>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                    <Typography className="table_cell_2">Email ID</Typography>
                  </TableCell>
                  <TableCell
                    sx={{ py: 0, px: 2, borderBottom: 0 }}
                    className="table_cell_2"
                  >
                    :
                  </TableCell>
                  <TableCell sx={{ padding: 0, borderBottom: 0 }}>
                  <Typography fontSize={"12px"} className="table_cell_2">
                      {singleEmployeeData?.email_address}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>

        {isloading ? <Loading /> : <Tabs tabs={tabs} />}
      </Box>

      {/* Drawer  start */}
      <Drawer anchor={"right"} open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ minWidth: "400px", p: 1, maxWidth: "700px" }}>
          <Box>
            <EmployeeEdit
              compName={compName}
              toggle={setOpenDrawer}
              employee_id={EMPLOYEEID}
              getSingleEmployeeData={getSingleEmployeeData}
            />
          </Box>
        </Box>
      </Drawer>
      <AlertDialog
        onsubmit={handleMulitiDelete}
        open={deleteConfirm}
        handleClose={HandleChangeDelete}
        text={`Are you sure want to delete image ?`}
      ></AlertDialog>
    </div>
  );
};

export default Tables;
