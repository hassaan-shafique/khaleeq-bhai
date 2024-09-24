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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expenses, setExpenses] = useState([
    { price: 0, expenseType: "", otherExpense: "" },
  ]);
  const [dynamicExpenseTypes, setDynamicExpenseTypes] = useState(EXPENSE_TYPES);

  // Handle input change for dynamic expenses
  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  // Handle adding new expense entry
  const handleAddExpense = () => {
    setExpenses([...expenses, { price: 0, expenseType: "", otherExpense: "" }]);
  };

  // Handle removing an expense entry
  const handleRemoveExpense = (index) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expensesCollectionRef = collection(db, "expenses");

      for (const expense of expenses) {
        // Add new expense type to the dynamic list if it's not empty
        if (expense.expenseType === "other" && expense.otherExpense) {
          const newExpenseType = {
            name: expense.otherExpense,
            value: expense.otherExpense.toLowerCase().replace(/\s+/g, ""),
          };
          setDynamicExpenseTypes((prev) => [...prev, newExpenseType]);
        }

        // Submit the expense
        await addDoc(expensesCollectionRef, {
          ...expense,
          selectedDate,
          otherExpense:
            expense.expenseType === "other" ? expense.otherExpense : "",
        });
      }

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
        <DialogTitle>Add Expenses</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h7" sx={{ mb: 1 }}>
              Select Date
            </Typography>
            <Box sx={{ mt: 1 }}>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                customInput={
                  <TextField
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    value={
                      selectedDate
                        ? selectedDate.toISOString().split("T")[0]
                        : ""
                    }
                  />
                }
              />
            </Box>
          </Box>

          {expenses.map((expense, index) => (
            <Box
              key={index}
              sx={{ mb: 3, border: "1px solid #ddd", padding: 2 }}
            >
              <Typography variant="h6">Expense {index + 1}</Typography>
              <TextField
                label="Price"
                type="number"
                name="price"
                value={expense.price}
                onChange={(e) =>
                  handleExpenseChange(index, "price", e.target.value)
                }
                fullWidth
                margin="normal"
                required
              />

              <InputLabel id={`expense-type-${index}`}>Expense Type</InputLabel>
              <Select
                label="Expense Type"
                labelId={`expense-type-${index}`}
                name="expenseType"
                value={expense.expenseType}
                onChange={(e) =>
                  handleExpenseChange(index, "expenseType", e.target.value)
                }
                fullWidth
                margin="normal"
                required
              >
                {dynamicExpenseTypes.map((expenseOption) => (
                  <MenuItem
                    key={expenseOption.value}
                    value={expenseOption.value}
                  >
                    {expenseOption.name}
                  </MenuItem>
                ))}
              </Select>

              {expense.expenseType === "other" && (
                <TextField
                  label="Other Expense Type"
                  name="otherExpense"
                  value={expense.otherExpense}
                  onChange={(e) =>
                    handleExpenseChange(index, "otherExpense", e.target.value)
                  }
                  margin="normal"
                  fullWidth
                  required
                />
              )}

              {index > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveExpense(index)}
                  sx={{ mt: 2 }}
                >
                  Remove Expense
                </Button>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={handleAddExpense} sx={{ mt: 3 }}>
            Add Another Expense
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Expenses
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExpenseForm;
