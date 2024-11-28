import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { db } from "../../../config/Firebase"; // Import your Firebase config
import {
  query,
  where,
  getDocs,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore"; // For updating and fetching document

const UpdateQuantity = ({ setRefresh }) => {
  const [open, setOpen] = useState(false); // To control dialog open/close
  const [barcode, setBarcode] = useState(""); // State for barcode input
  const [quantity, setQuantity] = useState(""); // State for quantity input
  const [error, setError] = useState(null); // State to store error messages

  const handleOpen = () => setOpen(true); // Open dialog
  const handleClose = () => setOpen(false); // Close dialog

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if barcode and quantity are entered
    if (!barcode || !quantity) {
      setError("Please provide both barcode and quantity.");
      return;
    }

    try {
      // Trim barcode input to avoid extra spaces
      const barcodeStr = barcode.trim();

      console.log("Searching for barcode:", barcodeStr);

      // Query Firestore to find the inventory document by barcode
      const q = query(
        collection(db, "inventory"),
        where("barcode", "==", barcodeStr)
      );

      // Fetch documents that match the barcode
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No inventory found with the provided barcode.");
        console.log("No document found with the given barcode.");
        return;
      }

      // Get the first matching document
      const docSnapshot = querySnapshot.docs[0];
      const inventoryDocRef = docSnapshot.ref;

      console.log("Document found:", docSnapshot.data());

      // Get the current quantity value and parse it as an integer
      const currentQuantity = parseInt(docSnapshot.data().quantity, 10);

      // Parse the input quantity as an integer
      const quantityToAdd = parseInt(quantity, 10);

      if (isNaN(quantityToAdd)) {
        setError("Invalid quantity entered. Please provide a valid number.");
        return;
      }

      // Calculate the new quantity
      const newQuantity = currentQuantity + quantityToAdd;

      // Update the quantity field in Firestore
      await updateDoc(inventoryDocRef, {
        quantity: newQuantity,
      });

      alert("Quantity updated successfully!");
      setRefresh((prev) => !prev); // Refresh the inventory list
      setOpen(false); // Close the dialog after successful update
    } catch (error) {
      console.error("Error updating quantity: ", error);
      setError(
        `Error updating quantity. ${
          error.message || "Please check your input and try again."
        }`
      );
    }
  };


  return (
    <div>
      {/* Update Quantity Button */}
      <Button variant="contained" color="success" onClick={handleOpen}>
        Update Quantity
      </Button>

      {/* Display Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Dialog for updating quantity */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Quantity</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Barcode"
              name="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateQuantity;
