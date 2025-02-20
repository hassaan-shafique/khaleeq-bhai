import React from 'react'
import { Typography, Paper, Box, Grid, Card, CardContent, CardMedia, Divider, Chip, Stack } from '@mui/material'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import BarcodeIcon from '@mui/icons-material/QrCode2'
import InventoryIcon from '@mui/icons-material/Inventory2'

const Product = ({ product }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          transition: '0.3s',
          '&:hover': { boxShadow: 6 }
        }}
      >
        <CardMedia
          component='img'
          height='160'
          image={product.kbcwImage || 'https://via.placeholder.com/150'}
          alt='Product'
          sx={{ borderRadius: 2, objectFit: 'cover', mb: 1 }}
        />

        <Typography variant='subtitle1' fontWeight='bold'>
          <BarcodeIcon fontSize='small' sx={{ mr: 1 }} />
          {product.kbcwBarcode}
        </Typography>

        <Stack direction='row' spacing={1} justifyContent='center' mt={1}>
          <Chip icon={<PriceCheckIcon />} label={`Rs ${product.kbcwPrice}`} color='success' size='small' />
          <Chip icon={<FormatSizeIcon />} label={product.kbcwSize} color='primary' size='small' />
          <Chip icon={<InventoryIcon />} label={`Qty: ${product.enteredQuantity}`} color='secondary' size='small' />
        </Stack>
      </Paper>
    </Grid>
  )
}

export default Product
