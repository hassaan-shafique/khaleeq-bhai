import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import Expense from "../expense/Expense"
import Sales from "../sale/Sales";
import Inventory from "../inventory/Inventory"

const ReportCards = () => {
  // Example data for each card
  const reports = [
    {
      title: "Expense",
      value: "15000 Rs.",
      description: "Total expenses this month",
    },
    {
      title: "Sales",
      value: "150000 Rs.",
      description: "Total sales this month",
    },
    {
      title: "Glasses",
      value: "250",
      description: "Total glasses sold",
    },
    {
      title: "Inventory",
      value: "200",
      description: "Total items in inventory",
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {reports.map((report, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: "#f5f5f5", textAlign: "center" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {report.title}
                </Typography>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ margin: "10px 0" }}
                >
                  {report.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {report.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Sales/>
      <Expense/>
      <Inventory/>
    </Box>
  );
};

export default ReportCards;
