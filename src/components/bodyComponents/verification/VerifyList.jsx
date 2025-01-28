import React, { useState } from 'react'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Checkbox
} from '@mui/material'

const VerifyList = ({ inventory, loading }) => {
  const [selectedItems, setSelectedItems] = useState({})

  const handleCheckboxChange = id => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id] // Toggle the checkbox state
    }))
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 5, px: 3 }}>
      {/* Page Heading */}
      <Typography variant='h4' sx={{ marginTop: 20, fontWeight: 'bold', mb: 4 }}>
        Inventory Verification
      </Typography>

      {/* Show Loading Spinner if loading is true */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflowY: 'auto', borderRadius: 3 }}>
          <Table sx={{ minWidth: 650, border: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
            {/* Table Head */}
            <TableHead sx={{ backgroundColor: '#ddd' }}>
              <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Serial No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Barcode</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Verify Check</TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {inventory.map(( item,index) => (
                <TableRow key={item.id} sx={{ borderBottom: '1px solid #ccc' }}>
                    <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <CardMedia
                      component='img'
                      height='150'
                      image={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      sx={{ borderRadius: 1, objectFit: 'cover' }}
                      loading='lazy' 
                    />
                  </TableCell>
                  <TableCell>{item.barcode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{item.quantity}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                  <TableCell>
                    <Checkbox
                      sx={{
                        width: 70,
                        height: 70,
                        padding: 0,
                        '& .MuiSvgIcon-root': {
                          fontSize: 50
                        }
                      }}
                      checked={selectedItems[item.id] || false}
                      onChange={() => handleCheckboxChange(item.id)}
                      color='primary'
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default VerifyList
