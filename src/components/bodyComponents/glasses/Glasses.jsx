import React from 'react'
import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button } from "@mui/material";
import GlassesForm from './GlassesForm'
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
          <Grid item md={12}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
                width: "98%",
                marginTop: 6, // Increased width to 98%
              }}
            >
              <GlassesForm setRefresh={setRefresh} />
              <GlassesList
                glasses={glasses}
                loading={loading}
                onEdit={setGlasses} // Pass setGlasses to handle edits
                onDelete={setGlasses} // Pass setGlasses to handle deletes
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Revenue;
