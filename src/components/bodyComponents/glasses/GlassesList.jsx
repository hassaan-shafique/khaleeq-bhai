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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // 

const GlassesList = ({ glasses = [], loading = false, onDelete, onEdit }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentGlass, setCurrentGlass] = useState(null);
  const [editedGlass, setEditedGlass] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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


  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {glasses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Glasses found....
            </Typography>
          ) : (
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
                  {glasses.map((glass, i) => (
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
