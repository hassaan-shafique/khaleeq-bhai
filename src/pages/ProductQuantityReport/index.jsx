import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import useCollection from '/src/hooks/useCollection'
import { COLLECTIONS } from '/src/constants'
import ProductQuantityReportView from '/src/views/productQuantityReport'

const ProductQuantity = () => {
  const { data: sales, loading: salesLoading } = useCollection(COLLECTIONS.SALES)
  const { data: inventory, loading: inventoryLoading } = useCollection(COLLECTIONS.INVENTORY)

  const loading = salesLoading || inventoryLoading

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

  return <ProductQuantityReportView salesData={sales} inventoryData={inventory} />
}

export default ProductQuantity
