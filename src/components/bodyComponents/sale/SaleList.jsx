import React, { useState, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Timestamp } from 'firebase/firestore'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DatePicker from 'react-datepicker'
import { doc, updateDoc, deleteDoc, addDoc, collection, query, getDocs, where } from 'firebase/firestore' // Firestore functions
import { db } from '../../../config/Firebase'
import AddInstallment from './Installments/addInstallment'
import ViewInstallment from './Installments/viewInstallments'
import { useNavigate } from 'react-router-dom'
import { LocalGasStationRounded } from '@mui/icons-material'

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

const SaleList = ({ sales = [], loading = false }) => {
  const [open, setOpen] = useState(false)
  const [DSale, setDSale] = useState(null)
  const [salesData, setSalesData] = useState(sales) // Local sales state
  const [editOpen, setEditOpen] = useState(false)
  const [editSale, setEditSale] = useState(new Date())

  const [showFields, setShowFields] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState(null)
  const [installmentDialogOpen, setInstallmentDialogOpen] = useState(false)
  const [installmentViewDialogOpen, setInstallmentViewDialogOpen] = useState(false)
  const [searchSalesman, setSearchSalesman] = React.useState('')
  const [searchContact, setSearchContact] = React.useState('')
  const [searchCustomer, setSearchCustomer] = React.useState('')
  const [searchOrder, setSearchOrder] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('All')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [sortDate, setSortDate] = useState('asc')

  const handleSort = () => {
    setSortDate(prevSortDate => (prevSortDate === 'asc' ? 'desc' : 'asc'))
  }

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}` // Returns date in "YYYY-MM-DD" format
  }

  const currentDate = getCurrentDate()
  const userRole = localStorage.getItem('userRole')

  const navigate = useNavigate()

  const printRef = useRef(null)

  // Filtered sales data with sorting
  const filteredSalesData = salesData.filter(sale => {
    console.log('type', typeof sale.startDate)

    const matchesSalesman = String(sale.salesman || '')
      .toLowerCase()
      .includes((searchSalesman || '').toLowerCase())

    const matchesContact = String(sale.contactNo || '')
      .toLowerCase()
      .includes((searchContact || '').toLowerCase())

    const matchesCustomer = String(sale.customerName || '')
      .toLowerCase()
      .includes((searchCustomer || '').toLowerCase())

    const matchesOrder = String(sale.orderNo || '')
      .toLowerCase()
      .includes((searchOrder || '').toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || String(sale.status || '').toLowerCase() === (statusFilter || '').toLowerCase()

    // Safely handle date comparisons
    // Normalize filter dates
    const normalizedFilterStartDate = filterStartDate ? new Date(filterStartDate).setHours(0, 0, 0, 0) : null
    const normalizedFilterEndDate = filterEndDate ? new Date(filterEndDate).setHours(23, 59, 59, 999) : null

    // Safely handle date comparisons
    let saleDate

    if (sale.startDate) {
      if (sale.startDate.seconds) {
        saleDate = new Date(sale.startDate.seconds * 1000)
      } else {
        saleDate = new Date(sale.startDate).setHours(0, 0, 0, 0)
      }
    } else {
      saleDate = null
    }

    const matchesDate =
      (!normalizedFilterStartDate || (saleDate && saleDate >= normalizedFilterStartDate)) &&
      (!normalizedFilterEndDate || (saleDate && saleDate <= normalizedFilterEndDate))

    return matchesSalesman && matchesContact && matchesCustomer && matchesOrder && matchesStatus && matchesDate
  })

  // Apply sorting after filtering
  const filteredAndSortedSalesData = filteredSalesData.sort((a, b) => {
    const aDate = a.startDate ? new Date(a.startDate.seconds * 1000) : null
    const bDate = b.startDate ? new Date(b.startDate.seconds * 1000) : null

    if (!aDate || !bDate) return 0 // If either date is missing, no sorting

    if (sortDate === 'asc') {
      return aDate - bDate // Ascending order
    } else {
      return bDate - aDate // Descending order
    }
  })

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
        </style>
      </head>
      <body>
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

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '3px',
            fontSize: '0.875rem' // Smaller font size
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            height: '20px' // Smaller row height
          }
        }
      }
    }
  })

  const calculatePendingTotal = () => {
    return filteredSalesData.reduce((total, sale) => {
      const price = parseFloat(sale.pendingAmount) || 0

      return total + price
    }, 0)
  }

  // Open dialog with sale details
  const handleOpenDialog = sale => {
    setDSale(sale)
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setDSale(null)
  }

  // Mark sale as complete and update the UI
  const handleMarkAsComplete = async (saleId, deliveredDate) => {
    if (!deliveredDate) {
      alert('Delivered Date is not added. Please provide a Delivered Date.')
      return
    }

    try {
      const saleDocRef = doc(db, 'sales', saleId) // Ensure the saleId is valid
      await updateDoc(saleDocRef, { status: 'Completed' })

      // Update local sales data
      const updatedSales = salesData.map(sale => (sale.id === saleId ? { ...sale, status: 'Completed' } : sale))
      setSalesData(updatedSales)
    } catch (error) {
      console.error('Error updating sale status:', error) // Log the error
      alert(`Error updating sale status: ${error.message}`) // Show alert with error message
    }
  }

  const handleDateChange = e => {
    const { name, value } = e.target // Get name and value from the input

    // Update the respective date field (startDate, endDate, deliveredDate) based on input's name
    setEditSale(prevSale => ({
      ...prevSale,
      [name]: value // Dynamically set the field (startDate, endDate, deliveredDate) based on input's name
    }))
  }

  // Delete sale
  const handleDeleteSale = async saleId => {
    const confirmation = window.confirm('Are you sure you want to delete this sale?')
    if (confirmation) {
      try {
        const saleDocRef = doc(db, 'sales', saleId) // Ensure the saleId is valid
        await deleteDoc(saleDocRef)

        // Update local sales data
        const updatedSales = salesData.filter(sale => sale.id !== saleId)
        setSalesData(updatedSales)
        alert('Sale Deleted Successfully')
      } catch (error) {
        console.error('Error deleting sale:', error) // Log the error
        alert(`Error deleting sale: ${error.message}`) // Show alert with error message
      }
    }
  }

  // Open edit dialog
  const handleEditSale = sale => {
    setEditSale(sale)
    setEditOpen(true)
  }

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditOpen(false)
    setEditSale(null)
  }

  // Save edited sale
  const handleSaveEdit = async () => {
    if (!editSale) return

    try {
      // Create a copy of the editSale object to avoid mutating the original
      const updatedSale = { ...editSale }

      // Validate and convert deliveredDate
      if (updatedSale.deliveredDate) {
        let deliveredDate

        // Check if it's already a Date object
        if (updatedSale.deliveredDate instanceof Date) {
          deliveredDate = updatedSale.deliveredDate
        }
        // Check if it's a valid date string
        else if (typeof updatedSale.deliveredDate === 'string') {
          deliveredDate = new Date(updatedSale.deliveredDate)
        }
        // Check if it's a Firestore Timestamp
        else if (updatedSale.deliveredDate.seconds) {
          deliveredDate = new Date(updatedSale.deliveredDate.seconds * 1000)
        }

        // Ensure the date is valid
        if (!deliveredDate || isNaN(deliveredDate.getTime())) {
          throw new Error('Invalid deliveredDate format')
        }

        // Convert to Firestore Timestamp
        updatedSale.deliveredDate = Timestamp.fromDate(deliveredDate)
      } else {
        updatedSale.deliveredDate = null // Handle empty or missing date
      }

      // Reference to the Firestore document
      const saleDocRef = doc(db, 'sales', updatedSale.id)

      // Update the Firestore document
      await updateDoc(saleDocRef, updatedSale)

      // Update local sales data
      const updatedSales = salesData.map(sale => (sale.id === updatedSale.id ? { ...sale, ...updatedSale } : sale))

      setSalesData(updatedSales)
      handleCloseEditDialog()
    } catch (error) {
      console.error('Error updating sale:', error)
      alert(`Error updating sale: ${error.message}`)
    }
  }

  const updatePendingAmount = async (saleId, installmentAmount) => {
    const saleDocRef = doc(db, 'sales', saleId)
    let currentSaleData = salesData.filter(sale => sale.id === saleId)[0]
    const newPendingAmount = currentSaleData.pendingAmount - installmentAmount
    currentSaleData.pendingAmount = newPendingAmount
    try {
      await updateDoc(saleDocRef, currentSaleData)
    } catch (error) {
      console.error('Error updating sale:', error)
      alert(`Error updating sale: ${error.message}`)
    }
  }

  console.log({ filteredAndSortedSalesData })

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          marginBottom: '1rem'
        }}
      >
        <FormControl>
          <InputLabel>Sale Status</InputLabel>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} label='Sale Status'>
            <MenuItem value='All'>All Sales</MenuItem>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Completed'>Completed</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Search by OrderNo'
          variant='outlined'
          value={searchOrder}
          onChange={e => setSearchOrder(e.target.value)}
          sx={{ maxWidth: '300px' }}
        />
        <TextField
          label='Search by Salesman'
          variant='outlined'
          value={searchSalesman}
          onChange={e => setSearchSalesman(e.target.value)}
          sx={{ maxWidth: '300px' }}
        />
        <TextField
          label='Search by Contact No'
          variant='outlined'
          value={searchContact}
          onChange={e => setSearchContact(e.target.value)}
          sx={{ maxWidth: '300px' }}
        />
        <TextField
          label='Search by Customer Name'
          variant='outlined'
          value={searchCustomer}
          onChange={e => setSearchCustomer(e.target.value)}
          sx={{ maxWidth: '300px' }}
        />
      </Box>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <TextField
          label='Start Date'
          type='date'
          variant='outlined'
          size='small'
          value={filterStartDate}
          onChange={e => setFilterStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          label='End Date'
          type='date'
          variant='outlined'
          size='small'
          value={filterEndDate}
          onChange={e => setFilterEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>

      {userRole == 'admin' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '1rem',
           
          }}
        >
          <Button variant='contained'  sx = { { background:'#616161',}}color='primary' onClick={handlePrint}>
            Print Sale Information
          </Button>
        </div>
      )}
      <Typography
        variant='h6'
        sx={{
          fontWeight: 'bold',

          marginRight: '4',
          color: 'red' // Optional: Adjust color as needed
        }}
      >
        Total Pending Amount: Rs: {calculatePendingTotal().toFixed(2)}
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100vh', // Full viewport height
            overflowY: 'auto',
          
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredAndSortedSalesData.length === 0 ? (
            <Typography variant='h6' align='center' sx={{ marginTop: 4 }}>
              No Sales found....
            </Typography>
          ) : (
            <ThemeProvider theme={theme}>
              <div ref={printRef}>
                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: '100%',
                    height: '76vh', // Set a fixed height or adjust as necessary
                    overflowY: 'auto', // Enables vertical scrolling
                    overflowX: 'auto', // Prevents horizontal scrolling
                    '&::-webkit-scrollbar': {
                      width: '10px', // Width of the vertical scrollbar
                      height: '10px' // Height of the horizontal scrollbar
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f0f0f0', // Track color
                      borderRadius: '10px' // Rounded track
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#888', // Scrollbar thumb color
                      borderRadius: '10px', // Rounded thumb
                      border: '2px solid #f0f0f0', // Adds spacing around the thumb
                      '&:hover': {
                        backgroundColor: '#555' // Darker on hover
                      }
                    }
                  }}
                >
                  {/* Listing Table */}
                  <Table stickyHeader>
                    <TableHead >
                      <TableRow sx={{ height: '60px' , width : " 120px" , backgroundColor: "#616161" }}>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Sale ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#616161" ,color :"white" }}>Order Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Delivery Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161",color :"white" }}>Delivered Date</TableCell>
                        {/* <TableCell sx={{ fontWeight: "bold" }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell> */}
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Order No</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Customer Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Contact</TableCell>

                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#616161" ,color :"white" }}>Salesman</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#616161" ,color :"white" }}>Doctor</TableCell>

                        {/* <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell> */}
                        {/* <TableCell sx={{ fontWeight: "bold" }}>Advance</TableCell> */}
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#616161"  ,color :"white"}}>Pending Amount</TableCell>

                        {/* <TableCell sx={{ fontWeight: "bold" }}>
                      Instruction
                    </TableCell> */}
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: "#616161" ,color :"white" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161" ,color :"white"}}>Actions</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' , backgroundColor: "#616161",color :"white" }}>view Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAndSortedSalesData.map((sale, i) => (
                        <TableRow key={sale.id} sx={{ height: '40px' }}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell sx={{ padding: '4px' }}>
                            {sale.startDate ? formatTimestamp(sale.startDate) : 'No Date'}
                          </TableCell>
                          <TableCell sx={{ padding: '4px' }}>
                            {sale.endDate ? formatTimestamp(sale.endDate) : 'No Date'}
                          </TableCell>
                          <TableCell sx={{ padding: '4px' }}>
                            {sale.deliveredDate ? formatTimestamp(sale.deliveredDate) : 'No Date'}
                          </TableCell>
                          {/* <TableCell>{sale.source}</TableCell>
                      <TableCell>{sale.barcode}</TableCell> */}
                          <TableCell sx={{ padding: '4px' }}>{sale.orderNo}</TableCell>
                          <TableCell sx={{ padding: '4px' }}>{sale.customerName}</TableCell>
                          <TableCell sx={{ padding: '4px' }}>{sale.contactNo}</TableCell>

                          <TableCell sx={{ padding: '4px' }}>{sale.salesman}</TableCell>
                          <TableCell sx={{ padding: '4px' }}>{sale.doctor}</TableCell>

                          {/* <TableCell>{sale.totalAmount}</TableCell> */}
                          {/* <TableCell>{sale.advance}</TableCell> */}
                          <TableCell sx={{ padding: '2px' }}>{sale.pendingAmount}</TableCell>

                          {/* <TableCell>{sale.instruction}</TableCell> */}

                          <TableCell sx={{ padding: '20px' }}>
                            <Button
                              variant='contained'
                              color={sale.status === 'Pending' ? 'error' : 'success'} // Set color based on status
                              sx={{ textTransform: 'none', minWidth: '100px' }} // Style the button
                            >
                              {sale.status === 'Pending' ? 'Pending' : 'Completed'}
                            </Button>
                          </TableCell>

                          {/* Status buttons with click handlers */}
                          <TableCell sx={{ padding: '8px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {sale.status === 'Pending' && (
                                <IconButton
                                  color='success'
                                  onClick={() => handleMarkAsComplete(sale.id, sale.deliveredDate)}
                                  sx={{ marginLeft: 1 }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              )}
                              <IconButton
                                variant='outlined'
                                color='primary'
                                onClick={() => handleEditSale(sale)}
                                sx={{ marginLeft: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              {userRole == 'admin' && (
                                <IconButton
                                  variant='outlined'
                                  color='error'
                                  onClick={() => handleDeleteSale(sale.id)}
                                  sx={{ marginLeft: 1 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              padding: '10px'
                            }}
                          >
                            <Button
                              variant='contained'
                              color='success'
                              sx={{ textTransform: 'none' }}
                              onClick={() => {
                                navigate(`${sale.id}/products`)
                              }}
                            >
                              <span>View Products</span>
                            </Button>
                            <Button
                              variant='contained'
                              color='warning'
                              sx={{ textTransform: 'none' }}
                              onClick={() => {
                                setInstallmentDialogOpen(true)
                                setSelectedSaleId(sale.id)
                              }}
                            >
                              Add Installment
                            </Button>
                            <Button
                              variant='contained'
                              color='secondary'
                              sx={{ textTransform: 'none' }}
                              onClick={() => {
                                setInstallmentViewDialogOpen(true)
                                setSelectedSaleId(sale.id)
                              }}
                            >
                              <EyeIcon /> <span>Installments</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </ThemeProvider>
          )}
        </>
      )}

      {installmentDialogOpen && (
        <AddInstallment
          saleId={selectedSaleId}
          updatePendingAmount={updatePendingAmount}
          open={installmentDialogOpen}
          handleClose={() => {
            setInstallmentDialogOpen(false)
            setSelectedSaleId(null)
          }}
        />
      )}

      {installmentViewDialogOpen && (
        <ViewInstallment
          id={selectedSaleId}
          open={installmentViewDialogOpen}
          handleClose={() => {
            setInstallmentViewDialogOpen(false)
            setSelectedSaleId(null)
          }}
        />
      )}

      {/* Dialog for displaying sale details */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Sale ID:</strong> {DSale?.id}
          </DialogContentText>
          <DialogContentText>
            <strong>Customer Name:</strong> {DSale?.customerName}
          </DialogContentText>
          {/* Add more fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing sale */}
      <Dialog open={editOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          <Typography variant='h7'>Order Date</Typography>
          <TextField
            label='Order Date'
            type='date'
            name='startDate'
            value={editSale?.startDate || ''}
            onChange={handleDateChange}
            margin='normal'
            sx={{ mr: 6 }}
            InputLabelProps={{
              shrink: true
            }}
          />
          <Typography variant='h7'>Delivery Date</Typography>
          <TextField
            label='Delivery Date'
            type='date'
            name='endDate'
            value={editSale?.endDate || ''}
            onChange={handleDateChange}
            margin='normal'
            sx={{ mr: 6 }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <Typography variant='h7'>Delivered Date</Typography>
          <TextField
            label='Delivered Date'
            type='date'
            name='deliveredDate'
            value={editSale?.deliveredDate || ''}
            onChange={handleDateChange}
            margin='normal'
            sx={{ mr: 6 }}
            InputLabelProps={{
              shrink: true
            }}
          />

          <TextField
            label='Order No'
            type='number'
            name='orderNo'
            value={editSale?.orderNo || ''}
            onChange={e => setEditSale({ ...editSale, orderNo: e.target.value })}
            margin='normal'
            sx={{ mr: 6 }}
          />

          <TextField
            label='Customer Name'
            name='customerName'
            value={editSale?.customerName || ''}
            onChange={e => setEditSale({ ...editSale, customerName: e.target.value })}
            placeholder='Customer Name'
            margin='normal'
            sx={{ mr: 1 }}
          />
          <TextField
            label='Contact No'
            name='contactNo'
            value={editSale?.contactNo || ''}
            onChange={e => setEditSale({ ...editSale, contactNo: e.target.value })}
            placeholder='Contact No'
            margin='normal'
            sx={{ mr: 6 }}
          />
          <TextField
            label='Address'
            name='address'
            value={editSale?.address || ''}
            onChange={e => setEditSale({ ...editSale, address: e.target.value })}
            placeholder='Address'
            margin='normal'
            sx={{ mr: 1 }}
          />
          <TextField
            label='Salesman'
            name='salesman'
            value={editSale?.salesman || ''}
            onChange={e => setEditSale({ ...editSale, salesman: e.target.value })}
            placeholder='Salesman'
            margin='normal'
            sx={{ mr: 6 }}
          />
          <TextField
            label='Doctor'
            name='doctor'
            value={editSale?.doctor || ''}
            onChange={e => setEditSale({ ...editSale, doctor: e.target.value })}
            placeholder='Doctor'
            margin='normal'
            sx={{ mr: 1 }}
          />
          <FormControl fullWidth margin="normal" sx={{ mr: 1 }}>
  <InputLabel>Payment Method</InputLabel>
  <Select
    name="payment"
    value={editSale?.payment || ""}
    onChange={(e) =>
      setEditSale({ ...editSale, payment: e.target.value })
    }
  >
    <MenuItem value="Cash">Cash</MenuItem>
    <MenuItem value="Bank">Bank</MenuItem>
    <MenuItem value="EasyPaisa">EasyPaisa</MenuItem>
    <MenuItem value="JazzCash">JazzCash</MenuItem>
  </Select>
</FormControl>


          {/* Additional Table for SPH, CYL, AXIS, ADD, IPD */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> </TableCell>
                  <TableCell>RE</TableCell>
                  <TableCell>LE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>SPH</TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='reSph'
                      value={editSale?.reSph || ''}
                      onChange={e => setEditSale({ ...editSale, reSph: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='leSph'
                      value={editSale?.leSph || ''}
                      onChange={e => setEditSale({ ...editSale, leSph: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CYL</TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='reCyl'
                      value={editSale?.reCyl || ''}
                      onChange={e => setEditSale({ ...editSale, reCyl: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='leCyl'
                      value={editSale?.leCyl || ''}
                      onChange={e => setEditSale({ ...editSale, leCyl: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AXIS</TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='reAxis'
                      value={editSale?.reAxis || ''}
                      onChange={e => setEditSale({ ...editSale, reAxis: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='leAxis'
                      value={editSale?.leAxis || ''}
                      onChange={e => setEditSale({ ...editSale, leAxis: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ADD</TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='reAdd'
                      value={editSale?.reAdd || ''}
                      onChange={e => setEditSale({ ...editSale, reAdd: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='leAdd'
                      value={editSale?.leAdd || ''}
                      onChange={e => setEditSale({ ...editSale, leAdd: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IPD</TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='reIpd'
                      value={editSale?.reIpd || ''}
                      onChange={e => setEditSale({ ...editSale, reIpd: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type='number'
                      name='leIpd'
                      value={editSale?.leIpd || ''}
                      onChange={e => setEditSale({ ...editSale, leIpd: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TextField
            label='Total Amount'
            type='number'
            name='totalAmount'
            value={editSale?.totalAmount || ''}
            onChange={e => setEditSale({ ...editSale, totalAmount: e.target.value })}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Advance'
            type='number'
            name='advance'
            value={editSale?.advance || ''}
            onChange={e => setEditSale({ ...editSale, advance: e.target.value })}
            fullWidth
            margin='normal'
          />
          <TextField
            label='Pending Amount'
            type='number'
            name='pendingAmount'
            value={editSale?.pendingAmount || ''}
            disabled
            fullWidth
            margin='normal'
          />
          <TextField
            label='Instruction'
            name='instruction'
            value={editSale?.instruction || ''}
            onChange={e => setEditSale({ ...editSale, instruction: e.target.value })}
            placeholder='Instruction'
            margin='normal'
            fullWidth
          />
          <RadioGroup
            row
            name='status'
            disabled
            value={editSale?.status || ''}
            onChange={e => setEditSale({ ...editSale, status: e.target.value })}
          >
            <FormControlLabel value='Pending' disabled control={<Radio />} label='Pending' />
            <FormControlLabel value='Completed' disabled control={<Radio />} label='Completed' />
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SaleList
