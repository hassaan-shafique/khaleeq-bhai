import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
 
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesForm = () => {
  const [orderNo, setOrderNo] = useState("");
  const [barcode, setBarcode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
   const [salesman, setSalesman] = useState("");
   const [doctor, setDoctor] = useState("");
 
   const [totalAmount, setTotalAmount] = useState("");
   const [pendingAmount, setPendingAmount] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log("Order No:", orderNo);
    console.log("Customer Name:", customerName);
  
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Sale</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="barcode"
          type="number"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Order No"
          type="number"
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          margin="normal"
          sx={{ mr: 6 }}
        />

        <TextField
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          margin="normal"
          sx={{ mr: 6 }}
        ></TextField>
        <TextField
          label="Contact No"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
          placeholder="Contact No"
          margin="normal"
          sx={{ mr: 6 }}
        ></TextField>
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          margin="normal"
          sx={{ mr: 6 }}
        ></TextField>
        <TextField
          label="Salesman"
          value={salesman}
          onChange={(e) => setSalesman(e.target.value)}
          placeholder="Salesman"
          margin="normal"
          sx={{ mr: 6 }}
        ></TextField>
        <TextField
          label="doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="Doctor"
          margin="normal"
        ></TextField>

        <TextField
          label="Total Amount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Total Amount"
          margin="normal"
          fullWidth
        ></TextField>
        <TextField
          label="Pending Amount"
          value={pendingAmount}
          onChange={(e) => setPendingAmount(e.target.value)}
          placeholder="Pending Amount"
          margin="normal"
          fullWidth
        ></TextField>

        <Typography variant="h7">Date of Order</Typography>
        <div>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            fullWidth
          />
        </div>
        <Typography variant="h7">Date of Delivery</Typography>
        <div>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            fullWidth
          />
        </div>

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default SalesForm;

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
