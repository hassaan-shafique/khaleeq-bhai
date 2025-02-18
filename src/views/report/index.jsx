import React, { useState } from 'react'
import { Grid, Box, Button, Table, Tab, TableCell } from '@mui/material'

import SaleStats from './modules/saleStats'
import SaleByProduct from './modules/saleByProduct'
import SaleByQuantity from './modules/saleByQuantity'
import ExpenseStats from './modules/ExpenseStats'
import Tabs from '../shared/Tabs/index.jsx'
import { TABS } from '../../constants'
import CashInHand from './modules/CashInHand'

const COMPONENTS = {
  SaleStats: props => <SaleStats {...props} />,
  ExpenseStats: props => <ExpenseStats {...props} />,
  SaleByProduct: props => <SaleByProduct {...props} />,
  SaleByQuantity: props => <SaleByQuantity {...props} />
}

const ReportSection = ({ selectedComponent, salesData, expenses, installments }) => {
  const SelectedComponent = COMPONENTS[selectedComponent]

  return (
    <Grid container spacing={4}>
      {SelectedComponent && (
        <Grid item xs={12}>
          <SelectedComponent salesData={salesData} expenses={expenses} installments={installments} />
        </Grid>
      )}
    </Grid>
  )
}

const ReportView = ({ salesData, expenses, installments }) => {
  const [selectedComponent, setSelectedComponent] = useState('CashInHand')

  return (
    <Box sx={{ padding: 14 }}>
      <Grid item xs={12}>
        <CashInHand salesData={salesData} expenses={expenses} installments={installments} />
      </Grid>
      <Grid container spacing={2} sx={{ marginBottom: 4, marginTop: '4px', padding: 4 }}>
        <Tabs value={selectedComponent} handler={value => setSelectedComponent(value)} tabs={TABS} />
      </Grid>

      <ReportSection
        selectedComponent={selectedComponent}
        salesData={salesData}
        expenses={expenses}
        installments={installments}
      />
    </Box>
  )
}

export default ReportView
