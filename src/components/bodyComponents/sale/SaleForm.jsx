import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TableContainer,
  Table,
TableHead,
TableRow,
TableCell,
TableBody,
FormControl,
InputLabel,
Select,
MenuItem,

} from "@mui/material";
import { useMemo } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection, Timestamp} from "firebase/firestore";
import { db } from "../../../config/Firebase";
import AddVendor from './Products/AddProduct/AddVendor';
import AddGlasses from "./Products/AddProduct/AddGlasses";
import AddKbcw from "./Products/AddProduct/AddKbcw";

const SalesForm = () => {
  const [value, setValue] = useState({
    orderNo: "",
    customerName: "",
    contactNo: "",
    address: "",
    salesman: "",
    doctor: "",
    startDate: new Date(),
    endDate: new Date(),
    deliveredDate: "",
    instruction: "",
    leSph: "",
    leCyl: "",
    leAxis: "",
    leAdd: "",
    leIpd: "",
    reSph: "",
    reCyl: "",
    reAxis: "",
    reAdd: "",
    reIpd: "",
    status: "Pending",
    totalAmount: "",
    payment: "Cash",
    pendingAmount: "",
    advance: "",
    discount: "",
  });

  const [open, setOpen] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const [vendorProducts, setVendorProducts] = useState([]);
  const [kbcwProducts, setKbcwProducts] = useState([]);
  const [glassesProducts, setGlassesProducts] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [totalVendorPrice, setTotalVendorPrice] = useState(0);
  const [totalKbcwPrice, setTotalKbcwPrice] = useState(0);
  const [totalGlassesPrice, setTotalGlassesPrice] = useState(0);


  

  const handleVendorPriceChange = (total) => {
    setTotalVendorPrice(total);
  };

  const handleKbcwPriceChange = (total) => {
    setTotalKbcwPrice(total);
  };

  const handleGlassesPriceChange = (total) => {
    setTotalGlassesPrice(total);
  };

  // Calculate the grand total
  const grandTotal = totalVendorPrice + totalKbcwPrice + totalGlassesPrice;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleDateChange = (date, field) => {
    setValue((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  useEffect(() => {
    const total = parseFloat(grandTotal) || 0;
    const advance = parseFloat(value.advance) || 0;
    const discount = parseFloat(value.discount) || 0;
    const pending = total - advance - discount;

    setValue((prev) => ({
      ...prev,
      pendingAmount: pending >= 0 ? pending : 0, // Ensure no negative value
    }));
  }, [grandTotal, value.advance, value.discount]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {

  


      // Reference to the sales collection
      const salesCollectionRef = collection(db, "sales");

      // Ensure product arrays are defined and fallback to empty arrays
      const safeValue = {
        ...value,
        kbcwProducts: kbcwProducts || [],
        glassesProducts: glassesProducts || [],
        vendorProducts: vendorProducts || [],
      };

      // Function to convert dates to Firebase Timestamps within product arrays
      const convertDatesToTimestamps = (productsArray) => {
        return productsArray.map((product) => ({
          ...product,
          deliveredDate:
            product.deliveredDate && !isNaN(new Date(product.deliveredDate))
              ? Timestamp.fromDate(new Date(product.deliveredDate))
              : null, // Ensure null if the date is invalid
        }));
      };

      // Update product arrays with converted dates
      safeValue.kbcwProducts = convertDatesToTimestamps(safeValue.kbcwProducts);
      safeValue.glassesProducts = convertDatesToTimestamps(
        safeValue.glassesProducts
      );
      safeValue.vendorProducts = convertDatesToTimestamps(
        safeValue.vendorProducts
      );

      // Remove undefined or null fields (deep cleaning for nested objects)
      const cleanData = (data) => {
        if (Array.isArray(data)) {
          return data.map(cleanData); // Recursively clean each item in the array
        } else if (data && typeof data === "object") {
          return Object.fromEntries(
            Object.entries(data)
              .filter(([_, v]) => v !== undefined && v !== null)
              .map(([k, v]) => [k, cleanData(v)])
          );
        }
        return data; // Return the value if it’s neither an object nor an array
      };

      const cleanedValue = cleanData(safeValue);

      // Debugging: Log the cleaned data with timestamps
      console.log(
        "Value after converting dates to timestamps:",
        JSON.stringify(cleanedValue, null, 2)
      );

      // Add the sale to Firestore
      const saleDocRef = await addDoc(salesCollectionRef, cleanedValue);
      console.log("Sale successfully added with ID:", saleDocRef.id);

      // Reset or close modal after success
      setOpen(false);
    } catch (error) {
      console.error("Error submitting sale or products:", error.message);
    }
  };

  const handleToggleFields = () => {
    setShowFields((prev) => !prev);
  };

  const handleAddVendorProducts = () => {
    setVendorProducts((prev) => [
      ...prev,
      {
        orderNumber: "",
        vendorName: "",
        quantity: "",
        borrowedBranch: "",
        vendorPrice: "",
        vendorItemType: "",
        vendorGlassNumber: "",
        vendorDeliveredDate: "",
      },
    ]);
  };

  const handleAddGlassesProducts = () => {
    setGlassesProducts((prev) => [
      ...prev,
      {
        glassesBarcode: "",
        glassesType: "",
        glassesName: "",
        glassesSize: "",
        glassesNumber: "",
        glassesQuantity: "",
        glassesDeliveredDate: "",
        glassesPrice: "",
      },
    ]);
  };

  const handleAddKbcwProducts = () => {
    setKbcwProducts((prev) => [
      ...prev,
      {
        kbcwInventoryType: "",
        kbcwBarcode: "",
        kbcwName: "",
        kbcwQuantity: "",
        kbcwSize: "",
        kbcwPrice: "",
        kbcwDeliveredDate: "",
      },
    ]);
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
          <Box sx={{ paddingTop: 5 }}>
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={3}
                alignItems="center"
                sx={{
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  marginLeft: "0px",
                  padding: "10px",
                }}
              >
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    placeholderText="Select Sales Date"
                    customInput={
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Sales Date"
                        value={value.startDate.toLocaleDateString()}
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
                  />
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    placeholderText="Select Delivery Date"
                    customInput={
                      <TextField
                        fullWidth
                        value={value.endDate.toLocaleDateString()}
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
                  />
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.deliveredDate}
                    onChange={(date) => handleDateChange(date, "deliveredDate")}
                    placeholderText="Select Delivered Date"
                    customInput={
                      <TextField
                        fullWidth
                    
                        variant="outlined"
                        label="Delivered Date"
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
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    label="Order No"
                    type="number"
                    name="orderNo"
                    value={value.orderNo}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Customer Name"
                    name="customerName"
                    value={value.customerName}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Contact No"
                    name="contactNo"
                    value={value.contactNo}
                    onChange={handleChange}
                    placeholder="Contact No"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    label="Address"
                    name="address"
                    value={value.address}
                    onChange={handleChange}
                    placeholder="Address"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Salesman"
                    name="salesman"
                    value={value.salesman}
                    onChange={handleChange}
                    placeholder="Salesman"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Doctor"
                    name="doctor"
                    value={value.doctor}
                    onChange={handleChange}
                    placeholder="Doctor"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>

                        <TableCell>SPH</TableCell>
                        <TableCell>CYL</TableCell>
                        <TableCell>AXIS</TableCell>
                        <TableCell>ADD</TableCell>
                        <TableCell>IPD</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* RE Row */}
                      <TableRow>
                        <TableCell>RE</TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="reSph"
                            value={value.reSph}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="reCyl"
                            value={value.reCyl}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="reAxis"
                            value={value.reAxis}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="reAdd"
                            value={value.reAdd}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="reIpd"
                            value={value.reIpd}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>

                      {/* LE Row */}
                      <TableRow>
                        <TableCell>LE</TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="leSph"
                            value={value.leSph}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="leCyl"
                            value={value.leCyl}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="leAxis"
                            value={value.leAxis}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="leAdd"
                            value={value.leAdd}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            name="leIpd"
                            value={value.leIpd}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    label="Instruction"
                    name="instruction"
                    value={value.instruction}
                    onChange={handleChange}
                    placeholder="Instruction"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <RadioGroup
                    row
                    name="status"
                    value={value.status}
                    onChange={handleChange}
                    sx={{ justifyContent: "flex-end" }}
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
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddKbcwProducts}
                    sx={{ marginTop: "10px", bgcolor: "#448EE4" }}
                  >
                    Add KBCW Product
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddGlassesProducts}
                    sx={{ marginTop: "10px", bgcolor: "#448EE4" }}
                  >
                    Add Glasses Product
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddVendorProducts}
                    sx={{ marginTop: "10px", bgcolor: "#448EE4" }}
                  >
                    Add Vendor Product
                  </Button>
                </Grid>
              </Grid>

              <AddVendor
                vendorProducts={vendorProducts}
                setVendorProducts={setVendorProducts}
                onVendorPriceChange={handleVendorPriceChange}
              />
              <AddGlasses
                glassesProducts={glassesProducts}
                setGlassesProducts={setGlassesProducts}
                onGlassesPriceChange={handleGlassesPriceChange}
              />
              <AddKbcw
                kbcwProducts={kbcwProducts}
                setKbcwProducts={setKbcwProducts}
                onKbcwPriceChange={handleKbcwPriceChange}
              />

              <Grid item xs={8}>
                <TextField
                  label="Total Amount"
                  name="totalAmount"
                  value={grandTotal}
                  onChange={handleChange}
                  placeholder="Total Amount"
                  margin="normal"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Discount"
                  name="discount"
                  value={value.discount}
                  onChange={handleChange}
                  placeholder="Discount"
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Advance"
                  name="advance"
                  value={value.advance}
                  onChange={handleChange}
                  placeholder="Advance"
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  label="Pending Amount"
                  name="pendingAmount"
                  value={value.pendingAmount}
                  onChange={handleChange}
                  placeholder="Pending Amount"
                  margin="normal"
                  fullWidth
                  disabled
                />
              </Grid>
              <Box sx={{ maxWidth: 300, margin: "20px auto" }}>
                <Typography variant="h6" mb={2}>
                  Select Payment Method
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={value.payment}
                    name="payment"
                    onChange={handleChange}
                    label="Payment Method"
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bank">Bank</MenuItem>
                    <MenuItem value="EasyPaisa">EasyPaisa</MenuItem>
                    <MenuItem value="JazzCash">JazzCash</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <DialogActions sx={{ marginTop: "50px" }}>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#448EE4" }}
                >
                  Submit Sale
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesForm;
