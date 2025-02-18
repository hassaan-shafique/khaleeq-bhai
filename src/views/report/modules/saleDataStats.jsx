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
  TableContainer
} from '@mui/material'

const formatDate = date => {
  const epochTime = date
  const newDate = new Date(epochTime * 1000)
  const formattedDate = newDate.toISOString().split('T')[0]
  return formattedDate
}

const SaleDataStats = ({ sale, installments, index }) => {
  const saleInstallments = installments.filter(installment => installment.saleId === sale.id)
  const totalInstallmentAmount = saleInstallments.reduce((total, inst) => total + Number(inst.amount || 0), 0)
  const latestInstallmentDate = saleInstallments.length
    ? new Date(Math.max(...saleInstallments.map(inst => new Date(inst.date)))).toLocaleDateString('en-GB')
    : 'No Date'

  return (
    <TableRow
      key={sale.id}
      hover
      sx={{
        '&:nth-of-type(odd)': {
          backgroundColor: '#f9f9f9'
        }
      }}
    >
      <TableCell>
        <Typography variant='body2'>{index + 1}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2'>{formatDate(sale.startDate.seconds)}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='primary'>
          {sale.orderNo}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='secondary'>
          Rs {sale.totalAmount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='secondary'>
          Rs {sale.advance}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='secondary'>
          Rs {sale.discount}
        </Typography>
      </TableCell>
      <TableCell align='left'>
        <Typography variant='body2' color='secondary'>
          {latestInstallmentDate}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='secondary'>
          Rs {totalInstallmentAmount}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2'>{sale.payment}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2'>{sale.salesman}</Typography>
      </TableCell>
    </TableRow>
  )
}

export default SaleDataStats
