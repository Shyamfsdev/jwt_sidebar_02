import React from 'react';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    FormHelperText,
} from '@mui/material';

const CCheckbox = ({ label, name, value, onChange, error = '' }) => {
  return (
    <FormControl
        required
        error={error ? true : false}
        component="fieldset"
        variant="standard"
        name={name}
      >
        <FormGroup>
            <FormControlLabel
                sx={{ margin: 0 }}
                control={
                <Checkbox
                    size="small"
                    checked={value}
                    sx={{paddingLeft:0}}
                    onChange={onChange}
                />
                }
                
                label={
                <Typography variant="p" fontSize={"12px"}>
                    {label}
                </Typography>
                }
            />
        </FormGroup>
        { error ? <FormHelperText>{error}</FormHelperText> : '' }
    </FormControl>
  );
};

export default CCheckbox;
