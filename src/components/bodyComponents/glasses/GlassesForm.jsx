import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/Firebase";

const GlassesForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);

  // State for form values
  const [value, setValue] = useState({
    price: 0,
    type: "",
    glass: "",
    number: "",
    quantity:"",
    barcodeNumber: "",
    selectedDate: new Date(), // Initializing with the current date
  });

  // Update form state when inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value, // Update corresponding state field
    }));
  };

  // Update date state when the date changes
  const handleDateChange = (date) => {
    setValue((prev) => ({
      ...prev,
      selectedDate: date, // Ensure selected date is updated
    }));
  };

  // Open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      price,
      type,
      glass,
      selectedDate,
      number,
      quantity,
      barcodeNumber,
    } = value;

    try {
      const expensesCollectionRef = collection(db, "glasses");
      await addDoc(expensesCollectionRef, {
        price,
        type,
        glass,
        barcodeNumber,
        number,
        quantity,
        selectedDate,
      });

      setOpen(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          m: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Glasses
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Glasses
        </Button>
      </Typography>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Glasses</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h7">Select Date</Typography>
            <div>
              <DatePicker
                className="datePicker"
                selected={value.selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy" // Format the date
                customInput={
                  <TextField
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    value={value.selectedDate.toLocaleDateString()} // Display selected date
                  />
                }
              />
            </div>
            <TextField
              label="Barcode Number"
              name="barcodeNumber"
              type="number"
              value={value.barcodeNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Glass Name"
              type="text"
              name="glass"
              value={value.glass}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label=" Glass Type"
              type="text"
              name="type"
              value={value.type}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Number"
              name="number"
              type="number"
              value={value.number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={value.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              type="number"
              value={value.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GlassesForm;