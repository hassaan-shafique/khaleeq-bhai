import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import SalesForm from "./SaleForm";
import SaleList from "./SaleList";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null); // To handle error in UI

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true); // Set loading to true when fetch starts
      setError(null); // Reset error before fetch
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesData = [];
        querySnapshot.forEach((doc) => {
          salesData.push({ id: doc.id, ...doc.data() });
        });

        if (salesData.length === 0) {
          setError("No sales available."); // Handle no data case
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
  }, [refresh]);

  return (
    <Box sx={{ width: "99%" }}>
      <Grid container sx={{ mx: 3, p: 3, width: "99%" }}>
        <Grid item md={12}>
          <Box
            sx={{
              margin: 3,
              bgcolor: "white",
              borderRadius: 2,
              padding: 3,
              width: "99%", // Ensure full width
            }}
          >
            {/* Show loading spinner */}
            {loading && (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            )}

            {/* Show error message if any */}
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            {!loading && !error && (
              <>
                <SalesForm setRefresh={setRefresh} />
                <SaleList sales={sales} />
               
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sales;
