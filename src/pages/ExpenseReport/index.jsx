import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import useCollection from '/src/hooks/useCollection'
import { COLLECTIONS } from '/src/constants'
import ExpenseReportView from '/src/views/expenseReport'

const ExpenseReport = () => {
  const {
    data: expenses,
    loading: expenseLoading,
    error: expenseError,
    refetch: refetchExpenses
  } = useCollection(COLLECTIONS.EXPENSES)

  const loading = expenseLoading

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

  return <ExpenseReportView expenses={expenses} />
}

export default ExpenseReport
