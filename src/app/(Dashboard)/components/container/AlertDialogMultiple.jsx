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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {text?.map((res,index) => (
                    <DialogContent key={index} style={{borderBottom:'1px solid #dddcdc'}}>
                        <DialogContentText id="alert-dialog-description"> {res.message}</DialogContentText>
                    </DialogContent>
                ))}

                <DialogActions>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            size="small"
                            // color={"cancel"}
                            sx={{ marginBottom: "5px" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleCloseBut}
                            color={"primary"}
                            size="small"
                            sx={{ marginBottom: "5px" }}
                        >
                            Confirm
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </div>
    );
}
