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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const SaleBySalesman = ({ salesData }) => {
  const [timeframe, setTimeframe] = useState("day");
  const [salesmanStats, setSalesmanStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [selectedSalesman, setSelectedSalesman] = useState("");

  const calculateStats = (data) => {
    const stats = {};
    data.forEach((sale) => {
      if (!selectedSalesman || sale.salesmanName === selectedSalesman) {
        const salesman = sale.salesmanName || "Unknown";
        if (!stats[salesman]) {
          stats[salesman] = { totalSales: 0, count: 0 };
        }
        stats[salesman].totalSales += sale.amount || 0;
        stats[salesman].count += 1;
      }
    });
    return stats;
  };

  useEffect(() => {
    setLoading(true);
    const filteredData = salesData.filter((sale) => {
      const saleDate = new Date(sale.date);
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
        const endDate = new Date(customDate.end);
        return saleDate >= startDate && saleDate <= endDate;
      }

      return saleDate >= startDate;
    });

    setSalesmanStats(calculateStats(filteredData));
    setLoading(false);
  }, [timeframe, customDate, selectedSalesman, salesData]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const topSalesman = Object.entries(salesmanStats).reduce(
    (top, [salesman, stats]) => {
      if (stats.totalSales > (top.totalSales || 0)) {
        return { salesman, ...stats };
      }
      return top;
    },
    {}
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales by Salesman
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

      {/* Salesman Dropdown */}
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <InputLabel>Select Salesman</InputLabel>
        <Select
          value={selectedSalesman}
          onChange={(e) => setSelectedSalesman(e.target.value)}
        >
          <MenuItem value="">All Salesmen</MenuItem>
          <MenuItem value="Saqlain">Saqlain</MenuItem>
          <MenuItem value="Sarfraz">Sarfraz</MenuItem>
          <MenuItem value="Khaleeq">Khaleeq</MenuItem>
        </Select>
      </FormControl>

      {/* Top Salesman */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Top Salesman</Typography>
        {loading ? (
          <CircularProgress />
        ) : topSalesman.salesman ? (
          <>
            <Typography variant="h5" color="secondary">
              {topSalesman.salesman}
            </Typography>
            <Typography>
              Sales: {topSalesman.count}, Total: ${topSalesman.totalSales}
            </Typography>
          </>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Paper>

      {/* Salesman Sales Data */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Salesman Sales Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Salesman</TableCell>
            <TableCell>Total Sales</TableCell>
            <TableCell>Number of Sales</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : Object.entries(salesmanStats).length > 0 ? (
            Object.entries(salesmanStats).map(([salesman, stats]) => (
              <TableRow key={salesman}>
                <TableCell>{salesman}</TableCell>
                <TableCell>${stats.totalSales}</TableCell>
                <TableCell>{stats.count}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default SaleBySalesman;
