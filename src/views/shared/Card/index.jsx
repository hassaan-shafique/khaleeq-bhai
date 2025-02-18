import { Grid, Card, CardContent, Typography } from '@mui/material'

const Widget = ({ label, value, size, md }) => {
  return (
    <Grid item xs={size} md={md ? md : size} sx={{ marginTop: 4 }}>
      <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Typography variant='h6' color='error'>
            {label}
          </Typography>
          <Typography variant='h4' color='secondary'>
            Rs {value.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default Widget
