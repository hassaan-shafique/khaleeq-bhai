import {
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
import { formatDateDisplay } from '/src/utils/dateUtils'
import SalemanPieChart from './salemanPieChart'

const DetailInstallments = ({ saleStats, loading, installments }) => {
  // Function to generate table rows for installment data
  const renderTableRows = () => {
    return saleStats.map((sale, index) => {
      // Filter installments for the current sale
      const saleInstallments = installments.filter(inst => inst.saleId === sale.id)

      // Calculate total installment amount
      const totalInstallmentAmount = saleInstallments.reduce((total, inst) => total + Number(inst.amount || 0), 0)

      // Get the latest installment date
      const latestInstallmentDate = saleInstallments.length
        ? new Date(Math.max(...saleInstallments.map(inst => new Date(inst.date)))).toLocaleDateString('en-GB') // "dd/mm/yyyy"
        : 'No Date'

      // Skip rows where totalInstallmentAmount is 0
      if (totalInstallmentAmount === 0) {
        return null
      }

      return (
        <TableRow
          key={sale.id}
          hover
          sx={{
            '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
            '&:nth-of-type(even)': { backgroundColor: '#ffffff' }
          }}
        >
          <TableCell>
            <Typography variant='body2'>{index + 1}</Typography>
          </TableCell>
          {/* <TableCell>
            <Typography variant='body2'>{formatDateDisplay(sale.startDate)}</Typography>
          </TableCell> */}
          <TableCell>
            <Typography variant='body2' color='primary'>
              {sale.orderNo}
            </Typography>
          </TableCell>
          <TableCell align='left'>
            <Typography variant='body2' color='secondary'>
              {latestInstallmentDate}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant='body2' fontWeight='bold' color='secondary'>
              Rs {totalInstallmentAmount}
            </Typography>
          </TableCell>
        </TableRow>
      )
    })
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container>
        <Grid item xs={12} md={8}>
          <Typography variant='h6' fontWeight='bold' gutterBottom>
            Detailed Installment Data
          </Typography>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, boxShadow: 4, padding: 2 }}>
        <TableContainer sx={{ maxHeight: 450, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Sr No', 'Order No', 'Installment Date', 'Installment Amount'].map((header, index) => (
                  <TableCell key={index}>
                    <Typography variant='subtitle1' fontWeight='bold'>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : saleStats.length > 0 ? (
                renderTableRows()
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    <Typography variant='body2' color='textSecondary'>
                      No Installment data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default DetailInstallments
