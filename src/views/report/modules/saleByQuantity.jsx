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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  Checkbox
} from '@mui/material'

const SaleByQuantity = ({ salesData }) => {
  const [timeframe, setTimeframe] = useState('day') // Default to "day"
  // const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false)
  const [customDate, setCustomDate] = useState({ start: '', end: '' })
  const [saleStats, setSaleStats] = useState([])
  const [productFilter, setProductFilter] = useState('')
  const [kbcwProducts, setKbcwProducts] = useState([])
  const [glassesProducts, setGlassesProducts] = useState([])
  const [kbcwTotal, setKbcwTotal] = useState(0)
  const [glassesTotal, setGlassesTotal] = useState(0)
  const [checkedProducts, setCheckedProducts] = useState({})

  const STATUS = {
    COMPLETED: 'Completed',
    PENDING: 'PENDING'
  }
  const userRole = localStorage.getItem('userRole')
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

  useEffect(() => {
    const getSalesData = () => {
      setSaleStats([])
      let sales = []
      let kbcwCount = 0
      let glassesCount = 0

      salesData.forEach(sale => {
        if (sale.status === STATUS.COMPLETED) {
          const saleDate = new Date(sale.startDate.seconds * 1000)
          let isValidSale = false

          // ✅ Single-day custom logic (start date === end date)
          if (timeframe === 'custom' && customDate.start && customDate.end) {
            const selectedStartDate = new Date(customDate.start)
            const selectedEndDate = new Date(customDate.end)

            // Normalize times to midnight for both start and end dates for precise comparison
            selectedStartDate.setHours(0, 0, 0, 0)
            selectedEndDate.setHours(23, 59, 59, 999) // Full end day (till 23:59:59.999)

            // If start date equals end date, it's a single day
            if (selectedStartDate.toDateString() === selectedEndDate.toDateString()) {
              isValidSale = saleDate.toDateString() === selectedStartDate.toDateString()
            } else {
              // Date range logic (start to end date)
              isValidSale = saleDate >= selectedStartDate && saleDate <= selectedEndDate
            }
          }
          // ✅ Non-custom logic (day, week, month)
          else {
            isValidSale =
              (timeframe === 'day' && isSameDay(sale.startDate)) ||
              (timeframe === 'week' && isSameWeek(sale.startDate)) ||
              (timeframe === 'month' && isSameMonth(sale.startDate))
          }

          // ✅ Apply product filter and collect sales
          if (isValidSale && (!productFilter || sale.productType === productFilter)) {
            sales.push(sale)

            // ✅ Accumulate and sort KBCW Products
            if (sale.kbcwProducts) {
              sale.kbcwProducts.forEach(product => {
                kbcwCount += Number(product.enteredQuantity) || 0
              })
              sale.kbcwProducts.sort((a, b) => (b.enteredQuantity || 0) - (a.enteredQuantity || 0))
            }

            // ✅ Accumulate and sort Glasses Products
            if (sale.glassesProducts) {
              sale.glassesProducts.forEach(product => {
                glassesCount += Number(product.enteredQuantity) || 0
              })
              sale.glassesProducts.sort((a, b) => (b.enteredQuantity || 0) - (a.enteredQuantity || 0))
            }
          }
        }
      })

      setSaleStats(sales)
      setKbcwTotal(kbcwCount)
      setGlassesTotal(glassesCount)
    }

    if (salesData.length) {
      getSalesData()
    }
  }, [timeframe, salesData, productFilter, customDate])

  const handleTimeframeChange = newTimeframe => {
    setTimeframe(newTimeframe)
    if (newTimeframe === 'custom' && (!customDate.start || !customDate.end)) {
      alert('Please select both start and end dates for the custom range.')
    }
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

  const isInCustomRange = orderDate => {
    if (!customDate.start || !customDate.end) return false

    const startDate = new Date(customDate.start)
    const endDate = new Date(customDate.end)
    const saleDate = new Date(orderDate.seconds * 1000)

    return saleDate >= startDate && saleDate <= endDate
  }

  // Helper function to format Firestore timestamp
  const formatTimestamp = timestamp => {
    try {
      const date = new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp)
      if (isNaN(date.getTime())) return 'Invalid Date'

      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
      const year = date.getFullYear()

      // Format as "DD/MM/YYYY"
      return `${day}/${month}/${year}`
    } catch (error) {
      return 'Invalid Date'
    }
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

  const allowedUsers = ['admin', 'productController']

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Products Quantity
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
          {allowedUsers.includes(userRole) && (
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
          {allowedUsers.includes(userRole) && (
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
          {allowedUsers.includes(userRole) && (
            <Button variant={timeframe === 'custom' ? 'contained' : 'outlined'} onClick={() => setTimeframe('custom')}>
              Custom
            </Button>
          )}
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
      </Grid>
      {/* Totals Summary */}
      <Paper sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant='h6' gutterBottom>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='body1'>
              <strong>KBCW Products Sold:</strong> {kbcwTotal}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='body1'>
              <strong>Glasses Products Sold:</strong> {glassesTotal}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Display Sales Data in a Table */}
      <Typography variant='h6' sx={{ marginBottom: 2 }}>
        Product Quantity Data
      </Typography>

      <div ref={printRef}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxHeight: 600, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handlePrint} variant='contained' color='primary'>
              Print Table
            </Button>
          </div>
          <Table>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : saleStats.length > 0 ? (
                saleStats.map((sale, index) => (
                  <React.Fragment key={sale.id}>
                    <TableRow
                      sx={{
                        backgroundColor: '#2f2f2f',
                        color: 'white',
                        '&:nth-of-type(odd)': {
                          backgroundColor: '#3b3b3b'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant='body2' sx={{ color: 'white' }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' sx={{ color: 'white' }}>
                          {formatTimestamp(sale.startDate)}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    {sale.kbcwProducts && sale.kbcwProducts.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ paddingLeft: 4 }}>
                          <Typography variant='subtitle1' fontWeight='bold'>
                            KBCW Products:
                          </Typography>
                          <Table size='small'>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Image</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Barcode</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Price</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Size</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Quantity</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Check</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {sale.kbcwProducts.map((product, i) => (
                                <TableRow key={i}>
                                  <TableCell>
                                    {product.kbcwImage ? (
                                      <img
                                        src={product.kbcwImage}
                                        alt='Product'
                                        style={{
                                          width: '100%',
                                          height: 'auto',
                                          maxHeight: '150px',
                                          objectFit: 'cover',
                                          borderRadius: '12px',
                                          backgroundColor: '#808080'
                                        }}
                                      />
                                    ) : (
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '150px',
                                          backgroundColor: '#f0f0f0',
                                          textAlign: 'center',
                                          lineHeight: '150px',
                                          borderRadius: '12px'
                                        }}
                                      >
                                        No Image Available
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>{product.kbcwBarcode}</TableCell>
                                  <TableCell>{product.kbcwPrice}</TableCell>
                                  <TableCell>{product.kbcwSize}</TableCell>
                                  <TableCell>{product.enteredQuantity}</TableCell>
                                  <TableCell>
                                    <Checkbox
                                      color='primary'
                                      checked={!!checkedProducts[product.kbcwBarcode]}
                                      onChange={event => handleCheckboxChange(event, product)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}

                    {sale.glassesProducts && sale.glassesProducts.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ paddingLeft: 4 }}>
                          <Typography variant='subtitle1' fontWeight='bold'>
                            Glasses Products:
                          </Typography>
                          <Table size='small'>
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Product Type</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Number</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Quantity</TableCell>
                                <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sale.glassesProducts.map((product, i) => (
                                <TableRow key={i}>
                                  <TableCell>{product.glassesType}</TableCell>
                                  <TableCell>{product.glassesNumber}</TableCell>
                                  <TableCell>{product.enteredQuantity}</TableCell>
                                  <TableCell>{product.glassesPrice}</TableCell>
                                  <TableCell>
                                    <Checkbox
                                      color='primary'
                                      // Use product.kbcwBarcode as the key
                                      checked={!!checkedProducts[product.kbcwBarcode]}
                                      onChange={event => handleCheckboxChange(event, product)}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <Typography variant='body2' color='textSecondary'>
                      No sales data available.
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

export default SaleByQuantity
