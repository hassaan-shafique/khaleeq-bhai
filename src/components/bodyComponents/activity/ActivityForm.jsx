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

  
  const [value, setValue] = useState({
    selectedDate: new Date(),
    itemName: "",
    refNo:"",
    remarks: "",
    vendor: "",
    price: 0,
    quantity: "",
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  
  const handleDateChange = (date) => {
    setValue((prev) => ({
      ...prev,
      selectedDate: date, 
    }));
  };

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { selectedDate, itemName, refNo, vendor, price, quantity,remarks } = value;

    try {
      const activityCollectionRef = collection(db, "daily-activity");
      await addDoc(activityCollectionRef, {
        selectedDate,
        itemName,
        refNo,
        remarks,
        vendor,
        price,
        quantity,
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
                dateFormat="MM/dd/yyyy" 
                customInput={
                  <TextField
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    value={value.selectedDate.toLocaleDateString()} 
                  />
                }
              />
            </div>
            <TextField
              label="Reference No"
              type="text"
              name="refNo"
              value={value.refNo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

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
             <TextField
              label="Remarks"
              name="remarks"
              type="string"
              value={value.remarks}
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
