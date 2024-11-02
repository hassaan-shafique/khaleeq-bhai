import { TextField, Box, Grid, Button,FormControl,InputLabel,Select, MenuItem} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddKbcw = ({ kbcwProducts, setKbcwProducts }) => {

  const handleKbcwProductChange = (index, field, value) => {
    const newProducts = [...kbcwProducts];
    newProducts[index][field] = value;
    setKbcwProducts(newProducts);
  };

  const handleRemove = (index) => {
    const newProducts = kbcwProducts.filter((_, i) => i !== index);
    setKbcwProducts(newProducts);
  };

   const handleDateChange = (date, key, index) => {
     const updatedProducts = [...kbcwProducts]; // Create a copy of the products array
     updatedProducts[index] = {
       ...updatedProducts[index],
       [key]: date, // Update the specific date field
     };
     setKbcwProducts(updatedProducts); // Update the state with new values
   };


  return (
    <Box sx={{ marginTop: "20px" }}>
      {kbcwProducts.map((kbcwProducts, index) => (
        <div key={index}>
          <h3>KBCW Product #{index + 1}</h3>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>KBCW Inventory Type</InputLabel>
                <Select
                  value={kbcwProducts.kbcwInventoryType}
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
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="KBCW Barcode"
                value={kbcwProducts.kbcwBarcode}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwBarcode", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Name"
                value={kbcwProducts.kbcwName}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Size"
                value={kbcwProducts.kbcwSize}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwSize", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={kbcwProducts.kbcwQuantity}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwQuantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={kbcwProducts.kbcwPrice}
                onChange={(e) =>
                  handleKbcwProductChange(index, "kbcwPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                selected={kbcwProducts.kbcwDeliveredDate}
                onChange={(date) =>
                  handleDateChange(date, "kbcwDeliveredDate", index)
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
};

export default AddKbcw;
