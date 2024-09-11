import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const InventoryForm = () => {
  const [open, setOpen] = useState(false); // State for popup visibility
  const [barcode, setBarcode] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
   const[name,setName] =useState("");
   const [selectedDate, setSelectedDate] = useState(new Date());
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    // Handle form submission logic here
    console.log("Barcode:", barcode);
    console.log("Image:", image);
    console.log("Type:", type);
    console.log("Price:", price);
    console.log("Quantity:", quantity);
    console.log("Size:", size);
    console.log("Name:",  name);
    console.log("Date:", selectedDate);
    setOpen(false); // Close the popup after submission
    setBarcode("");
    setImage("");
    setType("");
    setName("");
    setPrice("");
    setQuantity("");
    setSize("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          m: 3,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Inventory
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Inventory
        </Button>
      </Typography>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Inventory</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new inventory item.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <Typography variant="h7">Select Date</Typography>
            <div>
              <DatePicker
                className="datePicker"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>

            <TextField
              label="Barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              fullWidth
              margin="normal"
              required // Mark barcode as required
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="image-upload">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Product Image"
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <AddAPhotoIcon />
                )}
                <Typography> Choose Image </Typography>
              </label>
              <input
                type="file"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Box>
            <hr/>

            <Typography variant="h7">Inventory Type</Typography>
            <Select
              label="Expense Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Expense Type"
              margin="normal"
              fullWidth
            >
              <MenuItem value="glasses">Glasses</MenuItem>
              <MenuItem value="ContactLenses">Contact Lense</MenuItem>
              <MenuItem value="covers">Covers</MenuItem>
              <MenuItem value="Frames">Frames</MenuItem>
              <MenuItem value="solutions">Solutions</MenuItem>
              <MenuItem value="cleaners">Cleaners</MenuItem>
            </Select>

            <TextField
              label="Name"
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              fullWidth
              margin="normal"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            form="inventory-form"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InventoryForm;

// import { Grid, Box, Typography, Button } from "@mui/material";
// import React, { Component } from "react";

// export default class Inventory extends Component {
//   render() {
//     return (
//       <Box>
//         <Grid container sx={{ mx: 3, p: 3 }}>
//           <Grid item md={9}>
//             <Box
//               sx={{
//                 margin: 3,
//                 bgcolor: "white",
//                 borderRadius: 2,
//                 padding: 3,
//                 height: "100%",
//               }}
//             >
//               <Typography
//                 variant="h5"
//                 sx={{
//                   m: 3,
//                   fontWeight: "bold",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 Inventory
//                 <Button
//                   variant="contained"
//                   sx={{ bgcolor: "#504099", m: 3, px: 12 }}
//                 >
//                   Add inventory
//                 </Button>
//               </Typography>

//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     );
//   }
// }

{
  /* <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
             
            </Box> */
}
