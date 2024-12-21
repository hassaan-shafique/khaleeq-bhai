import React, { useState,useEffect} from "react";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import DatePicker from "react-datepicker";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../../../../config/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

function AddKbcw({ kbcwProducts, setKbcwProducts, onKbcwPriceChange }) {

  const [updating, setUpdating] = useState(false);

  const handleKbcwProductChange = (index, field, value) => {
    const updatedProducts = [...kbcwProducts];
    updatedProducts[index][field] = value;
    setKbcwProducts(updatedProducts);



    if (field === "kbcwBarcode") {
      fetchProductData(value, index);
    }

    if (field === "kbcwQuantity") {
      handleQuantityChange(index, value);
    }
  };

  const fetchProductData = async (barcode, index) => {
    if (!barcode) return;

    try {
      const q = query(
        collection(db, "inventory"),
        where("barcode", "==", barcode)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const productDoc = querySnapshot.docs[0];
        const productData = productDoc.data();

        const updatedProducts = [...kbcwProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          kbcwName: productData.name,
          kbcwPrice: productData.price,
          kbcwSize: productData.size,
          kbcwImage: productData.image,
          inventoryQuantity: productData.quantity, // Initial inventory quantity
        };
        setKbcwProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleQuantityChange = async (index, enteredQuantity) => {
    if (updating) return; // Prevent multiple clicks
    setUpdating(true); // Lock the button during update
  
    const product = kbcwProducts[index];
    const remainingQuantity = product.inventoryQuantity - enteredQuantity;
  
    if (remainingQuantity < 0) {
      alert("Insufficient stock in inventory");
      setUpdating(false); // Unlock button on error
      return;
    }
  
    const updatedProducts = [...kbcwProducts];
    updatedProducts[index].inventoryQuantity = remainingQuantity;
    setKbcwProducts(updatedProducts);
  
    // Update inventory quantity in Firestore
    try {
      const q = query(
        collection(db, "inventory"),
        where("barcode", "==", product.kbcwBarcode)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const productDocRef = doc(db, "inventory", querySnapshot.docs[0].id);
  
        // Ensure the update happens atomically
        await updateDoc(productDocRef, { quantity: remainingQuantity });
  
        alert("Quantity updated successfully");
      }
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
      alert("Error updating quantity. Please try again.");
    } finally {
      setUpdating(false); // Unlock button after update
    }
  };



  
  const handleRemove = (index) => {
    const newProducts = kbcwProducts.filter((_, i) => i !== index);
    setKbcwProducts(newProducts);
  };
  useEffect(() => {
    const totalKbcwPrice = kbcwProducts.reduce((total, product) => {
      const price = parseFloat(product.kbcwPrice) || 0;
      return total + price;
    }, 0);
    onKbcwPriceChange(totalKbcwPrice); // Pass total up
  }, [kbcwProducts, onKbcwPriceChange]);

  return (
    <Box sx={{ marginTop: "20px" }}>
      {kbcwProducts.map((product, index) => (
        <div key={index}>
          <h3>KBCW Product #{index + 1}</h3>
          {product.kbcwImage && (
            <Grid item xs={4}>
              <Paper
                elevation={3}
                sx={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={product.kbcwImage}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    backgroundColor: "#808080",
                  }}
                />
                <Box sx={{ marginTop: "8px", fontSize: "14px", color: "#333" }}>
                  Product Image
                </Box>
              </Paper>
            </Grid>
          )}
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            {/* Other fields */}

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>KBCW Inventory Type</InputLabel>
                <Select
                  value={product.kbcwInventoryType}
                  onChange={(e) =>
                    handleKbcwProductChange(
                      index,
                      "kbcwInventoryType",
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="Cleaners">Cleaners</MenuItem>
                  <MenuItem value="Solutions">Solutions</MenuItem>
                  <MenuItem value="Frames">Frames</MenuItem>
                  <MenuItem value="contact Lense">Contact Lenses</MenuItem>
                  <MenuItem value="Covers">Covers</MenuItem>
                  <MenuItem value="Covers">sun Glasses</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="KBCW Barcode"
                value={product.kbcwBarcode}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwBarcode", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={product.kbcwName || ""}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={product.kbcwSize || ""}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwSize", e.target.value)
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
              required
                type="number"
                label="Quantity"
                variant="outlined"
                fullWidth
                value={product.enteredQuantity || ""}
                onChange={(e) =>
                  setKbcwProducts((prev) => {
                    const updatedProducts = [...prev];
                    updatedProducts[index].enteredQuantity = e.target.value;
                    return updatedProducts;
                  })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={product.kbcwPrice || ""}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={product.kbcwDeliveredDate}
                onChange={(date) =>
                  handleKbcwProductChange(index, "kbcwDeliveredDate", date)
                }
                customInput={
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Delivery Date"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                    }}
                  />
                }
                placeholderText="Select Delivered Date"
                className="datepicker"
                style={{ width: "100%" }}
              />
            </Grid>
            {/* Display Product Image */}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end",gap:"0.5rem" }}>
           
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleQuantityChange(index, product.enteredQuantity)
                }
                disabled={updating} 
              >
                 {updating ? "Updating..." : ""}
                Click Here to Update Kbcw Inventory Quantity  

              </Button>
         
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemove(index)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </div>
      ))}
    </Box>
  );
}

export default AddKbcw;
