import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ChartComponent = ({ totalSales, totalExpenses, remainingCash }) => {
  const data = [
    {
      name: "Amount",
      Sales: totalSales,
      Expenses: totalExpenses,
      Remaining: remainingCash,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
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
  );
};

export default ChartComponent;
