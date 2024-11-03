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

const EditVendorDialog = ({
  editVendorProduct,
  setEditVendorProduct,
  open,
  onClose,
  onSubmit = () => {},
}) => {
  const handleVendorProductChange = (field, value) => {
    const newProduct = { ...editVendorProduct };
    newProduct[field] = value;
    setEditVendorProduct(newProduct);
  };

  const handleDateChange = (date, key) => {
    const newProduct = { ...editVendorProduct };
    newProduct[key] = date;
    setEditVendorProduct(newProduct);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Vendor Product</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: "20px" }}>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <TextField
                label="Order Number"
                value={editVendorProduct.orderNumber}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "orderNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Vendor Name"
                value={editVendorProduct.vendorName}
                onChange={(e) =>
                  handleVendorProductChange(index, "vendorName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={editVendorProduct.quantity}
                onChange={(e) =>
                  handleVendorProductChange(index, "quantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Borrowed Branch"
                value={editVendorProduct.borrowedBranch}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "borrowedBranch",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Item Number"
                value={editVendorProduct.vendorGlassNumber}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorGlassNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Item Type"
                value={editVendorProduct.vendorItemType}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorItemType",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={editVendorProduct.vendorPrice}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorPrice",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={editVendorProduct.vendorDeliveredDate}
                onChange={(date) =>
                  handleDateChange(date, "vendorDeliveredDate", index)
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
                        borderColor: "#black",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#black",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#black",
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

export default EditVendorDialog;
