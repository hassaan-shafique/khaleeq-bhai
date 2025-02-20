import React from 'react'
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Checkbox,
  Card
} from '@mui/material'
import Product from '../product'

const ProductTable = ({ saleStats, handleCheckboxChange, checkedProducts, inventoryData }) => {
  const groupAndSortProducts = saleStats => {
    const groupedProducts = {}
    saleStats.forEach(sale => {
      sale.kbcwProducts.forEach(product => {
        const barcode = product.kbcwBarcode
        const inventoryProduct = inventoryData.filter(f => f.barcode === barcode)
        if (!groupedProducts[barcode]) {
          groupedProducts[barcode] = {
            ...product,
            totalQuantity: 0,
            remainingQuantity: inventoryProduct[0]?.quantity || 'N/A'
          }
        }
        groupedProducts[barcode].totalQuantity += Number(product.enteredQuantity)
      })
    })

    return Object.values(groupedProducts).sort((a, b) => b.totalQuantity - a.totalQuantity)
  }

  const groupedByProducts = groupAndSortProducts(saleStats)
  return (
    <InventoryTable
      groupedByProducts={groupedByProducts}
      handleCheckboxChange={handleCheckboxChange}
      checkedProducts={checkedProducts}
    />
  )
}

const displayQuantity = quantity => {
  return <Typography sx={{ fontSize: '50px', fontWeight: 'bold' }}>{quantity}</Typography>
}

const TableHeading = heading => {
  return <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{heading}</Typography>
}

const InventoryTable = ({ groupedByProducts, handleCheckboxChange, checkedProducts }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxHeight: 600, overflow: 'auto', mt: 10 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>{TableHeading('Product')}</TableCell>
            <TableCell>{TableHeading('Sold Quantity')} </TableCell>
            <TableCell>{TableHeading('Inventory Quantity')} </TableCell>
            <TableCell>{TableHeading('Check')} </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedByProducts.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Product product={item} />
              </TableCell>
              <TableCell>{displayQuantity(item.totalQuantity || 'N/A')}</TableCell>
              <TableCell>{displayQuantity(item.inventoryQuantity || 'N/A')}</TableCell>
              <TableCell>
                <TableCell>
                  <Checkbox
                    color='primary'
                    checked={!!checkedProducts[item.kbcwBarcode]}
                    onChange={event => handleCheckboxChange(event, item)}
                  />
                </TableCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductTable
