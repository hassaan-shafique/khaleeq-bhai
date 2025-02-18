import React, { useEffect } from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'

const InstallmentData = ({ installments, timeframe, startDate ,endDate,onInstallmentCalculated }) => {

  const isSameDay = orderDate => {
    const now = new Date()
    const saleDate = new Date(orderDate)
    return saleDate.toDateString() === now.toDateString()
  }

  const isSameWeek = orderDate => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() - 7)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    const saleDate = new Date(orderDate)
    const result = saleDate >= startOfWeek && saleDate <= endOfWeek
    return result
  }

  const isSameMonth = orderDate => {
    const now = new Date()
    const saleDate = new Date(orderDate)
    const result = saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
    return result
  }

  const isCustom = (orderDate, startDate, endDate) => {
    const saleDate = new Date(orderDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = saleDate >= start && saleDate <= end;
    return result;
  }


  const filterDataByTimeframe = (date, startDate, endDate) => {
    // console.log("Filtering for date:", date, "Timeframe:", timeframe);

    switch (timeframe) {
      case "day":
        return isSameDay(date);
      case "week":
        return isSameWeek(date);
      case "month":
        return isSameMonth(date);
      case "custom":
        const result = isCustom(date, startDate, endDate);
        console.log("Custom Filter Result:", result);
        return result;
      default:
        return false;
    }
  };


  const calculateInstallments = (data, method) => {
    return data
      .filter(installment => installment.payment === method)
      .filter(installment => filterDataByTimeframe(installment.date, startDate, endDate))
      .reduce((total, installment) => total + (Number(installment.amount) || 0), 0)
  }

  const totalInstallment = (startDate, endDate) =>
    installments
      .filter(installment => filterDataByTimeframe(installment.date, startDate, endDate)) // Filter by timeframe
      .reduce((total, installment) => total + (Number(installment.amount) || 0), 0)

  const cashInstallment = calculateInstallments(installments, 'Cash')
  const bankInstallment = calculateInstallments(installments, 'Bank')
  const jazzcashInstallment = calculateInstallments(installments, 'JazzCash')
  const easypaisaInstallment = calculateInstallments(installments, 'EasyPaisa')


   const install = cashInstallment+ bankInstallment + jazzcashInstallment + easypaisaInstallment;

   useEffect(() => {
    if (onInstallmentCalculated) {
      onInstallmentCalculated(install,cashInstallment,bankInstallment,jazzcashInstallment,easypaisaInstallment);
    }
  }, [install,cashInstallment , bankInstallment, jazzcashInstallment, easypaisaInstallment,  onInstallmentCalculated]);

  return (
    <Grid container spacing={3}>
      {/* First row: Total Installment */}

      <Grid item xs={12} sx={{ marginTop: 5 }}>
        <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant='h6' color='error'>
              OUT (Total Installment)
            </Typography>
            <Typography variant='h4' color='secondary'>
            Rs {totalInstallment(startDate, endDate).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Second row and onwards: Two cards per row */}
      <Grid item xs={2} sm={6}>
        <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant='h6' color='error'>
              Cash Installment
            </Typography>
            <Typography variant='h4' color='secondary'>
              Rs {cashInstallment.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4} sm={6}>
        <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant='h6' color='error'>
              Bank Installment
            </Typography>
            <Typography variant='h4' color='secondary'>
              Rs {bankInstallment.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>


      <Grid item xs={4} sm={6}>
        <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant='h6' color='error'>
              EasyPaisa Installment
            </Typography>
            <Typography variant='h4' color='secondary'>
              Rs {easypaisaInstallment.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4} sm={6}>
        <Card elevation={3} sx={{ backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant='h6' color='error'>
              JazzCash Installment
            </Typography>
            <Typography variant='h4' color='secondary'>
              Rs {jazzcashInstallment.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InstallmentData
