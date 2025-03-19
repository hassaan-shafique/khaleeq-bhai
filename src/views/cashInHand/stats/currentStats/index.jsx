import React from 'react'
import { Grid, Typography, Card, CardContent, Box } from '@mui/material'

const STAT_CARDS = [
  { label: 'Total Advance', key: 'totalAdvance', color: 'linear-gradient(135deg, #16A085,rgb(23, 185, 47))', xs: 12, sm: 6, md: 4 },
  { label: 'IN (Cash)', key: 'totalInCash', color: 'linear-gradient(135deg, #1D976C, #93F9B9)', xs: 12, sm: 6, md: 2 },
  { label: 'CC (Bank)', key: 'totalInBank', color: 'linear-gradient(135deg, #1E3C72, #2A5298)', xs: 12, sm: 6, md: 2 },
  { label: 'JazzCash', key: 'totalinJazzcash', color: 'linear-gradient(135deg, #FF758C,rgb(234, 66, 136))', xs: 12, sm: 6, md: 2 },
  { label: 'EasyPaisa', key: 'totalinEasyPaisa', color: 'linear-gradient(135deg,rgb(59, 137, 60),rgb(15, 72, 30))', xs: 12, sm: 6, md: 2 },

  {
    label: 'Out (Total Installments)',
    key: 'totalInstallment',
    color: 'linear-gradient(135deg,rgb(240, 50, 56),rgb(222, 101, 41))',
    xs: 12,
    sm: 6,
    md: 4
  },
  {
    label: 'Cash Installments',
    key: 'cashInstallmentTotal',
    color: 'linear-gradient(135deg,rgb(43, 127, 195),rgb(75, 126, 238))',
    xs: 12,
    sm: 6,
    md: 2
  },
  {
    label: 'Bank Installments',
    key: 'bankInstallmentTotal',
    color: 'linear-gradient(135deg,rgb(224, 69, 69),rgb(227, 69, 69))',
    xs: 12,
    sm: 6,
    md: 2
  },
  {
    label: 'JazzCash Installments',
    key: 'jazzcashInstallmentTotal',
    color: 'linear-gradient(135deg,rgb(89, 48, 203),rgb(131, 82, 223))',
    xs: 12,
    sm: 6,
    md: 2
  },
  {
    label: 'EasyPaisa Installments',
    key: 'easypaisaInstallmentTotal',
    color: 'linear-gradient(135deg, #F7971E, #FFD200)',
    xs: 12,
    sm: 6,
    md: 2
  },

  {
    label: 'Total = In + Out + CC',
    key: 'total',
    color: 'linear-gradient(135deg,rgb(246, 200, 49),rgb(170, 172, 98))',
    xs: 12,
    sm: 6,
    md: 6
  },
  {
    label: 'Cash = Total - CC',
    key: 'finalCash',
    color: 'linear-gradient(135deg,rgb(167, 89, 235),rgb(148, 106, 233))',
    xs: 12,
    sm: 6,
    md: 6
  },
  {
    label: 'Total Expenses',
    key: 'totalExpenses',
    color: 'linear-gradient(135deg,rgb(255, 0, 0),rgb(255, 7, 7))',
    xs: 12,
    sm: 6,
    md: 4
  },
  {
    label: 'FinalCash = Cash - Expense',
    key: 'newBalance',
    color: 'linear-gradient(135deg,rgb(66, 178, 58),rgb(45, 131, 19),rgb(85, 178, 62))',
    xs: 12,
    sm: 6,
    md: 4
  }
];


const CurrentStats = ({ totalInCash = 0, totalInBank = 0, totalinJazzcash=0,totalinEasyPaisa=0, totalExpenses = 0, installmentTotal = 0 ,cashInstallmentTotal = 0,bankInstallmentTotal = 0 , jazzcashInstallmentTotal= 0, easypaisaInstallmentTotal =0 }) => {

 
  
 const totalAdvance = totalInCash + totalInBank + totalinEasyPaisa + totalinJazzcash;
 const totalInstallment = cashInstallmentTotal + bankInstallmentTotal + jazzcashInstallmentTotal + easypaisaInstallmentTotal;
 const total = totalAdvance + totalInstallment;
 const finalCash = total - totalInBank - totalinJazzcash - totalinJazzcash -bankInstallmentTotal -jazzcashInstallmentTotal - easypaisaInstallmentTotal;
 const newBalance = finalCash - totalExpenses;


  const data = { totalInCash,totalAdvance, totalInstallment, totalInBank, totalExpenses, installmentTotal,totalinJazzcash, totalinEasyPaisa , total, finalCash, newBalance , cashInstallmentTotal , bankInstallmentTotal, jazzcashInstallmentTotal , easypaisaInstallmentTotal }

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
