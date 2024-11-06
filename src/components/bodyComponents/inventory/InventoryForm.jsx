import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../config/Firebase";

const INVENTORY_TYPES = [
  { label: "Contact Lenses", value: "ContactLenses" },
  { label: "Covers", value: "covers" },
  { label: "Frames", value: "Frames" },
  { label: "Solutions", value: "solutions" },
  { label: "Cleaners", value: "cleaners" },
  { label: "Other", value: "other" }, // Added "Other" option
];

const InventoryForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    barcode: "",
    price: "",
    quantity: "",
    size: "",
    type: "",
    name: "",
    selectedDate: new Date(),
  });
  const [image, setImage] = useState(null);
  const [customType, setCustomType] = useState(""); // State to handle custom type
  const [errors, setErrors] = useState({});

  const storage = getStorage();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setValue((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!value.barcode) newErrors.barcode = "Barcode is required";
    if (!value.quantity) newErrors.quantity = "Quantity is required";
    if (!image) newErrors.image = "Image is required";
    if (value.type === "other" && !customType)
      newErrors.customType = "Custom type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const storageRef = ref(storage, `inventory-images/${image.name}`);
      await uploadBytes(storageRef, image);

      const imageUrl = await getDownloadURL(storageRef);

      const inventoryCollectionRef = collection(db, "inventory");
      await addDoc(inventoryCollectionRef, {
        ...value,
        type: value.type === "other" ? customType : value.type, // Use custom type if "Other" is selected
        image: imageUrl,
      });

      setOpen(false);
      setRefresh((prev) => !prev);
      setLoading(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
    }
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setImage(null); // Clear image selection on close
  };

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          m: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Inventory
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Inventory
        </Button>
      </Typography>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Inventory</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new inventory item.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <Typography variant="h7">Select Date</Typography>
            <DatePicker
              selected={value.selectedDate}
              onChange={handleDateChange}
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  error={Boolean(errors.selectedDate)}
                  helperText={errors.selectedDate}
                  required
                />
              }
            />
            <TextField
              label="Barcode"
              name="barcode"
              value={value.barcode}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={Boolean(errors.barcode)}
              helperText={errors.barcode}
            />
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <label htmlFor="image-upload">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product Preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <AddAPhotoIcon />
                )}
                <Typography sx={{ ml: 1 }}>Choose Image</Typography>
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*" // Allow all image types
                capture="camera" // Open the camera directly
                style={{ display: "none" }}
                onChange={handleImageChange}
                
              />
            </Box>
            {errors.image && (
              <Typography color="error">{errors.image}</Typography>
            )}

            <Select
              label="Inventory Type"
              name="type"
              value={value.type}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            >
              {INVENTORY_TYPES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>

            {value.type === "other" && (
              <TextField
                label="Custom Inventory Type"
                name="customType"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                fullWidth
                margin="normal"
                required
                error={Boolean(errors.customType)}
                helperText={errors.customType}
              />
            )}

            <TextField
              label="Name"
              name="name"
              value={value.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
            <TextField
              label="Price"
              type="number"
              name="price"
              value={value.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              error={Boolean(errors.price)}
              helperText={errors.price}
            />
            <TextField
              label="Quantity"
              type="number"
              name="quantity"
              value={value.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
            />
            <TextField
              label="Size"
              name="size"
              value={value.size}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryForm;

