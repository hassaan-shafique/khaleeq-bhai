import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material'

import { isSameDay, isSameMonth, isSameWeek, formatDateDisplay } from '/src/utils/dateUtils'
import Widget from '../shared/Widget'
import ProductTable from './components/productTable'

const ProductSaleReportView = ({ salesData }) => {
  const [timeframe, setTimeframe] = useState('day')
  const [loading, setLoading] = useState(false)
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [saleStats, setSaleStats] = useState([])
  const [productFilter, setProductFilter] = useState('')

  const STATUS = {
    COMPLETED: 'Completed',
    PENDING: 'PENDING'
  }
  const userRole = localStorage.getItem('userRole')

  useEffect(() => {
    const getSalesData = () => {
      setSaleStats([])
      let sales = []
      salesData.forEach(sale => {
        if (sale.status === STATUS.COMPLETED) {
          if (
            (!productFilter || sale.payment === productFilter) && // Apply payment filter
            ((timeframe === 'day' && isSameDay(sale.startDate)) ||
              (timeframe === 'week' && isSameWeek(sale.startDate)) ||
              (timeframe === 'month' && isSameMonth(sale.startDate)))
          ) {
            sales.push(sale)
          }
        }
      })
      setSaleStats(sales)
    }

    if (salesData.length) {
      getSalesData()
    }
  }, [timeframe, salesData, productFilter])

  const handleTimeframeChange = newTimeframe => {
    setTimeframe(newTimeframe)
  }

  const calculateKBCWTotal = () => {
    let total = 0
    salesData.forEach(sale => {
      if (
        sale.kbcwProducts &&
        sale.status === STATUS.COMPLETED &&
        ((timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)))
      ) {
        sale.kbcwProducts.forEach(product => {
          total += product.kbcwPrice * product.enteredQuantity
        })
      }
    })
    return total
  }

  const calculateGlassesTotal = () => {
    let total = 0
    salesData.forEach(sale => {
      if (
        sale.glassesProducts &&
        sale.status === STATUS.COMPLETED &&
        ((timeframe === 'day' && isSameDay(sale.startDate)) ||
          (timeframe === 'week' && isSameWeek(sale.startDate)) ||
          (timeframe === 'month' && isSameMonth(sale.startDate)))
      ) {
        sale.glassesProducts.forEach(product => {
          total += product.glassesPrice * product.enteredQuantity
        })
      }
    })
    return total
  }

  const printRef = useRef(null)

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
        /* Add styling for large tables */
        .print-container {
          overflow: visible !important; /* Ensure all content is visible */
        }
        /* Ensure images are visible */
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${printContents}
      </div>
      <script>
        // Ensure images are fully loaded before printing
        const images = document.querySelectorAll('img');
        const loadPromises = Array.from(images).map(img => {
          if (!img.complete) {
            return new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          return Promise.resolve();
        });

        Promise.all(loadPromises).then(() => {
          window.print();
          window.close();
        });
      </script>
    </body>
  </html>
`)
    newWindow.document.close()
  }

  return (
    <Box sx={{ padding: 4, marginTop: 20, height: '100vh' }}>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 4, mt: 4, color: '#333' }}>
        📊 KBCW Products Stats
      </Typography>

      {/* Buttons for Timeframe Selection */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
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
              color='primary'
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
          <Grid item xs={6}>
            <TextField
              label='Start Date'
              type='date'
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={customDate.start}
              onChange={e => setCustomDate(prev => ({ ...prev, start: e.target.value }))}
            />
          </Grid>
          <Grid item xs={6}>
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

      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Widget label='Total KBCW Products Sales' value={calculateKBCWTotal()} xs={12} sm={6} md={6} />
        <Widget label='Total Glasses Products Sales' value={calculateGlassesTotal()} xs={12} sm={6} md={6} />
      </Grid>

      <Grid container>
        <Grid item xs={6}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            Detailed Product Data
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handlePrint} variant='contained' color='primary'>
              Print Table
            </Button>
          </div>
        </Grid>
      </Grid>

      {loading && <CircularProgress />}

      <div ref={printRef}>
        <ProductTable saleStats={saleStats} />
      </div>
    </Box>
  )
}

export default ProductSaleReportView
