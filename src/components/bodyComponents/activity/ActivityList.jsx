import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../config/Firebase";

const ActivityList = ({ refresh }) => {
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(false); // State for edit mode
  const [editedActivity, setEditedActivity] = useState(null); // Store edited activity data
  const [openDialog, setOpenDialog] = useState(false);
  const [vendorSearch, setVendorSearch] = useState(""); // Search query for vendor
  const [itemSearch, setItemSearch] = useState(""); // Search query for item name
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state

  // Fetch data from Firebase
  const fetchActivities = async () => {
    try {
      const dailyActivityCollectionRef = collection(db, "daily-activity");
      const querySnapshot = await getDocs(dailyActivityCollectionRef);
      const activitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID
        ...doc.data(), // Include document data
      }));
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

   const calculateGrandTotal = () => {
     return filteredActivities.reduce((total, activity) => {
       const price = parseFloat(activity.price) || 0;
       
       return total + price ;
     }, 0);
   };

  // Fetch activities on component mount or when refresh changes
  useEffect(() => {
    fetchActivities();
  }, [refresh]);

  // Function to format timestamp
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

  // Handle edit activity
  const handleEdit = (activity) => {
    setEditing(true);
    setEditedActivity({ ...activity });
    setOpenDialog(true);
  };

  // Handle delete activity
  const handleDelete = async (id) => {
    try {
      const activityRef = doc(db, "daily-activity", id);
      await deleteDoc(activityRef);
      fetchActivities(); // Refresh the activities list
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Handle update activity
  const handleUpdate = async () => {
    if (editedActivity) {
      try {
        const activityRef = doc(db, "daily-activity", editedActivity.id);
        await updateDoc(activityRef, {
          selectedDate: editedActivity.selectedDate,
          itemName: editedActivity.itemName,
          vendor: editedActivity.vendor,
          price: editedActivity.price,
          quantity: editedActivity.quantity,
        });
        setEditing(false); // Exit editing mode
        fetchActivities();
        setOpenDialog(false); // Close the dialog after update
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditing(false);
    setEditedActivity(null);
    setOpenDialog(false);
  };

  // Handle search for vendor
  const handleVendorSearchChange = (e) => {
    setVendorSearch(e.target.value);
  };

  // Handle search for item name
  const handleItemSearchChange = (e) => {
    setItemSearch(e.target.value);
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Filter activities based on search queries and date range
  const filteredActivities = activities.filter((activity) => {
    const matchVendor = activity.vendor
      .toLowerCase()
      .includes(vendorSearch.toLowerCase());
    const matchItem = activity.itemName
      .toLowerCase()
      .includes(itemSearch.toLowerCase());

    // Convert selectedDate to date object for comparison
    const activityDate = new Date(
      activity.selectedDate.seconds
        ? activity.selectedDate.seconds * 1000
        : activity.selectedDate
    );

    const matchStartDate = !startDate || activityDate >= new Date(startDate);
    const matchEndDate = !endDate || activityDate <= new Date(endDate);

    return matchVendor && matchItem && matchStartDate && matchEndDate;
  });

  const userRole = localStorage.getItem("userRole");

  return (
    <div>
      {/* Search and Date Filters */}
      
        <div style={{ marginBottom: "20px", display: "flex" }}>
          <TextField
            label="Search by Vendor"
            value={vendorSearch}
            onChange={handleVendorSearchChange}
            fullWidth
            sx={{ mb: 2, mr: 2 }}
          />
          <TextField
            label="Search by Item Name"
            value={itemSearch}
            onChange={handleItemSearchChange}
            fullWidth
            sx={{ mb: 2, mr: 2 }}
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2", // Background color
                  color: "white", // Text color
                  fontWeight: "bold", // Bold text
                  padding: "12px", // Adjust padding as needed
                }}
              >
                <strong>Sr.No</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Date</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Ref No</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Item Name</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Vendor</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Price</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Quantity</strong>
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  fontWeight: "bold",
                  padding: "12px",
                }}
              >
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <TableRow key={activity.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {formatTimestamp(activity.selectedDate)}
                  </TableCell>
                  <TableCell>{activity.refNo}</TableCell>
                  <TableCell>{activity.itemName}</TableCell>
                  <TableCell>{activity.vendor}</TableCell>
                  <TableCell>{activity.price}</TableCell>
                  <TableCell>{activity.quantity}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEdit(activity)}
                      color="primary"
                      variant="contained"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    {userRole == "admin" && (
                      <Button
                        onClick={() => handleDelete(activity.id)}
                        color="secondary"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          textAlign: "left ",
          fontWeight: "bold",
        }}
      >
        Grand Total: {calculateGrandTotal().toFixed(2)}
      </Typography>

      {/* Edit Dialog */}
      {openDialog && editedActivity && (
        <Dialog open={openDialog} onClose={handleCancel}>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogContent>
            <TextField
              label="Item Name"
              value={editedActivity.itemName}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  itemName: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Vendor"
              value={editedActivity.vendor}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, vendor: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Price"
              value={editedActivity.price}
              onChange={(e) =>
                setEditedActivity({ ...editedActivity, price: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Quantity"
              value={editedActivity.quantity}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  quantity: e.target.value,
                })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ActivityList;
