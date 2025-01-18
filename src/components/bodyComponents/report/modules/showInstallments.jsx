import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../config/Firebase";
import { Card, CardContent, Typography, CircularProgress,Grid,Button, Paper,} from "@mui/material";

const ShowInstallments = () => {
  const [totalInstallment, setTotalInstallment] = useState(0);
  const [installments, setInstallments] =useState ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [timeframe, setTimeframe] = useState("day"); // Default to "day"
    const [customDate, setCustomDate] = useState({ start: "", end: "" });
  

  // Fetch and calculate installment data
  const fetchInstallments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "salesInstallments"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      // Calculate total installment amount
      const total = data.reduce((sum, installment) => {    
        return sum + Number(installment.amount);
      }, 0);
      setTotalInstallment(total);
    } catch (err) {
      console.error("Error fetching installments:", err);
      setError("Failed to fetch installments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, []);
  


  
  
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
  const filterDataByTimeframe = (data, timeframe) => {
    return data.filter((item) => {
      const date = new Date(item.date);
      if (timeframe === "day") return isSameDay(date);
      if (timeframe === "week") return isSameWeek(date);
      if (timeframe === "month") return isSameMonth(date);
      if (timeframe === "custom") {
        const { start, end } = customDate;
        const startDate = new Date(start);
        const endDate = new Date(end);
        return date >= startDate && date <= endDate;
      }
      return true;
    });
  };

  return (
<div>

    <Grid container spacing={2} sx={{ marginBottom: 4 }}>
        <Grid item>
          <Button
            variant={timeframe === "day" ? "contained" : "outlined"}
            onClick={() => setTimeframe("day")}
          >
            Day
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "week" ? "contained" : "outlined"}
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "month" ? "contained" : "outlined"}
            onClick={() => setTimeframe("month")}
          >
            Month
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={timeframe === "custom" ? "contained" : "outlined"}
            onClick={() => setTimeframe("custom")}
          >
            Custom
          </Button>
        </Grid>
      </Grid>
    
      <Card sx={{ margin: 2, padding: 2, backgroundColor: "#f5f5f5" }}>
        <CardContent>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Typography variant="h5" component="div">
                Total Installment Amount
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Rs. {totalInstallment.toLocaleString()}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowInstallments;
