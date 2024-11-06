
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditKbcwDialog = ({
  editKbcwProduct,
  setEditKbcwProduct,
  open,
  onClose,
  onSubmit = () => {},
}) => {
  const handleKbcwProductChange = (field, value) => {
    const newProduct = { ...editKbcwProduct };
    newProduct[field] = value;
    setEditKbcwProduct(newProduct);
  };

  const handleDateChange = (date, key) => {
    const newProduct = { ...editKbcwProduct };
    newProduct[key] = date;
    setEditKbcwProduct(newProduct);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Kbcw Product</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: "20px" }}>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>KBCW Inventory Type</InputLabel>
                <Select
                  value={editKbcwProduct.kbcwInventoryType}
                  onChange={(e) =>
                    handleKbcwProductChange(
                      index,
                      "kbcwInventoryType",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Cleaners">Cleaners</MenuItem>
                  <MenuItem value="Solutions">Solutions</MenuItem>
                  <MenuItem value="Frames">Frames</MenuItem>
                  <MenuItem value="contact Lense">Contact Lenses</MenuItem>
                  <MenuItem value="Covers">Covers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="KBCW Barcode"
                value={editKbcwProduct.kbcwBarcode}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwBarcode", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={editKbcwProduct.kbcwName}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={editKbcwProduct.kbcwSize}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwSize", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={editKbcwProduct.kbcwQuantity}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwQuantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={editKbcwProduct.kbcwPrice}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={editKbcwProduct.kbcwDeliveredDate}
                onChange={(date) =>
                  handleDateChange(date, "kbcwDeliveredDate", index)
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

export default EditKbcwDialog;


 