
import { Grid, Box, Typography, Button } from "@mui/material";
import React, { Component } from "react";
import InventoryForm from "./inventoryForm";






export default class Inventory extends Component {
  render() {
    return (
      <Box>
        <Grid container sx={{ mx: 3, p: 3 }}>
          <Grid item md={9}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
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
                  sx={{ bgcolor: "#504099", m: 3, px: 12 }}
                >
                  Add inventory
                </Button>
              </Typography>
             
              <InventoryForm/>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}


// import React, { useState } from "react";
// import {
//   Button,
//   TextField,
//   Typography,
//   Box,
  

// } from "@mui/material";
// import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

// const InventoryForm = () => {
//   const [barcode, setBarcode] = useState("");
//   const [image, setImage] = useState(null);
//   const [price, setPrice] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [size, setSize] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log("Barcode:", barcode);
//     console.log("Image:", image);
//     console.log("Price:", price);
//     console.log("Quantity:", quantity);
//     console.log("Size:", size);
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h6">Inventory 
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Barcode"
//           value={barcode}
//           onChange={(e) => setBarcode(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <label htmlFor="image-upload">
//             {image ? (
//               <img
//                 src={URL.createObjectURL(image)}
//                 alt="Product Image"
//                 style={{ width: "100px", height: "100px" }}
//               />
//             ) : (
//               <AddAPhotoIcon />
//             )}
//           </label>
//           <input
//             type="file"
//             id="image-upload"
//             style={{ display: "none" }}
//             onChange={handleImageChange}
//           />
//         </Box>
//         <TextField
//           label="Price"
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Quantity"
//           type="number"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Size"
//           value={size}
//           onChange={(e) => setSize(e.target.value)}
//           fullWidth
//           margin="normal"
//         />
//         <Button variant="contained" color="primary" type="submit">
//           Submit
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default InventoryForm;






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
