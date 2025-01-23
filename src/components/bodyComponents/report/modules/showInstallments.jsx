import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Paper,
  TextField,
} from "@mui/material";

const ShowInstallments = ({   data , onCalculateTotal } ) => {
  const [timeframe, setTimeframe] = useState("day");
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [totalInstallment, setTotalInstallment] = useState(0);
  const [cashInstallments, setCashInstallments] = useState(0);
  const [bankInstallments, setBankInstallments] = useState(0);
  const [jazzCashInstallments, setJazzCashInstallments] = useState(0);
  const [easyPaisaInstallments, setEasyPaisaInstallments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installments, setInstallments] = useState(data);
  
  const userRole = localStorage.getItem("userRole");

  

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    if (newTimeframe === "custom" && (!customDate.start || !customDate.end)) {
      // Handle case where custom dates are not selected
    } else {
      fetchInstallments(newTimeframe);
    }
  };

  // Fetch data from Firestore and calculate installment amounts based on timeframe
  const fetchInstallments = async (selectedTimeframe) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const querySnapshot = await getDocs(collection(db, "salesInstallments"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      // Filter data based on the selected timeframe
      const filteredData = filterDataByTimeframe(data, selectedTimeframe);

      console.log("Filtered Data: ", filteredData); // Debugging filtered data

      // Calculate values based on payment method
      setTotalInstallment(calculateTotalInstallment(filteredData));
      setCashInstallments(calculateCashInstallments(filteredData));
      setBankInstallments(calculateBankInstallments(filteredData));
      setJazzCashInstallments(calculateJazzCashInstallments(filteredData));
      setEasyPaisaInstallments(calculateEasyPaisaInstallments(filteredData));
    } catch (err) {
      console.error("Error fetching installments:", err);
      setError("Failed to fetch installments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to filter installments by timeframe
  const filterDataByTimeframe = (data, timeframe) => {
    return data.filter((installment) => {
      const installmentDate = new Date(installment.date); // Assuming `date` is a field in the installment object

      switch (timeframe) {
        case "day":
          return isSameDay(installmentDate);
        case "week":
          return isSameWeek(installmentDate);
        case "month":
          return isSameMonth(installmentDate);
        case "custom":
          return isInCustomRange(installmentDate);
        default:
          return true;
      }
    });
  };
  const calculateTotalInstallment = (data) => {
    return data.reduce(
      (total, installment) => total + (Number(installment.amount) || 0),
      0
    );
  };

  useEffect(() => {
    if (installments && onCalculateTotal) {
      const total = calculateTotalInstallment(installments);
      onCalculateTotal(total); // Pass the total to the parent
    }
  }, [installments, onCalculateTotal]);

  const calculateCashInstallments = (data) => {
    return data
      .filter((installment) => installment.payment === "Cash")
      .reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
  };

  const calculateBankInstallments = (data) => {
    const bankInstallments = data.filter((installment) => installment.payment === "Bank");
    console.log("Bank Installments: ", bankInstallments);
    return bankInstallments.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
  };

  const calculateJazzCashInstallments = (data) => {
    return data
      .filter((installment) => installment.payment === "JazzCash")
      .reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
  };

  const calculateEasyPaisaInstallments = (data) => {
    return data
      .filter((installment) => installment.payment === "EasyPaisa")
      .reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
  };

  // Helper functions to check timeframe
  const isSameDay = (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const isSameWeek = (date) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week
    return date >= startOfWeek && date <= endOfWeek;
  };

  const isSameMonth = (date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  const isInCustomRange = (date) => {
    if (!customDate.start || !customDate.end) return false;

    const startDate = new Date(customDate.start);
    const endDate = new Date(customDate.end);
    endDate.setHours(23, 59, 59, 999); // Include the full day for the end date

    return date >= startDate && date <= endDate;
  };

  // Trigger fetching and recalculation when timeframe or custom dates change
  useEffect(() => {
    fetchInstallments(timeframe);
  }, [timeframe, customDate]);

  return (
    <div>


      <Typography sx={{fontSize: 24}}> 
        INSTALLMENTS RECEIVED
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === "day" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("day")}
          >
            Day
          </Button>
        </Grid>

        <Grid item>
          {userRole === "admin" && (
            <Button
              variant={timeframe === "week" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleTimeframeChange("week")}
            >
              Week
            </Button>
          )}
        </Grid>

        <Grid item>
          {userRole === "admin" && (
            <Button
              variant={timeframe === "month" ? "contained" : "outlined"}
              color="primary"
              onClick={() => handleTimeframeChange("month")}
            >
              Month
            </Button>
          )}
        </Grid>

        <Grid item>
          {userRole === "admin" && (
            <Button
              variant={timeframe === "custom" ? "contained" : "outlined"}
              onClick={() => handleTimeframeChange("custom")}
            >
              Custom
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Custom Date Range Selection */}
      {timeframe === "custom" && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6} md={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customDate.start}
              onChange={(e) =>
                setCustomDate((prev) => ({ ...prev, start: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customDate.end}
              onChange={(e) =>
                setCustomDate((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2}>
        {/* Total Installment Amount - Top Row */}
        <Grid item xs={12} sm={8} md={16}>
          <Card sx={{ margin: 2, padding: 2, backgroundColor: "#f5f5f5" }}>
            <CardContent>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <>
                  <Typography variant="h6" component="div">
                    Total Installment Amount
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Rs. {totalInstallment.toLocaleString()}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Method Breakdown */}
        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ padding: 6 }}>
            <Typography variant="h6">Cash</Typography>
            <Typography variant="h4" color="secondary">
              {loading ? <CircularProgress size={24} /> : `Rs. ${cashInstallments.toLocaleString()}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ padding: 6 }}>
            <Typography variant="h6">Bank</Typography>
            <Typography variant="h4" color="secondary">
              {loading ? <CircularProgress size={24} /> : `Rs. ${bankInstallments.toLocaleString()}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ padding: 6 }}>
            <Typography variant="h6">JazzCash</Typography>
            <Typography variant="h4" color="secondary">
              {loading ? <CircularProgress size={24} /> : `Rs. ${jazzCashInstallments.toLocaleString()}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <Paper elevation={3} sx={{ padding: 6 }}>
            <Typography variant="h6">EasyPaisa</Typography>
            <Typography variant="h4" color="secondary">
              {loading ? <CircularProgress size={24} /> : `Rs. ${easyPaisaInstallments.toLocaleString()}`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    
    </div>
  );
};

export default ShowInstallments;
