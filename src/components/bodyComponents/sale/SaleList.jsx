import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { doc, updateDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../../../config/Firebase"; // Ensure db is correctly imported

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const SaleList = ({ sales = [], loading = false, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [Dsale, setDSale] = useState(null);
  const [salesData, setSalesData] = useState(sales); // Local sales state
  

  // Open dialog with sale details
  const handleOpenDialog = (sale) => {
    setDSale(sale);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDSale(null);
  };

  // Mark sale as complete and update the UI
 const handleMarkAsComplete = async (saleId) => {
   try {
     const saleDocRef = doc(db, "sales", saleId); // Ensure the saleId is valid
     await updateDoc(saleDocRef, { status: "Completed" });

     // Update local sales data
     const updatedSales = salesData.map((sale) =>
       sale.id === saleId ? { ...sale, status: "Completed" } : sale
     );
     setSalesData(updatedSales);
    //  setRefresh((prev) => !prev); // Optional refresh
   } catch (error) {
     console.error("Error updating sale status:", error); // Log the error
     alert(`Error updating sale status: ${error.message}`); // Show alert with error message
   }
 };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {salesData.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Sales found....
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sale ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Order Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Delivery Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Salesman</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RSph</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LSph</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RCyl</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LCyl</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RAxis</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LAxis</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RAdd</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LAdd</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Advance</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Pending Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Instruction
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.map((sale, i) => (
                    <TableRow key={sale.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {sale.startDate
                          ? formatTimestamp(sale.startDate)
                          : "No Date"}
                      </TableCell>
                      <TableCell>
                        {sale.endDate
                          ? formatTimestamp(sale.endDate)
                          : "No Date"}
                      </TableCell>
                      <TableCell>{sale.barcode}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{sale.contactNo}</TableCell>
                      <TableCell>{sale.address}</TableCell>
                      <TableCell>{sale.salesman}</TableCell>
                      <TableCell>{sale.doctor}</TableCell>
                      <TableCell>{sale.reSph}</TableCell>
                      <TableCell>{sale.leSph}</TableCell>
                      <TableCell>{sale.reCyl}</TableCell>
                      <TableCell>{sale.leCyl}</TableCell>
                      <TableCell>{sale.reAxis}</TableCell>
                      <TableCell>{sale.leAxis}</TableCell>
                      <TableCell>{sale.reAdd}</TableCell>
                      <TableCell>{sale.leAdd}</TableCell>
                      <TableCell>{sale.totalAmount}</TableCell>
                      <TableCell>{sale.advance}</TableCell>
                      <TableCell>{sale.pendingAmount}</TableCell>
                      <TableCell>{sale.instruction}</TableCell>

                      {/* Status button with click handler */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex", // Use flexbox to align items horizontally
                            alignItems: "center", // Vertically center the buttons
                            gap: 1, // Space between the buttons
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleOpenDialog(sale)} // Open dialog on click
                            sx={{
                              bgcolor:
                                sale.status === "Pending" ? "red" : "green",
                              ":hover": {
                                bgcolor:
                                  sale.status === "Pending"
                                    ? "darkred"
                                    : "darkgreen",
                              },
                            }}
                          >
                            {sale.status}
                          </Button>

                          {sale.status === "Pending" && (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small" // Makes the button smaller
                              onClick={() => handleMarkAsComplete(sale.id)}
                              sx={{ ml: 1 }}
                            >
                              Mark as Complete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Dialog for displaying sale details */}
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Sale Details</DialogTitle>
            <DialogContent>
              {Dsale && (
                <DialogContentText>
                  <p>
                    <strong>Order No:</strong> {Dsale.orderNo}
                  </p>
                  <p>
                    <strong>Customer Name:</strong> {Dsale.customerName}
                  </p>
                  <p>
                    <strong>Barcode:</strong> {Dsale.barcode}
                  </p>
                  <p>
                    <strong>Contact:</strong> {Dsale.contactNo}
                  </p>
                  <p>
                    <strong>Address:</strong> {Dsale.address}
                  </p>
                  <p>
                    <strong>Salesman:</strong> {Dsale.salesman}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {Dsale.doctor}
                  </p>
                  <p>
                    <strong>Right Sph:</strong> {Dsale.reSph}
                  </p>
                  <p>
                    <strong>Left Sph:</strong> {Dsale.leSph}
                  </p>
                  <p>
                    <strong>Right Cyl:</strong> {Dsale.reCyl}
                  </p>
                  <p>
                    <strong>Left Cyl:</strong> {Dsale.leCyl}
                  </p>
                  <p>
                    <strong>Right Axis:</strong> {Dsale.reAxis}
                  </p>
                  <p>
                    <strong>Left Axis:</strong> {Dsale.leAxis}
                  </p>
                  <p>
                    <strong>Right Add:</strong> {Dsale.reAdd}
                  </p>
                  <p>
                    <strong>Left Add:</strong> {Dsale.leAdd}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> {Dsale.totalAmount}
                  </p>
                  <p>
                    <strong>Advance:</strong> {Dsale.advance}
                  </p>
                  <p>
                    <strong>Pending Amount:</strong> {Dsale.pendingAmount}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {Dsale.instruction}
                  </p>
                </DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default SaleList;
