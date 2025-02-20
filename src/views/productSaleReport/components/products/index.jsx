import React from 'react'
import { Typography, Box, Grid, Card, CardContent, CardMedia, Divider, Chip, Stack } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Product from '../product'

const Products = ({ label, products }) => {
  return (
    <>
      {products?.length > 0 && (
        <>
          <Typography variant='h6' fontWeight='bold' color='#1976d2' gutterBottom>
            <ShoppingCartIcon fontSize='small' sx={{ mr: 1 }} />
            {label}
          </Typography>
          <Grid container spacing={2}>
            {products.map(product => (
              <Product product={product} />
            ))}
          </Grid>
        </>
      )}
    </>
  )
}

export default Products
