import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'

import { isSameDay, isSameMonth, isSameWeek } from '/src/utils/dateUtils'
import useSaleDate from '/src/hooks/useSaleDate'

import TotalSales from './components/totalSales'
import DetailSales from './components/detailSales'
import DetailInstallments from './components/detailInstallments'
import SalemanPieChart from './components/salemanPieChart'
import customInstallment from './components/customInstallments'
import CustomInstallments from './components/customInstallments'

const SaleStats = ({ salesData, installments }) => {
  const [timeframe, setTimeframe] = useState('day')
  const [loading, setLoading] = useState(false)
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [saleStats, setSaleStats] = useState([])
  const [paymentFilter, setPaymentFilter] = useState('')
  const userRole = localStorage.getItem('userRole')

  const getFilteredSalesData = () => {
    setSaleStats([])
    let filteredSales = []

    salesData.forEach(sale => {
      let saleDate = null

      if (sale?.startDate) {
        if (sale.startDate.seconds) {
          // Convert Firestore Timestamp to JS Date
          saleDate = new Date(sale.startDate.seconds * 1000)
        } else {
          // Convert string date ('YYYY-MM-DD') to JS Date with time reset
          saleDate = new Date(sale.startDate)
          saleDate.setHours(0, 0, 0, 0)
        }
      }

      // Convert customDate start & end to JS Dates
      const startDate = customDate?.start ? new Date(customDate.start).setHours(0, 0, 0, 0) : null
      const endDate = customDate?.end ? new Date(customDate.end).setHours(23, 59, 59, 999) : null
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

      const matchesFilter = !paymentFilter || sale.payment?.trim() === paymentFilter

      if (matchesFilter && matchesTimeframe) {
        filteredSales.push(sale)
      }
    })

    setSaleStats(filteredSales)
  }

  useEffect(() => {
    getFilteredSalesData()
  }, [timeframe, salesData, paymentFilter, customDate])

  const handleTimeframeChange = newTimeframe => {
    setTimeframe(newTimeframe)
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
            : params === 'discount'
            ? Number(sale.discount || 0)
            : 0

        return totalSales + amount
      }

      return totalSales
    }, 0)
  }

  const totalSales = calculateSales(paymentFilter, 'total')
  const totalInHand = calculateSales(paymentFilter, 'advance')
  const pendingSales = calculateSales(paymentFilter, 'pending')
  const discount = calculateSales(paymentFilter, 'discount')

  return (
    <Box sx={{ padding: 4, mt: 16 }}>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 4, mt: 4, color: '#333' }}>
        📊 Sales Details
      </Typography>

      {/* Buttons for Timeframe Selection */}
      <Grid container spacing={2} sx={{ marginBottom: 4, marginTop: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === 'day' ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => handleTimeframeChange('day')}
          >
            Day
          </Button>
        </Grid>

        <Grid item>
          {userRole === 'admin' && (
            <Button
              variant={timeframe === 'week' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => handleTimeframeChange('week')}
            >
              Week
            </Button>
          )}
        </Grid>
        <Grid item>
          {userRole === 'admin' && (
            <Button
              variant={timeframe === 'month' ? 'contained' : 'outlined'}
              color='primary'
              onClick={() => handleTimeframeChange('month')}
            >
              Month
            </Button>
          )}
        </Grid>
        <Grid item>
          {userRole === 'admin' && (
            <Button
              variant={timeframe === 'custom' ? 'contained' : 'outlined'}
              onClick={() => handleTimeframeChange('custom')}
            >
              Custom
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Custom Date Range Selection */}
      {timeframe === 'custom' && (
        <Grid container spacing={2} sx={{ marginBottom: 4 }}>
          <Grid item xs={6} md={6}>
            <TextField
              label='Start Date'
              type='date'
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customDate.start}
              onChange={e => setCustomDate(prev => ({ ...prev, start: e.target.value }))}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              label='End Date'
              type='date'
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customDate.end}
              onChange={e => setCustomDate(prev => ({ ...prev, end: e.target.value }))}
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

      <TotalSales totalSales={totalSales} totalInHand={totalInHand} discount={discount} pendingSales={pendingSales} />
      <DetailSales saleStats={saleStats} loading={loading} installments={installments} />
      <DetailInstallments saleStats={saleStats} loading={loading} installments={installments} />
      {/* <CustomInstallments saleStats={saleStats} salesData={salesData} loading={loading} installments={installments} /> */}
      <SalemanPieChart saleStats={saleStats} />
    </Box>
  )
}

export default SaleStats
