import React from "react";
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

const expenseList = ({ expenses = [], loading = false }) => {
  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {expenses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Inventory found....
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Expense ID
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      Expense Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      other Expenses
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((item, i) => (
                    <TableRow key={item.id}>
                      <TableCell>{i + 1}</TableCell>

                      <TableCell>{item.expenseType}</TableCell>
                      <TableCell>{item.otherExpense}</TableCell>
                      <TableCell>Rs.{item.price}</TableCell>
                      <TableCell>
                        {item.selectedDate
                          ? formatTimestamp(item.selectedDate)
                          : "No Date"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default expenseList;
