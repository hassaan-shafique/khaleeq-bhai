import React, { useState, useRef, useEffect } from 'react'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'

import EditIcon from '@mui/icons-material/Edit'
import { db } from '../../../config/Firebase' // Adjust to your Firebase setup
import { doc, updateDoc, deleteDoc, collection } from 'firebase/firestore' // Firestore functions
import UpdateQuantity from './updateQuantity'
import {getDocs } from 'firebase/firestore'



const InventoryList = ({ inventory = [], loading = false, setInventoryRefresh }) => {
  const [selectedType, setSelectedType] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(true)
  const [editableItem, setEditableItem] = useState(null)
  const [quantityRefresh, setQuantityRefresh] = useState(false)
  const [searchBarcode, setSearchBarcode] = React.useState('')
  const [inventoryTypes, setInventoryTypes] = useState([])

  const printRef = useRef(null)

  const handleTypeChange = event => setSelectedType(event.target.value)
  const handlePriceRangeChange = event => setSelectedPriceRange(event.target.value)

  const handleImageClick = image => {
    setSelectedImage(image)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => setOpenDialog(false)

  const openEditDialog = item => {
    setEditableItem({ ...item }) // Clone the item to avoid mutating the original object
    setEditDialogOpen(true)
  }
  const handleColorChange = event => {
    const { name, value } = event.target

    // Update the editableItem state with the new color value
    setEditableItem(prevState => ({
      ...prevState,
      [name]: value // This will set the color based on input (name is "color")
    }))
  }

  useEffect(() => {
    const fetchInventoryTypes = async () => {
      const typesCollection = collection(db, 'inventoryTypes')
      const snapshot = await getDocs(typesCollection)
      const fetchedTypes = snapshot.docs.map(doc => doc.data())
      setInventoryTypes(prev => [
        ...prev.filter(type => type.value === 'other'), // Keep "Other" always in dropdown
        ...fetchedTypes
      ])
    }

    fetchInventoryTypes()
  }, [])

  const handleEditInputChange = e => {
    const { name, value } = e.target
    setEditableItem(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveEdit = async () => {
    if (editableItem) {
      try {
        const itemRef = doc(db, 'inventory', editableItem.id)
        await updateDoc(itemRef, {
          name: editableItem.name,
          barcode: editableItem.barcode,
          price: Number(editableItem.price),
          quantity: Number(editableItem.quantity),
          type: editableItem.type,
          size: editableItem.size,
          color: editableItem.color
        })

        // Close the dialog
        setEditDialogOpen(false)

        if (setInventoryRefresh) {
          setInventoryRefresh(prev => !prev) // Toggle the state to trigger a re-render
        }

        alert('Item updated successfully!')
      } catch (error) {
        console.error('Error updating item:', error)
        alert('Failed to update the item. Please try again.')
      }
    }
  }

  const calculateTotalInventoryPrice = () => {
    return filteredInventory.reduce((total, item) => {
      const price = parseFloat(item.price) || 0

      return total + price
    }, 0)
  }

  const handleDeleteItem = async id => {
    const itemRef = doc(db, 'inventory', id)
    await deleteDoc(itemRef)
  }

  const filteredInventory = inventory.filter(item => {
    const matchesType = selectedType === '' || item.type === selectedType
    const matchesPriceRange = () => {
      switch (selectedPriceRange) {
        case '1':
          return item.price >= 350 && item.price <= 600
        case '2':
          return item.price >= 601 && item.price <= 950
        case '3':
          return item.price >= 951 && item.price <= 1250
        case '4':
          return item.price >= 1251 && item.price <= 1550
        case '5':
          return item.price >= 1551 && item.price <= 1850
        case '6':
          return item.price >= 1851 && item.price <= 2550
        case '7':
          return item.price >= 2551 && item.price <= 3500
        case '8':
          return item.price >= 3501 && item.price <= 6000
        case '9':
          return item.price >= 6001 && item.price <= 10000
        case '10':
          return item.price >= 10001 && item.price <= 30000
        case '11':
          return item.price >= 30001 && item.price <= 50000

        default:
          return true
      }
    }

    const matchesBarcode = String(item.barcode || '')
      .toLowerCase()
      .includes((searchBarcode || '').toLowerCase())
    return matchesBarcode && matchesType && matchesPriceRange()
  })

  const inventoryFilterTypes = [...new Set(inventory.map(item => item.type))]

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

  const userRole = localStorage.getItem('userRole')

  console.log({ inventoryTypes })

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Inventory Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              <MenuItem value=''>All</MenuItem>
              {inventoryFilterTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Price Range</InputLabel>
            <Select value={selectedPriceRange} onChange={handlePriceRangeChange}>
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='1'>Rs. 350 to 600</MenuItem>
              <MenuItem value='2'>Rs. 601 to 950</MenuItem>
              <MenuItem value='3'>Rs. 951 to 1250</MenuItem>
              <MenuItem value='4'>Rs. 1251 to 1550</MenuItem>
              <MenuItem value='5'>Rs. 1551 to 1850</MenuItem>
              <MenuItem value='6'>Rs. 1851 to 2550</MenuItem>
              <MenuItem value='7'>Rs. 2551 to 3500</MenuItem>
              <MenuItem value='8'>Rs. 3501 to 6000</MenuItem>
              <MenuItem value='9'>Rs. 6001 to 10000</MenuItem>
              <MenuItem value='10'>Rs. 10001 to 30000</MenuItem>
              <MenuItem value='11'>Rs. 30001 to 50000</MenuItem>
              {/* Add other price ranges */}
            </Select>
          </FormControl>

          <TextField
            label='Search by Barcode'
            variant='outlined'
            value={searchBarcode}
            onChange={e => setSearchBarcode(e.target.value)}
            fullWidth
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1rem',
              gap: '40rem'
            }}
          >
            {userRole == 'admin' && (
              <Button variant='contained' color='primary' onClick={handlePrint}>
                Print Kbcw Inventory
              </Button>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <UpdateQuantity setRefresh={setQuantityRefresh} />
            </div>
          </div>
          <Typography
            variant='h6'
            sx={{
              marginTop: 2,
              textAlign: 'left ',
              fontWeight: 'bold',
              color: 'blue'
            }}
          >
            Overall KBCW Inventory Worth: Rs: {calculateTotalInventoryPrice().toFixed(2)}/-
          </Typography>

          {filteredInventory.length === 0 ? (
            <Typography variant='h6' align='center' sx={{ marginTop: 4 }}>
              <CircularProgress />
            </Typography>
          ) : (
            <div ref={printRef}>
              <TableContainer component={Paper} sx={{ maxHeight: 500, maxWidth: '100%', overflowX: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2', // Primary color
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Sr.No
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Image
                      </TableCell>

                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Barcode
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Price
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Color
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: '#1976d2',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredInventory.map((item, i) => (
                      <TableRow key={item.id}>
                        <TableCell
                          sx={{
                            backgroundColor: '#1976d2',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#333',

                            borderRight: '1px solid #ccc' // Separate columns with border
                          }}
                        >
                          {i + 1}
                        </TableCell>

                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image} // Base64 image will render here
                              alt={`Image ${i + 1}`}
                              style={{
                                width: '150px',
                                height: '100px',
                                cursor: 'pointer',
                                border: '2px #1976d2 solid'
                              }}
                              onClick={() => handleImageClick(item.image)}
                            />
                          ) : (
                            'No Image'
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {item.barcode}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {item.type}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          Rs.{item.price}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {item.quantity}
                        </TableCell>

                        <TableCell
                          sx={{
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#deeff5',
                            display: 'flex', // Flexbox to center content
                            justifyContent: 'center', // Horizontally center
                            alignItems: 'center' // Vertically center
                          }}
                        >
                          <div
                            style={{
                              width: '98px',
                              height: '100px',
                              backgroundColor: item.color
                            }}
                            title={item.color}
                          ></div>
                        </TableCell>

                        <TableCell
                          sx={{
                            backgroundColor: '#deeff5'
                          }}
                        >
                          {userRole == 'admin' && (
                            <Button onClick={() => openEditDialog(item)}>
                              <EditIcon />
                            </Button>
                          )}

                          {userRole == 'admin' && (
                            <Button color='error' onClick={() => handleDeleteItem(item.id)}>
                              <DeleteIcon />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}

          {/* Image Preview Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md'>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogContent>
              <img src={selectedImage} alt='Selected' style={{ width: '100%', height: 'auto' }} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color='primary'>
                Close
              </Button>
            </DialogActions>
          </Dialog>
          {/* Edit Item Dialog */}

          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth='sm'>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogContent>
              <TextField
                label='Barcode'
                name='barcode'
                value={editableItem?.barcode || ''}
                onChange={handleEditInputChange}
                fullWidth
                margin='dense'
              />
              <TextField
                label='Name'
                name='name'
                value={editableItem?.name || ''}
                onChange={handleEditInputChange}
                fullWidth
                margin='dense'
              />
              <TextField
                label='Price'
                name='price'
                type='number'
                value={editableItem?.price || ''}
                onChange={handleEditInputChange}
                fullWidth
                margin='dense'
              />
              <TextField
                label='Quantity'
                name='quantity'
                type='number'
                value={editableItem?.quantity || ''}
                onChange={handleEditInputChange}
                fullWidth
                margin='dense'
              />

              <FormControl fullWidth margin='normal' required>
                <InputLabel id='inventory-type-label'>Inventory Type</InputLabel>
                <Select
                  labelId='inventory-type-label'
                  id='inventory-type'
                  name='type'
                  value={editableItem?.type || ''}
                  onChange={handleEditInputChange}
                >
                  {inventoryTypes.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label='Size'
                name='size'
                value={editableItem?.size || ''}
                onChange={handleEditInputChange}
                fullWidth
                margin='dense'
              />
              <TextField
                label='Pick Color'
                name='color'
                type='color'
                value={editableItem?.color || '#000000'}
                onChange={handleColorChange}
                fullWidth
                margin='dense'
              />

              <TextField
                label='Color Name'
                name='color'
                value={editableItem?.color || ''}
                onChange={handleColorChange}
                fullWidth
                margin='dense'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color='secondary'>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} color='primary'>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  )
}

export default InventoryList
