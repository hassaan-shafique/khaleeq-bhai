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
  // State to hold the selected inventory type filter
  const [selectedType, setSelectedType] = useState("");

  // Handle inventory type change
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Filter the inventory based on the selected type
  const filteredInventory = selectedType
    ? inventory.filter((item) => item.type === selectedType)
    : inventory; // Show all if no type is selected

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
                            style={{ width: "100px", height: "100px" }}
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
        </>
      )}
    </Box>
  );
};

export default InventoryList;
