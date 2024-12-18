


import {
  TextField,
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useEffect,useState} from  'react';
import { getDocs,doc } from "firebase/firestore";
import { db } from "../../../../../config/Firebase";
import {
  
 
  updateDoc,
  query,
  where,
  collection,
} from "firebase/firestore";

const AddGlasses = ({
  glassesProducts,
  setGlassesProducts,
  onGlassesPriceChange,
}) => {
  const [totalGlassesPrice, setTotalGlassesPrice] = useState(0);
    const [updating, setUpdating] = useState(false);


   const handleGlassesProductChange = (index, field, value) => {
     const updatedProducts = [...glassesProducts];
     updatedProducts[index][field] = value;
     setGlassesProducts(updatedProducts);

     if (field === "glassesNumber") {
       fetchProductData(value, index);
     }

     if (field === "glassesQuantity") {
       handleQuantityChange(index, value);
     }
   };

   const fetchProductData = async (number, index) => {
    if (!number) return;
  
    try {
      const q = query(collection(db, "glasses"), where("number", "==", number));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const availableTypes = [];
        querySnapshot.forEach((doc) => {
          const productData = doc.data();
          availableTypes.push({
            type: productData.type,
            name: productData.name,
            price: productData.price,
            size: productData.size,
            quantity: productData.quantity,
          });
        });
  
        const updatedProducts = [...glassesProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          glassesNumber: number,
          availableTypes,
          glassesType: "", // Reset the type selection
        };
        console.log("Available types:", availableTypes); // Debugging log
        setGlassesProducts(updatedProducts);
      } else {
        console.log("No products found for this number.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  

  const handleQuantityChange = async (index, enteredQuantity) => {
    if (updating) return; // Prevent multiple clicks
    setUpdating(true);
  
    const parsedQuantity = parseInt(enteredQuantity, 10); // Convert the input to an integer
  
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("Please enter a valid quantity.");
      setUpdating(false);
      return;
    }
  
    const product = glassesProducts[index];
    const selectedType = product.glassesType; // Ensure you are getting the selected type
    const remainingQuantity = product.inventoryQuantity - parsedQuantity;
  
    if (remainingQuantity < 0) {
      alert("Insufficient stock in inventory");
      setUpdating(false);
      return;
    }
  
    const updatedProducts = [...glassesProducts];
    updatedProducts[index].enteredQuantity = parsedQuantity; // Update the entered quantity with the parsed value
    updatedProducts[index].inventoryQuantity = remainingQuantity; // Update the remaining quantity
    setGlassesProducts(updatedProducts);
  
    // Update inventory quantity in Firestore based on glassesNumber and glassesType
    try {
      const q = query(
        collection(db, "glasses"),
        where("number", "==", product.glassesNumber), // Match the glasses number
        where("type", "==", selectedType) // Match the selected glasses type
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const productDocRef = doc(db, "glasses", querySnapshot.docs[0].id);
  
        console.log("Updating Firestore with remaining quantity:", remainingQuantity);
  
        // Update the Firestore document with the correct remaining quantity
        await updateDoc(productDocRef, {
          quantity: remainingQuantity, // Update the inventory quantity
        });
  
        console.log("Firestore update successful");
      } else {
        console.log("No matching product found in Firestore");
      }
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
    } finally {
      setUpdating(false); // Unlock button after update
    }
  };
  
  

  const handleTypeChange = (index, selectedType) => {
    const product = glassesProducts[index];
    const selectedProduct = product.availableTypes.find(
      (p) => p.type === selectedType
    );

    if (selectedProduct) {
      const updatedProducts = [...glassesProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        glassesType: selectedType,
        glassesName: selectedProduct.name,
        glassesPrice: selectedProduct.price,
        glassesSize: selectedProduct.size,
        inventoryQuantity: selectedProduct.quantity,
      };
      setGlassesProducts(updatedProducts);
    }
  };




  const handleRemove = (index) => {
    const newProducts = glassesProducts.filter((_, i) => i !== index);
    setGlassesProducts(newProducts);
  };

  const handleDateChange = (date, key, index) => {
    const updatedProducts = [...glassesProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: date,
    };
    setGlassesProducts(updatedProducts);
  };

  useEffect(() => {
    const totalGlassesPrice = glassesProducts.reduce((total, product) => {
      const price = parseFloat(product.glassesPrice) || 0;
      return total + price;
    }, 0);
    setTotalGlassesPrice(totalGlassesPrice);
    onGlassesPriceChange(totalGlassesPrice);
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

            {glassesProducts.availableTypes && glassesProducts.availableTypes.length > 0 ? (
              
  <Grid item xs={4}>
    <FormControl fullWidth>
      <InputLabel>Type</InputLabel>
      <Select
        value={glassesProducts.glassesType || ""}
        onChange={(e) => handleTypeChange(index, e.target.value)}
      >
        {glassesProducts.availableTypes.map((typeData, idx) => (
          <MenuItem key={idx} value={typeData.type}>
            {typeData.type}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
) : (
  <Grid item xs={4}>
    <TextField
      label="Type"
      value="write Number To View Types"
      disabled
      fullWidth
    />
  </Grid>
)}

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
              required
                type="number"
                label="Quantity"
                variant="outlined"
                fullWidth
                value={glassesProducts.enteredQuantity || ""}
                onChange={(e) =>
                  setGlassesProducts((prev) => {
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
              onClick={() =>
                handleQuantityChange(index, glassesProducts.enteredQuantity)
              }
              disabled={updating} 
            >
               {updating ? "Updating..." : ""}
            Click Here To Update Glasses Inventory Quantity
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
