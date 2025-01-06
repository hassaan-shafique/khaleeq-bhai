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
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase";

const GlassesForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);

  // State for form values
  const [value, setValue] = useState({
    price: 0,
    type: "",
    glassesName: "",
    number: "",
    quantity: "",
    barcodeNumber: "",
    selectedDate: new Date(), // Initializing with the current date
  });
  const [error ,setError] =useState()
;
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

  // Function to check if the barcode number already exists
  const checkBarcodeExistence = async (number, type) => {
    const glassesCollectionRef = collection(db, "glasses");
  
    // Create a query to check for both number and type
    const q = query(
      glassesCollectionRef,
      where("number", "==", number),
      where("type", "==", type)
    );
  
    try {
      // Fetch the query snapshot
      const querySnapshot = await getDocs(q);
  
      // Return true if a match is found, false otherwise
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking barcode existence:", error);
      return false; // Default to false if an error occurs
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      price,
      type,
      glassesName,
      selectedDate,
      number,
      quantity,
      barcodeNumber,
    } = value;

      

    // Check if the barcode number already exists
    // const numberExists = await checkBarcodeExistence(number);
    // if (numberExists) {
    //   alert("The Glasses number is already available.");
    //   return; // Exit early if the barcode already exists
    // }

    try {
      const isDuplicate = await checkBarcodeExistence(number, type);

      if (isDuplicate) {
        alert(
          `The glasses with number "${number}" and type "${type}" are already available.`
        );
        return; // Stop further execution if duplicate found
      }


      const glassesCollectionRef = collection(db, "glasses");
      await addDoc(glassesCollectionRef, {
        price,
        type,
        glassesName,
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
        Glasses Inventory
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
              name="glassesName"
              value={value.glassesName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              required
              label="Glass Type"
              type="text"
              name="type"
              value={value.type}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={Boolean(error)} // Display error if any
              helperText={error && error.includes("type") ? error : ""}
            />

            {/* Number Field */}
            <TextField
              required
              label="Number"
              name="number"
              type="text"
              value={value.number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={Boolean(error)} // Display error if any
              helperText={error && error.includes("number") ? error : ""}
            />

            {/* Quantity Field */}
            <TextField
              required
              label="Quantity"
              name="quantity"
              type="number"
              value={value.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={Boolean(error)} // Display error if any
              helperText={error && error.includes("quantity") ? error : ""}
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
