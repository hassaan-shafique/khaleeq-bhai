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
import { db } from "../../../config/Firebase";
import {
  query,
  where,
  getDocs,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore"; 

const UpdateQuantity = ({ setRefresh }) => {

  const [open, setOpen] = useState(false); 
  const [barcode, setBarcode] = useState(""); 
  const [quantity, setQuantity] = useState(""); 
  const [error, setError] = useState(null); 

  const handleOpen = () => setOpen(true); 
  const handleClose = () => setOpen(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!barcode || !quantity) {
      setError("Please provide both barcode and quantity.");
      return;
    }

    try {
     
      const barcodeStr = barcode.trim();

      console.log("Searching for barcode:", barcodeStr);

     
      const q = query(
        collection(db, "inventory"),
        where("barcode", "==", barcodeStr)
      );

     
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No inventory found with the provided barcode.");
        console.log("No document found with the given barcode.");
        return;
      }

    
      const docSnapshot = querySnapshot.docs[0];
      const inventoryDocRef = docSnapshot.ref;

      console.log("Document found:", docSnapshot.data());

      
      const currentQuantity = parseInt(docSnapshot.data().quantity, 10);

    
      const quantityToAdd = parseInt(quantity, 10);

      if (isNaN(quantityToAdd)) {
        setError("Invalid quantity entered. Please provide a valid number.");
        return;
      }

     
      const newQuantity = currentQuantity + quantityToAdd;

     
      await updateDoc(inventoryDocRef, {
        quantity: newQuantity,
      });
      setRefresh((prev) => !prev);

      alert("Quantity updated successfully!");
      window.location.reload(); 
     
      setOpen(false); 
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
     
      <Button variant="contained" color="success" onClick={handleOpen}>
        Update Quantity
      </Button>

     
      {error && <Typography color="error">{error}</Typography>}

      
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
