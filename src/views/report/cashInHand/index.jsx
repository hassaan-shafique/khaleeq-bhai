import React, { useState } from 'react'
import { Grid, Typography, Box, Button, TextField, ButtonGroup } from '@mui/material'

import { isSameDay, isSameMonth, isSameWeek } from '/src/utils/dateUtils'
import { calculateTotalExpenses } from '/src/utils/expensesUtils'
import InstallmentData from './../stats/installmentData'
import CurrentStats from '../stats/currentStats'
import TotalStats from '../stats/totalStats'
import AdvInsAddStats from '../stats/advInsAddStats'
import BalanceStats from '../stats/balanceStats'
import useSaleDate from '../../../hooks/useSaleDate'
import Charts from '../charts'

const CashInHand = ({ salesData, expenses, installments }) => {
  const userRole = localStorage.getItem('userRole')
  const [timeframe, setTimeframe] = useState('day')
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [installmentTotal, setInstallmentTotal] = useState(0)
  const [cashInstallmentTotal, setCashInstallmentTotal] = useState(0)
  const [bankInstallmentTotal, setBankInstallmentTotal] = useState(0)
  const [jazzcashInstallmentTotal, setJazzcashInstallmentTotal] = useState(0)
  const [easypaisaInstallmentTotal, setEasypaisaInstallmentTotal] = useState(0)

  const handleInstallmentTotal = (install, cash, bank, jazzcash, easypaisa) => {
    setInstallmentTotal(install)
    setCashInstallmentTotal(cash)
    setBankInstallmentTotal(bank)
    setJazzcashInstallmentTotal(jazzcash)
    setEasypaisaInstallmentTotal(easypaisa)
  }

  const calculateSales = (filter, params) => {
    if (!salesData || salesData.length === 0) return 0

    return salesData.reduce((totalSales, sale) => {
      const { saleDate, startDate, endDate } = useSaleDate(customDate, sale)
      const withinCustomRange =
        timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

      const matchesTimeframe =
        timeframe === 'day'
          ? isSameDay(sale.startDate)
          : timeframe === 'week'
          ? isSameWeek(sale.startDate)
          : timeframe === 'month'
          ? isSameMonth(sale.startDate)
          : withinCustomRange

      const matchesFilter = !filter || sale.payment?.trim() === filter

      if (matchesTimeframe && matchesFilter) {
        const amount =
          params === 'advance'
            ? Number(sale.advance || 0)
            : params === 'total'
            ? Number(sale.totalAmount || 0)
            : params === 'pending'
            ? Number(sale.pendingAmount || 0)
            : 0

        return totalSales + amount
      }

      return totalSales
    }, 0)
  }

  const totalInHand = calculateSales('', 'advance')
  const totalInCash = calculateSales('Cash', 'advance')
  const totalInBank = calculateSales('Bank', 'advance')
  const totalInJazzCash = calculateSales('JazzCash', 'advance')
  const totalInEasyPaisa = calculateSales('EasyPaisa', 'advance')

  const totalWorth = calculateSales('', 'total')
  const totalSales = calculateSales('', 'total')
  const pendingSales = calculateSales('', 'pending')
  const totalExpenses = calculateTotalExpenses(expenses, customDate, timeframe)
  const remainingCash = totalSales - totalExpenses
  const Balance = totalInHand + installmentTotal - totalExpenses

  return (
    <Box sx={{ padding: 4, bgcolor: 'background.default', borderRadius: 2 }}>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 4, mt: 4, color: '#333' }}>
        📊 Cash In Hand Overview
      </Typography>

      {/* Timeframe Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ButtonGroup variant='outlined'>
          <Button variant={timeframe === 'day' ? 'contained' : 'outlined'} onClick={() => setTimeframe('day')}>
            Day
          </Button>
          {userRole === 'admin' && (
            <>
              <Button variant={timeframe === 'week' ? 'contained' : 'outlined'} onClick={() => setTimeframe('week')}>
                Week
              </Button>
              <Button variant={timeframe === 'month' ? 'contained' : 'outlined'} onClick={() => setTimeframe('month')}>
                Month
              </Button>
              <Button
                variant={timeframe === 'custom' ? 'contained' : 'outlined'}
                onClick={() => setTimeframe('custom')}
              >
                Custom
              </Button>
            </>
          )}
        </ButtonGroup>
      </Box>

      {timeframe === 'custom' && (
        <Grid container spacing={2} sx={{ padding: 2, mb: 4 }}>
          <Grid item xs={6}>
            <TextField
              label='Start Date'
              type='date'
              fullWidth
              value={customDate.start}
              onChange={e => setCustomDate({ ...customDate, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='End Date'
              type='date'
              fullWidth
              value={customDate.end}
              onChange={e => setCustomDate({ ...customDate, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      )}

      {/* Stats Display */}

      <CurrentStats
        totalInCash={totalInCash}
        totalInBank={totalInBank}
        totalExpenses={totalExpenses}
        installmentTotal={installmentTotal}
      />

      <Charts
        totalSales={totalSales}
        totalExpenses={totalExpenses}
        totalInHand={totalInHand}
        pendingAmount={pendingSales}
        remainingCash={remainingCash}
        Balance={Balance}
      />

      <TotalStats
        totalWorth={totalWorth}
        totalInHand={totalInHand}
        pendingSales={pendingSales}
        totalInCash={totalInCash}
        totalInBank={totalInBank}
        totalInJazzCash={totalInJazzCash}
        totalInEasyPaisa={totalInEasyPaisa}
      />

      <InstallmentData
        installments={installments}
        timeframe={timeframe}
        startDate={customDate.start}
        endDate={customDate.end}
        onInstallmentCalculated={handleInstallmentTotal}
      />

      <AdvInsAddStats
        totalInCash={totalInCash}
        totalInBank={totalInBank}
        totalInJazzCash={totalInJazzCash}
        totalInEasyPaisa={totalInEasyPaisa}
        cashInstallmentTotal={cashInstallmentTotal}
        bankInstallmentTotal={bankInstallmentTotal}
        jazzcashInstallmentTotal={jazzcashInstallmentTotal}
        easypaisaInstallmentTotal={easypaisaInstallmentTotal}
      />

      <BalanceStats
        totalExpenses={totalExpenses}
        totalInHand={totalInHand}
        installmentTotal={installmentTotal}
        totalInCash={totalInCash}
        cashInstallmentTotal={cashInstallmentTotal}
      />
    </Box>
  )
}

export default CashInHand
