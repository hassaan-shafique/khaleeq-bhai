import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
  TextField,
 MenuItem,
 Select,
 FormControl,
 InputLabel,
} from '@mui/material'
import { FixedSizeList } from 'react-window'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const VerifyList = ({ inventory, loading }) => {
  const [quantities, setQuantities] = useState({})
  const [searchBarcode, setSearchBarcode] = useState("")
  const [searchName, setSearchName] = useState("")
  const [inventoryType, setInventoryType] =useState ("");
  const [statusFilter ,setStatusFilter] = useState ("All");

  useEffect(() => {
    setQuantities(
      inventory.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})
    )
  }, [inventory])

  const updateQuantity = useCallback((id, change) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) + change, 0)
    }))
  }, [])

  const filteredInventory = inventory.filter(item => {
    const matchesBarcode = String(item.barcode || '')
      .toLowerCase()
      .includes((searchBarcode || '').toLowerCase());
    const matchesName = String(item.name || '')
      .toLowerCase()
      .includes((searchName || '').toLowerCase());
    const matchesType = String((item.type || '').toLowerCase()).includes((inventoryType || '').toLowerCase());
  
    // Determine the item's status based on its quantity
    const itemStatus = (quantities[item.id] ?? item.quantity) === 0 ? 'Checked' : 'Verifying';
  
    const matchesStatus =
      statusFilter === 'All' || statusFilter === '' || itemStatus === statusFilter;
  
    return matchesBarcode && matchesName && matchesType && matchesStatus;
  });
  

  // Virtualized Row Component
  const Row = ({ index, style }) => {
    const item = filteredInventory[index] // Use filteredInventory here
    return (
      <div style={{ ...style, display: 'flex', width: '100%' }}>
        <TableRow component="div" sx={{ display: 'flex', width: '100%' }}>
          <TableCell component="div" sx={{ flex: 1 }}>{index + 1}</TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>
            <CardMedia
              component='img'
              height='90'
              width='90'
              image={item.image || 'https://via.placeholder.com/60'}
              alt={item.name}
              sx={{ borderRadius: 1, objectFit: 'cover' }}
              loading="lazy"
            />
          </TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>{item.barcode}</TableCell>
          <TableCell component="div" sx={{ flex: 3 }}>{item.name}</TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>{item.type}</TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>{quantities[item.id] ?? item.quantity}</TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>
            <Button onClick={() => updateQuantity(item.id, 1)}>
              <AddIcon />
            </Button>
            <Button onClick={() => updateQuantity(item.id, -1)}>
              <RemoveIcon />
            </Button>
          </TableCell>
          <TableCell component="div" sx={{ flex: 2 }}>
  <Button
    sx={{
      backgroundColor: quantities[item.id] === 0 ? 'green' : 'white',
      color: quantities[item.id] === 0 ? 'white' : 'black'
    }}
  >
    {quantities[item.id] === 0 ? 'Checked' : 'Verifying'}
  </Button>
</TableCell>
        </TableRow>
      </div>
    )
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 15, px: 3 }}>
      <Typography variant='h4' sx={{ marginTop: 5, fontWeight: 'bold', mb: 4 }}>
        Inventory Verification
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={3}>
          <TextField
            label='Search by Barcode'
            variant='outlined'
            value={searchBarcode}
            onChange={e => setSearchBarcode(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Search by Name'
            variant='outlined'
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Search by Type'
            variant='outlined'
            value={inventoryType}
            onChange={e => setInventoryType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
  <FormControl fullWidth>
    <InputLabel>Sale Status</InputLabel>
    <Select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      label="Sale Status"
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="Verifying">Verifying</MenuItem>
      <MenuItem value="Checked">Checked</MenuItem>
    </Select>
  </FormControl>
</Grid>

      </Grid>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 600, borderRadius: 3, overflow: 'hidden' }}>
          {/* Fixed Table Header */}
          <Table sx={{ minWidth: 650, border: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
            <TableHead sx={{ backgroundColor: '#ddd' }}>
              <TableRow sx={{ display: 'flex', width: '100%' }}>
                <TableCell sx={{ flex: 1, fontWeight: 'bold' }}>Serial No</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Barcode</TableCell>
                <TableCell sx={{ flex: 3, fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Actions</TableCell>
                <TableCell sx={{ flex: 2, fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
          </Table>

          {/* Virtualized List */}
          <FixedSizeList
            height={600} // Adjust height based on your layout
            itemCount={filteredInventory.length} // Use filteredInventory length
            itemSize={120} // Row height in px
            width="100%"
          >
            {Row}
          </FixedSizeList>
        </TableContainer>
      )}
    </Box>
  )
}

export default VerifyList
