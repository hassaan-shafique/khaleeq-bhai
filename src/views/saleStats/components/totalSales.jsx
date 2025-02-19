import { Grid, Card, CardContent, Typography, Box } from '@mui/material'

const STAT_CARDS = [
  { label: 'Total Sales', key: 'totalSales', color: 'linear-gradient(135deg, #4caf50, #66bb6a)' },
  { label: 'Total Advance', key: 'totalInHand', color: 'linear-gradient(135deg, #3f51b5, #7986cb)' },
  { label: 'Total Discount', key: 'discount', color: 'linear-gradient(135deg, #ff9800, #ffb74d)' },
  { label: 'Total Pending Amount', key: 'pendingSales', color: 'linear-gradient(135deg, #f44336, #ef5350)' }
]

const TotalSales = ({ totalSales = 0, totalInHand = 0, discount = 0, pendingSales = 0 }) => {
  const data = { totalSales, totalInHand, discount, pendingSales }

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3} justifyContent='center'>
        {STAT_CARDS.map(({ label, key, color }, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
                  {data[key].toLocaleString()}/-
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default TotalSales
