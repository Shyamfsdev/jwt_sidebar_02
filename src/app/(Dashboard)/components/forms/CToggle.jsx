import React from 'react'
import {
    ToggleButton,
    ToggleButtonGroup,
  } from "@mui/material";
import {Each} from "@/lib/functions/Each";

export default function CToggle({name, value, options, onChange}) {
  return (
    <ToggleButtonGroup
    orientation="horizontal"
    value={value}
    name={name}
    size={"small"}
    exclusive
    onChange={onChange}
    sx={{ marginBottom: 2 }}
    >
        <Each of={options} render={(item) => 
            <ToggleButton
                    size="small"
                    value={item.value}
                    sx={
                        item.value === value
                        ? {
                            border: "1px solid #185aa6 !important",
                            color: "#185aa6 !important",
                        }
                        : {}
                    }
                    aria-label={item.value}
                >
                {item.label}
            </ToggleButton>
        } />
    </ToggleButtonGroup>
  )
}
