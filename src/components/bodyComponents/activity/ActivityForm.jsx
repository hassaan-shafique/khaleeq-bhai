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

const ActivityForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);

  // State for form values
  const [value, setValue] = useState({
    selectedDate: new Date(),
    itemName: "",
    vendor: "",
    price: 0,
    quantity: "",
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
    const { selectedDate, itemName, vendor, price, quantity } = value;

    try {
      const activityCollectionRef = collection(db, "daily-activity");
      await addDoc(activityCollectionRef, {
        selectedDate,
        itemName,
        vendor,
        price,
        quantity,
      });

      setOpen(false);
      setRefresh((prev) => !prev); // Trigger refresh after adding a new entry
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          m: 9,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Daily Activity
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 7 }}
          onClick={handleClickOpen}
        >
          Add Daily Activity
        </Button>
      </Typography>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Daily Activity</DialogTitle>
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
              label="Item Name"
              type="text"
              name="itemName"
              value={value.itemName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Vendor"
              name="vendor"
              type="text"
              value={value.vendor}
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
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={value.quantity}
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

export default ActivityForm;
