import React, { useState ,useEffect  } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  TablePagination,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { db } from "../../../config/Firebase";// Ensure Firebase is configured
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Timestamp } from "firebase/firestore";


const ExpenseList = ({ expenses = [], loading = false }) => {
  const [selectedType, setSelectedType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [expenseData, setExpenseData] = useState(expenses)
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatTimestamp = (timestamp) =>
    timestamp ? timestamp.toDate().toLocaleDateString("en-GB") : "";
  // where("selectedDate", "==", new Date(date));
  // const q = query(
  //   collection(db, "expenses"),
  //   where("selectedDate", "==", Timestamp.fromDate(new Date(date)))
  // );

  const groupExpensesByDate = (expenses) =>
    expenses.reduce((acc, expense) => {
      const date = expense.selectedDate
        ? formatTimestamp(expense.selectedDate)
        : "No Date";
      acc[date] = acc[date] ? [...acc[date], expense] : [expense];
      return acc;
    }, {});

  const filteredExpenses = selectedType
    ? expenses.filter((e) => e.expenseType === selectedType)
    : expenses;

  const dateFilteredExpenses = filteredExpenses.filter((item) => {
    const itemDate = item.selectedDate ? item.selectedDate.toDate() : null;
    return (
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate))
    );
  });






  const groupedExpenses = groupExpensesByDate(dateFilteredExpenses);
  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Calculate the total expense for each date
  const calculateTotalExpense = (expenses) => {
    if (!expenses?.length) return 0; // Handle empty arrays gracefully
    return expenses.reduce(
      (accumulator, expense) => accumulator + Number(expense.price),
      0
    );
  };

  // Calculate the grand total across all expenses (grouped by date)
  const calculateGrandTotal = (groupedExpenses) => {
    if (!Object.keys(groupedExpenses).length) return 0; // Handle empty objects

    // Sum all expenses from each group
    return Object.values(groupedExpenses).reduce(
      (grandTotal, expensesForDate) =>
        grandTotal +
        expensesForDate.reduce(
          (total, expense) => total + Number(expense.price),
          0
        ),
      0
    );
  };
 const handleDelete = async (id) => {
   try {
     // Optimistically update the state
     const updatedExpenses = expenseData.filter((expense) => expense.id !== id);
     setExpenseData(updatedExpenses);
       alert(" Successfull");

     // Delete from Firebase
     await deleteDoc(doc(db, "expenses", id));
   } catch (error) {
     console.error("Failed to delete expense:", error);
   
   }
 };


  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <FormControl sx={{ minWidth: 200, mr: 2 }}>
              <InputLabel>Filter by Expense Type</InputLabel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Filter by Expense Type"
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(expenses.map((e) => e.expenseType))].map(
                  (type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ mr: 2 }}
            />
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>

          {sortedDates.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
              No Expenses found....
            </Typography>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 500,
                maxWidth: "100%",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  width: "10px",
                  height: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f0f0f0",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                  border: "1px solid #f0f0f0",
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#0056b3" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Expenses
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                      Total (Rs.)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedDates
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((date, index) => (
                      <TableRow key={index}>
                        <TableCell>{date}</TableCell>
                        <TableCell>
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="subtitle1">
                                View Expenses
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {groupedExpenses[date].map((expense, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    mb: 1,
                                    p: 1,
                                    bgcolor: "#f9f9f9",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography key={i}>
                                    <strong> Expense {i + 1}</strong> <br />
                                    <strong>Type:</strong> {expense.expenseType}{" "}
                                    | <strong>Price:</strong> Rs.{" "}
                                    {expense.price}
                                  </Typography>
                                  <Typography>
                                    <strong>Other:</strong>{" "}
                                    {expense.otherExpense || ""}
                                  </Typography>
                                  <IconButton
                                    onClick={() =>
                                      handleDelete(expense.id)
                                    } 
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                        <TableCell>
                          Rs. {calculateTotalExpense(groupedExpenses[date])}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography
            variant="h5" // Larger font size for prominence
            sx={{
              mt: 2,
              textAlign: "right",
              fontWeight: "bold", // Make it bold for emphasis
              padding: "5px",
              borderRadius: "8px",
              color: "#fff", // White text for contrast
              backgroundColor: "#1976d1", // Blue background to make it stand out
              display: "inline-block", // Make it fit content size
            }}
          >
            Grand Total: Rs. {calculateGrandTotal(groupedExpenses)}
          </Typography>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedDates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default ExpenseList;
