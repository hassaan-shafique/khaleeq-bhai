import React from 'react'
import { Typography, Card, CardContent, Divider, Box } from '@mui/material'
import { formatDateDisplay } from '/src/utils/dateUtils'
import Products from '../products'
import EventNoteIcon from '@mui/icons-material/EventNote'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'

const SaleCard = ({ sale }) => {
  // Don't render if no products are available
  if (!sale.kbcwProducts?.length && !sale.glassesProducts?.length) return null

  return (
    <Box
    //   sx={{
    //     borderRadius: 3,
    //     boxShadow: 6,
    //     p: 3,
    //     mb: 4,
    //     backgroundColor: '#ffffff',
    //     transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease',
    //     '&:hover': {
    //       transform: 'scale(1.02)',
    //       boxShadow: 10
    //     }
    //   }}
    >
      {/* Sale Info */}
      <Box display='flex' alignItems='center' gap={2} mb={1}>
        <EventNoteIcon color='primary' />
        <Typography variant='h6' fontWeight='bold' color='primary'>
          {formatDateDisplay(sale.startDate)}
        </Typography>
      </Box>

      <Box display='flex' alignItems='center' gap={2} mb={2}>
        <ConfirmationNumberIcon color='primary' />
        <Typography variant='h6' fontWeight='bold' color='primary'>
          Sale #: {sale.orderNo}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Product Sections */}
      <Products label='KBCW Products' products={sale.kbcwProducts} />
      <Products label='Glasses Products' products={sale.glassesProducts} />
    </Box>
  )
}

export default SaleCard
