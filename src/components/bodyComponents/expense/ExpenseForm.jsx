

import React, { useState } from "react";
import { Button, TextField, Typography, Box,Select , MenuItem } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InventoryForm = () => {
  
 
  const [price, setPrice] = useState("");
  const [expenseType, setExpenseType] = useState("");
   const [selectedDate, setSelectedDate] = useState(new Date());

 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
   
    console.log("Price:", price);
     console.log("Selected Date:", selectedDate);
      console.log("Expense Type:", expenseType);
   
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Add Your Expense</Typography>
      <form onSubmit={handleSubmit}>
        <Typography variant="h7">Select Date</Typography>
        <div>
          <DatePicker
            className="datePicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>
        <Typography variant="h7">Price</Typography>
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="h7">Expense Type</Typography>
        <Select
          label="Expense Type"
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          placeholder="Expense Type"
          margin="normal"
          fullWidth
        >
          <MenuItem value="salary">Chai</MenuItem>
          <MenuItem value="rent">Rent</MenuItem>
          {/* Add more expense types as needed */}
        </Select>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default InventoryForm;






















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
