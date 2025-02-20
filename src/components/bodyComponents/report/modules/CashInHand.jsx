import React, { useState, useEffect } from 'react'
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
  Paper,
  CircularProgress
} from '@mui/material'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../../config/Firebase' // Adjust the import path if necessary
import ChartComponent from './ChartComponent'
import ShowInstallments from './showInstallments'
import InstallmentData from './installmentsData'

const CashInHand = ({ id, salesData, expenses }) => {
  const [timeframe, setTimeframe] = useState('day') // Default to "day"
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [paymentFilter, setPaymentFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [installments, setInstallments] = useState([])
  const [error, setError] = useState(null)
  const [totalInstallmentAmount, setTotalInstallmentAmount] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

  // Callback function to receive the amount from the child
  const handleTotalInstallment = amount => {
    setTotalInstallmentAmount(amount)
  }

  const userRole = localStorage.getItem('userRole')

  const fetchInstallments = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'salesInstallments'))
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setInstallments(data)
    } catch (err) {
      console.error('Error fetching installments:', err)
      setError('Failed to fetch installments.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch installments from Firebase
  useEffect(() => {
    fetchInstallments()
  }, [])

  const STATUS = {
    COMPLETED: 'Completed',
    PENDING: 'PENDING'
  }

  const isSameDay = orderDate => {
    const now = new Date()
    const saleDate = new Date(orderDate.seconds * 1000)
    return saleDate.toDateString() === now.toDateString()
  }

  const isSameWeek = orderDate => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() - 7)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    const saleDate = new Date(orderDate.seconds * 1000)
    return saleDate >= startOfWeek && saleDate <= endOfWeek
  }

  const isSameMonth = orderDate => {
    const now = new Date()
    const saleDate = new Date(orderDate.seconds * 1000)
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
  }
  const isCustom = (orderDate, startDate, endDate) => {
    const saleDate = new Date(orderDate)
    const start = new Date(startDate)
    const end = new Date(endDate)

    const result = saleDate >= start && saleDate <= end

    return result
  }

  const filterDataByTimeframe = (date, startDate, endDate) => {
    switch (timeframe) {
      case 'day':
        return isSameDay(date)
      case 'week':
        return isSameWeek(date)
      case 'month':
        return isSameMonth(date)
      case 'custom':
        const result = isCustom(date, startDate, endDate)
        return result
      default:
        return false
    }
  }

  const filterDataByTimeframee = (data, timeframe) => {
    return data.filter(item => {
      const date = new Date(item.date)
      if (timeframe === 'day') return isSameDay(date)
      if (timeframe === 'week') return isSameWeek(date)
      if (timeframe === 'month') return isSameMonth(date)
      if (timeframe === 'custom') {
        const { start, end } = customDate
        const startDate = new Date(start)
        const endDate = new Date(end)
        return date >= startDate && date <= endDate
      }
      return true
    })
  }

  const calculateTotalSales = () => {
    let totalSales = 0

    salesData.forEach(sale => {
      // Ensure sale.startDate is not null or undefined
      if (sale.startDate && sale.startDate.seconds) {
        if (
          sale.status === STATUS.COMPLETED &&
          (!paymentFilter || sale.payment === paymentFilter) // Apply payment filter
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
            totalSales += Number(sale.totalAmount) || 0 // Safeguard against invalid numbers
          }
        }
      }
    })

    return totalSales
  }

  const calculateTotalExpenses = () => {
    let totalExpenses = 0

    expenses.forEach(expense => {
      if (expense.selectedDate && expense.selectedDate.seconds) {
        const expenseDate = new Date(expense.selectedDate.seconds * 1000) // Convert Firestore timestamp
        const startDate = customDate.start ? new Date(customDate.start) : null
        const endDate = customDate.end ? new Date(customDate.end) : null

        if (endDate) {
          endDate.setHours(23, 59, 59, 999)
        }

        const withinCustomRange =
          timeframe === 'custom' && startDate && endDate && expenseDate >= startDate && expenseDate <= endDate

        if (
          (timeframe === 'day' && isSameDay(expense.selectedDate)) ||
          (timeframe === 'week' && isSameWeek(expense.selectedDate)) ||
          (timeframe === 'month' && isSameMonth(expense.selectedDate)) ||
          withinCustomRange
        ) {
          totalExpenses += Number(expense.price)
        }
      }
    })

    return totalExpenses
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

  const formatDate = date => {
    const epochTime = date
    const newDate = new Date(epochTime * 1000)
    const formattedDate = newDate.toISOString().split('T')[0]
    return formattedDate
  }

  const calculateInCash = () => {
    let totalInCash = 0
    salesData.forEach(sale => {
      if (sale.startDate && sale.startDate.seconds ) {
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
  // for completed sale
  const totalSales = calculateTotalSales()
  const totalExpenses = calculateTotalExpenses()
  const remainingCash = totalSales - totalExpenses

  // for pending sale
  const totalInHand = calculateInHandSales()
  const totalExpense = calculateTotalExpenses()
  const totalWorth = calculateTotalWorth()
  const totalInBank = calculateSalesInBank()
  const totalInCash = calculateInCash()
  const totalInEasyPaisa = calculateSalesInEasypaisa()
  const totalInJazzCash = calculateSalesInJazzCash()

  const Balance = totalInHand + installmentTotal - totalExpense

  const CashBalance = totalInCash + cashInstallmentTotal - totalExpense

  const total = totalInHand + installmentTotal

  const final = totalInCash + installmentTotal + totalInBank

  const finalCash = final - totalInBank

  const newBalance = finalCash - totalExpense

  // amount of advance and installment
  const totalCashAmount = totalInCash + cashInstallmentTotal
  const totalBankAmount = totalInBank + bankInstallmentTotal
  const totalJazzCashAmount = totalInEasyPaisa + jazzcashInstallmentTotal
  const totalEasyPaisaAmount = totalInEasyPaisa + easypaisaInstallmentTotal

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Cash In Hand
      </Typography>

      {/* Timeframe Buttons */}
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

      {/* Custom Date Range */}
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
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <InputLabel>Payment Type</InputLabel>
        <Select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
          <MenuItem value=''>All</MenuItem>
          <MenuItem value='Cash'>Cash</MenuItem>
          <MenuItem value='Bank'>Bank</MenuItem>
          <MenuItem value='JazzCash'>JazzCash</MenuItem>
          <MenuItem value='EasyPaisa'>EasyPaisa</MenuItem>
        </Select>
      </FormControl>
      {/* <Typography sx={{ fontSize: 18, textAlign: 'center' }}>Completed Sales Report </Typography> */}

      {/* Cash In Hand Summary */}

      {/* <Grid container spacing={3}>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant='h6' color='primary'>
                Total Completed Sales
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {totalSales.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                Total Expenses
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={3}
            sx={{
              backgroundColor: remainingCash >= 0 ? '#e8f5e9' : '#ffebee'
            }}
          >
            <CardContent>
              <Typography variant='h6' color={remainingCash >= 0 ? 'success.main' : 'error'}>
                Remaining Cash
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {remainingCash.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}

      {/* <Typography sx={{ fontSize: 18, textAlign: 'center' }}>Pending Sales Report </Typography> */}

      <Grid container spacing={4} sx={{ padding: 2 }}>
        {/* First Row: IN, Out, and CC */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                IN (Cash)
              </Typography>
              <Typography variant='h4' color='secondary'>
                {loading ? <CircularProgress size={24} /> : `Rs ${calculateInCash()}/-`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                Out (Total Installments)
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {installmentTotal.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                CC (Bank)
              </Typography>
              <Typography variant='h4' color='secondary'>
                {loading ? <CircularProgress size={24} /> : `Rs ${calculateSalesInBank()}/-`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Second Row: Final and FinalCash */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                Total = In + Out + CC
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {final.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                Cash = Total - CC
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {finalCash.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 4 }}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                Total Expenses
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {totalExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Third Row: NewBalance */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ backgroundColor: '#f5f5f5', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' color='error'>
                NewBalance = Cash - Expense
              </Typography>
              <Typography variant='h4' color='secondary'>
                Rs {newBalance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={7} sx={{ marginTop: 7 }}>
        {/* First Column: Total Order Worth, Total Advance, Pending Amount */}
        <Grid item xs={12} sm={6} md={4}>
          <Grid container spacing={2}>
            {/* Total Order Worth */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 10 }}>
                <Typography variant='h5' color='primary'>
                  Total Order Worth
                </Typography>
                <Typography variant='h4' color='secondary'>
                  {loading ? <CircularProgress size={24} /> : `Rs ${calculateTotalWorth()}/-`}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Advance */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 11 }}>
                <Typography variant='h6' color='primary'>
                  Total Advance
                </Typography>
                <Typography variant='h4' color='secondary'>
                  {loading ? <CircularProgress size={24} /> : `Rs ${calculateInHandSales()}/-`}
                </Typography>
              </Paper>
            </Grid>

            {/* Total Pending Amount */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 10 }}>
                <Typography variant='h6'>Total Pending Amount</Typography>
                <Typography variant='h4' color='secondary'>
                  {loading ? <CircularProgress size={24} /> : `Rs ${calculatePendingSales()}/-`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Second Column: Cash Information (Cash in Bank, Cash, JazzCash, EasyPaisa) */}
        <Grid item xs={12} sm={6} md={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant='h6' color='error'>
                    IN (Cash)
                  </Typography>
                  <Typography variant='h4' color='secondary'>
                    {loading ? <CircularProgress size={24} /> : `Rs ${calculateInCash()}/-`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Cash in Bank */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant='h6' color='error'>
                    CC (Bank)
                  </Typography>
                  <Typography variant='h4' color='secondary'>
                    {loading ? <CircularProgress size={24} /> : `Rs ${calculateSalesInBank()}/-`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Cash */}

            {/* Cash in JazzCash */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant='h6' color='error'>
                    Cash in JazzCash
                  </Typography>
                  <Typography variant='h4' color='secondary'>
                    {loading ? <CircularProgress size={24} /> : `Rs ${calculateSalesInJazzCash()}/-`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Cash in EasyPaisa */}
            <Grid item xs={12}>
              <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant='h6' color='error'>
                    Cash in EasyPaisa
                  </Typography>
                  <Typography variant='h4' color='secondary'>
                    {loading ? <CircularProgress size={24} /> : `Rs ${calculateSalesInEasypaisa()}/-`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* <p>Total Installment Amount: Rs. {totalInstallment}</p> */}
        {/* Third Column: Balance Amount and Total Expenses */}

        <Grid item xs={12} sm={6} md={5}>
          <InstallmentData
            installments={installments}
            timeframe={timeframe}
            startDate={customDate.start}
            endDate={customDate.end}
            onInstallmentCalculated={handleInstallmentTotal}
          />

          {/* <ShowInstallments
         installments={installments}
         timeframe={timeframe}
         customDate={customDate}
         onCalculateTotal={handleTotalInstallment}
        />  */}
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total Cash
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {totalCashAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total Bank Amount
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {totalBankAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total JazzCash Amount
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {totalJazzCashAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total EasyPaisa Amount
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {totalEasyPaisaAmount.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: 4 }}>
          {/* Cash Balance Card */}
          <Grid item xs={12} sm={6}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Cash Balance
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {CashBalance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ marginTop: 4 }}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total inHand = Advance + total Installment Amount
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {total.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Total Expenses */}

          <Grid item xs={12} sx={{ marginTop: 4 }}>
            <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant='h6' color='error'>
                  Total Expenses
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {totalExpenses.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Balance Amount */}
          <Grid item xs={12}>
            <Card
              elevation={3}
              sx={{
                backgroundColor: remainingCash >= 0 ? '#e8f5e9' : '#ffebee'
              }}
            >
              <CardContent>
                <Typography variant='h6' color={remainingCash >= 0 ? 'success.main' : 'error'}>
                  Balance Amount
                </Typography>
                <Typography variant='h4' color='secondary'>
                  Rs {Balance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 8 }}>
        <Grid>
          <ChartComponent
            totalSales={totalSales}
            totalExpenses={totalExpenses}
            remainingCash={remainingCash}
            totalInHand={totalInHand}
            pendingAmount={calculatePendingSales()}
            Balance={Balance}
          />
        </Grid>
      </Box>
    </Box>
  )
}

export default CashInHand
