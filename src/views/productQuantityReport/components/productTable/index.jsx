import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import Product from '../product'

const ProductTable = ({ saleStats, handleCheckboxChange, checkedProducts, inventoryData }) => {
  const [groupedByProducts, setGroupedByProducts] = useState([])

  // Function to group and sort products
  const groupAndSortProducts = () => {
    const groupedProducts = {}

    saleStats.forEach(sale => {
      sale.kbcwProducts.forEach(product => {
        const barcode = product.kbcwBarcode
        const inventoryProduct = inventoryData.find(f => f.barcode === barcode)

        if (!groupedProducts[barcode]) {
          groupedProducts[barcode] = {
            ...product,
            totalQuantity: 0,
            remainingQuantity: inventoryProduct ? inventoryProduct.quantity : 'N/A'
          }
        }

        groupedProducts[barcode].totalQuantity += Number(product.enteredQuantity)
      })
    })

    return Object.values(groupedProducts).sort((a, b) => b.totalQuantity - a.totalQuantity)
  }

  // Update grouped products whenever saleStats or inventoryData changes
  useEffect(() => {
    setGroupedByProducts(groupAndSortProducts())
  }, [saleStats, inventoryData]) // Depend on both `saleStats` and `inventoryData`

  return (
    <InventoryTable
      groupedByProducts={groupedByProducts}
      handleCheckboxChange={handleCheckboxChange}
      checkedProducts={checkedProducts}
    />
  )
}

const displayQuantity = quantity => (
  <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{quantity}</Typography>
)

const TableHeading = heading => (
  <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{heading}</Typography>
)

const InventoryTable = ({ groupedByProducts, handleCheckboxChange, checkedProducts }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, maxHeight: 600, overflow: 'auto', mt: 5 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#616161" }}>
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
              <TableCell>{displayQuantity(item.remainingQuantity || 'N/A')}</TableCell>
              <TableCell>
                <Checkbox
                  color='primary'
                  checked={!!checkedProducts[item.kbcwBarcode]}
                  onChange={event => handleCheckboxChange(event, item)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductTable
