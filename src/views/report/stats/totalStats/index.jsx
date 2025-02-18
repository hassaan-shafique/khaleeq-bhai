import React from 'react'
import { Grid, Typography } from '@mui/material'
import Widget from '/src/views/shared/Card'

const TotalStats = ({
  totalInCash = 0,
  totalInJazzCash = 0,
  totalInEasyPaisa = 0,
  totalInBank = 0,
  totalWorth = 0,
  totalInHand = 0,
  pendingSales = 0
}) => {
  const WIDGETS = [
    { label: 'Total Order Worth', key: totalWorth, size: 12, md: 4 },
    { label: 'Total Advance', key: totalInHand, size: 12, md: 4 },
    { label: 'Total Pending Amount', key: pendingSales, size: 12, md: 4 },
    { label: 'IN (Cash)', key: totalInCash, size: 12, md: 6 },
    { label: 'CC (Bank)', key: totalInBank, size: 12, md: 6 },
    { label: 'Cash in JazzCash', key: totalInJazzCash, size: 12, md: 6 },
    { label: 'Cash in EasyPaisa', key: totalInEasyPaisa, size: 12, md: 6 }
  ]

  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', padding: 4 }}>
        Total Stats
      </Typography>

      <Grid container spacing={4} sx={{ padding: 2 }}>
        {WIDGETS.map(({ label, key, size, md }, index) => (
          <Widget key={index} label={label} value={key} size={size} md={md} />
        ))}
      </Grid>
    </>
  )
}

export default TotalStats
