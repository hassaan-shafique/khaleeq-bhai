import React from "react";
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
    setEditVendorProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date, key) => {
    setEditVendorProduct((prev) => ({ ...prev, [key]: date }));
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
                value={editVendorProduct.orderNumber || ""}
                onChange={(e) =>
                  handleVendorProductChange("orderNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Vendor Name"
                value={editVendorProduct.vendorName || ""}
                onChange={(e) =>
                  handleVendorProductChange("vendorName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={editVendorProduct.quantity || ""}
                onChange={(e) =>
                  handleVendorProductChange("quantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Borrowed Branch"
                value={editVendorProduct.borrowedBranch || ""}
                onChange={(e) =>
                  handleVendorProductChange("borrowedBranch", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Item Number"
                value={editVendorProduct.vendorGlassNumber || ""}
                onChange={(e) =>
                  handleVendorProductChange("vendorGlassNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Item Type"
                value={editVendorProduct.vendorItemType || ""}
                onChange={(e) =>
                  handleVendorProductChange("vendorItemType", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={editVendorProduct.vendorPrice || ""}
                onChange={(e) =>
                  handleVendorProductChange("vendorPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={
                  editVendorProduct.vendorDeliveredDate &&
                  !isNaN(Date.parse(editVendorProduct.vendorDeliveredDate))
                    ? new Date(editVendorProduct.vendorDeliveredDate)
                    : null
                }
                onChange={(date) =>
                  handleDateChange(date, "vendorDeliveredDate")
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
