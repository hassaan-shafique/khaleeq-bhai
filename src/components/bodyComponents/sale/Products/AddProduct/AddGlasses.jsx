


import {
  TextField,
  Box,
  Grid,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect,useState} from  'react';
import { getDocs,doc } from "firebase/firestore";
import { db } from "../../../../../config/Firebase";

const AddGlasses = ({
  glassesProducts,
  setGlassesProducts,
  onGlassesPriceChange,

}) => {
  const [totalGlassesPrice, setTotalGlassesPrice] = useState();

  // const handleGlassesProductChange = (index, field, value) => {
  //   const newProducts = [...glassesProducts];
  //   newProducts[index][field] = value;
  //   setGlassesProducts(newProducts);
  // };
 const handleGlassesProductChange = (index, field, value) => {
   const updatedProducts = [...glassesProducts];
   updatedProducts[index][field] = value;
   setGlassesProducts(updatedProducts);

   // If either glassesNumber or glassesType changes, fetch product data
   if (field === "glassesNumber" || field === "glassesType") {
     const glassesNumber = updatedProducts[index].glassesNumber;
     const glassesType = updatedProducts[index].glassesType;
     if (glassesNumber && glassesType) {
       fetchGlassesData(glassesNumber, glassesType, index);
     }
   }

   // Optionally, handle quantity changes similarly
   if (field === "glassesQuantity") {
     handleQuantityChange(index, value); // Define this function if needed
   }
 };

 const fetchGlassesData = async (glassesNumber, glassesType, index) => {
   try {
     // Query Firestore with both glassesNumber and glassesType
     const q = query(
       collection(db, "glasses"),
       where("glassesNumber", "==", glassesNumber),
       where("glassesType", "==", glassesType)
     );
     const querySnapshot = await getDocs(q);

     if (!querySnapshot.empty) {
       const productDoc = querySnapshot.docs[0];
       const productData = productDoc.data();

       // Update product fields in the form
       const updatedProducts = [...glassesProducts];
       updatedProducts[index] = {
         ...updatedProducts[index],
         glassesName: productData.name,
         glassesPrice: productData.price,
         glassesSize: productData.size,
         inventoryQuantity: productData.quantity, // Initial inventory quantity
       };
       setGlassesProducts(updatedProducts);

       // Decrease inventory quantity in Firestore
       decrementInventoryQuantity(productDoc.id, productData.quantity);
     }
   } catch (error) {
     console.error("Error fetching product data:", error);
   }
 };

 const decrementInventoryQuantity = async (productId, currentQuantity) => {
   try {
     const newQuantity = currentQuantity - 1; // Adjust quantity as needed
     const productRef = doc(db, "inventory", productId);
     await updateDoc(productRef, { quantity: newQuantity });
   } catch (error) {
     console.error("Error updating inventory quantity:", error);
   }
 };

  const handleRemove = (index) => {
    const newProducts = glassesProducts.filter((_, i) => i !== index);
    setGlassesProducts(newProducts);
  };
  const handleDateChange = (date, key, index) => {
    const updatedProducts = [...glassesProducts]; // Create a copy of the products array
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: date, // Update the specific date field
    };
    setGlassesProducts(updatedProducts); // Update the state with new values
  };
  useEffect(() => {
    const totalGlassesPrice = glassesProducts.reduce((total, product) => {
      const price = parseFloat(product.glassesPrice) || 0;
      return total + price;
    }, 0);
    onGlassesPriceChange(totalGlassesPrice); // Pass total up
  }, [glassesProducts, onGlassesPriceChange]);

  return (
    <Box sx={{ marginTop: "20px" }}>
      {glassesProducts.map((glassesProducts, index) => (
        <div key={index}>
          <h3>Glasses Product #{index + 1}</h3>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <TextField
                label="Glasses Barcode"
                value={glassesProducts.glassesBarcode}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesBarcode",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Glasses Type"
                value={glassesProducts.glassesType || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesType",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={glassesProducts.glassesName || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesName",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={glassesProducts.glassesSize || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesSize",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Number"
                value={glassesProducts.glassesNumber || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={glassesProducts.glassesQuantity || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesQuantity",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={glassesProducts.glassesPrice || ""}
                onChange={(e) =>
                  handleGlassesProductChange(
                    index,
                    "glassesPrice",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={glassesProducts.glassesDeliveredDate || ""}
                onChange={(date) =>
                  handleDateChange(date, "glassesDeliveredDate", index)
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
                        borderColor: "#black",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#black",
                      },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#black",
                      },
                    }}
                  />
                }
                placeholderText="Select Delivered Date"
                className="datepicker"
                style={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/* <Box sx={{ marginTop: "20px" }}>
            <h3>
              Total Price For Glasses Product: Rs {totalGlassesPrice}
            </h3>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => decrementInventoryQuantity(index)}
            >
              Sell
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemove(index)}
              sx={{ marginLeft: "8px" }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </div>
      ))}
    </Box>
  );
};

export default AddGlasses;
