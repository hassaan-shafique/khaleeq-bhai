import { Grid, Box, Typography, Button } from "@mui/material";
import React from "react";
import ExpenseFrom from "./ExpenseForm"




const Expense = () => {
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
           

              <ExpenseFrom/>
            </Box>
       
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
