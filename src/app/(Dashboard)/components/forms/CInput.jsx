import React from 'react';
import TextField from '@mui/material/TextField';

const CInput = ({ label, name, value, onChange, error = '',type }) => {
  return (
    <TextField
      size="small"
      fullWidth
      error={error}
      type={type || 'text'}
      helperText={error}
      placeholder={label}
      value={value}
      onChange={onChange}
      label={label}
      name={name}
      sx={{ pb: 1 }}
      inputProps={{
        style: {
          fontSize: "14px",
        },
      }}
      InputLabelProps={{
        style: {
          fontSize: "14px",
        },
      }}
    />
  );
};

export default CInput;
