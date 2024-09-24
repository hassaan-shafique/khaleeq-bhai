import { Grid, Box, Typography, Button,TextField } from "@mui/material";
import React, { useEffect } from "react";
import ExpenseFrom from "./ExpenseForm"
import { useState } from "react";
import ExpenseList from "./expenseList";
import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Expense = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "expenses"));
        const expenseData = [];
        querySnapshot.forEach((doc) => {
          expenseData.push({ id: doc.id, ...doc.data() });
        });
        setExpenses(expenseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses: ", error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [refresh]);

  return (
    <>
      <Box>
        <Grid container sx={{ mx: 4, p: 3 }}>
          <Grid item md={9}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "#FAF9F6",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
              <ExpenseFrom setRefresh={setRefresh} />
              <ExpenseList expenses={expenses} loading={loading} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Expense;
