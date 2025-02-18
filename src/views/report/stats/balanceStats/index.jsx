import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Card'

const BalanceStats = (totalExpenses=0) => {
  
  const Balance = totalInHand + installmentTotal - totalExpenses
  const CashBalance = totalInCash + cashInstallmentTotal - totalExpenses
  const total = totalInHand + installmentTotal


  return (
    <>
  <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 4 }}>
        Balance Stats
      </Typography>

      <Grid container spacing={3} sx={{ marginTop: 4 }}>
        <Widget label={'Cash Balance'} value={CashBalance} size={12} sm={6} />
        <Widget label={'Total inHand = Advance + total Installment Amount'} value={total} size={12} sm={6} />
        <Widget label={' Total Expenses'} value={totalExpenses} size={12} sm={6} />
        <Widget label={'Balance Amount'} value={Balance} size={12} sm={6} md={3} />
      </Grid>
    </>
  )
}

export default BalanceStats


