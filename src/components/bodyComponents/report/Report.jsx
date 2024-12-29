import React, { useEffect, useState } from "react";
import { Grid, Box, CircularProgress } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Adjust path as per your project structure
import SaleStats from "./modules/saleStats";
import SaleByPayment from "./modules/saleByPayment";
import SaleByProduct from "./modules/saleByProduct";
import SaleByQuantity from "./modules/saleByQuantity";
import SaleBySalesman from "./modules/saleBySalesman";

const ReportCards = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        {/* Second Row: SaleByPayment and SaleByEmployee */}
        <Grid item xs={12} md={6}>
          <SaleByPayment salesData={salesData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SaleBySalesman salesData={salesData} />
        </Grid>

        {/* Third Row: SaleByProduct */}
        <Grid item xs={12}>
          <SaleByProduct salesData={salesData} />
        </Grid>

        {/* Fourth Row: SaleByQuantity */}
        <Grid item xs={12}>
          <SaleByQuantity salesData={salesData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportCards;
