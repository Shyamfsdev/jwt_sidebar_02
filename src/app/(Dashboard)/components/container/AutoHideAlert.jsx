import React, { useState, useEffect } from "react";
import { Alert, Snackbar, Slide } from "@mui/material";

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const AutoHideAlert = ({
  severity,
  message,isAlertVisible,
  open,
  onClose,
  autoHideDuration,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setIsOpen(false);
  //       if (onClose) {
  //         onClose();
  //       }
  //     }, autoHideDuration);

  //     return () => {
  //       clearTimeout(timer);
  //     };
  //   }, [autoHideDuration, onClose]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [isAlertVisible]);
  const dialogStyle = {
    position: "absolute",
    top: 10, 
    right: 10,
    // left: '60%', 
    // transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
  };
  return (
    <div style={dialogStyle}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        isAlertVisible={open}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
      >
        <Alert severity={severity} onClose={onClose}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AutoHideAlert;
