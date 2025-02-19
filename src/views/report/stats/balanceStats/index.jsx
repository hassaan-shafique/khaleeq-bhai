import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Widget'

const BalanceStats = ({
  totalExpenses = 0,
  totalInHand = 0,
  installmentTotal = 0,
  totalInCash = 0,
  cashInstallmentTotal = 0
}) => {
  const Balance = totalInHand + installmentTotal - totalExpenses
  const CashBalance = totalInCash + cashInstallmentTotal - totalExpenses
  const total = totalInHand + installmentTotal

  const STATS = [
    { label: 'Cash Balance', value: CashBalance },
    { label: 'Total (Advance + Installment)', value: total },
    { label: 'Total Expenses', value: totalExpenses },
    { label: 'Balance Amount', value: Balance }
  ]

  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 2 }}>
        Balance Stats
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        {STATS.map(({ label, value }, index) => (
          <Widget key={index} label={label} value={value} size={12} sm={6} md={3} />
        ))}
      </Grid>
    </>
  )
}

export default BalanceStats
