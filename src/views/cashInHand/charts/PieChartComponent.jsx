import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Grid, Typography } from '@mui/material'

const PieChartComponent = ({ totalExpenses, remainingCash }) => {
  const data = [
    { name: 'Expenses', value: totalExpenses },
    { name: 'Remaining', value: remainingCash }
  ]

  const COLORS = ['#f44336', '#4caf50']

  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ textAlign: 'center' }}> Expenses Breakdown</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie data={data} cx='50%' cy='50%' outerRadius={100} fill='#8884d8' dataKey='value' label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Grid>
  )
}

export default PieChartComponent
