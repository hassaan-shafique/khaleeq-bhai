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
  TextField,
  TablePagination,
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

// Group expenses by date
const groupExpensesByDate = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const formattedDate = expense.selectedDate
      ? formatTimestamp(expense.selectedDate)
      : "No Date";
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(expense);
    return acc;
  }, {});
};

const ExpenseList = ({ expenses = [], loading = false }) => {
  const [selectedType, setSelectedType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Filter expenses by selected type
  const filteredExpenses = selectedType
    ? expenses.filter((item) => item.expenseType === selectedType)
    : expenses;

  // Filter expenses by selected date range
  const dateFilteredExpenses = filteredExpenses.filter((item) => {
    const itemDate = item.selectedDate ? item.selectedDate.toDate() : null;
    return (
      (!startDate || (itemDate && itemDate >= new Date(startDate))) &&
      (!endDate || (itemDate && itemDate <= new Date(endDate)))
    );
  });

  // Group the filtered expenses by date
  const groupedExpenses = groupExpensesByDate(dateFilteredExpenses);

  const uniqueExpenseTypes = [
    ...new Set(expenses.map((item) => item.expenseType)),
  ];

  // Sort dates from Recent to Old
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    const dateA = new Date(a === "No Date" ? 0 : new Date(a));
    const dateB = new Date(b === "No Date" ? 0 : new Date(b));
    return dateB - dateA; // Descending order
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on change
  };

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
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, marginRight: 2 }}
            >
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
            <TextField
              type="date"
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ marginRight: 2 }}
            />
            <TextField
              type="date"
              variant="outlined"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>

          {Object.keys(groupedExpenses).length === 0 ? (
            <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
              No Expenses found....
            </Typography>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ boxShadow: 3, maxHeight: "600px", overflowY: "auto" }}
              >
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
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          color: "white",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        Expenses
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedDates
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((date, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              border: "1px solid #e0e0e0",
                              padding: "16px",
                            }}
                          >
                            {date}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #e0e0e0",
                              padding: "16px",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                          >
                            {/* Show multiple expenses in one row */}
                            {groupedExpenses[date].map((item, i) => (
                              <Box
                                key={i}
                                sx={{
                                  borderBottom:
                                    i !== groupedExpenses[date].length - 1
                                      ? "1px solid #e0e0e0"
                                      : "none",
                                  marginBottom:
                                    i !== groupedExpenses[date].length - 1
                                      ? "8px"
                                      : "0",
                                  paddingBottom: "8px",
                                  backgroundColor: "#f9f9f9", // Alternate background color
                                  borderRadius: "4px",
                                  padding: "10px",
                                }}
                              >
                                {/* Display dynamic headings */}
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    backgroundColor: "#0056b3", // Light blue background
                                    padding: "5px",
                                    borderRadius: "4px",
                                    display: "inline-block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Expense {i + 1}:
                                </Typography>
                                <Typography>
                                  <strong>Type:</strong> {item.expenseType} |{" "}
                                  <strong>Other:</strong> {item.otherExpense} |{" "}
                                  <strong>Price:</strong> Rs. {item.price}
                                </Typography>
                              </Box>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={sortedDates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ marginTop: 2 }}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ExpenseList;
