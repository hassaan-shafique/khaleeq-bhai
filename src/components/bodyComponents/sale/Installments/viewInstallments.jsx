import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../../config/Firebase'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export const ViewInstallment = ({ id, open, handleClose }) => {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState(null)

  // Fetch installments from Firebase
  const fetchInstallments = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'salesInstallments'))
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setInstallments(data.filter(f => f.saleId === id))
    } catch (error) {
      console.error('Error fetching installments:', error)
      setError('Failed to fetch installments. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchInstallments()
  }, [id])

  // Handle Edit Click
  const handleEditClick = installment => {
    setSelectedInstallment({ ...installment })
    setEditDialogOpen(true)
  }

  // Handle Delete Click
  const handleDeleteClick = installment => {
    setSelectedInstallment(installment)
    setDeleteDialogOpen(true)
  }

  // Update Firestore Installment
  const handleUpdateInstallment = async () => {
    if (!selectedInstallment) return

    try {
      // Log the current selected installment before updating
      console.log('Before update, selectedInstallment:', selectedInstallment)

      // Determine if the date is a Firestore Timestamp and convert accordingly
      let parsedDate
      if (selectedInstallment.date && selectedInstallment.date.toDate) {
        parsedDate = selectedInstallment.date.toDate()
        console.log('Converted Firestore Timestamp to Date:', parsedDate)
      } else {
        parsedDate = new Date(selectedInstallment.date)
        console.log('Parsed date from string:', parsedDate)
      }

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date value: ' + selectedInstallment.date)
      }
      console.log('Parsed Date is valid:', parsedDate)

      // Get a reference to the document in Firestore
      const installmentRef = doc(db, 'salesInstallments', selectedInstallment.id)
      console.log('Updating installment document at path:', installmentRef.path)

      // Update the document with the new values
      await updateDoc(installmentRef, {
        amount: Number(selectedInstallment.amount),
        payment: selectedInstallment.payment,
        date: parsedDate // Storing as a Date object
      })
      console.log('Update successful!')

      // Refresh the data after update and close the dialog
      await fetchInstallments()
      setEditDialogOpen(false)
    } catch (error) {
      console.error('Error updating installment:', error)
      setError('Failed to update installment.')
    }
  }

  // Delete Firestore Installment
  const handleDeleteInstallment = async () => {
    if (!selectedInstallment) return

    try {
      const installmentRef = doc(db, 'salesInstallments', selectedInstallment.id)
      await deleteDoc(installmentRef)

      fetchInstallments()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting installment:', error)
      setError('Failed to delete installment.')
    }
  }

  // Calculate Total Amount
  const totalAmount = installments.reduce((sum, installment) => sum + Number(installment.amount || 0), 0)

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle>Installments</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
                <CircularProgress />
              </div>
            ) : error ? (
              <p>{error}</p>
            ) : installments.length ? (
              <>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align='left' sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        Amount
                      </TableCell>
                      <TableCell align='left' sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        Payment Method
                      </TableCell>
                      <TableCell align='left' sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        Date
                      </TableCell>
                      <TableCell align='left' sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {installments.map(installment => (
                      <TableRow key={installment.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                        <TableCell align='left'>Rs. {installment.amount}</TableCell>
                        <TableCell align="left">{installment?.payment || "Unknown"}</TableCell>
                        <TableCell align='left'>
                          {installment.date
                            ? installment.date.toDate
                              ? installment.date.toDate().toLocaleDateString()
                              : new Date(installment.date).toLocaleDateString()
                            : 'Invalid Date'}
                        </TableCell>
                        <TableCell align='left'>
                          <IconButton onClick={() => handleEditClick(installment)} color='primary'>
                            <EditIcon />
                          </IconButton>
                          {/* <IconButton onClick={() => handleDeleteClick(installment)} color='error'>
                            <DeleteIcon />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography variant='h6' sx={{ textAlign: 'right', marginTop: 2, fontWeight: 'bold' }}>
                  Total: Rs. {totalAmount}
                </Typography>
              </>
            ) : (
              <p>No installments available.</p>
            )}
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Installment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label='Amount'
            type='number'
            fullWidth
            value={selectedInstallment?.amount || ''}
            onChange={e => setSelectedInstallment(prev => ({ ...prev, amount: e.target.value }))}
          />
          <TextField
            select
            label='Payment Method'
            fullWidth
            value={selectedInstallment?.payment || ''}
            onChange={e => setSelectedInstallment(prev => ({ ...prev, payment: e.target.value }))}
          >
            <MenuItem value='Cash'>Cash</MenuItem>
            <MenuItem value='Card'>Bank</MenuItem>
            <MenuItem value='JazzCash'>JazzCash</MenuItem>
            <MenuItem value='EasyPaisa'>EasyPaisa</MenuItem>
          </TextField>
          <TextField
            label='Date'
            type='date'
            fullWidth
            value={
              selectedInstallment
                ? selectedInstallment.date && selectedInstallment.date.toDate
                  ? selectedInstallment.date.toDate().toISOString().split('T')[0]
                  : new Date(selectedInstallment.date).toISOString().split('T')[0]
                : ''
            }
            onChange={e => setSelectedInstallment(prev => ({ ...prev, date: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleUpdateInstallment} color='primary' variant='contained'>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this installment?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteInstallment} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewInstallment
