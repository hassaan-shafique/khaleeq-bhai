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
} from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection } from "firebase/firestore";
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
    startDate: "",
    endDate: "",
    DeliveredDate: "",
    instruction: "",
    leSph:"",
    leCyl:"",
    leAxis:"",
    leAdd:"",
    leIpd:"",
    reSph:"",
    reCyl:"",
    reAxis:"",
    reAdd:"",
    reIpd:"",
    status: "Pending",
    totalAmount: "",
    pendingAmount: "",
    advance: "",
    discount: "" ,
  });

  const [open, setOpen] = useState(false);
    const [showFields, setShowFields] = useState(false);

 const [vendorProducts, setVendorProducts] = useState([]);

  const [kbcwProducts, setKbcwProducts] = useState([]);

  const [glassesProducts, setGlassesProducts] = useState([]);
  const [refresh ,setRefresh] = useState (false);


  

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
   const discount = parseFloat(value.discount) || 0; // New discount field
   const pending = total - advance - discount;

   setValue((prev) => ({
     ...prev,
     pendingAmount: pending >= 0 ? pending : 0, // Ensure no negative value
   }));
 }, [value.totalAmount, value.advance, value.discount]);

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const expensesCollectionRef = collection(db, "sales");

    value.kbcwProducts = kbcwProducts;
    value.glassesProducts = glassesProducts;
    value.vendorProducts = vendorProducts;

    // Ensure discount is captured in the submitted data
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
        vendorItemType: "",
        vendorGlassNumber: "",
        vendorDeliveredDate:"",
    }])
  }
  const handleAddGlassesProducts= () => {
    setGlassesProducts([...glassesProducts,{
       glassesBarcode: "", 
       glassesType: "", 
       glassesName: "",
        glassesSize: "",
         glassesNumber: "",
          glassesQuantity: "", 
          glassesDeliveredDate: "",
           glassesPrice: "",

    }])
  }
  const handleAddKbcwProducts = () => {
    setKbcwProducts([...kbcwProducts, {
       kbcwInventoryType: "",
         kbcwBarcode: "", 
         kbcwName: "", 
         kbcwQuantity: "",
          kbcwSize: "", 
          kbcwPrice: "",
          kbcwDeliveredDate:"",
        }]);
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
                    selected={value.DeliveredDate}
                    onChange={(date) => handleDateChange(date, "DeliveredDate")}
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
                      {/* LE Row */}
                      <TableRow>
                        <TableCell>LE</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            name="leSph"
                            value={value.leSph}
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
                        <TableCell>
                          <TextField
                            type="number"
                            name="leAxis"
                            value={value.leAxis}
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

                      {/* RE Row */}
                      <TableRow>
                        <TableCell>RE</TableCell>
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
                            name="reCyl"
                            value={value.reCyl}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
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
                            name="reAdd"
                            value={value.reAdd}
                            onChange={handleChange}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            name="reIpd"
                            value={value.reIpd}
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
              />
              <AddGlasses
                glassesProducts={glassesProducts}
                setGlassesProducts={setGlassesProducts}
              />
              <AddKbcw
                kbcwProducts={kbcwProducts}
                setKbcwProducts={setKbcwProducts}
              />
              <Grid item xs={8}>
                <TextField
                  label="Total Amount"
                  name="totalAmount"
                  value={value.totalAmount}
                  onChange={handleChange}
                  placeholder="Total Amount"
                  margin="normal"
                  fullWidth
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
                />
              </Grid>

              <DialogActions sx={{ marginTop: "50px" }}>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#448EE4" }}
                >
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
