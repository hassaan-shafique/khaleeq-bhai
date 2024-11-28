import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Update with your Firebase config path

const ExpenseReportCard = () => {
  const [expenses, setExpenses] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to fetch filtered expenses from Firebase
  const fetchExpenses = async () => {
    try {
      const expensesRef = collection(db, "expenses");
      let q = query(expensesRef);

      // Apply date range filter if both start and end dates are selected
      if (startDate && endDate) {
        q = query(
          expensesRef,
          where("date", ">=", new Date(startDate)),
          where("date", "<=", new Date(endDate))
        );
      }

      const querySnapshot = await getDocs(q);
      const fetchedExpenses = querySnapshot.docs.map((doc) => doc.data());
      setExpenses(fetchedExpenses);

      // Calculate the total amount
      const total = fetchedExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch expenses whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchExpenses();
    }
  }, [startDate, endDate]);

  return (
    <Card sx={{ marginTop:5, margin: 9, padding: 6}}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expense Report
        </Typography>

        {/* Date Filters */}
        <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button variant="contained" onClick={fetchExpenses}>
            Filter
          </Button>
        </Box>

        {/* Display Total Amount */}
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Total Expense Amount: Rs{totalAmount}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExpenseReportCard;
