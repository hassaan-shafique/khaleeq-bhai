import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Widget'

const AdvInsAddStats = ({
  totalInCash = 0,
  totalInJazzCash = 0,
  totalInEasyPaisa = 0,
  totalInBank = 0,
  cashInstallmentTotal = 0,
  bankInstallmentTotal = 0,
  jazzcashInstallmentTotal = 0,
  easypaisaInstallmentTotal = 0
}) => {
  const STATISTICS = [
    { label: 'Total Cash', value: totalInCash + cashInstallmentTotal },
    { label: 'Total Bank Amount', value: totalInBank + bankInstallmentTotal },
    { label: 'Total JazzCash Amount', value: totalInJazzCash + jazzcashInstallmentTotal },
    { label: 'Total EasyPaisa Amount', value: totalInEasyPaisa + easypaisaInstallmentTotal }
  ]
  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 4 }}>
        Advance and Installment Addition Stats
      </Typography>

      <Grid container spacing={4} sx={{ padding: 2 }}>
        {STATISTICS.map(({ label, value }, index) => (
          <Widget key={index} label={label} value={value} size={12} sm={6} md={3} />
        ))}
      </Grid>
    </>
  )
}

export default AdvInsAddStats
