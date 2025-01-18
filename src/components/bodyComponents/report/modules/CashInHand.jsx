import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Button, TextField,
  
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Paper,
  CircularProgress,
 } from "@mui/material";
 import { collection, getDocs } from "firebase/firestore";
 import { db } from "../../../../config/Firebase"; // Adjust the import path if necessary
import ChartComponent from "./ChartComponent";
import ShowInstallments from "./showInstallments";

const CashInHand = ({ id, salesData, expenses,  }) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [paymentFilter ,setPaymentFilter] = useState ( "Cash");
  const [loading, setLoading] = useState(false)
  const [installments, setInstallments] =useState ([]);
  const [error, setError] = useState(null);
  
 // Fetch installments from Firebase
 useEffect(() => {
  const fetchInstallments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "salesInstallments"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInstallments(data);
    } catch (err) {
      console.error("Error fetching installments:", err);
      setError("Failed to fetch installments.");
    } finally {
      setLoading(false);
    }
  };

  fetchInstallments();
}, []);

const handleTimeframeChange = (newTimeframe) => {
  setTimeframe(newTimeframe);
  if (newTimeframe !== "custom") {
    setCustomDate({ start: null, end: null });
  }
};
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
      // Apply payment filter if set
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
  const calculateInHandSales = () => {
    let totalInHand = 0;
  
    salesData.forEach((sale) => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        if (
          (!paymentFilter || sale.payment === paymentFilter) // Apply payment filter
        ) {
          const saleDate = new Date(sale.startDate.seconds * 1000); // Convert Firestore timestamp
          const startDate = customDate.start ? new Date(customDate.start) : null;
          const endDate = customDate.end ? new Date(customDate.end) : null;
  
          // Ensure the end date includes the entire day
          if (endDate) {
            endDate.setHours(23, 59, 59, 999);
          }
  
          const withinCustomRange =
            timeframe === "custom" &&
            startDate &&
            endDate &&
            saleDate >= startDate &&
            saleDate <= endDate;
  
          if (
            (timeframe === "day" && isSameDay(sale.startDate)) ||
            (timeframe === "week" && isSameWeek(sale.startDate)) ||
            (timeframe === "month" && isSameMonth(sale.startDate)) ||
            withinCustomRange
          ) {
            totalInHand += Number(sale.advance);
          }
        }
      }
    });
  
    return totalInHand;
  };
  

  const totalSales = calculateTotalSales();
  const totalExpenses = calculateTotalExpenses();
  const remainingCash = totalSales - totalExpenses;


  const totalInHand = calculateInHandSales();
  const totalExpense = calculateTotalExpenses ();
  const Balance = totalInHand - totalExpense;
  
  const calculatePendingSales = () => {
    let totalPending = 0;
  
    salesData.forEach((sale) => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        if (
          (!paymentFilter || sale.payment === paymentFilter) // Apply payment filter
        ) {
          const saleDate = new Date(sale.startDate.seconds * 1000); // Convert Firestore timestamp
          const startDate = customDate.start ? new Date(customDate.start) : null;
          const endDate = customDate.end ? new Date(customDate.end) : null;
  
          // Ensure the end date includes the entire day
          if (endDate) {
            endDate.setHours(23, 59, 59, 999);
          }
  
          const withinCustomRange =
            timeframe === "custom" &&
            startDate &&
            endDate &&
            saleDate >= startDate &&
            saleDate <= endDate;
  
          if (
            (timeframe === "day" && isSameDay(sale.startDate)) ||
            (timeframe === "week" && isSameWeek(sale.startDate)) ||
            (timeframe === "month" && isSameMonth(sale.startDate)) ||
            withinCustomRange
          ) {
            totalPending += Number(sale.pendingAmount);
          }
        }
      }
    });
  
    return totalPending;
  };
  
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
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <InputLabel>Payment Type</InputLabel>
        <Select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Bank">Bank</MenuItem>
          <MenuItem value="JazzCash">JazzCash</MenuItem>
          <MenuItem value="EasyPaisa">EasyPaisa</MenuItem>
        </Select>
      </FormControl>

      {/* Cash In Hand Summary */}
      <Grid container spacing={3}>
        {/* Sales Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                Total Completed Sales
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

<Grid container spacing={1} sx={{marginTop: 7}} >
      <Paper elevation={3} sx={{ padding: 2, flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
    <Typography variant="h6" color= "primary">Total Advance</Typography>
    <Typography variant="h4" color="secondary">
      {loading ? <CircularProgress size={24} /> : `Rs ${calculateInHandSales()}/-`}
    </Typography>
  </Paper>

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
             Balance Amount
              </Typography>
              <Typography variant="h4" color="secondary">
                Rs {Balance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        </Grid>
       


         <Paper elevation={3} sx={{ padding: 2, flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
            <Typography variant="h6">Total Pending Amount</Typography>
            <Typography variant="h4" color="secondary">
              {loading ? <CircularProgress size={24} /> : `Rs ${calculatePendingSales()}/-`}
            </Typography>
          </Paper>

        
        {/* <ShowInstallments
         installments={installments} 
         timeframe={timeframe}
         customDate={customDate}
        /> */}

      <Box sx = {{marginTop: 8}} >
      <Grid>
      <ChartComponent
        totalSales={totalSales}
        totalExpenses={totalExpenses}
        remainingCash={remainingCash}
        totalInHand={totalInHand}
        pendingAmount={calculatePendingSales()}
        Balance={Balance}
      />
      </Grid>
      </Box>


    </Box>
  );
};

export default CashInHand;
