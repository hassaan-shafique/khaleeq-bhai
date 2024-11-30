import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase"; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const AllVendorSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for search filters
  const [vendorSearch, setVendorSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // State for date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

   const printRef = useRef(null);

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

const handlePrint = () => {
  // Temporarily hide other parts of the UI during printing
  const printContents = printRef.current.innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload(); // Reload to restore original content
};


  // Filter sales data based on search inputs and date range
 const filteredSalesData = salesData.filter(
   (sale) =>
     Array.isArray(sale.vendorProducts) &&
     sale.vendorProducts.some(
       (product) =>
         (!vendorSearch ||
           (sale.vendorName &&
             sale.vendorName
               .toLowerCase()
               .includes(vendorSearch.toLowerCase()))) &&
         (!branchSearch ||
           (product.borrowedBranch &&
             product.borrowedBranch
               .toLowerCase()
               .includes(branchSearch.toLowerCase()))) &&
         (!customerSearch ||
           (sale.customerName &&
             sale.customerName
               .toLowerCase()
               .includes(customerSearch.toLowerCase()))) &&
               
         (!startDate ||
           (sale.startDate &&
             new Date(sale.startDate) >= new Date(startDate))) &&
         (!endDate ||
           (sale.startDate && new Date(sale.startDate) <= new Date(endDate)))
     )
 );



  if (loading) return <p>Loading...</p>;
  if (salesData.length === 0) return <p>No vendor sales available.</p>;

  return (
    <div style={{ marginTop: 30, padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        All Vendor Sales
      </Typography>

      {/* Search Fields */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <TextField
          label="Search by Vendor Name"
          variant="outlined"
          size="small"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
        />
        <TextField
          label="Search by Borrowed Branch"
          variant="outlined"
          size="small"
          value={branchSearch}
          onChange={(e) => setBranchSearch(e.target.value)}
        />
        <TextField
          label="Search by Customer Name"
          variant="outlined"
          size="small"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
      </div>

      {/* Date Range Filter */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Vendor Information
        </Button>
      </div>

      <div ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sticky sx={{ backgroundColor: "#2a9df4" }}>
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
                  Vendor Name
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
              {filteredSalesData.map((sale) =>
                sale.vendorProducts.map((product, index) => (
                  <TableRow key={`${sale.id}-${index}`}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.contactNo}</TableCell>
                    <TableCell>{sale.vendorName || "N/A"}</TableCell>
                    <TableCell>{product.VendorItemName}</TableCell>
                    <TableCell>{product.borrowedBranch}</TableCell>
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
    </div>
  );
};

export default AllVendorSales;
