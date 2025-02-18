import React, { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Paper
} from '@mui/material'

import ChartComponent from './ChartComponent'
import InstallmentData from './installmentsData'
import { isSameDay, isSameMonth, isSameWeek } from '/src/utils/dateUtils'
import { calculateTotalExpenses } from '/src/utils/expensesUtils'

import CurrentStats from '../stats/currentStats'
import TotalStats from '../stats/totalStats'
import AdvInsAddStats from '../stats/advInsAddStats'
import BalanceStats from '../stats/balanceStats'
import useSaleDate from '../../../hooks/useSaleDate'

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

      // Check if sale falls within the selected timeframe
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

      // Apply filter condition only if `filter` has a value
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

  //   ----------------

  const totalInCash = calculateSales('Cash', 'advance')
  const totalInBank = calculateSales('Bank', 'advance')
  const totalInJazzCash = calculateSales('JazzCash', 'advance')
  const totalInEasyPaisa = calculateSales('EasyPaisa', 'advance')
  const totalWorth = calculateSales('', 'total')
  const totalSales = calculateSales('', 'total')
  const totalInHand = calculateSales('', 'advance')
  const pendingSales = calculateSales('', 'pending')
  const totalExpenses = calculateTotalExpenses(expenses, customDate, timeframe)
  const remainingCash = totalSales - totalExpenses
  const Balance = totalInHand + installmentTotal - totalExpenses

  //   ----------------

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Cash In Hand
      </Typography>

      {/* ----- */}

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button variant={timeframe === 'day' ? 'contained' : 'outlined'} onClick={() => setTimeframe('day')}>
            Day
          </Button>
        </Grid>
        <Grid item>
          {userRole === 'admin' && (
            <Button variant={timeframe === 'week' ? 'contained' : 'outlined'} onClick={() => setTimeframe('week')}>
              Week
            </Button>
          )}
        </Grid>
        <Grid item>
          {userRole === 'admin' && (
            <Button variant={timeframe === 'month' ? 'contained' : 'outlined'} onClick={() => setTimeframe('month')}>
              Month
            </Button>
          )}
        </Grid>
        <Grid item>
          {userRole === 'admin' && (
            <Button variant={timeframe === 'custom' ? 'contained' : 'outlined'} onClick={() => setTimeframe('custom')}>
              Custom
            </Button>
          )}
        </Grid>
      </Grid>

      {timeframe === 'custom' && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6}>
            <TextField
              label='Start Date'
              type='date'
              fullWidth
              value={customDate.start}
              onChange={e => setCustomDate({ ...customDate, start: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='End Date'
              type='date'
              fullWidth
              value={customDate.end}
              onChange={e => setCustomDate({ ...customDate, end: e.target.value })}
            />
          </Grid>
        </Grid>
      )}

      {/* ----- */}

      <CurrentStats
        totalInCash={totalInCash}
        totalInBank={totalInBank}
        totalExpenses={totalExpenses}
        installmentTotal={installmentTotal}
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

      <Box sx={{ marginTop: 8 }}>
        <Grid>
          <ChartComponent
            totalSales={totalSales}
            totalExpenses={totalExpenses}
            totalInHand={totalInHand}
            pendingAmount={pendingSales}
            remainingCash={remainingCash}
            Balance={Balance}
          />
        </Grid>
      </Box>
    </Box>
  )
}

export default CashInHand
