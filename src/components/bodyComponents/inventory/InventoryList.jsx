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
} from "@mui/material";

// Function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const InventoryList = ({ inventory = [], loading = false }) => {
  // State to hold the selected inventory type and price filter
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  // State to manage dialog visibility and selected image
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Handle inventory type change
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Handle price range change
  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
  };

  // Open dialog with selected image
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage("");
  };

  // Filter the inventory based on the selected type and price range
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
          return true; // Show all if no price range is selected
      }
    };
    return matchesType && matchesPriceRange();
  });

  // Extract unique inventory types from the inventory array
  const inventoryTypes = [...new Set(inventory.map((item) => item.type))];

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Inventory Type Filter Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Inventory Type</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              label="Filter by Inventory Type"
            >
              <MenuItem value="">All</MenuItem>
              {inventoryTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price Range Filter Dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Filter by Price Range</InputLabel>
            <Select
              value={selectedPriceRange}
              onChange={handlePriceRangeChange}
              label="Filter by Price Range"
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
            </Select>
          </FormControl>

          {filteredInventory.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Inventory found....
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Inventory ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Inventory Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
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
                            onClick={() => handleImageClick(item.image)} // Open dialog on click
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
                      <TableCell>{item.size}</TableCell>
                      <TableCell>
                        {item.selectedDate
                          ? formatTimestamp(item.selectedDate)
                          : "No Date"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Image Dialog */}
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
        </>
      )}
    </Box>
  );
};

export default InventoryList;
