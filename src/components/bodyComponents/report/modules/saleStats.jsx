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
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";

const SaleStats = () => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const salesRef = collection(db, "sales");
      const now = new Date();
      let startDate;
      let endDate = new Date();

      if (timeframe === "day") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timeframe === "week") {
        const startOfWeek = now.getDate() - now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
      } else if (timeframe === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeframe === "custom" && customDate.start && customDate.end) {
        startDate = new Date(customDate.start);
        endDate = new Date(customDate.end);
      }

      const filters = [where("date", ">=", startDate)];
      if (timeframe === "custom") {
        filters.push(where("date", "<=", endDate));
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
  }, [timeframe, customDate]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const calculateTotalSales = () => {
    return salesData.reduce((total, sale) => total + (sale.amount || 0), 0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales Statistics
      </Typography>

      {/* Buttons for Timeframe Selection */}
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
          <Button
            variant={timeframe === "week" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("week")}
          >
            Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "month" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("month")}
          >
            Month
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "custom" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("custom")}
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
              value={customDate.start}
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
              value={customDate.end}
              onChange={(e) =>
                setCustomDate((prev) => ({ ...prev, end: e.target.value }))
              }
            />
          </Grid>
        </Grid>
      )}

      {/* Display Total Sales */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Sales</Typography>
        <Typography variant="h4" color="secondary">
          {loading ? <CircularProgress size={24} /> : `$${calculateTotalSales()}`}
        </Typography>
      </Paper>

      {/* Display Sales Data in a Table */}
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
                <TableCell>{sale.paymentType}</TableCell>
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

export default SaleStats;
