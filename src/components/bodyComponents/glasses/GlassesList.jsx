import React, { useState,useRef} from "react";
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // 
import { Print } from "@mui/icons-material";
import UpdateGlassesQuantity from "./updateGlassesQuantity";

const GlassesList = ({ glasses = [], loading = false, onDelete, onEdit }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentGlass, setCurrentGlass] = useState(null);
  const [editedGlass, setEditedGlass] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
   const [searchNumber, setSearchNumber] = React.useState("");
   const [searchType, setSearchType] = React.useState("");
   const[priceRange, setPriceRange] = React.useState(""); 
   const [filteredGlasses, setFilteredGlasses] = React.useState(glasses);
   const [refresh ,setRefresh] =useState();

   const userRole = localStorage.getItem("userRole");

   
  const printRef = useRef (null);

 const handleSearch = () => {
   setFilteredGlasses(
     glasses.filter((glass) => {
       const matchesNumber = searchNumber
         ? glass.number.toString().includes(searchNumber)
         : true;
       const matchesType = searchType
         ? glass.type.toLowerCase().includes(searchType.toLowerCase())
         : true;
       

       return matchesNumber && matchesType;
     })
   );
 };

 // When glasses props change, reset the filteredGlasses
 React.useEffect(() => {
   setFilteredGlasses(glasses);
 }, [glasses]);

 // Re-run the search whenever search criteria change
 React.useEffect(() => {
   handleSearch();
 }, [searchNumber, searchType]);

  const handlePriceRangeChange = (e) => {
    const selectedRange = e.target.value;
    setPriceRange(selectedRange);
    const filtered = glasses.filter((item) => {
      switch (selectedRange) {
        case "0": 
          return true;
        case "1":
          return item.price >= 350 && item.price <= 600;
        case "2":
          return item.price >= 601 && item.price <= 950;
        case "3":
          return item.price >= 951 && item.price <= 1250;
        case "4":
          return item.price >= 1251 && item.price <= 1550;
        case "5":
          return item.price >= 1551 && item.price <= 1850;
        case "6":
          return item.price >= 1851 && item.price <= 2550;
        case "7":
          return item.price >= 2551 && item.price <= 3500;
        case "8":
          return item.price >= 3501 && item.price <= 6000;
        case "9":
          return item.price >= 6001 && item.price <= 10000;
        case "10":
          return item.price >= 10001 && item.price <= 30000;
        case "11":
          return item.price >= 30001 && item.price <= 50000;
        default:
          return true; // If no range is selected, return all items
      }
    });
    setFilteredGlasses(filtered);
  };
 



  // Format date
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(
        timestamp.seconds ? timestamp.seconds * 1000 : timestamp
      );
      if (isNaN(date.getTime())) return "Invalid Date";

      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
      };

      return date.toLocaleDateString("en-GB", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Open edit dialog
  const handleEdit = (glass) => {
    setCurrentGlass(glass);
    setEditedGlass(glass); // Start with the existing glass data
    setEditDialogOpen(true);
  };

  // Close edit dialog
  const handleClose = () => {
    setEditDialogOpen(false);
    setCurrentGlass(null);
  };

  // Show snackbar message
  const handleSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Update the glass data in Firestore
  const handleSave = async () => {
    try {
      const glassDocRef = doc(db, "glasses", currentGlass.id); // 'glasses' is your Firestore collection
      await updateDoc(glassDocRef, {
        glass: editedGlass.glass,
        type: editedGlass.type,
        price: editedGlass.price,
        // Add other fields you want to update
      });

      // Update the local glasses array with the edited glass
      onEdit((prevGlasses) =>
        prevGlasses.map((glass) =>
          glass.id === currentGlass.id ? { ...glass, ...editedGlass } : glass
        )
      );

      handleSnackbar("Successfully Updated");
      handleClose();
    } catch (error) {
      console.error("Error updating document: ", error);
      handleSnackbar("Error updating document", "error");
    }
  };


  // Delete functionality with Firestore
 const handleDelete = async (glassId) => {
   try {
     const glassDocRef = doc(db, "glasses", glassId); // 'glasses' is your Firestore collection
     await deleteDoc(glassDocRef);

     // Update the local glasses array to remove the deleted glass
     onDelete((prevGlasses) =>
       prevGlasses.filter((glass) => glass.id !== glassId)
     );

     handleSnackbar("Successfully Deleted");
   } catch (error) {
     console.error("Error deleting document: ", error);
     handleSnackbar("Error deleting document", "error");
   }
 };
  const handlePrint = () => {
    // Clone the printRef content to a new window for printing
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank");

    // Write the content to the new window
    newWindow.document.open();
    newWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print</title>
        <style>
          /* Ensure the table fits on the page */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          /* Add styling for large tables */
          .print-container {
            overflow: visible !important; /* Ensure all content is visible */
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${printContents}
        </div>
      </body>
    </html>
  `);
    newWindow.document.close();
    newWindow.print();
    newWindow.close();
  };


  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {userRole == "admin" && (
            <Box
              sx={{
                display: "flex",
                gap: "1rem", // Add gap property for consistent spacing
                marginBottom: "1rem",
              }}
            >
              <TextField
                variant="outlined"
                label="Search by Number"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)} // Update searchNumber state
                sx={{ width: "300px" }}
              />
              <TextField
                variant="outlined"
                label="Search by Type"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)} // Update searchType state
                sx={{ width: "300px" }}
              />
              <FormControl sx={{ width: "300px", marginBottom: "1rem" }}>
                <InputLabel>Filter by Price Range</InputLabel>
                <Select value={priceRange} onChange={handlePriceRangeChange}>
                  <MenuItem value="0">All</MenuItem>
                  <MenuItem value="1">350 - 600</MenuItem>
                  <MenuItem value="2">601 - 950</MenuItem>
                  <MenuItem value="3">951 - 1250</MenuItem>
                  <MenuItem value="4">1251 - 1550</MenuItem>
                  <MenuItem value="5">1551 - 1850</MenuItem>
                  <MenuItem value="6">1851 - 2550</MenuItem>
                  <MenuItem value="7">2551 - 3500</MenuItem>
                  <MenuItem value="8">3501 - 6000</MenuItem>
                  <MenuItem value="9">6001 - 10000</MenuItem>
                  <MenuItem value="10">10001 - 30000</MenuItem>
                  <MenuItem value="11">30001 - 50000</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {userRole == "admin" && (

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print Glasses Inventory
            </Button>
          </div>

          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "-2rem",
              marginBottom: "1rem",
            }}
          >
            <UpdateGlassesQuantity setRefresh={setRefresh} />
          </div>

          {filteredGlasses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Glasses found....
            </Typography>
          ) : (
            <div ref={printRef}>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 500,
                  maxWidth: "100%",
                  width: "98%", // Increased width to 98%
                  overflowX: "auto",
                  borderRadius: "8px", // Rounded corners for the table container
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.7)", // Soft shadow for depth
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
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: "#E0F7FA", // Light blue background for header
                        "& th": {
                          fontWeight: "bold",
                          color: "#black", // Darker color for text
                          padding: "12px 16px", // Padding for header cells
                          textAlign: "center", // Center align header text
                          borderBottom: "2px solid #black", // Bottom border for header cells
                        },
                      }}
                    >
                      <TableCell>ID</TableCell>
                      <TableCell>Glass Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Number</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Barcode</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGlasses.map((glass, i) => (
                      <TableRow
                        key={glass.id}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f1f1f1", // Subtle hover effect for rows
                          },
                          transition: "background-color 0.3s", // Smooth transition on hover
                        }}
                      >
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="center">{glass.glass}</TableCell>
                        <TableCell align="center">{glass.type}</TableCell>
                        <TableCell align="center">{glass.number}</TableCell>
                        <TableCell align="center">Rs.{glass.price}</TableCell>
                        <TableCell align="center">
                          {glass.barcodeNumber}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              glass.quantity > 10
                                ? "lightgreen"
                                : glass.quantity <= 10
                                ? "red"
                                : "inherit", // Use red if less than 10, otherwise inherit background
                            fontWeight:
                              glass.quantity > 10
                                ? "bold"
                                : glass.quantity < 10
                                ? "bold"
                                : "normal", // Bold if highlighted
                            color: glass.quantity < 10 ? "#fff" : "inherit", // White text for low stock
                          }}
                        >
                          {glass.quantity}
                        </TableCell>
                        <TableCell align="center">
                          {formatTimestamp(glass.selectedDate)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleEdit(glass)}
                            color="primary"
                            sx={{
                              marginRight: "8px",
                              "&:hover": {
                                backgroundColor: "#e0f7fa", // Light hover effect for edit icon
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(glass.id)}
                            color="error"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#ffebee", // Light hover effect for delete icon
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      )}

      {/* Edit Glass Dialog */}
      <Dialog open={editDialogOpen} onClose={handleClose}>
        <DialogTitle>Edit Glass</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Glass Name"
            value={editedGlass?.glass || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, glass: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Glass Type"
            value={editedGlass?.type || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, type: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Glass Number"
            value={editedGlass?.number || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, number: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Barcode"
            value={editedGlass?.barcodeNumber || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, barcodeNumber: e.target.value })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Price"
            value={editedGlass?.price || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, price: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quantity"
            value={editedGlass?.quantity || ""}
            onChange={(e) =>
              setEditedGlass({ ...editedGlass, quantity: e.target.value })
            }
            margin="normal"
          />
          {/* Add more fields as necessary */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GlassesList;
