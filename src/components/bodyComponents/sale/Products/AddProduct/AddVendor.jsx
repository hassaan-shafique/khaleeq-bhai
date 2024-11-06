import {
  TextField,
  Box,
  Grid,
  Button,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect,useState } from "react";

const AddVendor = ({ vendorProducts, setVendorProducts,onVendorPriceChange}) => {

  const [totalVendorPrice,setTotalVendorPrice] =useState()

  const handleVendorProductChange = (index, field, value) => {
    const newProducts = [...vendorProducts];
    newProducts[index][field] = value;
    setVendorProducts(newProducts);
  };

  const handleRemove = (index) => {
    const newProducts = vendorProducts.filter((_, i) => i !== index);
    setVendorProducts(newProducts);
  };

   const handleDateChange = (date, key, index) => {
     const updatedProducts = [...vendorProducts]; // Create a copy of the products array
     updatedProducts[index] = {
       ...updatedProducts[index],
       [key]: date, // Update the specific date field
     };
     setVendorProducts(updatedProducts); // Update the state with new values
   };

  useEffect(() => {
    const totalVendorPrice = vendorProducts.reduce((total, product) => {
      const price = parseFloat(product.vendorPrice) || 0; // Ensure price is a number
      return total + price;
    }, 0);
    

    onVendorPriceChange(totalVendorPrice); // Pass total up
  }, [vendorProducts,onVendorPriceChange]);

  return (
    <Box sx={{ marginTop: "20px" }}>
      {vendorProducts.map((vendorProducts, index) => (
        <div key={index}>
          <h3>VendorProduct #{index + 1}</h3>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <TextField
                label="Order Number"
                value={vendorProducts.orderNumber}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "orderNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Vendor Name"
                value={vendorProducts.vendorName}
                onChange={(e) =>
                  handleVendorProductChange(index, "vendorName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={vendorProducts.quantity}
                onChange={(e) =>
                  handleVendorProductChange(index, "quantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Borrowed Branch"
                value={vendorProducts.borrowedBranch}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "borrowedBranch",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Item Number"
                value={vendorProducts.vendorGlassNumber}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorGlassNumber",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Item Type"
                value={vendorProducts.vendorItemType}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorItemType",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={vendorProducts.vendorPrice}
                onChange={(e) =>
                  handleVendorProductChange(
                    index,
                    "vendorPrice",
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={vendorProducts.vendorDeliveredDate}
                onChange={(date) =>
                  handleDateChange(date, "vendorDeliveredDate", index)
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
            <h3>Total Price For Vendor Product: Rs {totalVendorPrice}</h3>
          </Box> */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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

export default AddVendor;
