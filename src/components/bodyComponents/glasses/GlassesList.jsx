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

const GlassesList = ({ glasses = [], loading = false }) => {
  const formatTimestamp = (timestamp) => {
    try {
      // Convert timestamp to a Date object
      const date = new Date(
        timestamp.seconds ? timestamp.seconds * 1000 : timestamp
      );

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      // Format the date
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Glasses ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Glass Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Glass Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Glass Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {glasses.map((glasses, i) => (
                    <TableRow key={glasses.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{glasses.glass}</TableCell>
                      <TableCell>{glasses.type}</TableCell>
                      <TableCell>{glasses.number}</TableCell>
                      <TableCell>Rs.{glasses.price}</TableCell>
                      <TableCell>{glasses.barcodeNumber}</TableCell>
                      <TableCell>{glasses.quantity}</TableCell>
                      <TableCell>
                        {formatTimestamp(glasses.selectedDate)}
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

export default GlassesList;
