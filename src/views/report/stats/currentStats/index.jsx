import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Card'

const CurrentStats = ({ totalInCash = 0, totalInBank = 0, totalExpenses = 0, installmentTotal = 0 }) => {
  const final = totalInCash + installmentTotal + totalInBank
  const finalCash = final - totalInBank
  const newBalance = finalCash - totalExpenses

  const WIDGETS = [
    { label: 'IN (Cash)', key: totalInCash, size: 12, md: 4 },
    { label: 'Out (Total Installments)', key: installmentTotal, size: 12, md: 4 },
    { label: 'CC (Bank)', key: totalInBank, size: 12, md: 4 },
    { label: 'Total = In + Out + CC', key: final, size: 12, md: 6 },
    { label: 'Cash = Total - CC', key: finalCash, size: 12, md: 6 },
    { label: 'Total Expenses', key: totalExpenses, size: 12 },
    { label: 'NewBalance = Cash - Expense', key: newBalance, size: 12 }
  ]

  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2 }}>
        Current Stats
      </Typography>

      <Grid container spacing={4} sx={{ padding: 2 }}>
        {WIDGETS.map(({ label, key, size, md }, index) => (
          <Widget key={index} label={label} value={key} size={size} md={md} />
        ))}
      </Grid>
    </>
  )
}

export default CurrentStats
