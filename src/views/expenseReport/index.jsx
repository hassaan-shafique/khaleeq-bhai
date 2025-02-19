import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TableContainer,
  TextField
} from '@mui/material'
import Widget from '../shared/Widget'
import { formatDateDisplay } from '../../utils/dateUtils'

const ExpenseReportView = ({ expenses }) => {
  const [timeframe, setTimeframe] = useState('day') // Default to "day"
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [filteredExpenses, setFilteredExpenses] = useState([]) // Filtered expense list
  const [loading, setLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const printRef = useRef(null)
  const userRole = localStorage.getItem('userRole')

  // Filter expenses based on the selected timeframe
  useEffect(() => {
    const filterExpenses = () => {
      const now = new Date()
      let filtered = []

      expenses.forEach(expense => {
        const expenseDate = new Date(expense.selectedDate.seconds * 1000)
        let isValidExpense = false

        // Handle custom date range logic
        if (timeframe === 'custom' && customDate.start && customDate.end) {
          const selectedStartDate = new Date(customDate.start)
          const selectedEndDate = new Date(customDate.end)

          // Normalize times for accurate comparisons
          selectedStartDate.setHours(0, 0, 0, 0)
          selectedEndDate.setHours(23, 59, 59, 999) // Full end day (till 23:59:59.999)

          // Check if expense date is within the custom range
          isValidExpense = expenseDate >= selectedStartDate && expenseDate <= selectedEndDate
        }
        // Handle predefined timeframes (day, week, month)
        else if (
          (timeframe === 'day' && isSameDay(expenseDate, now)) ||
          (timeframe === 'week' && isSameWeek(expenseDate, now)) ||
          (timeframe === 'month' && isSameMonth(expenseDate, now))
        ) {
          isValidExpense = true
        }

        if (isValidExpense) {
          filtered.push(expense)
        }
      })

      setFilteredExpenses(filtered)
    }

    if (expenses.length > 0) {
      setLoading(true)
      filterExpenses()
      setLoading(false)
    }
  }, [timeframe, expenses, customDate])

  const calculateTotalPrice = (expenses, timeframe, customDate) => {
    const now = new Date()
    let total = 0

    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.selectedDate.seconds * 1000)
      let isValidExpense = false

      if (timeframe === 'day') {
        isValidExpense = isSameDay(expenseDate, now)
      } else if (timeframe === 'week') {
        isValidExpense = isSameWeek(expenseDate, now)
      } else if (timeframe === 'month') {
        isValidExpense = isSameMonth(expenseDate, now)
      } else if (timeframe === 'custom' && customDate.start && customDate.end) {
        const selectedStartDate = new Date(customDate.start)
        const selectedEndDate = new Date(customDate.end)

        // Normalize times to midnight for both start and end dates for precise comparison
        selectedStartDate.setHours(0, 0, 0, 0)
        selectedEndDate.setHours(23, 59, 59, 999) // Full end day (till 23:59:59.999)

        // Check if the expense date is within the custom range
        isValidExpense = expenseDate >= selectedStartDate && expenseDate <= selectedEndDate
      }

      return isValidExpense
    })

    filtered.forEach(expense => {
      total += parseFloat(expense.price || 0)
    })

    setFilteredExpenses(filtered)
    return total
  }

  useEffect(() => {
    setLoading(true)
    const total = calculateTotalPrice(expenses, timeframe, customDate)
    setTotalPrice(total)
    setLoading(false)
  }, [expenses, timeframe, customDate])

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const isSameWeek = (date1, date2) => {
    const startOfWeek = new Date(date2)
    startOfWeek.setDate(date2.getDate() - date2.getDay() - 7)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    return date1 >= startOfWeek && date1 <= endOfWeek
  }

  const isSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }

  const handlePrint = () => {
    // Clone the printRef content to a new window for printing
    const printContents = printRef.current.innerHTML
    const newWindow = window.open('', '_blank')

    // Write the content to the new window
    newWindow.document.open()
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print</title>
          <style>
            /* Styling for the heading */
            h1 {
              text-align: center;
              font-size: 24px;
              margin-bottom: 20px;
            }

            /* Ensure the table fits on the page */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            /* Styling for large tables */
            .print-container {
              overflow: visible !important; /* Ensure all content is visible */
            }
          </style>
        </head>
        <body>
          <!-- Add a title to the print view -->
          <h1>Sales Data</h1>

          <!-- Insert the content to be printed (table data) -->
          <div class="print-container">
            ${printContents}
          </div>
        </body>
      </html>
    `)
    newWindow.document.close()
    newWindow.print()
    newWindow.close()
  }

  return (
    <Box sx={{ padding: 4, marginTop: 20, height: '100vh' }}>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 4, mt: 4, color: '#333' }}>
        📊 Expense Stats
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        {['day', ...(userRole === 'admin' ? ['week', 'month', 'custom'] : [])].map(frame => (
          <Grid item key={frame}>
            <Button
              variant={timeframe === frame ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => setTimeframe(frame)}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </Button>
          </Grid>
        ))}
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
              InputLabelProps={{ shrink: true }} // ✅ Fix overlapping label
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='End Date'
              type='date'
              fullWidth
              value={customDate.end}
              onChange={e => setCustomDate({ ...customDate, end: e.target.value })}
              InputLabelProps={{ shrink: true }} // ✅ Fix overlapping label
            />
          </Grid>
        </Grid>
      )}

      <Widget
        label={`Total Expense (${timeframe === 'day' ? 'Today' : timeframe === 'week' ? 'This Week' : 'This Month'})`}
        value={totalPrice.toFixed(2)}
        size={12}
        md={12}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2, paddingTop: 5 }}>
        <Button onClick={handlePrint} variant='contained' color='primary'>
          Print Table
        </Button>
      </Box>
      <div ref={printRef} style={{ marginTop: 20 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxHeight: '400px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {['Sr No', 'Date', 'Expense Type', 'Price'].map(header => (
                  <TableCell key={header}>
                    <Typography variant='subtitle1' fontWeight='bold'>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense, index) => (
                  <TableRow key={expense.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>
                      <Typography variant='body2'>{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{formatDateDisplay(expense.selectedDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' color='secondary'>
                        {expense.expenseType || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>Rs {parseFloat(expense.price).toFixed(2)}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align='center'>
                    <Typography variant='body2' color='textSecondary'>
                      No expenses available for the selected timeframe.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  )
}

export default ExpenseReportView
