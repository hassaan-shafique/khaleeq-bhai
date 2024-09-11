import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  Tab,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesForm = () => {
  const [open, setOpen] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [barcode, setBarcode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [salesman, setSalesman] = useState("");
  const [doctor, setDoctor] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [pendingAmount, setPendingAmount] = useState("");
  const [advance,setAdvance] =useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
   const [reSph, setReSph] = useState("");
   const [reCyl, setReCyl] = useState("");
   const [reAxis, setReAxis] = useState("");
   const [reAdd, setReAdd] = useState("");
   const [leSph, setLeSph] = useState("");
   const [leCyl, setLeCyl] = useState("");
   const [leAxis, setLeAxis] = useState("");
   const [leAdd, setLeAdd] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to server)
    console.log("Order No:", orderNo);
    console.log("Customer Name:", customerName);
    console.log("Barcode:", barcode);
    // ... other fields
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
        Sales
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Sale
        </Button>
      </Typography>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Barcode"
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
              sx={{ mr: 1 }}
            />
            <TextField
              label="Contact No"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder="Contact No"
              margin="normal"
              sx={{ mr: 6 }}
            />
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              margin="normal"
              sx={{ mr: 1 }}
            />
            <TextField
              label="Salesman"
              value={salesman}
              onChange={(e) => setSalesman(e.target.value)}
              placeholder="Salesman"
              margin="normal"
              sx={{ mr: 6 }}
            />
            <TextField
              label="Doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              placeholder="Doctor"
              margin="normal"
              sx={{ mr: 1 }}
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell>RE</TableCell>
                    <TableCell>LE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>SPH</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={reSph}
                        onChange={(e) => setReSph(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={leSph}
                        onChange={(e) => setLeSph(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CYL</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={reCyl}
                        onChange={(e) => setReCyl(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={leCyl}
                        onChange={(e) => setLeCyl(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AXIS</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={reAxis}
                        onChange={(e) => setReAxis(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={leAxis}
                        onChange={(e) => setLeAxis(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ADD</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={reAdd}
                        onChange={(e) => setReAdd(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={leAdd}
                        onChange={(e) => setLeAdd(e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TextField
              label="Total Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total Amount"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Advance"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              placeholder="Advance"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Pending Amount"
              value={pendingAmount}
              onChange={(e) => setPendingAmount(e.target.value)}
              placeholder="Pending Amount"
              margin="normal"
              fullWidth
            />
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="inventory-form"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
