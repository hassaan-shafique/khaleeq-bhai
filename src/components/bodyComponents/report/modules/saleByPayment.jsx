import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";

const SaleByPayment = () => {
  const [selectedPayment, setSelectedPayment] = useState("CASH"); // Default payment option
  const [timeframe, setTimeframe] = useState("day"); // Default timeframe
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState({ start: null, end: null });

  const paymentOptions = ["CASH", "BANK", "EasyPaisa", "JazzCash"];

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const salesRef = collection(db, "sales");
      const now = new Date();
      let startDate;

      if (timeframe === "day") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timeframe === "week") {
        const startOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
      } else if (timeframe === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeframe === "custom" && customDate.start && customDate.end) {
        startDate = new Date(customDate.start);
      }

      const filters = [where("paymentType", "==", selectedPayment)];
      if (startDate) {
        filters.push(where("date", ">=", startDate));
      }
      if (timeframe === "custom" && customDate.end) {
        filters.push(where("date", "<=", new Date(customDate.end)));
      }

      const q = query(salesRef, ...filters);
      const querySnapshot = await getDocs(q);
      const sales = [];
      querySnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() });
      });

      setSalesData(sales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [timeframe, selectedPayment, customDate]);

  const calculateTotalAmount = () => {
    return salesData.reduce((total, sale) => total + (sale.amount || 0), 0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales by Payment Method
      </Typography>

      {/* Payment Type Dropdown */}
      <Box sx={{ marginBottom: 4 }}>
        <TextField
          select
          label="Select Payment Type"
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
          fullWidth
        >
          {paymentOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Timeframe Selection Buttons */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === "day" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setTimeframe("day")}
          >
            Day
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "week" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "month" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setTimeframe("month")}
          >
            Month
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "custom" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setTimeframe("custom")}
          >
            Custom
          </Button>
        </Grid>
      </Grid>

      {/* Custom Date Range Selection */}
      {timeframe === "custom" && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setCustomDate((prev) => ({ ...prev, start: e.target.value }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setCustomDate((prev) => ({ ...prev, end: e.target.value }))}
            />
          </Grid>
        </Grid>
      )}

      {/* Total Sales */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Sales Amount</Typography>
        <Typography variant="h4" color="secondary">
          {loading ? <CircularProgress size={24} /> : `$${calculateTotalAmount()}`}
        </Typography>
      </Paper>

      {/* Sales Table */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Sales Details
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Customer</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : salesData.length > 0 ? (
            salesData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {new Date(sale.date.seconds * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>{`$${sale.amount}`}</TableCell>
                <TableCell>{sale.customerName || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No sales data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SaleByPayment;
