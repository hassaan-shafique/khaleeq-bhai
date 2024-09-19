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
  InputLabel,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/Firebase";

const EXPENSE_TYPES = [
  { name: "Salary", value: "salary" },
  { name: "Rent", value: "rent" },
  { name: "Food", value: "food" },
  { name: "Electricity Bill", value: "electricityBill" },
  { name: "Loan", value: "loan" },
  { name: "Other", value: "other" },
];

const ExpenseForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    price: 0,
    expenseType: "",
    otherExpense: "",
    selectedDate: new Date(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setValues((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { price, expenseType, selectedDate, otherExpense } = values;

    try {
      const expensesCollectionRef = collection(db, "expenses");
      await addDoc(expensesCollectionRef, {
        price,
        expenseType,
        selectedDate,
        otherExpense: expenseType === "other" ? otherExpense : "",
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
        Expenses
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={() => setOpen(true)}
        >
          Add Expense
        </Button>
      </Typography>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h7" sx={{ mb: 1 }}>
                Select Date
              </Typography>
              <Box sx={{ mt: 1 }}>
                <DatePicker
                  selected={values.selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  customInput={
                    <TextField
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 1 }}
                      value={
                        values.selectedDate
                          ? values.selectedDate.toISOString().split("T")[0]
                          : "" // Empty string if no date is selected
                      }
                    />
                  }
                />
                 
              </Box>
            </Box>

            <Typography variant="h7">Price</Typography>
            <TextField
              label="Price"
              type="number"
              name="price"
              value={values.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            <InputLabel id="expense-type">Expense Type</InputLabel>
            <Select
              label="Expense Type"
              labelId="expense-type"
              name="expenseType"
              value={values.expenseType}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            >
              {EXPENSE_TYPES.map((expense) => (
                <MenuItem key={expense.value} value={expense.value}>
                  {expense.name}
                </MenuItem>
              ))}
            </Select>

            {values.expenseType === "other" && (
              <TextField
                label="Other Expense Type"
                name="otherExpense"
                value={values.otherExpense}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
                required
              />
            )}
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseForm;
