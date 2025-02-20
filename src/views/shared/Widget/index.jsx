import { Grid, Card, CardContent, Typography, Box } from '@mui/material'

const Widget = ({ label, value, size, md, rupees = true }) => {
  return (
    <Grid item xs={size} md={md || size} sx={{ mt: 3 }}>
      <Card
        elevation={4}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 2s ease-in-out',
          '&:hover': { boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.15)' }
        }}
      >
        <CardContent>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Typography variant='subtitle1' fontWeight={600} color='text.secondary'>
              {label}
            </Typography>
            <Typography variant='h4' fontWeight={700} color='primary'>
              {rupees && 'Rs'} {value.toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default Widget
