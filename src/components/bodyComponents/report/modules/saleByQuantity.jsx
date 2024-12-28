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
  Avatar,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";

const SaleByQuantity = () => {
  const [timeframe, setTimeframe] = useState("day");
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

      const q = query(salesRef, where("date", ">=", startDate));
      if (timeframe === "custom") {
        q.push(where("date", "<=", endDate));
      }

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

  const getTotalQuantity = (productType) => {
    return salesData
      .filter((sale) => sale.productType === productType)
      .reduce((total, sale) => total + (sale.quantity || 0), 0);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales by Quantity
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

      {/* Display Total Quantity */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Quantity Sold</Typography>
        <Typography>
          <strong>KBCW Product:</strong> {getTotalQuantity("KBCW")}
        </Typography>
        <Typography>
          <strong>Glasses Product:</strong> {getTotalQuantity("Glasses")}
        </Typography>
      </Paper>

      {/* Sales Data Table */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Detailed Sales Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            {salesData.some((sale) => sale.productType === "KBCW") && (
              <>
                <TableCell>Barcode</TableCell>
                <TableCell>Image</TableCell>
              </>
            )}
            {salesData.some((sale) => sale.productType === "Glasses") && (
              <TableCell>Type</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : salesData.length > 0 ? (
            salesData.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  {new Date(sale.date.seconds * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>{sale.productType}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                {sale.productType === "KBCW" && (
                  <>
                    <TableCell>{sale.barcode}</TableCell>
                    <TableCell>
                      <Avatar src="/path/to/kbcw-image.jpg" alt="KBCW" />
                    </TableCell>
                  </>
                )}
                {sale.productType === "Glasses" && <TableCell>{sale.type}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No sales data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SaleByQuantity;
