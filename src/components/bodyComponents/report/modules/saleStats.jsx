import React, { useState, useEffect ,useRef} from "react";
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
  FormControl,
  InputLabel,
 MenuItem,
 Select,
 TableContainer,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const SaleStats = ({salesData}) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  // const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false)
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [saleStats, setSaleStats] = useState([])
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showChart, setShowChart] = useState(false);
  const STATUS = {
    COMPLETED : "Completed",
    PENDING: "PENDING"
  }
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2"];
   const  userRole =localStorage.getItem ("userRole");

  useEffect(() => {
    const getSalesData = () => {
      setSaleStats([])
      let sales = []
      salesData.forEach(sale => {
        if (sale.status === STATUS.COMPLETED) {
          if (
            (!paymentFilter || sale.payment === paymentFilter) && // Apply payment filter
            ((timeframe === "day" && isSameDay(sale.startDate)) ||
              (timeframe === "week" && isSameWeek(sale.startDate)) ||
              (timeframe === "month" && isSameMonth(sale.startDate)))
          ) {
            sales.push(sale);
          }
        }
      });
      setSaleStats(sales);
    };
    
    if (salesData.length) {
      getSalesData()
    }
   
  }, [timeframe, salesData, paymentFilter]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

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
  const calculatePieData = () => {
    const groupedData = {};

    saleStats.forEach((sale) => {
      const salesman = sale.salesman || "Unknown";
      if (!groupedData[salesman]) {
        groupedData[salesman] = 0;
      }
      groupedData[salesman] += sale.totalAmount;
    });

    return Object.keys(groupedData).map((salesman) => ({
      name: salesman,
      value: groupedData[salesman],
    }));
  };
  

  const pieData = calculatePieData();
  const printRef = useRef(null);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank");

    newWindow.document.open();
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            /* Print-specific styles */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              table {
                width: 100%;
              }
              th, td {
                font-size: 14px;
                padding: 6px;
              }
            }
          </style>
        </head>
        <body>
          <div>
            ${printContents}
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
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
  



  // Helper function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(
      timestamp.seconds ? timestamp.seconds * 1000 : timestamp
    );
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    // Format as "DD/MM/YYYY"
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Invalid Date";
  }
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
            color="primary"
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


      {/* Display Total Sales */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Sales</Typography>
        <Typography variant="h4" color="secondary">
          {loading ? <CircularProgress size={24} /> : `Rs ${calculateTotalSales()}/-`}
        </Typography>
      </Paper>

      {/* Display Sales Data in a Table */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Detailed Sales Data
      </Typography>
      
<div ref={printRef}> 
<TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
<div style={{ display: "flex", justifyContent: "flex-end",  }}>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print Table
        </Button>
      </div>
  <Table >
  
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
            Amount
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
            Payment Type
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight="bold">
           Salesman
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
   
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={3} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : saleStats.length > 0 ? (
        saleStats.map( (sale,index) =>
          sale.totalAmount ? (
            <TableRow
              key={sale.id}
           
              hover
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            >
              <TableCell>
            <Typography variant="body2">{index + 1}</Typography>
          </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatTimestamp(sale.startDate)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="secondary">
                  Rs {sale.totalAmount}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{sale.payment}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{sale.salesman}</Typography>
              </TableCell>
              
             
            </TableRow>
          ) : null
        )
      ) : (
        <TableRow>
          <TableCell colSpan={3} align="center">
            <Typography variant="body2" color="textSecondary">
              No sales data available.
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table> 
  
</TableContainer>
</div>


  <Typography variant="h6" gutterBottom>
    Sales by Salesman
  </Typography>
  <Paper elevation={9} sx={{ padding: 2, marginBottom: 4 }}>
  {/* Calculate and Display the Top Salesman */}
  {pieData.length > 0 && (
    <Typography variant="h6" color="black" sx={{ marginBottom: 2 }}>
      <strong>Top Salesman:</strong>
     <Typography variant="h6">
     <strong>
        {pieData.reduce((max, entry) =>
          entry.value > max.value ? entry : max
        ).name}
      </strong>{" "}
    
      with Rs{" "}
      {pieData.reduce((max, entry) =>
        entry.value > max.value ? entry : max
      ).value}
    </Typography>
    </Typography>
  )}

  <ResponsiveContainer width="70%" height={400}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label={(entry) => `${entry.name}: Rs ${entry.value}`}
      >
        {pieData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
 </Paper>


 </Box>
  );
};

export default SaleStats;
