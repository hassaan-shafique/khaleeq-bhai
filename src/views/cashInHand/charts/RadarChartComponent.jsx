import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Grid, Typography } from '@mui/material'

const RadarChartComponent = ({ totalSales, totalExpenses, Balance }) => {
  const data = [
    { subject: 'Sales', A: totalSales, fullMark: totalSales + totalExpenses + Balance },
    { subject: 'Expenses', A: totalExpenses, fullMark: totalSales + totalExpenses + Balance },
    { subject: 'Balance', A: Balance, fullMark: totalSales + totalExpenses + Balance }
  ]

  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ textAlign: 'center' }}> Financial Overview</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey='subject' />
          <PolarRadiusAxis />
          <Tooltip />
          <Radar name='Performance' dataKey='A' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </Grid>
  )
}

export default RadarChartComponent
