import React from "react";
import { useState, useEffect } from "react";
import { Grid, Box, Typography, Button } from "@mui/material";

import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";
import SalesForm from "./SaleForm";
import SaleList from "./SaleList";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sales"));
        const salesData = [];
        querySnapshot.forEach((doc) => {
          salesData.push({ id: doc.id, ...doc.data() });
        });
        setSales(salesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Sales: ", error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, [refresh]);
  return (
    <>
      <Box>
        <Grid container sx={{ mx: 3, p: 3 }}>
          <Grid item md={9}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
              <SalesForm setRefresh={setRefresh} />
            <SaleList sales={sales}/>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Sales;
