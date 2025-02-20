import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Grid, Typography } from '@mui/material'

const LineChartComponent = ({ totalSales, totalExpenses, remainingCash }) => {
  const data = [
    {
      name: 'Sales vs Expenses',
      Sales: totalSales,
      Expenses: totalExpenses,
      Remaining: remainingCash
    }
  ]

  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ textAlign: 'center' }}> Sales Trend Chart</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='Sales' stroke='#4caf50' strokeWidth={2} />
          <Line type='monotone' dataKey='Expenses' stroke='#f44336' strokeWidth={2} />
          <Line type='monotone' dataKey='Remaining' stroke='#3f51b5' strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  )
}

export default LineChartComponent
