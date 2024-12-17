


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
        const q = query(
          collection(db, "glasses"),
          where("number", "==", number)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          const productData = productDoc.data();

          const updatedProducts = [...glassesProducts];
          updatedProducts[index] = {
            ...updatedProducts[index],
            glassesName: productData.name,
            glassesPrice: productData.price,
            glassesSize: productData.size,
            glassesNumber: productData.number,
            glassesType: productData.type,
            inventoryQuantity: productData.quantity, // Initial inventory quantity
          };
          setGlassesProducts(updatedProducts);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

  const handleQuantityChange = async (index, enteredQuantity) => {

    if (updating) return; // Prevent multiple clicks
    setUpdating(true);
    const product = glassesProducts[index];
    const remainingQuantity = product.inventoryQuantity - enteredQuantity;

    if (remainingQuantity <= 0) {
      alert("Insufficient stock in inventory");
      setUpdating(false); 
      return;
    }

    const updatedProducts = [...glassesProducts];
    updatedProducts[index].inventoryQuantity = remainingQuantity;
    setGlassesProducts(updatedProducts);

    // Update inventory quantity in Firestore
    try {
      const q = query(
        collection(db, "glasses"),
        where("number", "==", product.glassesNumber)
      
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const productDocRef = doc(db, "glasses", querySnapshot.docs[0].id);
        await updateDoc(productDocRef, { quantity: remainingQuantity });
      }
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
    }
    finally {
      setUpdating(false); // Unlock button after update
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
