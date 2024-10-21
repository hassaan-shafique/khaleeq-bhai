import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  MenuItem,
} from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/Firebase";
import { Inventory } from "@mui/icons-material";
import AddProduct from "./Products/AddProduct";

const SalesForm = () => {
  // Use one state object for all form fields
  const [value, setValue] = useState({
    barcode: "",
    orderNo: "",
    source:"",
    customerName: "",
    contactNo: "",
    address: "",
    salesman: "",
    doctor: "",
    totalAmount: "",
    pendingAmount: "", // Pending amount will be calculated
    advance: "",
    startDate: null,
    endDate: null,
    DeliveredDate: null,
    reSph: "",
    reCyl: "",
    reAxis: "",
    reAdd: "",
    reIpd: "",
    leSph: "",
    leCyl: "",
    leAxis: "",
    leAdd: "",
    leIpd: "",
    instruction: "",
    status: "Pending",
  });

    const [showFields, setShowFields] = useState(false);
    const [selectedSource, setSelectedSource] = useState("");
    const [vendorProducts, setVendorProducts] = useState([
      { vendorName: "",
         borrowedBranch: "",
          VendorItemName :"",
           quantity: "",
            vendorBarcode: "",
                vendorPrice: "" ,
                DeliveredDate:"" },
    ]);
    const [kbcwProduct, setKbcwProduct] = useState([
      {
        kbcwBarcode: "",
        kbcwInventoryType: "",
        kbcwName: "",
        kbcwPrice: "",
        kbcwQuantity:"",
        kbcwSize: "",
        kbcwDeliveredDate: "",
      },
    ]);

     const [glassesProduct, setGlassesProduct] = useState([
       {
         glassesBarcode: "",
         GlassesType: "",
         glassesName: "",
         glassesNumber:"",
         glassesPrice: "",
         glassesSize: "",
         glassesQuantity: "",
         glassesDeliveredDate: "",
       },
     ]);
     const handleAddNewProduct = () => {
       setGlassesProduct([
         ...glassesProduct,
         {
           glassesBarcode: "",
           GlassesType: "",
           glassesName: "",
           glassesNumber: "",
           glassesPrice: "",
           glassesSize: "",
           glassesQuantity: "",
           glassesDeliveredDate: "",
         },
       ]);
        setKbcwProduct([
          ...kbcwProduct,
          {
            kbcwBarcode: "",
            kbcwInventoryType: "",
            kbcwName: "",
            kbcwPrice: "",
            kbcwQuantity: "",
            kbcwSize: "",
            kbcwDeliveredDate: "",
          },
        ]);
         setVendorProducts([
           ...vendorProducts,
           {
             vendorName: "",
             borrowedBranch: "",
             VendorItemName: "",
             quantity: "",
             vendorBarcode: "",
             vendorPrice: "",
             DeliveredDate: "",
           },
         ]);
     };
     
     
     
    const handleSourceChange = (event) => {
      setSelectedSource(event.target.value);
    };

    const handleAddProductClick = () => {
      setShowFields(true);
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

    const addNewProduct = () => {
      setProducts([...products, { name: "", quantity: "", price: "" }]);
    };
    const addAnotherProduct = (setProducts, products) => {
      setProducts([...products, {}]);
    };

  const [open, setOpen] = useState(false);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  // Generic handler for TextField changes
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  // Specific handler for date changes
  const handleDateChange = (date, field) => {
    setValue((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  // Effect to calculate pending amount
  useEffect(() => {
    const total = parseFloat(value.totalAmount) || 0;
    const advance = parseFloat(value.advance) || 0;
    const pending = total - advance;
    setValue((prev) => ({
      ...prev,
      pendingAmount: pending >= 0 ? pending : 0,
    }));
  }, [value.totalAmount, value.advance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      barcode,
      orderNo,
      source,
      customerName,
      contactNo,
      address,
      salesman,
      doctor,
      totalAmount,
      pendingAmount,
      advance,
      startDate,
      endDate,
      DeliveredDate,
      reSph,
      reCyl,
      reAxis,
      reAdd,
      leSph,
      leCyl,
      leAxis,
      leAdd,
      reIpd,
      leIpd,
      instruction,
      status,
    } = value;

    try {
      const expensesCollectionRef = collection(db, "sales");
      await addDoc(expensesCollectionRef, {
        barcode,
        orderNo,
        source,
        customerName,
        contactNo,
        address,
        salesman,
        doctor,
        totalAmount,
        pendingAmount,
        advance,
        startDate,
        endDate,
        DeliveredDate,
        reSph,
        reCyl,
        reAxis,
        reAdd,
        leSph,
        leCyl,
        leAxis,
        leAdd,
        reIpd,
        leIpd,
        instruction,
        status,
      });

      setOpen(false);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
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
        Sales
        <Button
          variant="contained"
          sx={{ bgcolor: "#448EE4", m: 1, px: 9 }}
          onClick={handleClickOpen}
        >
          Add Sale
        </Button>
      </Typography>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add Sale</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <Typography variant="subtitle1">Date of Order</Typography>
                <DatePicker
                  selected={value.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  placeholderText="Select Order Date"
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1">Date of Delivery</Typography>
                <DatePicker
                  selected={value.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  placeholderText="Select Delivery Date"
                  fullWidth
                />
              </Grid>

              <Grid item xs={4}>
                <Typography variant="subtitle1">Delivered Date</Typography>
                <DatePicker
                  selected={value.DeliveredDate}
                  onChange={(date) => handleDateChange(date, "DeliveredDate")}
                  placeholderText="Select Delivered Date"
                  fullWidth
                />
              </Grid>
            </Grid>

            <TextField
              label="Order No"
              type="number"
              name="orderNo"
              value={value.orderNo}
              onChange={handleChange}
              margin="normal"
              sx={{ mr: 2 }}
            />
            <TextField
              label="Customer Name"
              name="customerName"
              value={value.customerName}
              onChange={handleChange}
              placeholder="Customer Name"
              margin="normal"
              sx={{ mr: 2 }}
            />
            <TextField
              label="Contact No"
              name="contactNo"
              value={value.contactNo}
              onChange={handleChange}
              placeholder="Contact No"
              margin="normal"
              sx={{ mr: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              value={value.address}
              onChange={handleChange}
              placeholder="Address"
              margin="normal"
              sx={{ mr: 2 }}
            />
            <TextField
              label="Salesman"
              name="salesman"
              value={value.salesman}
              onChange={handleChange}
              placeholder="Salesman"
              margin="normal"
              sx={{ mr: 2 }}
            />
            <TextField
              label="Doctor"
              name="doctor"
              value={value.doctor}
              onChange={handleChange}
              placeholder="Doctor"
              margin="normal"
              sx={{ mr: 1 }}
            />

            {/* <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell>RE</TableCell>
                    <TableCell>LE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>SPH</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reSph"
                        value={value.reSph}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leSph"
                        value={value.leSph}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CYL</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reCyl"
                        value={value.reCyl}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leCyl"
                        value={value.leCyl}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AXIS</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reAxis"
                        value={value.reAxis}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leAxis"
                        value={value.leAxis}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ADD</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reAdd"
                        value={value.reAdd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leAdd"
                        value={value.leAdd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IPD</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="reIpd"
                        value={value.reIpd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        name="leIpd"
                        value={value.leIpd}
                        onChange={handleChange}
                        fullWidth
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer> */}
            {/* <TextField
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={value.totalAmount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Advance"
              type="number"
              name="advance"
              value={value.advance}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Pending Amount"
              type="number"
              name="pendingAmount"
              value={value.pendingAmount}
              disabled
              fullWidth
              margin="normal"
            /> */}
          
            

             <Box sx={{ padding: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProductClick}
                sx={{ marginTop: "10px" }}
              >
                Add Product
              </Button>

              {showFields && (
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
                      {vendorProducts.map((vendorProducts, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          sx={{ marginBottom: "10px" }}
                        >
                          <Grid item xs={4}>
                            <TextField
                              label="Vendor Name"
                              value={vendorProducts.vendorName}
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
                              value={vendorProducts.quantity}
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
                              label="BorrowedBranch"
                              value={vendorProducts.borrowedBranch}
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
                              value={vendorProducts.vendorPrice}
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
                              value={vendorProducts.VendorItemName}
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
                          <Grid>
                          <Button
                          onClick={handleAddNewProduct}>
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
                              label="Barcode "
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
                              label="Name "
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
                          <Grid item xs={4}>
                            <TextField
                              label="Delivered Date"
                              value={kbcwproduct.kbcwDeliveredDate}
                              onChange={(e) =>
                                handlekbcwProductChange(
                                  index,
                                  "kbcwDeliveredDate",
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
                </Box>
              )}
            </Box> 

            <TextField
              label="Instruction"
              name="instruction"
              value={value.instruction}
              onChange={handleChange}
              placeholder="Instruction"
              margin="normal"
              fullWidth
            />
            <RadioGroup
              row
              name="status"
              value={value.status}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Pending"
                control={<Radio />}
                label="Pending"
              />
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
            </RadioGroup>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesForm;
