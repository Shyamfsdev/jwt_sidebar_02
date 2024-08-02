import React from 'react'
import {
    Button,
  } from '@mui/material';
function NormalButton({title,color,handleButtonclick}) {
  return (
    <div><Button variant="contained" onClick={handleButtonclick} color={color} sx={{marginBottom:'5px'}}>
    {title}
  </Button></div>
  )
}

export default NormalButton