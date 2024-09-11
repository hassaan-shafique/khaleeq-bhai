import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExpenseForm = () => {
  const [open, setOpen] = useState(false); // State for popup visibility
  const [price, setPrice] = useState("");
 const[itemId,setItemId] =useState("");
 const[branchBorrowedFrom,setBranchBorrowedFrom]=useState("");
 const[borrowedItem,setBorrowedItem]=useState("");
 const[barcodeNumber,setBarcodeNumber]=useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Price:", price);
    console.log("Selected Date:", selectedDate);
   
    setOpen(false); // Close the popup after submission
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Glasses</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h7">Select Date</Typography>
            <div>
              <DatePicker
                className="datePicker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            <TextField
              label="Item ID"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Branch Borrowed From"
              value={branchBorrowedFrom}
              onChange={(e) => setBranchBorrowedFrom(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Typography variant="h7">Price</Typography>
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Borrowed Item"
              value={borrowedItem}
              onChange={(e) => setBorrowedItem(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Barcode Number"
              value={barcodeNumber}
              onChange={(e) => setBarcodeNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="expense-form"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseForm;

// import React, { useState } from "react";
// import {
//   Button,
//   TextField,
//   Typography,
//   Box,
//   DatePicker,
//   Select,
//   MenuItem,
// } from "@mui/material";

// const ExpenseForm = () => {
//   const [date, setDate] = useState(new Date());
//   const [expenseType, setExpenseType] = useState("");
//   const [price, setPrice] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log("Date:", date);
//     console.log("Expense Type:", expenseType);
//     console.log("Price:", price);
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h6"> Expenses</Typography>
//       <form onSubmit={handleSubmit}>
//         <DatePicker
//           label="Select Date"
//           value={date}
//           onChange={(newValue) => setDate(newValue)}
//           fullWidth
//         />
//         <Select
//           label="Expense Type"
//           value={expenseType}
//           onChange={(e) => setExpenseType(e.target.value)}
//           fullWidth
//         >
//           <MenuItem value="salary">Salary</MenuItem>
//           <MenuItem value="rent">Rent</MenuItem>
//           {/* Add more expense types as needed */}
//         </Select>
//         <TextField
//           label="Price"
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           fullWidth
//         />
//         <Button variant="contained" color="primary" type="submit">
//           Submit
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default ExpenseForm;
