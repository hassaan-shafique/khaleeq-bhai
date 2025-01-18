import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Grid,Typography, } from "@mui/material";

const ChartComponent = ({ totalSales, totalExpenses, remainingCash, totalInHand, pendingAmount, Balance }) => {
  const salesData = [
    {
      name: "Sales vs Expenses",
      Sales: totalSales,
      Expenses: totalExpenses,
      Remaining: remainingCash,
    },
  ];

  const balanceData = [
    {
      name: "In Hand vs Expenses",
      "In Hand": totalInHand,
      Expenses: totalExpenses,
      Balance: Balance,
      Pending: pendingAmount,
    },
  ];

  return (
    <Grid container spacing={0} sx={{ marginTop: 2 }}>
      {/* First BarChart for Total Sales - Expense = Remaining Cash */}
     
      <Grid item xs={12} sm={6}>
      <Typography sx= {{textAlign: "center"}}> Completed Sales Chart</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Sales" fill="#4caf50" />
            <Bar dataKey="Expenses" fill="#f44336" />
            <Bar dataKey="Remaining" fill="#3f51b5" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>

      {/* Second BarChart for Total In Hand - Expense = Balance */}
      
      <Grid item xs={10} sm={6}>
      <Typography sx ={{ textAlign: "center" }}> Pending Sales Chart</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={balanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="In Hand" fill="#ff9800" />
            <Bar dataKey="Expenses" fill="#f44336" />
            <Bar dataKey="Balance" fill="#3f51b5" />
            <Bar dataKey="Pending" fill="#9c27b0" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default ChartComponent;
