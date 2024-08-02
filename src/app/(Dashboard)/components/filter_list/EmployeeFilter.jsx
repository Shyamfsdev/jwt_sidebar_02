import React from "react";
import { Typography, Button, IconButton,Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DateFilter from "../buttons/DateFilter";
import {
  ArrowBack,
  DeleteForeverOutlined,
  EditOutlined,
  MoreVertOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

export default function EmployeeFilter({
  heading,
  employee_status,
  EmployeeStatusValue,
  employeeStatus,
  department_status,
  DepartmentValue,
  departmentName,
  isSelected,
  onCreatedDateChange,
  dateTitle,
  handleRefresh,employeeMaster,managerStatus,ManagerStatusValue
}) {
  return (
    <div className="display_flex_end global_padding_15" style={{display:'flex',width:'100%'}}>
        <div className="display_flex_end">
        <Box fullWidth>
        <DateFilter
          title={dateTitle}
          buttonType={1}
          onDateRangeChange={onCreatedDateChange}
          isSelected={isSelected}
        ></DateFilter>
        </Box>
            </div>
         <Autocomplete
          margin="normal"
          variant="outlined"
          options={department_status}
          style={{ width: "15%",marginLeft:'10px'}}
          value={
            department_status.find((option) => option.department_name === departmentName) ||
            null
          }
          onChange={(event, value) =>
            DepartmentValue(event.target.value, value)
          }
          getOptionLabel={(val) => val.department_name}
          required
          id="department"
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              value={departmentName === undefined ? "" : departmentName}
              style={{ margin: "2px"}} // Align label to center
              InputLabelProps={{
                className: "textfieldstylefont",
              }}
              InputProps={{
                ...params.InputProps,
                autoComplete: "off",
                className: "fontInput",
              }}
              placeholder="Department"
            />
          )}
          clearIcon={null}
        />
        <Autocomplete
          margin="normal"
          variant="outlined"
          options={employee_status}
          style={{ width: "15%",marginLeft:'10px'}}
          value={
            employee_status.find((option) => option.label === employeeStatus) ||
            null
          }
          onChange={(event, value) =>
            EmployeeStatusValue(event.target.value, value)
          }
          getOptionLabel={(val) => val.label}
          required
          id="employee_status"
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              value={employeeStatus === undefined ? "" : employeeStatus}
              style={{ margin: "2px"}} // Align label to center
              InputLabelProps={{
                className: "textfieldstylefont",
              }}
              InputProps={{
                ...params.InputProps,
                autoComplete: "off",
                className: "fontInput",
              }}
              placeholder={heading + ' Status'}
            />
          )}
          clearIcon={null}
        />
        <Autocomplete
          margin="normal"
          variant="outlined"
          options={employeeMaster}
          style={{ width: "15%",marginLeft:'10px'}}
          value={
            employeeMaster.find((option) => option.full_name === managerStatus) ||
            null
          }
          onChange={(event, value) =>
            ManagerStatusValue(event.target.value, value)
          }
          getOptionLabel={(val) => val.full_name}
          required
          id="manager_status"
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              value={managerStatus === undefined ? "" : managerStatus}
              style={{ margin: "2px"}} // Align label to center
              InputLabelProps={{
                className: "textfieldstylefont",
              }}
              InputProps={{
                ...params.InputProps,
                autoComplete: "off",
                className: "fontInput",
              }}
              placeholder="Manager"
            />
          )}
          clearIcon={null}
        />
         <IconButton onClick={handleRefresh} size="small" style={{marginTop:'-1px',marginLeft:'10px',background: "#185aa6",color: "white",borderRadius: "5px"}} className='flex_display'>
          <RefreshOutlined />
        </IconButton>
    </div>
  );
}
