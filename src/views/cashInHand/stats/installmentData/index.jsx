import React, { useEffect } from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material'
import Widget from '/src/views/shared/widget'

const InstallmentData = ({ installments, timeframe, startDate, endDate, onInstallmentCalculated }) => {
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
    const saleDate = new Date(orderDate)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const result = saleDate >= start && saleDate <= end
    return result
  }

  const filterDataByTimeframe = (date, startDate, endDate) => {
    switch (timeframe) {
      case 'day':
        return isSameDay(date)
      case 'week':
        return isSameWeek(date)
      case 'month':
        return isSameMonth(date)
      case 'custom':
        const result = isCustom(date, startDate, endDate)
        return result
      default:
        return false
    }
  }

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
  const easypaisaInstallment = calculateInstallments(installments, 'EasyPaisa')
  const jazzcashInstallment = calculateInstallments(installments, 'JazzCash')
  const install = cashInstallment + bankInstallment + jazzcashInstallment + easypaisaInstallment

  useEffect(() => {
    if (onInstallmentCalculated) {
      onInstallmentCalculated(install, cashInstallment, bankInstallment, jazzcashInstallment, easypaisaInstallment)
    }
  }, [install, cashInstallment, bankInstallment, jazzcashInstallment, easypaisaInstallment, onInstallmentCalculated])

  const stats = [
    { label: 'OUT (Total Installment)', value: totalInstallment(startDate, endDate), size: 12 },
    { label: 'Cash Installment', value: cashInstallment, size: 12, md: 6 },
    { label: 'Bank Installment', value: bankInstallment, size: 12, md: 6 },
    { label: 'EasyPaisa Installment', value: easypaisaInstallment, size: 12, md: 6 },
    { label: 'JazzCash Installment', value: jazzcashInstallment, size: 12, md: 6 }
  ]

  return (
    <>
      <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 2, marginTop: 4 }}>
        Installments Stats
      </Typography>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        {stats.map((item, index) => (
          <Widget key={index} label={item.label} value={item.value} size={item.size} md={item.md} />
        ))}
      </Grid>
    </>
  )
}

export default InstallmentData
