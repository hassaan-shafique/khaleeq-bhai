import React, { useRef } from 'react'
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TableContainer,
  Box,
  Grid
} from '@mui/material'

import SaleDataStats from '../saleDataStats'

const DetailSales = ({ saleStats, loading, installments }) => {
  const printRef = useRef(null)

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML
    const newWindow = window.open('', '_blank')

    newWindow.document.open()
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Sales Data</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                margin: 10px;
              }
              th, td {
                font-size: 14px;
                padding: 8px;
              }
            }
          </style>
        </head>
        <body>
          <div>
            ${printContents}
          </div>
        </body>
      </html>
    `)
    newWindow.document.close()
    newWindow.print()
    newWindow.close()
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container>
        <Grid item xs={10}>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            Detailed Sales Data
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <Button onClick={handlePrint} align='right' variant='contained' color='primary'>
              Print Table
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box ref={printRef}>
        <Paper sx={{ borderRadius: 3, boxShadow: 4, padding: 2 }}>
          <TableContainer
            sx={{
              maxHeight: 450,
              overflowY: 'auto'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    'Sr No',
                    'Order Date',
                    'Order No',
                    'Amount',
                    'Advance',
                    'Discount',
                    'Installment Date',
                    'Installment Amount',
                    'Payment Type',
                    'Salesman'
                  ].map((header, index) => (
                    <TableCell key={index}>
                      <Typography variant='subtitle1' fontWeight='bold'>
                        {header}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={10} align='center'>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}

                {!loading && saleStats.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align='center'>
                      <Typography variant='body2' color='textSecondary'>
                        No sales data available.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}

                {saleStats.map((sale, index) => (
                  <SaleDataStats key={index} sale={sale} installments={installments} index={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  )
}

export default DetailSales
