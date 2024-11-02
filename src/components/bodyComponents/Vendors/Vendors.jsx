import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; // Firestore configuration
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const AllVendorSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVendorSales = async () => {
      try {
        const salesRef = collection(db, "sales");
        const querySnapshot = await getDocs(salesRef);

        const allSales = [];
        querySnapshot.forEach((doc) => {
          const sale = { id: doc.id, ...doc.data() };
          if (sale.vendorProducts && sale.vendorProducts.length > 0) {
            allSales.push(sale); // Store only sales that have vendor products
          }
        });

        setSalesData(allSales);
      } catch (error) {
        console.error("Error fetching vendor sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVendorSales();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (salesData.length === 0) return <p>No vendor sales available.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        All Vendor Sales
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sticky sx={{ backgroundColor: "#2a9df4" }}>
            {" "}
            {/* Optional: Light blue background */}
            <TableRow>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Sale ID
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Customer Name
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Customer Number
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Vendor Product
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Borrowed Branch
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Sale Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesData.map((sale) =>
              sale.vendorProducts.map((product, index) => (
                <TableRow key={`${sale.id}-${index}`}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{sale.contactNo}</TableCell>
                  <TableCell>{product.VendorItemName}</TableCell>
                  <TableCell> {product.borrowedBranch}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>Rs {product.vendorPrice} </TableCell>
                  <TableCell>
                    {new Date(sale.startDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllVendorSales;
