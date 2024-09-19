import React from 'react'
import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button } from "@mui/material";
import GlassesFrom from './GlassesFrom'
import GlassesList from './glassesList';
import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Revenue = () => {
    const [glasses, setGlasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
     useEffect(() => {
       const fetchExpenses = async () => {
         try {
           const querySnapshot = await getDocs(collection(db, "glasses"));
           const glassesData = [];
           querySnapshot.forEach((doc) => {
             glassesData.push({ id: doc.id, ...doc.data() });
           });
           setGlasses(glassesData);
           setLoading(false);
         } catch (error) {
           console.error("Error fetching glasses: ", error);
           setLoading(false);
         }
       };
       fetchExpenses();
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
              <GlassesFrom setRefresh={setRefresh} />
              <GlassesList glasses={glasses} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Revenue;
