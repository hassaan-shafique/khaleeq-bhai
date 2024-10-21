import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  MenuItem,
  Select
} from "@mui/material";

const AddProduct = ({
    handleAddNewProduct,
    vendorProducts,
    setVendorProducts,
    kbcwProduct,
    setKbcwProduct,
    glassesProduct,
    setGlassesProduct

}) => {
  const [selectedSource, setSelectedSource] = useState("");

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handlekbcwProductChange = (index, field, value) => {
    const newProducts = [...kbcwProduct];
    newProducts[index][field] = value;
    setKbcwProduct(newProducts);
  };

  const handlevendorProductChange = (index, field, value) => {
    const newProducts = [...vendorProducts];
    newProducts[index][field] = value;
    setVendorProducts(newProducts);
  };

  const handleglassesProductChange = (index, field, value) => {
    const newProducts = [...glassesProduct];
    newProducts[index][field] = value;
    setGlassesProduct(newProducts);
  };

  return (
    <div>
        <Box sx={{ marginTop: "20px" }}>
          <Select
            value={selectedSource}
            onChange={handleSourceChange}
            fullWidth
            displayEmpty
            sx={{ marginBottom: "20px" }}
          >
            <MenuItem value="" disabled>
              Select Source
            </MenuItem>
            <MenuItem value="KBCW">KBCW</MenuItem>
            <MenuItem value="Glasses">Glasses</MenuItem>
            <MenuItem value="Vendor">Vendor</MenuItem>
          </Select>

          {selectedSource === "Vendor" && (
            <Box sx={{ marginTop: "20px" }}>
              {vendorProducts.map((vendorProduct, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs={4}>
                    <TextField
                      label="Vendor Name"
                      value={vendorProduct.vendorName}
                      onChange={(e) =>
                        handlevendorProductChange(
                          index,
                          "vendorName",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Quantity"
                      value={vendorProduct.quantity}
                      onChange={(e) =>
                        handlevendorProductChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Borrowed Branch"
                      value={vendorProduct.borrowedBranch}
                      onChange={(e) =>
                        handlevendorProductChange(
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
                      label="Price"
                      value={vendorProduct.vendorPrice}
                      onChange={(e) =>
                        handlevendorProductChange(
                          index,
                          "vendorPrice",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Item Name"
                      value={vendorProduct.VendorItemName}
                      onChange={(e) =>
                        handlevendorProductChange(
                          index,
                          "VendorItemName",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          {selectedSource === "Glasses" && (
            <Box sx={{ marginTop: "20px" }}>
              {glassesProduct.map((glassesProduct, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs={4}>
                    <TextField
                      label="Glasses Barcode"
                      value={glassesProduct.glassesBarcode}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      label="Type"
                      value={glassesProduct.glassesType}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      value={glassesProduct.glassesName}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      value={glassesProduct.glassesSize}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      value={glassesProduct.glassesNumber}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      value={glassesProduct.glassesQuantity}
                      onChange={(e) =>
                        handleglassesProductChange(
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
                      label="Delivered Date"
                      value={glassesProduct.glassesDeliveredDate}
                      onChange={(e) =>
                        handleglassesProductChange(
                          index,
                          "glassesDeliveredDate",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Price"
                      value={glassesProduct.glassesPrice}
                      onChange={(e) =>
                        handleglassesProductChange(
                          index,
                          "glassesPrice",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={handleAddNewProduct}>
                      Add Another Product
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}

          {selectedSource === "KBCW" && (
            <Box sx={{ marginTop: "20px" }}>
              {kbcwProduct.map((kbcwproduct, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs={4}>
                    <Select
                      name="kbcwInventoryType"
                      value={kbcwproduct.kbcwInventoryType}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwInventoryType",
                          e.target.value
                        )
                      }
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select Inventory Type
                      </MenuItem>
                      <MenuItem value="Cleaners">Cleaners</MenuItem>
                      <MenuItem value="Solution">Solution</MenuItem>
                      <MenuItem value="Contact Lenses">
                        Contact Lenses
                      </MenuItem>
                      <MenuItem value="Frames">Frames</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Barcode"
                      value={kbcwproduct.kbcwBarcode}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwBarcode",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Name"
                      value={kbcwproduct.kbcwName}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwName",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Quantity"
                      value={kbcwproduct.kbcwQuantity}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwQuantity",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Size"
                      value={kbcwproduct.kbcwSize}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwSize",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Price"
                      value={kbcwproduct.kbcwPrice}
                      onChange={(e) =>
                        handlekbcwProductChange(
                          index,
                          "kbcwPrice",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={handleAddNewProduct}>
                      Add Another Product
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Box>
          )}
        </Box>
    </div>
  );
};

export default AddProduct;
