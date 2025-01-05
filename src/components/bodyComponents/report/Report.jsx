import React, { useEffect, useState } from "react";
import { Grid, Box, CircularProgress } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Adjust path as per your project structure
import SaleStats from "./modules/saleStats";

import SaleByProduct from "./modules/saleByProduct";
import SaleByQuantity from "./modules/saleByQuantity";
import ExpenseStats from "./modules/ExpenseStats";



const ReportCards = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const salesRef = collection(db, "sales");
      const querySnapshot = await getDocs(salesRef);
      const sales = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSalesData(sales);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);



  

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesCollection = collection(db, 'expenses');
        const expensesSnapshot = await getDocs(expensesCollection);
        const expensesList = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expensesList);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 14 }}>
      <Grid container spacing={4}>
        {/* First Row: SaleStats */}
        <Grid item xs={12}>
          <SaleStats salesData={salesData} />
        </Grid>

        <Grid item xs={12}>
          <ExpenseStats expenses={expenses} />
        </Grid>

       

     
        <Grid item xs={12}>
          <SaleByProduct salesData={salesData} />
        </Grid>

        
        <Grid item xs={12}>
          <SaleByQuantity salesData={salesData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportCards;
