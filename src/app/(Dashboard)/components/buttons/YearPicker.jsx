import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
function ButtonField(props) {
  const {
    setOpen,
    label,
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
      {/* {label ? `Current date: ${label}` : 'Pick a date'} */}
    </IconButton>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
    openTo={'year'}
      view={['year']}
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

export default function PickerWithButtonFieldYear({
  onChange,
  index,
  field,
  type
}) {
  const [value, setValue] = React.useState(null);
  const handleDateChange = (value) => {
    let date;
    if (custome){
        date = value.format(format)
    }else{
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
            <ButtonDatePicker
              value={value}
              onChange={(newValue) => handleDateIndexChange(newValue)}
            />
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
