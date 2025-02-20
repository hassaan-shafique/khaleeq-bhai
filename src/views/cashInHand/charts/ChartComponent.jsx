import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Grid, Typography } from '@mui/material'

const ChartComponent = ({  
  totalExpenses = 0,  
  totalInCash = 0,
  totalInBank = 0,  
  installmentTotal = 0 
}) => {
 
  const balanceData = [
    {
      name: 'Finance Overview',  
      Expenses: totalExpenses,
      Cash: totalInCash,
      Bank: totalInBank,
      Installments: installmentTotal,  
    }
  ]

  return (
    <Grid container spacing={0} sx={{ marginTop: 20, justifyContent: 'center' }}>
      <Grid item xs={12} sm={10}>
        <Typography sx={{ textAlign: 'center' }}>Sales Chart</Typography>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={balanceData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />  {/* ✅ Fixed missing name issue */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='Cash' fill='#6DBF98 ' />
            <Bar dataKey='Installments' fill='#FDD835' /> 
            <Bar dataKey='Bank' fill='#64B5F6 ' />
            <Bar dataKey='Expenses' fill='#D32F2F' />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  )
}

export default ChartComponent
