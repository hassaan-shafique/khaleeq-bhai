import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Update with your Firebase config path

const SalesReport = () => {
  const [sales, setSales] =useState ();
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSalesData = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);

    try {
      const salesRef = collection(db, "sales");
      const start = new Date(startDate);
      const end = new Date(endDate);

      const q = query(
        salesRef,
        where("date", ">=", start),
        where("date", "<=", end)
      );

      const querySnapshot = await getDocs(q);
      const sales = [];
      querySnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() });
      });

      setSalesData(sales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      alert("Failed to fetch sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (field) => {
    return salesData.reduce((acc, curr) => acc + (curr[field] || 0), 0);
  };

  const calculatePaymentTypeTotal = (paymentType) => {
    return salesData
      .filter((sale) => sale.paymentType === paymentType)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };
   useEffect(() => {
      const fetchSales = async () => {
        setLoading(true); // Set loading to true when fetch starts
        
        try {
          const querySnapshot = await getDocs(collection(db, "sales"));
          const salesData = [];
          querySnapshot.forEach((doc) => {
            salesData.push({ id: doc.id, ...doc.data() });
          });
  
          if (salesData.length === 0) {
           ; // Handle no data case
          }
          setSales(salesData);
        } catch (error) {
          console.error("Error fetching sales: ", error);
          setError("Error fetching sales data. Please try again later.");
        } finally {
          setLoading(false); // Set loading to false after fetch
        }
      };
  
      fetchSales();
    }, );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales Report
      </Typography>

      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchSalesData}
        disabled={loading || !startDate || !endDate}
      >
        {loading ? "Loading..." : "Fetch Sales Data"}
      </Button>

      {salesData.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Summary</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Total Sales</TableCell>
                <TableCell>Pending Balance</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>EasyPaisa</TableCell>
                <TableCell>JazzCash</TableCell>
                <TableCell>Cash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{calculateTotal("amount")}</TableCell>
                <TableCell>{calculateTotal("pendingBalance")}</TableCell>
                <TableCell>{calculatePaymentTypeTotal("Bank")}</TableCell>
                <TableCell>{calculatePaymentTypeTotal("EasyPaisa")}</TableCell>
                <TableCell>{calculatePaymentTypeTotal("JazzCash")}</TableCell>
                <TableCell>{calculatePaymentTypeTotal("Cash")}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" sx={{ marginTop: 4 }}>
            Detailed Sales Data
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Pending Balance</TableCell>
                <TableCell>Payment Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {new Date(sale.date.seconds * 1000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sale.amount}</TableCell>
                  <TableCell>{sale.pendingBalance}</TableCell>
                  <TableCell>{sale.paymentType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default SalesReport;
