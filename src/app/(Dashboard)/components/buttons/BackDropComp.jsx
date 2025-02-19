import React from 'react';
import {
  Backdrop,
  CircularProgress
} from '@mui/material';
import { useAuthContext } from "@/app/DataProvider";

const BackdropComponent = () => {
    const { backdropOpen } =
        useAuthContext();
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={backdropOpen}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropComponent;
