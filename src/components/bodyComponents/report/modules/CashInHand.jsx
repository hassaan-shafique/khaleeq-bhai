import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Button, TextField } from "@mui/material";

const CashInHand = ({ salesData, expenses }) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [paymentFilter ,setPaymentFilter] = useState ( "");

  const STATUS = {
    COMPLETED : "Completed",
    PENDING: "PENDING"
  }

  const isSameDay = (orderDate) => {
    const now = new Date();
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate.toDateString() === now.toDateString();
  };

  const isSameWeek = (orderDate) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() -7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); 
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate >= startOfWeek && saleDate <= endOfWeek;
  };
  
  const isSameMonth = (orderDate) => {
    const now = new Date();
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  };
  const filterDataByTimeframe = (data, timeframe) => {
    return data.filter((item) => {
      const date = new Date(item.date);
      if (timeframe === "day") return isSameDay(date);
      if (timeframe === "week") return isSameWeek(date);
      if (timeframe === "month") return isSameMonth(date);
      if (timeframe === "custom") {
        const { start, end } = customDate;
        const startDate = new Date(start);
        const endDate = new Date(end);
        return date >= startDate && date <= endDate;
      }
      return true;
    });
  };

  const calculateTotalSales = () => {
    let totalSales = 0;
    salesData.forEach((sale) => {
      if (
        sale.status === STATUS.COMPLETED &&
        (!paymentFilter || sale.payment === paymentFilter) // Apply payment filter
      ) {
        if (
          (timeframe === "day" && isSameDay(sale.startDate)) ||
          (timeframe === "week" && isSameWeek(sale.startDate)) ||
          (timeframe === "month" && isSameMonth(sale.startDate))
        ) {
          totalSales += sale.totalAmount;
        }
      }
    });
    return totalSales;
  };
  

  const calculateTotalExpenses = () => {
    let totalExpenses = 0;
  
    expenses.forEach((expense) => {
      if (
        (!paymentFilter || expense.payment === paymentFilter) && // Apply payment filter if set
        (!timeframe || (
          (timeframe === "day" && isSameDay(expense.selectedDate)) ||
          (timeframe === "week" && isSameWeek(expense.selectedDate)) ||
          (timeframe === "month" && isSameMonth(expense.selectedDate))
        ))
      ) {
        totalExpenses += Number(expense.price);
      }
    });
  
    return totalExpenses;
  };

  const totalSales = calculateTotalSales();
  const totalExpenses = calculateTotalExpenses();
  const remainingCash = totalSales - totalExpenses;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cash In Hand
      </Typography>

      {/* Timeframe Buttons */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === "day" ? "contained" : "outlined"}
            onClick={() => setTimeframe("day")}
          >
            Day
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "week" ? "contained" : "outlined"}
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "month" ? "contained" : "outlined"}
            onClick={() => setTimeframe("month")}
          >
            Month
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "custom" ? "contained" : "outlined"}
            onClick={() => setTimeframe("custom")}
          >
            Custom
          </Button>
        </Grid>
      </Grid>

      {/* Custom Date Range */}
      {timeframe === "custom" && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={customDate.start}
              onChange={(e) =>
                setCustomDate({ ...customDate, start: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={customDate.end}
              onChange={(e) =>
                setCustomDate({ ...customDate, end: e.target.value })
              }
            />
          </Grid>
        </Grid>
      )}

      {/* Cash In Hand Summary */}
      <Grid container spacing={3}>
        {/* Sales Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Sales
              </Typography>
              <Typography variant="h4" color="secondary">
                Rs {totalSales.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="error">
                Total Expenses
              </Typography>
              <Typography variant="h4" color="secondary">
                Rs {totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Remaining Cash Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: remainingCash >= 0 ? "#e8f5e9" : "#ffebee",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                color={remainingCash >= 0 ? "success.main" : "error"}
              >
                Remaining Cash
              </Typography>
              <Typography variant="h4" color="secondary">
                Rs {remainingCash.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CashInHand;
