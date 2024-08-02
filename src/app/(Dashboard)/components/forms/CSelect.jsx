import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import {Each} from "@/lib/functions/Each";

const CSelect = ({ label, name, value, onChange, options, error = '', none = true  }) => {
  return (
    <FormControl fullWidth size="small" error={error ? true : false}>
        <InputLabel sx={{ fontSize: "14px" }} id="demo-simple-select-label">{label}</InputLabel>
        <Select
        placeholder={label}
        value={value || ''}
        onChange={onChange}
        label={label}
        sx={{ fontSize: "12px" }}
        name={name}
        >
            {none ? <MenuItem value='' sx={{fontSize: "14px"}}> --None-- </MenuItem> : ''}
            <Each of={options} render={(item) => 
                <MenuItem value={item.value} sx={{fontSize: "14px"}}> {item.label} </MenuItem>
            } />
        </Select>
        {error ? <FormHelperText>{error}</FormHelperText> : ''}
    </FormControl>
  );
};

export default CSelect;
