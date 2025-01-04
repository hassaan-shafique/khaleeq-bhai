import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel
} from '@mui/material'
import Webcam from 'react-webcam'
import { query, where, getDocs } from 'firebase/firestore'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { addDoc, collection } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from '../../../config/Firebase'

const InventoryForm = ({ setRefresh }) => {
  const [inventoryTypes, setInventoryTypes] = useState([{ label: 'Other', value: 'other' }])

  const [formData, setFormData] = useState({
    type: ''
  })
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState({
    barcode: '',
    price: '',
    quantity: '',
    size: '',
    type: '',
    name: '',
    color: '',
    selectedDate: new Date()
  })
  const [image, setImage] = useState(null)
  const [customType, setCustomType] = useState('') // State to handle custom type
  const [errors, setErrors] = useState({})
  const [barcode, setBarcode] = useState()
  const [imageBlob, setImageBlob] = useState('')

  const storage = getStorage()

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleRemoveImage = () => {
    if (image) {
      URL.revokeObjectURL(image)
      setImage(null)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setValue(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDateChange = date => {
    setValue(prev => ({
      ...prev,
      selectedDate: date
    }))
  }

  useEffect(() => {
    const fetchInventoryTypes = async () => {
      const typesCollection = collection(db, 'inventoryTypes')
      const snapshot = await getDocs(typesCollection)
      const fetchedTypes = snapshot.docs.map(doc => doc.data())
      setInventoryTypes(prev => [
        ...prev.filter(type => type.value === 'other'), // Keep "Other" always in dropdown
        ...fetchedTypes
      ])
    }

    fetchInventoryTypes()
  }, [])

  const handleAddCustomType = async () => {
    if (customType.trim() && !inventoryTypes.some(type => type.value.toLowerCase() === customType.toLowerCase())) {
      const newType = {
        label: customType,
        value: customType.toLowerCase().replace(/\s+/g, '_') // Normalize value
      }

      try {
        const typesCollection = collection(db, 'inventoryTypes')
        await addDoc(typesCollection, newType)
        setInventoryTypes(prev => [...prev, newType]) // Update dropdown
        setFormData(prev => ({ ...prev, type: newType.value })) // Set the selected type
        setCustomType('') // Clear input field
      } catch (error) {
        console.error('Error adding custom type to Firestore:', error)
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!value.barcode) newErrors.barcode = 'Barcode is required'
    if (!value.quantity) newErrors.quantity = 'Quantity is required'
    if (!image) newErrors.image = 'Image is required'
    if (value.type === 'other' && !customType) newErrors.customType = 'Custom type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkBarcodeExistence = async barcode => {
    const inventoryCollectionRef = collection(db, 'inventory')
    const q = query(inventoryCollectionRef, where('barcode', '==', barcode))

    try {
      // Add logs to track query execution and barcode being passed
      console.log('Checking for barcode:', barcode)

      const querySnapshot = await getDocs(q)

      // Debug the query result
      console.log('Query snapshot empty:', querySnapshot.empty) // This will log true if no matching documents, false if found

      querySnapshot.forEach(doc => {
        console.log('Matching document:', doc.id, doc.data()) // Log the document ID and its data
      })

      return !querySnapshot.empty // If the snapshot is empty, it means no matching barcode was found
    } catch (error) {
      console.error('Error checking barcode existence:', error)
      return false
    }
  }

  // Utility function to convert Base64 to Blob

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const isBarcodeExists = await checkBarcodeExistence(value.barcode)

      if (isBarcodeExists) {
        alert(`An item with the barcode "${value.barcode}" already exists.`)
        setLoading(false) // Reset loading state
        return // Stop further processing
      }

      // Ensure the image exists before proceeding
      if (image) {
        const uniqueImageName = `${Date.now()}-${image.name}`
        const storageRef = ref(storage, `inventory-images/${uniqueImageName}`)

        // Upload the file directly
        const snapshot = await uploadBytes(storageRef, image)
        console.log('Upload snapshot:', snapshot)

        // Get the download URL
        const imageUrl = await getDownloadURL(storageRef)
        console.log('Image URL:', imageUrl)

        // Save the data to Firestore
        const inventoryCollectionRef = collection(db, 'inventory')
        const docRef = await addDoc(inventoryCollectionRef, {
          ...value,
          type: value.type === 'other' ? customType : value.type,
          image: imageUrl // Save the download URL in Firestore
        })

        console.log('Document added with ID:', docRef.id)

        // Reset form and UI states
        setOpen(false)
        setRefresh(prev => !prev)
      } else {
        console.error('No image selected for upload.')
      }
    } catch (error) {
      console.error('Error adding document: ', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    setErrors({})
    setImage(null) // Clear image selection on close
  }

  return (
    <div>
      <Typography
        variant='h5'
        sx={{
          m: 3,
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        Inventory
        <Button variant='contained' sx={{ bgcolor: '#448EE4', m: 1, px: 9 }} onClick={handleClickOpen}>
          Add Inventory
        </Button>
      </Typography>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogTitle>Add Inventory</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill in the details of the new inventory item.</DialogContentText>
          <form onSubmit={handleSubmit}>
            <Typography variant='h7'>Select Date</Typography>
            <DatePicker
              selected={value.selectedDate}
              onChange={handleDateChange}
              customInput={
                <TextField
                  fullWidth
                  variant='outlined'
                  sx={{ mt: 1 }}
                  error={Boolean(errors.selectedDate)}
                  helperText={errors.selectedDate}
                  required
                />
              }
            />
            <TextField
              type='string'
              label='Barcode'
              name='barcode'
              value={value.barcode}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              required
              error={Boolean(errors.barcode)}
              helperText={errors.barcode}
            />

            <Box>
              {/* Image Upload Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <label
                  htmlFor='image-upload'
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {image ? (
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt='Product Preview'
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <AddAPhotoIcon sx={{ fontSize: '40px', color: '#555' }} />
                  )}
                  <Typography sx={{ ml: 1 }}>{image ? 'Change Image' : 'Choose Image'}</Typography>
                </label>
                <input
                  type='file'
                  id='image-upload'
                  accept='image/*'
                  capture='environment' // Opens back camera by default
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {image && (
                  <Typography
                    onClick={handleRemoveImage}
                    sx={{
                      ml: 2,
                      cursor: 'pointer',
                      color: 'red',
                      textDecoration: 'underline'
                    }}
                  >
                    Remove
                  </Typography>
                )}
              </Box>

              {/* Captured Image Section */}
              {image && (
                <Box
                  sx={{
                    width: '100%',
                    mt: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <Typography variant='subtitle1' align='center' gutterBottom>
                    Captured/Uploaded Image
                  </Typography>
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt='Captured/Uploaded'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              )}
            </Box>

            {errors.image && <Typography color='error'>{errors.image}</Typography>}

            <FormControl fullWidth margin='normal' required>
              <InputLabel id='inventory-type-label'>Inventory Type</InputLabel>
              <Select
                labelId='inventory-type-label'
                id='inventory-type'
                name='type'
                value={value.type}
                onChange={handleInputChange}
              >
                {inventoryTypes.map(item => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Custom Type Text Field */}
            {value.type === 'other' && (
              <div>
                <TextField
                  label='Custom Inventory Type'
                  value={customType}
                  onChange={e => setCustomType(e.target.value)}
                  fullWidth
                  margin='normal'
                />
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleAddCustomType}
                  disabled={!customType.trim()} // Disable if input is empty
                >
                  Add Custom Type
                </Button>
              </div>
            )}

            <TextField
              label='Name'
              name='name'
              type='string'
              value={value.name}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              label='Price'
              type='number'
              name='price'
              value={value.price}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              error={Boolean(errors.price)}
              helperText={errors.price}
            />
            <TextField
              label='Quantity'
              type='number'
              name='quantity'
              value={value.quantity}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
              required
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
            />
            <TextField
              label='Color'
              name='color'
              value={value.color}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
            />
            <TextField
              label='Size'
              name='size'
              value={value.size}
              onChange={handleInputChange}
              fullWidth
              margin='normal'
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default InventoryForm
