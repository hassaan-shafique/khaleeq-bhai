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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";

const SaleByEmployee = () => {
  const [timeframe, setTimeframe] = useState("day");
  const [salesData, setSalesData] = useState([]);
  const [employeeStats, setEmployeeStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

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
      const uniqueEmployees = new Set();
      querySnapshot.forEach((doc) => {
        const sale = { id: doc.id, ...doc.data() };
        sales.push(sale);
        if (sale.employeeName) uniqueEmployees.add(sale.employeeName);
      });

      setSalesData(sales);
      setEmployees([...uniqueEmployees]);

      // Calculate employee stats
      const stats = {};
      sales.forEach((sale) => {
        if (
          !selectedEmployee ||
          sale.employeeName === selectedEmployee ||
          !sale.employeeName
        ) {
          const employee = sale.employeeName || "Unknown";
          if (!stats[employee]) {
            stats[employee] = { totalSales: 0, count: 0 };
          }
          stats[employee].totalSales += sale.amount || 0;
          stats[employee].count += 1;
        }
      });

      setEmployeeStats(stats);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [timeframe, customDate, selectedEmployee]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const topEmployee = Object.entries(employeeStats).reduce(
    (top, [employee, stats]) => {
      if (stats.totalSales > (top.totalSales || 0)) {
        return { employee, ...stats };
      }
      return top;
    },
    {}
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales by Employee
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

      {/* Employee Dropdown */}
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <InputLabel>Select Employee</InputLabel>
        <Select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <MenuItem value="">All Employees</MenuItem>
          <MenuItem value="">Ali</MenuItem>
          <MenuItem value="">Sarfraz</MenuItem>
          {employees.map((employee) => (
            <MenuItem key={employee} value={employee}>
              {employee}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Top Employee */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Top Employee</Typography>
        {loading ? (
          <CircularProgress />
        ) : topEmployee.employee ? (
          <>
            <Typography variant="h5" color="secondary">
              {topEmployee.employee}
            </Typography>
            <Typography>
              Sales: {topEmployee.count}, Total: ${topEmployee.totalSales}
            </Typography>
          </>
        ) : (
          <Typography>No data available</Typography>
        )}
      </Paper>

      {/* Employee Sales Data */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Employee Sales Data
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
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
          ) : Object.keys(employeeStats).length > 0 ? (
            Object.entries(employeeStats).map(([employee, stats]) => (
              <TableRow key={employee}>
                <TableCell>{employee}</TableCell>
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

export default SaleByEmployee;
