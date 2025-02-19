import React from 'react'
import { Grid, Typography, Card, CardContent, Box } from '@mui/material'

const STAT_CARDS = [
  { label: 'IN (Cash)', key: 'totalInCash', color: 'linear-gradient(135deg, #4caf50, #66bb6a)', xs: 12, sm: 6, md: 4 },
  {
    label: 'Out (Total Installments)',
    key: 'installmentTotal',
    color: 'linear-gradient(135deg, #ff9800, #ffb74d)',
    xs: 12,
    sm: 6,
    md: 4
  },
  { label: 'CC (Bank)', key: 'totalInBank', color: 'linear-gradient(135deg, #3f51b5, #7986cb)', xs: 12, sm: 6, md: 4 },
  {
    label: 'Total = In + Out + CC',
    key: 'final',
    color: 'linear-gradient(135deg, #673ab7, #9575cd)',
    xs: 12,
    sm: 6,
    md: 6
  },
  {
    label: 'Cash = Total - CC',
    key: 'finalCash',
    color: 'linear-gradient(135deg, #009688, #26a69a)',
    xs: 12,
    sm: 6,
    md: 6
  },
  {
    label: 'Total Expenses',
    key: 'totalExpenses',
    color: 'linear-gradient(135deg, #f44336, #ef5350)',
    xs: 12,
    sm: 6,
    md: 4
  },
  {
    label: 'NewBalance = Cash - Expense',
    key: 'newBalance',
    color: 'linear-gradient(135deg, #ff5722, #ff7043)',
    xs: 12,
    sm: 6,
    md: 4
  }
]

const CurrentStats = ({ totalInCash = 0, totalInBank = 0, totalExpenses = 0, installmentTotal = 0 }) => {
  const final = totalInCash + installmentTotal + totalInBank
  const finalCash = final - totalInBank
  const newBalance = finalCash - totalExpenses

  const data = { totalInCash, totalInBank, totalExpenses, installmentTotal, final, finalCash, newBalance }

  return (
    <Box sx={{ mt: 5 }}>


      <Grid container spacing={3} justifyContent='center'>
        {STAT_CARDS.map(({ label, key, color, xs, sm, md }, index) => (
          <Grid item xs={xs} sm={sm} md={md} key={index}>
            <Card
              sx={{
                background: color,
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <CardContent sx={{ textAlign: 'center', p: 3, position: 'relative', zIndex: 1 }}>
                <Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {label}
                </Typography>
                <Typography variant='h6' sx={{ fontSize: '1.7rem', mt: 1, fontWeight: 'bold' }}>
                  {data[key].toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default CurrentStats
