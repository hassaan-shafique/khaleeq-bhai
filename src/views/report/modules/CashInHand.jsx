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
import { STATUS } from '../../../constants'
import { isSameDay, isSameMonth, isSameWeek, formatDate } from '/src/utils/dateUtils'
import { calculateTotalExpenses } from '/src/utils/expensesUtils'
import Widget from '/src/views/shared/Card'

import CurrentStats from '../stats/currentStats'
import TotalStats from '../stats/totalStats'
import AdvInsAddStats from '../stats/advInsAddStats'
import BalanceStats from '../stats/balanceStats'

const CashInHand = ({ salesData, expenses, installments }) => {
  const userRole = localStorage.getItem('userRole')

  const [timeframe, setTimeframe] = useState('day')
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [paymentFilter, setPaymentFilter] = useState('')
  const [installmentTotal, setInstallmentTotal] = useState(0)
  const [cashInstallmentTotal, setCashInstallmentTotal] = useState(0)
  const [bankInstallmentTotal, setBankInstallmentTotal] = useState(0)
  const [jazzcashInstallmentTotal, setJazzcashInstallmentTotal] = useState(0)
  const [easypaisaInstallmentTotal, setEasypaisaInstallmentTotal] = useState(0)

  //   -----

  const handleInstallmentTotal = (install, cash, bank, jazzcash, easypaisa) => {
    setInstallmentTotal(install)
    setCashInstallmentTotal(cash)
    setBankInstallmentTotal(bank)
    setJazzcashInstallmentTotal(jazzcash)
    setEasypaisaInstallmentTotal(easypaisa)
  }

  const calculateTotalSales = () => {
    let totalSales = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        if (sale.status === STATUS.COMPLETED) {
          const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
          const startDate = customDate.start ? new Date(customDate.start) : null
          const endDate = customDate.end ? new Date(customDate.end) : null

          // Ensure the end date includes the entire day
          if (endDate) {
            endDate.setHours(23, 59, 59, 999)
          }

          const withinCustomRange =
            timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

          if (
            (timeframe === 'day' && isSameDay(sale.startDate)) ||
            (timeframe === 'week' && isSameWeek(sale.startDate)) ||
            (timeframe === 'month' && isSameMonth(sale.startDate)) ||
            withinCustomRange
          ) {
            totalSales += Number(sale.totalAmount) || 0 // Safeguard against invalid numbers
          }
        }
      }
    })

    return totalSales
  }

  const calculateInHandSales = () => {
    if (!salesData || salesData.length === 0) return 0

    let totalInHand = 0

    salesData.forEach(sale => {
      // Skip invalid or missing data
      if (!sale.startDate?.seconds) return

      const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
      const startDate = customDate.start ? new Date(customDate.start) : null
      const endDate = customDate.end ? new Date(customDate.end) : null

      // Handle edge case for same-day selection in custom timeframe
      if (startDate && endDate && startDate.toDateString() === endDate.toDateString()) {
        endDate.setHours(23, 59, 59, 999) // Extend the end date to cover the entire day
      }

      // Ensure consistency by converting all dates to UTC
      const saleDateUTC = new Date(saleDate.toISOString())
      const startDateUTC = startDate ? new Date(startDate.toISOString()) : null
      const endDateUTC = endDate ? new Date(endDate.toISOString()) : null

      // Check if the sale matches the selected payment filter
      const matchesPaymentFilter = !paymentFilter || sale.payment === paymentFilter

      // Check if the sale falls within the custom date range
      const withinCustomRange =
        timeframe === 'custom' && startDateUTC && endDateUTC && saleDateUTC >= startDateUTC && saleDateUTC <= endDateUTC

      // Check if the sale falls within the selected timeframe
      const matchesTimeframe =
        (timeframe === 'day' && isSameDay(sale.startDate)) ||
        (timeframe === 'week' && isSameWeek(sale.startDate)) ||
        (timeframe === 'month' && isSameMonth(sale.startDate)) ||
        withinCustomRange

      // Add the sale advance to the total if all conditions are met
      if (matchesPaymentFilter && matchesTimeframe) {
        totalInHand += Number(sale.advance)
      }
    })

    return totalInHand
  }

  const calculateTotalWorth = () => {
    if (!salesData || salesData.length === 0) return 0

    let totalWorth = 0

    salesData.forEach(sale => {
      // Skip invalid or missing data
      if (!sale.startDate?.seconds) return

      // Convert Firestore timestamp to a Date object
      const saleDate = new Date(sale.startDate.seconds * 1000)
      const startDate = customDate.start ? new Date(customDate.start) : null
      const endDate = customDate.end ? new Date(customDate.end) : null

      // Handle same-day selection for custom timeframe
      if (startDate && endDate && startDate.toDateString() === endDate.toDateString()) {
        endDate.setHours(23, 59, 59, 999) // Extend the end date to include the entire day
      }

      // Adjust dates to UTC for consistent comparisons
      const saleDateUTC = new Date(saleDate.toISOString())
      const startDateUTC = startDate ? new Date(startDate.toISOString()) : null
      const endDateUTC = endDate ? new Date(endDate.toISOString()) : null

      // Debugging: Log important values

      // Check if the sale falls within the custom date range
      const withinCustomRange =
        timeframe === 'custom' && startDateUTC && endDateUTC && saleDateUTC >= startDateUTC && saleDateUTC <= endDateUTC

      // Check if the sale matches the selected timeframe
      const matchesTimeframe =
        (timeframe === 'day' && isSameDay(sale.startDate)) ||
        (timeframe === 'week' && isSameWeek(sale.startDate)) ||
        (timeframe === 'month' && isSameMonth(sale.startDate)) ||
        withinCustomRange

      // Add the sale's totalAmount to the total worth if it matches all conditions
      if (matchesTimeframe && (!paymentFilter || sale.payment === paymentFilter)) {
        totalWorth += Number(sale.totalAmount)
      }
    })

    return totalWorth
  }

  const calculateInCash = () => {
    let totalInCash = 0
    salesData.forEach(sale => {
      if (sale.startDate && sale.startDate.seconds) {
        const saleDate = formatDate(sale.startDate.seconds)
        const { start, end } = customDate
        const withinCustomRange = timeframe === 'custom' && start && end && saleDate >= start && saleDate <= end
        if (
          (timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)) ||
          withinCustomRange
        ) {
          if (sale.payment && sale.payment.trim() === 'Cash') {
            totalInCash += Number(sale.advance)
          }
        }
      }
    })
    return totalInCash
  }

  const calculateSalesInBank = () => {
    let totalInBank = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
        const startDate = customDate.start ? new Date(customDate.start) : null
        const endDate = customDate.end ? new Date(customDate.end) : null

        // Ensure the start date begins at 00:00:00 and the end date includes the full day
        if (startDate) startDate.setHours(0, 0, 0, 0)
        if (endDate) endDate.setHours(23, 59, 59, 999)

        const withinCustomRange =
          timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

        if (
          (timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)) ||
          withinCustomRange
        ) {
          if (sale.payment && sale.payment.trim() === 'Bank') {
            totalInBank += Number(sale.advance)
          }
        }
      }
    })

    return totalInBank
  }

  const calculateSalesInJazzCash = () => {
    let totalInJazzCash = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
        const startDate = customDate.start ? new Date(customDate.start) : null
        const endDate = customDate.end ? new Date(customDate.end) : null

        // Ensure the end date includes the entire day
        if (startDate) startDate.setHours(0, 0, 0, 0)
        if (endDate) endDate.setHours(23, 59, 59, 999)

        const withinCustomRange =
          timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

        if (
          (timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)) ||
          withinCustomRange
        ) {
          if (sale.payment && sale.payment.trim() === 'JazzCash') {
            totalInJazzCash += Number(sale.advance)
          }
        }
      }
    })

    return totalInJazzCash
  }

  const calculateSalesInEasypaisa = () => {
    let totalInEasyPaisa = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
        const startDate = customDate.start ? new Date(customDate.start) : null
        const endDate = customDate.end ? new Date(customDate.end) : null

        // Ensure the end date includes the entire day
        if (startDate) startDate.setHours(0, 0, 0, 0)
        if (endDate) endDate.setHours(23, 59, 59, 999)

        const withinCustomRange =
          timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

        if (
          (timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)) ||
          withinCustomRange
        ) {
          if (sale.payment && sale.payment.trim() === 'EasyPaisa') {
            totalInEasyPaisa += Number(sale.advance)
          }
        }
      }
    })

    return totalInEasyPaisa
  }

  const calculatePendingSales = () => {
    let totalPending = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        if (
          !paymentFilter ||
          sale.payment === paymentFilter // Apply payment filter
        ) {
          const saleDate = new Date(sale.startDate.seconds * 1000) // Convert Firestore timestamp
          const startDate = customDate.start ? new Date(customDate.start) : null
          const endDate = customDate.end ? new Date(customDate.end) : null

          // Ensure the end date includes the entire day
          if (endDate) {
            endDate.setHours(23, 59, 59, 999)
          }

          const withinCustomRange =
            timeframe === 'custom' && startDate && endDate && saleDate >= startDate && saleDate <= endDate

          if (
            (timeframe === 'day' && isSameDay(sale.startDate)) ||
            (timeframe === 'week' && isSameWeek(sale.startDate)) ||
            (timeframe === 'month' && isSameMonth(sale.startDate)) ||
            withinCustomRange
          ) {
            totalPending += Number(sale.pendingAmount)
          }
        }
      }
    })

    return totalPending
  }

  //   ----------------

  const totalInCash = calculateInCash()
  const totalInBank = calculateSalesInBank()
  const totalExpenses = calculateTotalExpenses(expenses, customDate, timeframe)

  const totalWorth = calculateTotalWorth()
  const totalInHand = calculateInHandSales()
  const pendingSales = calculatePendingSales()
  const totalInJazzCash = calculateSalesInJazzCash()
  const totalInEasyPaisa = calculateSalesInEasypaisa()

  const totalSales = calculateTotalSales()

  //   ----------------

  const remainingCash = totalSales - totalExpenses
  const Balance = totalInHand + installmentTotal - totalExpenses


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
