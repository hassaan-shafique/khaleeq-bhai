import {
  TextField,
  Box,
  Grid,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddVendor = ({ vendorProducts, setVendorProducts }) => {

  const handlevendorProductChange = (index, field, value) => {
    const newProducts = [...vendorProducts];
    newProducts[index][field] = value;
    setVendorProducts(newProducts);
  };

  const handleRemove = (index) => {
    const newProducts = vendorProducts.filter((_, i) => i !== index);
    setVendorProducts(newProducts);
  };

  return (
    <Box sx={{ marginTop: "20px" }}>
      {vendorProducts.map((vendorProduct, index) => (
        <div key={index}>
          <h3>VendorProduct #{index + 1}</h3>
          <Grid container spacing={2} sx={{ marginBottom: "10px" }}>
            <Grid item xs={4}>
              <TextField
                label="Order Number"
                value={vendorProduct.orderNumber}
                onChange={(e) =>
                  handlevendorProductChange(index, "orderNumber", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Vendor Name"
                value={vendorProduct.vendorName}
                onChange={(e) =>
                  handlevendorProductChange(index, "vendorName", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Quantity"
                value={vendorProduct.quantity}
                onChange={(e) =>
                  handlevendorProductChange(index, "quantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Borrowed Branch"
                value={vendorProduct.borrowedBranch}
                onChange={(e) =>
                  handlevendorProductChange(index, "borrowedBranch", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                value={vendorProduct.vendorPrice}
                onChange={(e) =>
                  handlevendorProductChange(index, "vendorPrice", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Item Name"
                value={vendorProduct.VendorItemName}
                onChange={(e) =>
                  handlevendorProductChange(index, "VendorItemName", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
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
