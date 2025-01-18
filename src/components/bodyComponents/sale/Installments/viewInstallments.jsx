import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";

export const ViewInstallment = ({ id, open, handleClose}) => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch installments from Firebase
  const fetchInstallments = async () => {
    setLoading(true); // Set loading state to true before fetching
    try {
      const querySnapshot = await getDocs(collection(db, "salesInstallments"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInstallments(data.filter((f) => f.saleId === id));

     
    } catch (error) {
      console.error("Error fetching installments:", error);
      setError("Failed to fetch installments. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, [id]); // Fetch installments whenever the `id` changes

  // Calculate the total amount
  const totalAmount = installments.reduce(
    (sum, installment) => sum + Number(installment.amount || 0),
    0
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Installments</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 20 }}
            >
              <CircularProgress />
            </div>
          ) : error ? (
            <p>{error}</p> // Display error message if there is an error
          ) : installments.length ? (
            <>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Payment Method
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {installments.map((installment) => (
                    <TableRow
                      key={installment.id}
                      sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}
                    >
                      <TableCell align="left">Rs. {installment.amount}</TableCell>
                      <TableCell align="left">{installment.payment}</TableCell>
                      <TableCell align="left">
                        {new Date(installment.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography
                variant="h6"
                sx={{
                  textAlign: "right",
                  marginTop: 2,
                  fontWeight: "bold",
                }}
              >
                Total: Rs. {totalAmount}
              </Typography>
            </>
          ) : (
            <p>No installments available.</p>
          )}
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInstallment;
