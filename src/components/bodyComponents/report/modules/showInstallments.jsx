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
} from "@mui/material";

const ShowInstallments = () => {
  const [totalInstallment, setTotalInstallment] = useState(0);
  const [cashInstallments, setCashInstallments] = useState(0);
  const [bankInstallments, setBankInstallments] = useState(0);
  const [jazzCashInstallments, setJazzCashInstallments] = useState(0);
  const [easyPaisaInstallments, setEasyPaisaInstallments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Firestore and calculate installment amounts
  const fetchInstallments = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const querySnapshot = await getDocs(collection(db, "salesInstallments"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      console.log("Fetched Data: ", data);  // Debugging fetched data

      // Calculate values based on payment method
      setTotalInstallment(calculateTotalInstallment(data));
      setCashInstallments(calculateCashInstallments(data));
      setBankInstallments(calculateBankInstallments(data));
      setJazzCashInstallments(calculateJazzCashInstallments(data));
      setEasyPaisaInstallments(calculateEasyPaisaInstallments(data));
    } catch (err) {
      console.error("Error fetching installments:", err);
      setError("Failed to fetch installments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total installment amount
  const calculateTotalInstallment = (data) => {
    return data.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
  };

// Calculate installment amount in cash
const calculateCashInstallments = (data) => {
  const cashInstallments = data.filter((installment) => installment.payment === "Cash");
  console.log("Cash Data:", cashInstallments); // Debugging
  return cashInstallments.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
};

// Calculate installment amount in bank
const calculateBankInstallments = (data) => {
  const bankInstallments = data.filter((installment) => installment.payment === "Bank");
  console.log("Bank Data:", bankInstallments); // Debugging
  return bankInstallments.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
};

// Calculate installment amount in JazzCash
const calculateJazzCashInstallments = (data) => {
  const jazzCashInstallments = data.filter((installment) => installment.payment === "JazzCash");
  console.log("JazzCash Data:", jazzCashInstallments); // Debugging
  return jazzCashInstallments.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
};

// Calculate installment amount in EasyPaisa
const calculateEasyPaisaInstallments = (data) => {
  const easyPaisaInstallments = data.filter((installment) => installment.payment === "EasyPaisa");
  console.log("EasyPaisa Data:", easyPaisaInstallments); // Debugging
  return easyPaisaInstallments.reduce((total, installment) => total + (Number(installment.amount) || 0), 0);
};


  useEffect(() => {
    fetchInstallments();
  }, []);

  return (
    <div>
 <Grid container spacing={2}>
  {/* Total Installment Amount - Top Row (increased length) */}
  <Grid item xs={12} sm={8} md={16}> {/* Increased width here */}
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

  {/* Payment Method Breakdown - First Row: Cash and Bank Installments */}
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

  {/* Second Row: JazzCash and EasyPaisa Installments */}
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
