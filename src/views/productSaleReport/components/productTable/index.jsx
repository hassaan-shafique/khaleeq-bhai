import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Chip
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'
import SaleCard from '../saleCard'
import { formatDateDisplay } from '/src/utils/dateUtils'

const ProductReport = ({ saleStats }) => {
  const [selectedSale, setSelectedSale] = useState(null)
  const filteredSales = saleStats.filter(s => s.kbcwProducts?.length || s.glassesProducts?.length)

  const handleOpen = sale => {
    setSelectedSale(sale)
  }

  const handleClose = () => {
    setSelectedSale(null)
  }

  const getTotalProductCount = (kbcw, glasses) => {
    return kbcw + glasses
  }

  return (
    <>
      {/* 📝 Order Table */}
      <TableContainer component={Paper} sx={{ mt: 4, borderRadius: 3, boxShadow: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>
                <Typography fontWeight='bold'>#</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight='bold'>Order No</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight='bold'>Sale Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight='bold'>Products</Typography>
              </TableCell>
              <TableCell align='center'>
                <Typography fontWeight='bold'>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale, index) => (
              <TableRow key={sale.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sale.orderNo}</TableCell>
                <TableCell>{formatDateDisplay(sale.startDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={getTotalProductCount(sale.kbcwProducts.length, sale.glassesProducts.length)}
                    color='secondary'
                    size='large'
                  />
                </TableCell>
                <TableCell align='center'>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpen(sale)}
                  >
                    View Products
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(selectedSale)} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight='bold'>🛍️ Order Details</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{selectedSale && <SaleCard sale={selectedSale} />}</DialogContent>
      </Dialog>
    </>
  )
}

export default ProductReport
