import React from 'react'
import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Card'


const TotalStats = (totalInCash =0 ,totalWorth =0 , totalInJazzCash= 0) => {
     const totalInCash = calculateInCash()
      const totalInBank = calculateSalesInBank()
      const totalInHand = calculateInHandSales()
      const totalWorth = calculateTotalWorth()
      const totalInEasyPaisa = calculateSalesInEasypaisa()
      const totalInJazzCash = calculateSalesInJazzCash()
      const pendingSales= calculatePendingSales()
  return (
    <>
    <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 4 }}>
        Total Stats
      </Typography>

      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Widget label={'Total Order Worth'} value={totalWorth} size={12} />
        <Widget label={'Total Advance'} value={totalInHand} size={12} />
        <Widget label={'Total Pending Amount'} value={pendingSales} size={12} />
        <Widget label={'IN (Cash)'} value={totalInCash} size={12} />
        <Widget label={'CC (Bank)'} value={totalInBank} size={12} />
        <Widget label={'Cash in JazzCash'} value={totalInJazzCash} size={12} />
        <Widget label={'Cash in EasyPaisa'} value={totalInEasyPaisa} size={12} />
      </Grid>
    </>
  )
}

export default TotalStats
