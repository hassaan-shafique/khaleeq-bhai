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
  TextField,
  MenuItem,
} from "@mui/material";

const SaleByPayment = ({ salesData }) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  const [selectedPaymentType, setSelectedPaymentType] = useState("Cash");
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  const paymentOptions = ["Cash", "Bank", "JazzCash", "EasyPaisa"];

  const STATUS = { COMPLETED: "Completed" };

  const filterSales = () => {
    return salesData.filter((sale) => {
      if (sale.status === STATUS.COMPLETED && sale.payment === selectedPaymentType) {
        const saleDate = new Date(sale.startDate.seconds * 1000);
        if (timeframe === "day" && isSameDay(saleDate)) return true;
        if (timeframe === "week" && isSameWeek(saleDate)) return true;
        if (timeframe === "month" && isSameMonth(saleDate)) return true;
        if (timeframe === "custom" && isWithinCustomRange(saleDate)) return true;
      }
      return false;
    });
  };

  const calculateTotalSales = (filteredSales) => {
    return filteredSales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
  };

  const isSameDay = (saleDate) => new Date().toDateString() === saleDate.toDateString();

  const isSameWeek = (saleDate) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return saleDate >= startOfWeek && saleDate < endOfWeek;
  };

  const isSameMonth = (saleDate) => {
    const now = new Date();
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  };

  const isWithinCustomRange = (saleDate) => {
    const { start, end } = customDate;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return saleDate >= startDate && saleDate <= endDate;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredSales = filterSales();
  const totalSales = calculateTotalSales(filteredSales);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales by Payment Type
      </Typography>

      {/* Payment Type Selection */}
      <TextField
        select
        label="Select Payment Type"
        value={selectedPaymentType}
        onChange={(e) => setSelectedPaymentType(e.target.value)}
        fullWidth
        sx={{ marginBottom: 4 }}
      >
        {paymentOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      {/* Timeframe Buttons */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {["day", "week", "month", "custom"].map((tf) => (
          <Grid item key={tf}>
            <Button
              variant={timeframe === tf ? "contained" : "outlined"}
              color="primary"
              onClick={() => setTimeframe(tf)}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Custom Date Range */}
      {timeframe === "custom" && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setCustomDate((prev) => ({ ...prev, start: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setCustomDate((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </Grid>
        </Grid>
      )}

      {/* Total Sales */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Sales for {selectedPaymentType}</Typography>
        <Typography variant="h4" color="secondary">
          Rs {totalSales}/-
        </Typography>
      </Paper>

      {/* Sales Table */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Detailed Sales Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{formatTimestamp(sale.startDate)}</TableCell>
                <TableCell>{`Rs ${sale.totalAmount}`}</TableCell>
                <TableCell>{sale.payment}</TableCell>
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
