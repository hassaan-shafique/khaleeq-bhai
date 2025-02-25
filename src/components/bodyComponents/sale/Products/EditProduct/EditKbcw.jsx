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
    setEditKbcwProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date, key) => {
    setEditKbcwProduct((prev) => ({
      ...prev,
      [key]: date,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit KBCW Product</DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: "20px" }}>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>KBCW Inventory Type</InputLabel>
                <Select
                  value={editKbcwProduct.kbcwInventoryType || ""}
                  onChange={(e) =>
                    handleKbcwProductChange("kbcwInventoryType", e.target.value)
                  }
                >
                  <MenuItem value="Cleaners">Cleaners</MenuItem>
                  <MenuItem value="Solutions">Solutions</MenuItem>
                  <MenuItem value="Frames">Frames</MenuItem>
                  <MenuItem value="Contact Lense">Contact Lenses</MenuItem>
                  <MenuItem value="Covers">Covers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="KBCW Barcode"
                value={editKbcwProduct.kbcwBarcode || ""}
                onChange={(e) =>
                  handleKbcwProductChange("kbcwBarcode", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={editKbcwProduct.kbcwName || ""}
                onChange={(e) =>
                  handleKbcwProductChange("kbcwName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={editKbcwProduct.kbcwSize || ""}
                onChange={(e) =>
                  handleKbcwProductChange("kbcwSize", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={editKbcwProduct.enteredQuantity || ""}
                onChange={(e) =>
                  handleKbcwProductChange("enteredQuantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={editKbcwProduct.kbcwPrice || ""}
                onChange={(e) =>
                  handleKbcwProductChange("kbcwPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={
                  editKbcwProduct.kbcwDeliveredDate &&
                  !isNaN(new Date(editKbcwProduct.kbcwDeliveredDate).getTime())
                    ? new Date(editKbcwProduct.kbcwDeliveredDate)
                    : null
                }
                onChange={(date) => handleDateChange(date, "kbcwDeliveredDate")}
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

export default EditKbcwDialog;
