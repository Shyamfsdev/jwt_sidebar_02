import * as React from "react";
import { 
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    Dialog,
    Button,
 } from "@mui/material";

export default function AlertDialog({ open, handleClose, text, onsubmit }) {
  const handleCloseBut = () => {
    onsubmit();
    handleClose();
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">{text}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> {text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box sx={{display:"flex",gap:1}}>
            <Button
              variant="outlined"
              onClick={handleClose}
              size="small"
              // color={"cancel"}
              sx={{ marginBottom: "5px" }}
            >
              No
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleCloseBut}
              color={"primary"}
              size="small"
              sx={{ marginBottom: "5px" }}
            >
              Yes
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
