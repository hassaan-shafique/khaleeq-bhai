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
  TextField,
  TableContainer,
  Checkbox
} from '@mui/material'
import Widget from '../shared/Widget'
import ProductTable from './components/productTable'
import { isSameDay, isSameMonth, isSameWeek } from '/src/utils/dateUtils'
import useSaleDate from '/src/hooks/useSaleDate'

const ProductQuantityReportView = ({ salesData, inventoryData }) => {
  const [timeframe, setTimeframe] = useState('day')
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [saleStats, setSaleStats] = useState([])
  const [checkedProducts, setCheckedProducts] = useState({})
  const printRef = useRef(null)
  const userRole = localStorage.getItem('userRole')
  const allowedUsers = ['admin', 'productController']

  //   - check

  useEffect(() => {
    const stored = localStorage.getItem('checkedProducts')
    if (stored) {
      setCheckedProducts(JSON.parse(stored))
    }
  }, [])

  // Helper: Save checkedProducts state to localStorage
  const saveCheckedProducts = newState => {
    localStorage.setItem('checkedProducts', JSON.stringify(newState))
  }

  // Handler for when a checkbox is toggled
  const handleCheckboxChange = (event, product) => {
    const { checked } = event.target
    // Use product.kbcwBarcode as the key (adjust if you have another unique identifier)
    const key = product.kbcwBarcode
    const newState = { ...checkedProducts, [key]: checked }
    setCheckedProducts(newState)
    saveCheckedProducts(newState)
  }

  //   - check

  const handleTimeframeChange = newTimeframe => {
    setTimeframe(newTimeframe)
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

  //   -
  const calculateTotal = productSpecs => {
    let total = 0
    salesData.forEach(sale => {
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

      if (matchesTimeframe && productSpecs === 'kbcw') {
        total += sale.kbcwProducts.length
      } else {
        total += sale.glassesProducts.length
      }
    })
    return total
  }

  const kbcwTotal = calculateTotal('kbcw')
  const glassesTotal = calculateTotal('glasses')

  useEffect(() => {
    const getSalesData = () => {
      setSaleStats([])
      let sales = []
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

        if (matchesTimeframe) {
          sales.push(sale)
        }
      })
      setSaleStats(sales)
    }

    if (salesData.length) {
      getSalesData()
    }
  }, [customDate, timeframe, salesData])

  return (
    <Box sx={{ padding: 4, marginTop: 20, height: '100vh' }}>
      <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold', mb: 6, mt: 4, color: '#333' }}>
        📊 Product Quantity Stats
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
        <Grid container spacing={2} sx={{ marginBottom: 4, marginTop: 6 }}>
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

      {/* Totals Summary */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Widget label='KBCW Products Sold' value={kbcwTotal} rupees={false} xs={12} sm={6} md={6} />
        <Widget label='Glasses Products Sold' value={glassesTotal} rupees={false} xs={12} sm={6} md={6} />
      </Grid>

      {/* Display Sales Data in a Table */}
      <Typography variant='h6' sx={{ marginBottom: 2 }}>
        Product Quantity
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handlePrint} variant='contained' color='primary'>
          Print Table
        </Button>
      </div>

      <div ref={printRef}>
        <ProductTable
          saleStats={saleStats}
          handleCheckboxChange={handleCheckboxChange}
          checkedProducts={checkedProducts}
          inventoryData={inventoryData}
        />
      </div>
    </Box>
  )
}

export default ProductQuantityReportView
