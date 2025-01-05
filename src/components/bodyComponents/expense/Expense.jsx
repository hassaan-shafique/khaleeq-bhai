import { Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpenseFrom from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Expense = ({expenses, loading, setRefresh=()=>{}}) => {
 

  return (
    <>
      <Box sx={{ marginTop: 6, width: "100%" }}>
       
        <Grid container sx={{ mx: 4, p: 3, width: "98%" }}>
          
           <Grid item xs={12}>
          
           
            <Box
              sx={{
                margin: 3,
                bgcolor: "#FAF9F6",
                borderRadius: 2,
                padding: 3,
                width: "100%", // Ensure full width of Box
                height: "100%",
              }}
            >
              <ExpenseFrom setRefresh={setRefresh} />
              <ExpenseList expenses={expenses} loading={loading} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
