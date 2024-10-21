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
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,

} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DatePicker from "react-datepicker";
import { doc, updateDoc, deleteDoc ,addDoc,collection,query,getDocs,where,} from "firebase/firestore"; // Firestore functions
import { db } from "../../../config/Firebase"; // Ensure db is correctly imported
import AddInstallment from "./Installments/addInstallment";
import ViewInstallment from "./Installments/viewInstallments";
import { useNavigate } from "react-router-dom";

// Helper function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

const SaleList = ({ sales = [], loading = false, setRefresh }) => {
  const [open, setOpen] = useState(false);
  const [DSale, setDSale] = useState(null);
  const [salesData, setSalesData] = useState(sales); // Local sales state
  const [editOpen, setEditOpen] = useState(false);
  const [editSale, setEditSale] = useState(null); // For editing
  const [showFields, setShowFields] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null)
  const [installmentDialogOpen, setInstallmentDialogOpen] = useState(false)
  const [installmentViewDialogOpen, setInstallmentViewDialogOpen] = useState(false);

  const navigate = useNavigate()


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
  const handleMarkAsComplete = async (saleId, deliveredDate) => {
    if (!deliveredDate) {
      alert("Delivered Date is not added. Please provide a Delivered Date.");
      return;
    }

    try {
      const saleDocRef = doc(db, "sales", saleId); // Ensure the saleId is valid
      await updateDoc(saleDocRef, { status: "Completed" });

      // Update local sales data
      const updatedSales = salesData.map((sale) =>
        sale.id === saleId ? { ...sale, status: "Completed" } : sale
      );
      setSalesData(updatedSales);
    } catch (error) {
      console.error("Error updating sale status:", error); // Log the error
      alert(`Error updating sale status: ${error.message}`); // Show alert with error message
    }
  };

  // Delete sale
  const handleDeleteSale = async (saleId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this sale?"
    );
    if (confirmation) {
      try {
        const saleDocRef = doc(db, "sales", saleId); // Ensure the saleId is valid
        await deleteDoc(saleDocRef);

        // Update local sales data
        const updatedSales = salesData.filter((sale) => sale.id !== saleId);
        setSalesData(updatedSales);
      } catch (error) {
        console.error("Error deleting sale:", error); // Log the error
        alert(`Error deleting sale: ${error.message}`); // Show alert with error message
      }
    }
  };

  // Open edit dialog
  const handleEditSale = (sale) => {
    setEditSale(sale);
    setEditOpen(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setEditSale(null);
  };

  // Save edited sale
  const handleSaveEdit = async () => {
    if (!editSale) return;

    const saleDocRef = doc(db, "sales", editSale.id); // Ensure the saleId is valid
    try {
      await updateDoc(saleDocRef, editSale); // Update the Firestore document

      // Update local sales data
      const updatedSales = salesData.map((sale) =>
        sale.id === editSale.id ? editSale : sale
      );
      setSalesData(updatedSales);
      handleCloseEditDialog(); // Close the edit dialog
    } catch (error) {
      console.error("Error updating sale:", error);
      alert(`Error updating sale: ${error.message}`);
    }
  };

  const updatePendingAmount = async (saleId, installmentAmount) => {
    const saleDocRef = doc(db, "sales", saleId);
    let currentSaleData = salesData.filter((sale) => sale.id === saleId)[0];
    const newPendingAmount = currentSaleData.pendingAmount - installmentAmount
    currentSaleData.pendingAmount = newPendingAmount;
    try {
      await updateDoc(saleDocRef, currentSaleData);
    } catch (error) {
      console.error("Error updating sale:", error);
      alert(`Error updating sale: ${error.message}`);
    }
  }

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
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "100%",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  width: "10px", // Width of the vertical scrollbar
                  height: "10px", // Height of the horizontal scrollbar
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f0f0f0", // Track color
                  borderRadius: "10px", // Rounded track
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888", // Scrollbar thumb color
                  borderRadius: "10px", // Rounded thumb
                  border: "2px solid #f0f0f0", // Adds spacing around the thumb
                  "&:hover": {
                    backgroundColor: "#555", // Darker on hover
                  },
                },
              }}
            >
              {/* Listing Table */}
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sale ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Order Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Delivery Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Delivered Date
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Salesman</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>RSph</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RCyl</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RAxis</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RAdd</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>RIPD</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LSph</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LCyl</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LAxis</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LAdd</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>LIPD</TableCell> */}
                    {/* <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Advance</TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Pending Amount
                    </TableCell>

                    {/* <TableCell sx={{ fontWeight: "bold" }}>
                      Instruction
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}></TableCell>
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
                      <TableCell>
                        {sale.DeliveredDate
                          ? formatTimestamp(sale.DeliveredDate)
                          : "No Date"}
                      </TableCell>
                      {/* <TableCell>{sale.source}</TableCell>
                      <TableCell>{sale.barcode}</TableCell> */}
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{sale.contactNo}</TableCell>
                      <TableCell>{sale.address}</TableCell>
                      <TableCell>{sale.salesman}</TableCell>
                      <TableCell>{sale.doctor}</TableCell>
                      {/* <TableCell>{sale.reSph}</TableCell>
                      <TableCell>{sale.reCyl}</TableCell>
                      <TableCell>{sale.reAxis}</TableCell>
                      <TableCell>{sale.reAdd}</TableCell>
                      <TableCell>{sale.reIpd}</TableCell>
                      <TableCell>{sale.leSph}</TableCell>
                      <TableCell>{sale.leCyl}</TableCell>
                      <TableCell>{sale.leAxis}</TableCell>
                      <TableCell>{sale.leAdd}</TableCell>
                      <TableCell>{sale.leIpd}</TableCell>
                      <TableCell>{sale.totalAmount}</TableCell>
                      <TableCell>{sale.advance}</TableCell> */}
                      <TableCell>{sale.pendingAmount}</TableCell>
                      {/* <TableCell>{sale.instruction}</TableCell> */}

                      <TableCell>
                        <Button
                          variant="contained"
                          color={
                            sale.status === "Pending" ? "error" : "success"
                          } // Set color based on status
                          sx={{ textTransform: "none", minWidth: "100px" }} // Style the button
                        >
                          {sale.status === "Pending" ? "Pending" : "Completed"}
                        </Button>
                      </TableCell>

                      {/* Status buttons with click handlers */}
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {sale.status === "Pending" && (
                            <IconButton
                              color="success"
                              onClick={() =>
                                handleMarkAsComplete(
                                  sale.id,
                                  sale.deliveredDate
                                )
                              }
                              sx={{ marginLeft: 1 }}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                          <IconButton
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditSale(sale)}
                            sx={{ marginLeft: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteSale(sale.id)}
                            sx={{ marginLeft: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            navigate(`${sale.id}/products`)
                          }}
                        >
                          <span>View Products</span>
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            setInstallmentDialogOpen(true);
                            setSelectedSaleId(sale.id);
                          }}
                        >
                          Add Installment
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            setInstallmentViewDialogOpen(true);
                            setSelectedSaleId(sale.id);
                          }}
                        >
                          <EyeIcon /> <span>Installments</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {installmentDialogOpen && (
        <AddInstallment
          saleId={selectedSaleId}
          updatePendingAmount={updatePendingAmount}
          open={installmentDialogOpen}
          handleClose={() => {
            setInstallmentDialogOpen(false);
            setSelectedSaleId(null);
          }}
        />
      )}

      {installmentViewDialogOpen && (
        <ViewInstallment
          id={selectedSaleId}
          open={installmentViewDialogOpen}
          handleClose={() => {
            setInstallmentViewDialogOpen(false);
            setSelectedSaleId(null);
          }}
        />
      )}

      {/* Dialog for displaying sale details */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Sale Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Sale ID:</strong> {DSale?.id}
          </DialogContentText>
          <DialogContentText>
            <strong>Customer Name:</strong> {DSale?.customerName}
          </DialogContentText>
          {/* Add more fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing sale */}
      <Dialog open={editOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          {/* <Typography variant="h7">Date of Order</Typography>
          <DatePicker
            selected={editSale?.startDate}
            onChange={(date) => setEditSale({ ...editSale, startDate: date })}
            fullWidth
          />

          <Typography variant="h7">Date of Delivery</Typography>
          <DatePicker
            selected={editSale?.endDate}
            onChange={(date) => setEditSale({ ...editSale, endDate: date })}
            fullWidth
          />

          <Typography variant="h7">Delivered Date</Typography>
          <DatePicker
            selected={editSale?.DeliveredDate}
            onChange={(date) =>
              setEditSale({ ...editSale, DeliveredDate: date })
            }
            fullWidth
          /> */}

          <TextField
            label="Order No"
            type="number"
            name="orderNo"
            value={editSale?.orderNo || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, orderNo: e.target.value })
            }
            margin="normal"
            sx={{ mr: 6 }}
          />

          <TextField
            label="Customer Name"
            name="customerName"
            value={editSale?.customerName || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, customerName: e.target.value })
            }
            placeholder="Customer Name"
            margin="normal"
            sx={{ mr: 1 }}
          />
          <TextField
            label="Contact No"
            name="contactNo"
            value={editSale?.contactNo || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, contactNo: e.target.value })
            }
            placeholder="Contact No"
            margin="normal"
            sx={{ mr: 6 }}
          />
          <TextField
            label="Address"
            name="address"
            value={editSale?.address || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, address: e.target.value })
            }
            placeholder="Address"
            margin="normal"
            sx={{ mr: 1 }}
          />
          <TextField
            label="Salesman"
            name="salesman"
            value={editSale?.salesman || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, salesman: e.target.value })
            }
            placeholder="Salesman"
            margin="normal"
            sx={{ mr: 6 }}
          />
          <TextField
            label="Doctor"
            name="doctor"
            value={editSale?.doctor || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, doctor: e.target.value })
            }
            placeholder="Doctor"
            margin="normal"
            sx={{ mr: 1 }}
          />

          {/* Additional Table for SPH, CYL, AXIS, ADD, IPD */}
          <TableContainer>
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
                      value={editSale?.reSph || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, reSph: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="leSph"
                      value={editSale?.leSph || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, leSph: e.target.value })
                      }
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
                      value={editSale?.reCyl || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, reCyl: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="leCyl"
                      value={editSale?.leCyl || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, leCyl: e.target.value })
                      }
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
                      value={editSale?.reAxis || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, reAxis: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="leAxis"
                      value={editSale?.leAxis || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, leAxis: e.target.value })
                      }
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
                      value={editSale?.reAdd || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, reAdd: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="leAdd"
                      value={editSale?.leAdd || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, leAdd: e.target.value })
                      }
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
                      value={editSale?.reIpd || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, reIpd: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      name="leIpd"
                      value={editSale?.leIpd || ""}
                      onChange={(e) =>
                        setEditSale({ ...editSale, leIpd: e.target.value })
                      }
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TextField
            label="Total Amount"
            type="number"
            name="totalAmount"
            value={editSale?.totalAmount || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, totalAmount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Advance"
            type="number"
            name="advance"
            value={editSale?.advance || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, advance: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Pending Amount"
            type="number"
            name="pendingAmount"
            value={editSale?.pendingAmount || ""}
            disabled
            fullWidth
            margin="normal"
          />
          <TextField
            label="Instruction"
            name="instruction"
            value={editSale?.instruction || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, instruction: e.target.value })
            }
            placeholder="Instruction"
            margin="normal"
            fullWidth
          />
          <RadioGroup
            row
            name="status"
            disabled
            value={editSale?.status || ""}
            onChange={(e) =>
              setEditSale({ ...editSale, status: e.target.value })
            }
          >
            <FormControlLabel
              value="Pending"
              disabled
              control={<Radio />}
              label="Pending"
            />
            <FormControlLabel
              value="Completed"
              disabled
              control={<Radio />}
              label="Completed"
            />
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SaleList;
