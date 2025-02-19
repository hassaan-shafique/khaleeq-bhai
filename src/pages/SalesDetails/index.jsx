import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import useCollection from '/src/hooks/useCollection'
import { COLLECTIONS } from '/src/constants'
import SaleStats from '/src/views/saleStats'

const SalesDetails = () => {
  const {
    data: sales,
    loading: salesLoading,
    error: salesError,
    refetch: refetchSales
  } = useCollection(COLLECTIONS.SALES)
  const {
    data: expenses,
    loading: expenseLoading,
    error: expenseError,
    refetch: refetchExpenses
  } = useCollection(COLLECTIONS.EXPENSES)
  const {
    data: installments,
    loading: installmentLoading,
    error: installmentError,
    refetch: refetchInstallments
  } = useCollection(COLLECTIONS.INSTALLMENTS)

  const loading = salesLoading || expenseLoading || installmentLoading

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

  return <SaleStats salesData={sales} expenses={expenses} installments={installments} />
}

export default SalesDetails
