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
} from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/Firebase";
import AddVendor from './Products/AddProduct/AddVendor';

const SalesForm = () => {
  const [value, setValue] = useState({
    orderNo: "",
    customerName: "",
    contactNo: "",
    address: "",
    salesman: "",
    doctor: "",
    startDate: null,
    endDate: null,
    DeliveredDate: null,
    instruction: "",
    status: "Pending",
    totalAmount: "",
    pendingAmount: "",
    advance: "",
  });

  const [open, setOpen] = useState(false);
    const [showFields, setShowFields] = useState(false);

 const [vendorProducts, setVendorProducts] = useState([]);

  const [kbcwProduct, setKbcwProduct] = useState([
    { kbcwInventoryType: "", kbcwBarcode: "", kbcwName: "", kbcwQuantity: "", kbcwSize: "", kbcwPrice: "" }
  ]);

  const [glassesProduct, setGlassesProduct] = useState([
    { glassesBarcode: "", glassesType: "", glassesName: "", glassesSize: "", glassesNumber: "", glassesQuantity: "", glassesDeliveredDate: "", glassesPrice: "" }
  ]);

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
    try {
      const expensesCollectionRef = collection(db, "sales");
        value.kbcwProducts = kbcwProduct
        value.glassesProducts = glassesProduct
        value.vendorProducts = vendorProducts
      await addDoc(expensesCollectionRef, value);
      setOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleToggleFields = () => {
    setShowFields((prev) => !prev);
  };

  const handleAddVendorProducts = () => {
    setVendorProducts([...vendorProducts,  {
        orderNumber: "",
        vendorName: "",
        quantity: "",
        borrowedBranch: "",
        vendorPrice: "",
        VendorItemName: ""
    }])
  }

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
          <Box  sx={{ paddingTop: 5 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.startDate}
                    onChange={(date) => handleDateChange(date, "startDate")}
                    placeholderText="Select Order Date"
                    className="datepicker"
                    style={{ width: "100%" }} // For responsiveness
                  />
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.endDate}
                    onChange={(date) => handleDateChange(date, "endDate")}
                    placeholderText="Select Delivery Date"
                    className="datepicker"
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <DatePicker
                    selected={value.DeliveredDate}
                    onChange={(date) => handleDateChange(date, "DeliveredDate")}
                    placeholderText="Select Delivered Date"
                    className="datepicker"
                    style={{ width: "100%" }}
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
                        sx={{ justifyContent: 'flex-end' }}
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
                onClick={handleToggleFields}
                sx={{ marginTop: "10px", bgcolor: "#448EE4" }}
            >
                Add KBCW Product
            </Button>
    </Grid>
     <Grid item >
            <Button
                variant="contained"
                color="primary"
                onClick={handleToggleFields}
                sx={{ marginTop: "10px", bgcolor: "#448EE4" }}
            >
                Add Glasses Product
            </Button>
    </Grid>
     <Grid item >
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



                <AddVendor vendorProducts={vendorProducts} setVendorProducts={setVendorProducts} />



                {/* <AddProduct
                    vendorProducts={vendorProducts}
                    setVendorProducts={setVendorProducts}
                    kbcwProduct={kbcwProduct}
                    setKbcwProduct={setKbcwProduct}
                    glassesProduct={glassesProduct}
                    setGlassesProduct={setGlassesProduct}
                /> */}

              <DialogActions sx={{ marginTop: '50px' }}>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" sx={{ bgcolor: "#448EE4" }}>
                  Save
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
