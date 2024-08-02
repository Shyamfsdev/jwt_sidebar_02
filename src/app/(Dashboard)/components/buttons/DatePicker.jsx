import React, {useState} from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
function ButtonField(props) {
  const {
    setOpen,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <IconButton
      variant="outlined"
      id={id}
      size="small"
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
    >
      <CalendarMonthIcon />
    </IconButton>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

function ButtonCustomePicker(props) {
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
    
      openTo={props.type}
      view={[props.type]}
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

export default function PickerWithButtonField({
  onChange,
  index,
  field,
  type,
  custome,
  customeType,
  format
}) {
  const [value, setValue] = useState(null);
  const handleDateChange = (value) => {
    let date;
    if (custome) {
        date = value.format(format)
    } else {
        date = value.format("MM/DD/YYYY");
    }
    onChange(date);
    setValue(value);
  };

  const handleDateIndexChange = (value) => {
    const date = value.format("MM/DD/YYYY");
    onChange(index, field, date);
  };
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {type === 1 ? (
          custome ? (
            <ButtonCustomePicker
              type={customeType}
              value={value}
              onChange={(newValue) => handleDateIndexChange(newValue)}
            />
          ) : (
            <ButtonDatePicker
              value={value}
              onChange={(newValue) => handleDateIndexChange(newValue)}
            />
          )
        ) : (
          <ButtonDatePicker
            value={value}
            onChange={(newValue) => handleDateChange(newValue)}
          />
        )}
      </LocalizationProvider>
    </Box>
  );
}
