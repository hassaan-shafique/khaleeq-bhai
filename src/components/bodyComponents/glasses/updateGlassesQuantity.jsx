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
} from "firebase/firestore"; // For updating and fetching document

const UpdateGlassesQuantity = ({ setRefresh }) => {
  const [open, setOpen] = useState(false); // To control dialog open/close
  const [number, setNumber] = useState(""); // State for number input
  const [type, setType] = useState(""); // State for type input
  const [quantity, setQuantity] = useState(""); // State for quantity input
  const [error, setError] = useState(null); // State to store error messages

  const handleOpen = () => setOpen(true); // Open dialog
  const handleClose = () => {
    setOpen(false); // Close dialog
    setError(null); // Clear errors
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate inputs
  if (!number || !type || !quantity) {
    setError("Please provide the number, type, and quantity.");
    return;
  }

  // Flexible validation for number input (allowing various formats)
  const numberPattern = /^[-+]?\d+(\.\d+)?(\/[-+]?\d+(\.\d+)?)?$/; // Handles single numbers or "num/num"
  if (!numberPattern.test(number)) {
    setError(
      "Invalid number format. Examples: '1332', '1.25/1.30', '-1.25/-1.25', '+3.4/+6.5'."
    );
    return;
  }

  try {
    // Normalize number input by trimming and removing spaces
    const formattedNumber = number
      .trim() // Remove leading/trailing spaces
      .replace(/\s+/g, ""); // Remove any spaces within the input

    console.log("Formatted number:", formattedNumber);

    // Normalize type input (convert to lowercase to avoid case-sensitivity issues)
    const normalizedType = type.trim().toLowerCase(); // Convert to lowercase

    console.log("Searching for glasses:", {
      number: formattedNumber,
      type: normalizedType,
    });

    // Query Firestore for the glasses document by number and type
    const q = query(
      collection(db, "glasses"), // Replace with your Firestore collection name
      where("number", "==", formattedNumber), // Match the formatted number
      where("type", "==", normalizedType) // Match the normalized type (lowercase)
    );

    // Fetch matching documents
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setError("No glasses found with the provided number and type.");
      console.log("No document found with the given criteria.");
      return;
    }

    // Get the first matching document
    const docSnapshot = querySnapshot.docs[0];
    const glassesDocRef = docSnapshot.ref;

    console.log("Document found:", docSnapshot.data());

    // Get the current quantity and parse it as an integer
    const currentQuantity = parseInt(docSnapshot.data().quantity, 10);

    // Parse the input quantity as an integer
    const quantityToAdd = parseInt(quantity, 10);

    if (isNaN(quantityToAdd)) {
      setError("Invalid quantity entered. Please provide a valid number.");
      return;
    }

    // Calculate the new quantity
    const newQuantity = currentQuantity + quantityToAdd;

    // Update the Firestore document
    await updateDoc(glassesDocRef, {
      quantity: newQuantity,
    });

    alert("Glasses quantity updated successfully!");
    setRefresh((prev) => !prev); // Trigger a refresh
    setOpen(false); // Close the dialog
  } catch (error) {
    console.error("Error updating glasses quantity: ", error);
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
        Update Glasses Quantity
      </Button>

      {/* Display Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Dialog for updating quantity */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Glasses Quantity</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Number (e.g., 1.25/1.30)"
              name="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Type (e.g., ContactLenses)"
              name="type"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
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

export default UpdateGlassesQuantity;
