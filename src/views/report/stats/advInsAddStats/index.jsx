import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Card'

const AdvInsAddStats = (totalInCash =0 ,totalInJazzCash = 0, totalInBank = 0 ,totalInEasyPaisa = 0) => {
  const totalCashAmount = totalInCash + cashInstallmentTotal
  const totalBankAmount = totalInBank + bankInstallmentTotal
  const totalJazzCashAmount = totalInJazzCash + jazzcashInstallmentTotal
  const totalEasyPaisaAmount = totalInEasyPaisa + easypaisaInstallmentTotal
  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 4 }}>
        Advance and Installment Addition Stats
      </Typography>

      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Widget label={'Total Cash'} value={totalCashAmount} size={12} sm={6} md={3} />
        <Widget label={'Total Bank Amount'} value={totalBankAmount} size={12} sm={6} md={3} />
        <Widget label={'Total JazzCash Amount'} value={totalJazzCashAmount} size={12} sm={6} md={3} />
        <Widget label={'Total EasyPaisa Amount'} value={totalEasyPaisaAmount} size={12} sm={6} md={3} />
      </Grid>
    </>
  )
}

export default AdvInsAddStats

