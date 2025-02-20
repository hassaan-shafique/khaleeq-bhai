import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import useCollection from '/src/hooks/useCollection'
import { COLLECTIONS } from '/src/constants'
import ProductSaleReportView from '/src/views/productSaleReport'

const ProductSaleReport = () => {
  const { data: sales, loading } = useCollection(COLLECTIONS.SALES)

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <ProductSaleReportView salesData={sales} />
}

export default ProductSaleReport
