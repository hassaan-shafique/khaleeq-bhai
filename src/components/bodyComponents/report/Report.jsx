import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Sales from "../sale/Sales";
import ExpenseReportCard from "./reportExpense";
const ReportCards = ({expenses=[]}) => {
  // Example data for each card
 

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <ExpenseReportCard />
        </Grid>
      </Grid>

      <Sales />
    
     
    </Box>
  );
};

export default ReportCards;
