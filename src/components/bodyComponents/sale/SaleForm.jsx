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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/Firebase";

const SalesForm = () => {
  // Use one state object for all form fields
  const [value, setValue] = useState({
    barcode: "",
    orderNo: "",
    customerName: "",
    contactNo: "",
    address: "",
    salesman: "",
    doctor: "",
    totalAmount: "",
    pendingAmount: "",
    advance: "",
    startDate: null,
    endDate: null,
    reSph: "",
    reCyl: "",
    reAxis: "",
    reAdd: "",
    leSph: "",
    leCyl: "",
    leAxis: "",
    leAdd: "",
    instruction: "",
    status: "Pending",
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Generic handler for TextField changes
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  // Specific handler for date changes
  const handleDateChange = (date, field) => {
    setValue((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
     barcode,
    orderNo,
    customerName,
    contactNo,
    address,
    salesman,
    doctor,
    totalAmount,
    pendingAmount,
    advance,
    startDate,
    endDate,
    reSph ,
    reCyl,
    reAxis,
    reAdd,
    leSph,
    leCyl,
    leAxis,
    leAdd,
    instruction,
    status,
    } = value;

    try {
      const expensesCollectionRef = collection(db, "sales");
      await addDoc(expensesCollectionRef, {
        barcode,
        orderNo,
        customerName,
        contactNo,
        address,
        salesman,
        doctor,
        totalAmount,
        pendingAmount,
        advance,
        startDate,
        endDate,
        reSph,
        reCyl,
        reAxis,
        reAdd,
        leSph,
        leCyl,
        leAxis,
        leAdd,
        instruction,
        status,
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
        Sales
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Sale
        </Button>
      </Typography>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h7">Date of Order</Typography>
            <div>
              <DatePicker
                selected={value.startDate}
                onChange={(date) => handleDateChange(date, "startDate")}
                fullWidth
              />
            </div>
            <Typography variant="h7">Date of Delivery</Typography>
            <div>
              <DatePicker
                selected={value.endDate}
                onChange={(date) => handleDateChange(date, "endDate")}
                fullWidth
              />
            </div>
            <TextField
              label="Barcode"
              type="number"
              name="barcode" // Name matches the key in the value object
              value={value.barcode}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Order No"
              type="number"
              name="orderNo"
              value={value.orderNo}
              onChange={handleChange}
              margin="normal"
              sx={{ mr: 6 }}
            />
            <TextField
              label="Customer Name"
              name="customerName"
              value={value.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              margin="normal"
              sx={{ mr: 1 }}
            />
            <TextField
              label="Contact No"
              name="contactNo"
              value={value.contactNo}
              onChange={handleChange}
              placeholder="Contact No"
              margin="normal"
              sx={{ mr: 6 }}
            />
            <TextField
              label="Address"
              name="address"
              value={value.address}
              onChange={handleChange}
              placeholder="Address"
              margin="normal"
              sx={{ mr: 1 }}
            />
            <TextField
              label="Salesman"
              name="salesman"
              value={value.salesman}
              onChange={handleChange}
              placeholder="Salesman"
              margin="normal"
              sx={{ mr: 6 }}
            />
            <TextField
              label="Doctor"
              name="doctor"
              value={value.doctor}
              onChange={handleChange}
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
                        name="reSph"
                        value={value.reSph}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leSph"
                        value={value.leSph}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CYL</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reCyl"
                        value={value.reCyl}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leCyl"
                        value={value.leCyl}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AXIS</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reAxis"
                        value={value.reAxis}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leAxis"
                        value={value.leAxis}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ADD</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reAdd"
                        value={value.reAdd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leAdd"
                        value={value.leAdd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TextField
              label="Total Amount"
              name="totalAmount"
              value={value.totalAmount}
              onChange={handleChange}
              placeholder="Total Amount"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Advance"
              name="advance"
              value={value.advance}
              onChange={handleChange}
              placeholder="Advance"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Pending Amount"
              name="pendingAmount"
              value={value.pendingAmount}
              onChange={handleChange}
              placeholder="Pending Amount"
              margin="normal"
              fullWidth
            />

            {/* Status Radio Buttons */}
            <Typography variant="h7" sx={{ mt: 2 }}>
              Sale Status
            </Typography>
            <RadioGroup
              row
              name="status"
              value={value.status}
              onChange={handleChange}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value="Pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
            </RadioGroup>

            <TextField
              label="Instruction"
              name="instruction"
              value={value.instruction}
              onChange={handleChange}
              placeholder="Instruction"
              fullWidth
              margin="normal"
            />

            <DialogActions>
              <Button
                onClick={handleClose}
                sx={{
                  mt: 4,
                  bgcolor: "#005eff",
                  px: 3,
                  ":hover": { bgcolor: "#005eff" },
                }}
                variant="contained"
                type="submit"
              >
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesForm;
