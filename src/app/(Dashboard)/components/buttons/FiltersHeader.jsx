import React, {useState} from "react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material/InputLabel";

export default function CreateButton({
  heading,
}) {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <FormControl fullWidth size="small" sx={{ minWidth: "150px" }}>
      <InputLabel sx={{ fontSize: "14px" }} id="demo-simple-select-label">
        {heading}
      </InputLabel>
      <Select
        sx={{ fontSize: "14px" }}
        placeholder={heading}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        label={heading}
        onChange={handleChange}
        // onChange={(event, value) =>
        //   EmployeeStatusValue(event.target.value, value)
        // }
      >
        <MenuItem value={"male"}>Male</MenuItem>
        <MenuItem value={"female"}>Female</MenuItem>
        <MenuItem value={"other"}>Other</MenuItem>
      </Select>
    </FormControl>
  );
}
