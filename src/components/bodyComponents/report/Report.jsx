import React, { useEffect, useState } from "react";
import { Grid, Box, CircularProgress, Button, Table, Tab, TableCell } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Adjust path as per your project structure
import SaleStats from "./modules/saleStats";
import SaleByProduct from "./modules/saleByProduct";
import SaleByQuantity from "./modules/saleByQuantity";
import ExpenseStats from "./modules/ExpenseStats";
import CashInHand from "./modules/CashInHand";

const ReportCards = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  
  const [selectedComponent, setSelectedComponent] = useState("CashInHand");
  

 
 

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
      {/* Button to switch between components */}
    

      {/* Cash In Hand Component (Always visible) */}
      <Grid item xs={12}>
        <CashInHand   salesData={salesData} expenses={expenses} />
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={selectedComponent === "SaleStats" ? "contained" : "outlined"}
            onClick={() => setSelectedComponent("SaleStats")}
          >
          Show Detail Sales Report
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedComponent === "ExpenseStats" ? "contained" : "outlined"}
            onClick={() => setSelectedComponent("ExpenseStats")}
          >
           Show Expense Report
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedComponent === "SaleByProduct" ? "contained" : "outlined"}
            onClick={() => setSelectedComponent("SaleByProduct")}
          >
            Sale Detail Product Report
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={selectedComponent === "SaleByQuantity" ? "contained" : "outlined"}
            onClick={() => setSelectedComponent("SaleByQuantity")}
          >
            show Product Quantity Report
          </Button>
        </Grid>
      </Grid>
      

      {/* Render Selected Component */}
      <Grid container spacing={4}>
        {selectedComponent === "SaleStats" && (
          <Grid item xs={12}>
            <SaleStats salesData={salesData} />
          </Grid>
        )}
        {selectedComponent === "ExpenseStats" && (
          <Grid item xs={12}>
            <ExpenseStats expenses={expenses} />
          </Grid>
        )}
        {selectedComponent === "SaleByProduct" && (
          <Grid item xs={12}>
            <SaleByProduct salesData={salesData} />
          </Grid>
        )}
        {selectedComponent === "SaleByQuantity" && (
          <Grid item xs={12}>
            <SaleByQuantity salesData={salesData} />
          </Grid>
        )}
      </Grid>

      
    </Box>
  );
};

export default ReportCards;
