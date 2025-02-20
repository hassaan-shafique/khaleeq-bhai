import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import useCollection from '/src/hooks/useCollection'
import CashInHandView from '/src/views/cashInHand'
import { COLLECTIONS } from '/src/constants'

const CashInHand = () => {
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

  return <CashInHandView salesData={sales} expenses={expenses} installments={installments} />
}

export default CashInHand
