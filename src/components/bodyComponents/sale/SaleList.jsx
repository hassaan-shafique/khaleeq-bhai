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

// Function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const SaleList = ({ sales = [], loading = false }) => {
  // State for managing the dialog box
  const [open, setOpen] = useState(false);
  const [Dsale, setDSale] = useState(null);

  // Function to handle the opening of the dialog
  const handleOpenDialog = (sale) => {
    setDSale(sale);
    setOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setDSale(null);
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sales.length === 0 ? (
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
                      Order date
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
                      TotalAmount
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
                  {sales.map((sale, i) => (
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
                  {/* <p>
                    <strong>Customer Name:</strong> {Dsale.startDate}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> {Dsale.endDate}
                  </p> */}
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
                    <strong>Adress:</strong> {Dsale.address}
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
                    <strong>Left Sph</strong> {Dsale.leSph}
                  </p>
                  <p>
                    <strong>Right Cyl</strong> {Dsale.reCyl}
                  </p>
                  <p>
                    <strong>Left Cyl</strong> {Dsale.leCyl}
                  </p>
                  <p>
                    <strong>Right Axis</strong> {Dsale.reAxis}
                  </p>
                  <p>
                    <strong>Left Axis</strong> {Dsale.leAxis}
                  </p>
                  <p>
                    <strong>Right Add</strong> {Dsale.reAdd}
                  </p>
                  <p>
                    <strong>Left Add</strong> {Dsale.leAdd}
                  </p>

                  <p>
                    <strong>Total Amount</strong> {Dsale.totalAmount}
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
                  <p>
                    <strong>Status:</strong> {Dsale.status}
                  </p>

                  {/* Add more details as needed */}
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
