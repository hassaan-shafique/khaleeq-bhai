import React from 'react'
import { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button } from '@mui/material'
import InventoryList from './InventoryList'
import InventoryForm from './InventoryForm'
import { db } from '../../../config/Firebase'
import { collection, getDocs } from 'firebase/firestore'

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [inventoryRefresh, setInventoryRefresh] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 25
  })

  const fetchInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'inventory'))
      const inventoryData = []
      querySnapshot.forEach(doc => {
        inventoryData.push({ id: doc.id, ...doc.data() })
      })
      setInventory(inventoryData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching Inventory: ', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [inventoryRefresh])

  return (
    <>
      <Box sx={{ width: '98%', marginTop: 6 }}>
        <Grid container sx={{ mx: 3, p: 3, width: '100%' }}>
          <Grid item md={12} sx={{ width: '98%' }}>
            <Box
              sx={{
                margin: 3,
                width: '98%',
                bgcolor: 'white',
                borderRadius: 2,
                padding: 3,
                height: '100%'
              }}
            >
              <InventoryForm setRefresh={setInventoryRefresh} />
              <InventoryList inventory={inventory} setInventoryRefresh={setInventoryRefresh} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Inventory
