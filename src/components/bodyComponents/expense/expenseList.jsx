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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

const ExpenseList = ({ expenses = [], loading = false }) => {
  const [selectedType, setSelectedType] = useState("");

  const filteredExpenses = selectedType
    ? expenses.filter((item) => item.expenseType === selectedType)
    : expenses;

  const uniqueExpenseTypes = [
    ...new Set(expenses.map((item) => item.expenseType)),
  ];

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}
          >
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Expense Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Filter by Expense Type"
              >
                <MenuItem value="">All</MenuItem>
                {uniqueExpenseTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {filteredExpenses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Expenses found....
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#0056b3" }}>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Expense ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Expense Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Other Expenses
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredExpenses.map((item, i) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:hover": { backgroundColor: "#e9f7ff" },
                        backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9f9f9",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <TableCell
                        sx={{ border: "1px solid #e0e0e0", padding: "16px" }}
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #e0e0e0", padding: "16px" }}
                      >
                        {item.expenseType}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #e0e0e0", padding: "16px" }}
                      >
                        {item.otherExpense}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #e0e0e0", padding: "16px" }}
                      >
                        Rs.{item.price}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid #e0e0e0", padding: "16px" }}
                      >
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

export default ExpenseList;
