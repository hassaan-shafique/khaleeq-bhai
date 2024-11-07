import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { db } from "../../../config/Firebase"; // Adjust to your Firebase setup
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Firestore functions

const InventoryList = ({ inventory = [], loading = false }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const handleTypeChange = (event) => setSelectedType(event.target.value);
  const handlePriceRangeChange = (event) =>
    setSelectedPriceRange(event.target.value);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const openEditDialog = (item) => {
    setEditableItem({ ...item }); // Clone the item to avoid mutating the original object
    setEditDialogOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditableItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (editableItem) {
      const itemRef = doc(db, "inventory", editableItem.id); // Replace 'inventory' with your collection name
      await updateDoc(itemRef, {
        name: editableItem.name,
        price: Number(editableItem.price),
        quantity: Number(editableItem.quantity),
        type: editableItem.type,
        size: editableItem.size,
      });
      setEditDialogOpen(false);
    }
  };

  const handleDeleteItem = async (id) => {
    const itemRef = doc(db, "inventory", id);
    await deleteDoc(itemRef);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesType = selectedType === "" || item.type === selectedType;
    const matchesPriceRange = () => {
      switch (selectedPriceRange) {
        case "1":
          return item.price >= 350 && item.price <= 600;
        case "2":
          return item.price >= 601 && item.price <= 950;
        case "3":
          return item.price >= 951 && item.price <= 1250;
        case "4":
          return item.price >= 1251 && item.price <= 1550;
        case "5":
          return item.price >= 1551 && item.price <= 1850;
        case "6":
          return item.price >= 1851 && item.price <= 2550;
        case "7":
          return item.price >= 2551 && item.price <= 3500;
        case "8":
          return item.price >= 3501 && item.price <= 6000;
        case "9":
          return item.price >= 6001 && item.price <= 10000;
        case "10":
          return item.price >= 10001 && item.price <= 30000;
        case "11":
          return item.price >= 30001 && item.price <= 50000;
        
        default:
          return true;
      }
    };
    return matchesType && matchesPriceRange();
  });

  const inventoryTypes = [...new Set(inventory.map((item) => item.type))];

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Inventory Type</InputLabel>
            <Select value={selectedType} onChange={handleTypeChange}>
              <MenuItem value="">All</MenuItem>
              {inventoryTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Price Range</InputLabel>
            <Select
              value={selectedPriceRange}
              onChange={handlePriceRangeChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Rs. 350 to 600</MenuItem>
              <MenuItem value="2">Rs. 601 to 950</MenuItem>
              <MenuItem value="3">Rs. 951 to 1250</MenuItem>
              <MenuItem value="4">Rs. 1251 to 1550</MenuItem>
              <MenuItem value="5">Rs. 1551 to 1850</MenuItem>
              <MenuItem value="6">Rs. 1851 to 2550</MenuItem>
              <MenuItem value="7">Rs. 2551 to 3500</MenuItem>
              <MenuItem value="8">Rs. 3501 to 6000</MenuItem>
              <MenuItem value="9">Rs. 6001 to 10000</MenuItem>
              <MenuItem value="10">Rs. 10001 to 30000</MenuItem>
              <MenuItem value="11">Rs. 30001 to 50000</MenuItem>
              {/* Add other price ranges */}
            </Select>
          </FormControl>

          {filteredInventory.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Inventory found....
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 500, maxWidth: "100%", overflowX: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Inventory ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Barcode</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInventory.map((item, i) => (
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={`Image ${i + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleImageClick(item.image)}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>{item.barcode}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>Rs.{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Button onClick={() => openEditDialog(item)}>
                          Edit
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Image Preview Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
            <DialogTitle>Image Preview</DialogTitle>
            <DialogContent>
              <img
                src={selectedImage}
                alt="Selected"
                style={{ width: "100%", height: "auto" }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Item Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            maxWidth="sm"
          >
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                name="name"
                value={editableItem?.name || ""}
                onChange={handleEditInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={editableItem?.price || ""}
                onChange={handleEditInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={editableItem?.quantity || ""}
                onChange={handleEditInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Type"
                name="type"
                value={editableItem?.type || ""}
                onChange={handleEditInputChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Size"
                name="size"
                value={editableItem?.size || ""}
                onChange={handleEditInputChange}
                fullWidth
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setEditDialogOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default InventoryList;
