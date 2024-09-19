import React, { useEffect, useState } from "react";
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
    // Parse the timestamp string into a Date object
    const date = new Date(timestamp);

    // Define options for formatting the date and time
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    const formattedDate = date.toLocaleDateString("en-GB", options);

    return `${formattedDate}`;
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
                      Branch Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Item Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {glasses.map((glasses, i) => (
                    <TableRow key={glasses.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{glasses.branchBorrowedFrom}</TableCell>
                      <TableCell> {glasses.barcodeNumber}</TableCell>
                      <TableCell> {glasses.borrowedItem}</TableCell>
                      <TableCell> Rs.{glasses.price}</TableCell>
                      <TableCell>
                        {formatTimestamp(Date(glasses.selectedDate))}
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
