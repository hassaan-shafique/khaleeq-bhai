import React, { useState } from "react";
import {
  TextField,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditGlassDialog = ({
  editGlassProduct,
  setEditGlassProduct,
  open,
  onClose,
  onSubmit=()=>{},
}) => {
  const handleGlassesProductChange = (field, value) => {
    const newProduct = { ...editGlassProduct };
    newProduct[field] = value;
    setEditGlassProduct(newProduct);
  };

  const handleDateChange = (date, key) => {
    const newProduct = { ...editGlassProduct };
    newProduct[key] = date;
    setEditGlassProduct(newProduct);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Glass Product</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: "20px" }}>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <TextField
                label="Glasses Barcode"
                value={editGlassProduct.glassesBarcode}
                onChange={(e) =>
                  handleGlassesProductChange("glassesBarcode", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Glasses Type"
                value={editGlassProduct.glassesType}
                onChange={(e) =>
                  handleGlassesProductChange("glassesType", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={editGlassProduct.glassesName}
                onChange={(e) =>
                  handleGlassesProductChange("glassesName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={editGlassProduct.glassesSize}
                onChange={(e) =>
                  handleGlassesProductChange("glassesSize", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Number"
                value={editGlassProduct.glassesNumber}
                onChange={(e) =>
                  handleGlassesProductChange("glassesNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={editGlassProduct.enteredQuantity}
                onChange={(e) =>
                  handleGlassesProductChange("enteredQuantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={editGlassProduct.glassesPrice}
                onChange={(e) =>
                  handleGlassesProductChange("glassesPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={
                  editGlassProduct.glassesDeliveredDate &&
                  !isNaN(
                    new Date(editGlassProduct.glassesDeliveredDate).getTime()
                  )
                    ? new Date(editGlassProduct.glassesDeliveredDate)
                    : null
                }
                onChange={(date) =>
                  handleDateChange(date, "glassesDeliveredDate")
                }
                customInput={
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Delivery Date"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                    }}
                  />
                }
                placeholderText="Select Delivered Date"
                className="datepicker"
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGlassDialog
