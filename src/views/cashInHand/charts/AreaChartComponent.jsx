import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Grid, Typography } from '@mui/material'

const AreaChartComponent = ({ totalInHand, totalExpenses, Balance }) => {
  const data = [
    {
      name: 'In Hand vs Expenses',
      'In Hand': totalInHand,
      Expenses: totalExpenses,
      Balance: Balance
    }
  ]

  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ textAlign: 'center' }}> Cash Flow Overview</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Area type='monotone' dataKey='In Hand' stroke='#ff9800' fill='#ffcc80' />
          <Area type='monotone' dataKey='Expenses' stroke='#f44336' fill='#ffab91' />
          <Area type='monotone' dataKey='Balance' stroke='#3f51b5' fill='#7986cb' />
        </AreaChart>
      </ResponsiveContainer>
    </Grid>
  )
}

export default AreaChartComponent
