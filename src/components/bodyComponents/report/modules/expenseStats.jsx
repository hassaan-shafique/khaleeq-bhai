import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TableContainer,
  Card,
  CardContent,

} from "@mui/material";

const ExpenseStats = ({ expenses }) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  const [filteredExpenses, setFilteredExpenses] = useState([]); // Filtered expense list
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Filter expenses based on the selected timeframe
  useEffect(() => {
    const filterExpenses = () => {
      const now = new Date();
      let filtered = [];

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.selectedDate.seconds * 1000);

        if (
          (timeframe === "day" && isSameDay(expenseDate, now)) ||
          (timeframe === "week" && isSameWeek(expenseDate, now)) ||
          (timeframe === "month" && isSameMonth(expenseDate, now))
        ) {
          filtered.push(expense);
        }
      });

      setFilteredExpenses(filtered);
    };

    if (expenses.length > 0) {
      setLoading(true);
      filterExpenses();
      setLoading(false);
    }
  }, [timeframe, expenses]);

  const calculateTotalPrice = (expenses, timeframe) => {
    const now = new Date();
    let total = 0;
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.selectedDate.seconds * 1000);
      if (timeframe === "day") {
        return isSameDay(expenseDate, now);
      } else if (timeframe === "week") {
        return isSameWeek(expenseDate, now);
      } else if (timeframe === "month") {
        return isSameMonth(expenseDate, now);
      }
      return false;
    });

    filtered.forEach((expense) => {
      total += parseFloat(expense.price || 0);
    });

    setFilteredExpenses(filtered);
    return total;
  };
  useEffect(() => {
    setLoading(true);
    const total = calculateTotalPrice(expenses, timeframe);
    setTotalPrice(total);
    setLoading(false);
  }, [expenses, timeframe]);


  // Check if two dates are on the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  
  const isSameWeek = (date1, date2) => {
    const startOfWeek = new Date(date2);
    startOfWeek.setDate(date2.getDate() - date2.getDay() - 7); 
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); 
  
    return date1 >= startOfWeek && date1 <= endOfWeek;
  };
  

  // Check if two dates are in the same month
  const isSameMonth = (date1, date2) => {
    return (
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Format a Firestore timestamp to "DD/MM/YYYY"
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(
        timestamp.seconds ? timestamp.seconds * 1000 : timestamp
      );
      if (isNaN(date.getTime())) return "Invalid Date";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Expense Stats
      </Typography>
      

      
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {["day", "week", "month"].map((frame) => (
          <Grid item key={frame}>
            <Button
              variant={timeframe === frame ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTimeframe(frame)}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ marginBottom: 4, backgroundColor: "#f5f5f5", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Total Expense ({timeframe === "day" ? "Today" : timeframe === "week" ? "This Week" : "This Month"})
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h4" color="primary" sx={{ marginTop: 2 }}>
              Rs {totalPrice.toFixed(2)}
            </Typography>
          )}
        </CardContent>
      </Card>
      


      {/* Expenses Table */}
      <TableContainer 
  component={Paper} 
  sx={{ borderRadius: 2, boxShadow: 3, maxHeight: 400 }}
>
  <Table stickyHeader>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
            Sr No
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
            Date
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
            Expense Type
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
            Price
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense, index) => (
          <TableRow
            key={expense.id}
            hover
            sx={{
              "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
            }}
          >
            <TableCell>
              <Typography variant="body2">{index + 1}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2">
                {new Date(expense.selectedDate.seconds * 1000).toLocaleDateString()}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2" color="secondary">
                {expense.expenseType || "-"}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2">Rs {expense.price}</Typography>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} align="center">
            <Typography variant="body2" color="textSecondary">
              No expenses available for the selected timeframe.
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

    </Box>
  );
};

export default ExpenseStats;
