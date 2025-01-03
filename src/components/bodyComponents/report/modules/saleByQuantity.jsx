import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
 MenuItem,
 Select,
 TableContainer,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";



const SaleByQuantity = ({salesData}) => {
  const [timeframe, setTimeframe] = useState("day"); // Default to "day"
  // const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false)
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [saleStats, setSaleStats] = useState([])
  const [productFilter, setProductFilter] = useState("");
const [kbcwProducts,setKbceProducts] =useState([]);
const [glassesProducts, setGlassesProducts] =useState ([]);
const [kbcwTotal, setKbcwTotal] = useState(0);
  const [glassesTotal, setGlassesTotal] = useState(0);
  const STATUS = {
    COMPLETED : "Completed",
    PENDING: "PENDING"
  }
 

  useEffect(() => {
    const getSalesData = () => {
      setSaleStats([])
      let sales = []
      let kbcwCount = 0;
      let glassesCount = 0;
      salesData.forEach(sale => {
        if (sale.status === STATUS.COMPLETED) {
          if (
            (!productFilter || sale.payment === productFilter) && // Apply payment filter
            ((timeframe === "day" && isSameDay(sale.startDate)) ||
              (timeframe === "week" && isSameWeek(sale.startDate)) ||
              (timeframe === "month" && isSameMonth(sale.startDate)))
          ) {
            sales.push(sale);
            
            if (sale.kbcwProducts) {
              sale.kbcwProducts.forEach((product) => {
                kbcwCount += Number(product.enteredQuantity) || 0; // Add the quantity
              });
            
              // Sort kbcwProducts by enteredQuantity in descending order
              sale.kbcwProducts.sort((a, b) => (b.enteredQuantity || 0) - (a.enteredQuantity || 0));
            }
            
            // Accumulate and sort quantities for Glasses Products
            if (sale.glassesProducts) {
              sale.glassesProducts.forEach((product) => {
                glassesCount += Number(product.enteredQuantity) || 0; // Add the quantity
              });
            
              // Sort glassesProducts by enteredQuantity in descending order
              sale.glassesProducts.sort((a, b) => (b.enteredQuantity || 0) - (a.enteredQuantity || 0));
            }
          }
        }
      });
      setSaleStats(sales);
      setKbcwTotal(kbcwCount);
      setGlassesTotal(glassesCount);
    };
    
    if (salesData.length) {
      getSalesData()
    }
   
  }, [timeframe, salesData, productFilter]);


  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const isSameDay = (orderDate) => {
    const now = new Date();
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate.toDateString() === now.toDateString();
  };

  const isSameWeek = (orderDate) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() -7);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); 
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate >= startOfWeek && saleDate <= endOfWeek;
  };
  
  const isSameMonth = (orderDate) => {
    const now = new Date();
    const saleDate = new Date(orderDate.seconds * 1000);
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
  };
 


  // Helper function to format Firestore timestamp
const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(
      timestamp.seconds ? timestamp.seconds * 1000 : timestamp
    );
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    // Format as "DD/MM/YYYY"
    return `${day}/${month}/${year}`;
  } catch (error) {
    return "Invalid Date";
  }
};



  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
       Products Quantity
      </Typography>

      {/* Buttons for Timeframe Selection */}
      <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === "day" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("day")}
          >
            Day
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "week" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("week")}
          >
            Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "month" ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleTimeframeChange("month")}
          >
            Month
          </Button>
        </Grid>
       
      </Grid>
        {/* Totals Summary */}
        <Paper sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>KBCW Products Sold:</strong> {kbcwTotal}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">
              <strong>Glasses Products Sold:</strong> {glassesTotal}
            </Typography>
          </Grid>
        </Grid>
      </Paper>


      {/* Display Sales Data in a Table */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
         Product  Quantity Data
      </Typography>
      

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 ,maxHeight: 600, 
    overflow: "auto",}}>
  <Table>
   
    
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : saleStats.length > 0 ? (
        saleStats.map((sale, index) => (
          <React.Fragment key={sale.id}>
        <TableRow
  
  sx={{
    backgroundColor: "#2f2f2f", 
    color: "white",
    "&:nth-of-type(odd)": {
      backgroundColor: "#3b3b3b", 
    },
  }}
>
  <TableCell>
    <Typography variant="body2" sx={{ color: "white" }}>
      {index + 1}
    </Typography>
  </TableCell>
  <TableCell>
    <Typography variant="body2" sx={{ color: "white" }}>
      {formatTimestamp(sale.startDate)}
    </Typography>
  </TableCell>
</TableRow>


            
            {sale.kbcwProducts && sale.kbcwProducts.length > 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ paddingLeft: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold">
    KBCW Products:
  </Typography>
  <Table size="small">
    <TableHead>
      <TableRow sx={{ backgroundColor: '#1976d2' }}> 
        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Image</TableCell>
        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Barcode</TableCell>
        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Price</TableCell>
        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Size</TableCell>
        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Quantity</TableCell>
      </TableRow>
    </TableHead>

                    <TableBody>
                      {sale.kbcwProducts.map((product, i) => (
                        <TableRow key={i}>
                           <TableCell>{product.kbcwImage ? (
                           <img
                             src={product.kbcwImage}
                             alt="Product"
                             style={{
                               width: "100%",
                               height: "auto",
                               maxHeight: "150px",
                               objectFit: "cover",
                               borderRadius: "12px",
                               backgroundColor: "#808080",
                             }}
                           />
                         ) : (
                           <div style={{ width: "100%", height: "150px", backgroundColor: "#f0f0f0", textAlign: "center", lineHeight: "150px", borderRadius: "12px" }}>
                             No Image Available
                           </div>
                         )}</TableCell>
                          <TableCell>{product.kbcwBarcode}</TableCell>
                          <TableCell>{product.kbcwPrice}</TableCell>
                          <TableCell>{product.kbcwSize}</TableCell>
                          <TableCell>{product.enteredQuantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}

         
            {sale.glassesProducts && sale.glassesProducts.length > 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ paddingLeft: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold">
  Glasses Products:
</Typography>
<Table size="small">
  <TableHead>
    <TableRow sx={{ backgroundColor: '#1976d2' }}> 
      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Product Type</TableCell>
      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Number</TableCell>
      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Quantity</TableCell>
      <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Price</TableCell>
    </TableRow>
  </TableHead>
                    <TableBody>
                      {sale.glassesProducts.map((product, i) => (
                        <TableRow key={i}>
                           <TableCell>{product.glassesType}</TableCell>
                           <TableCell>{product.glassesNumber}</TableCell>
                           <TableCell>{product.enteredQuantity}</TableCell>
                           <TableCell>{product.glassesPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <Typography variant="body2" color="textSecondary">
              No sales data available.
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>




    </Box>
  );
};

export default SaleByQuantity;
