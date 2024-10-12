import { Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpenseFrom from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import { db } from "../../../config/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

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
      <Box sx={{ width: "100%" }}>
        {" "}
        {/* Set Box to full width */}
        <Grid container sx={{ mx: 4, p: 3, width: "100%" }}>
          {" "}
          {/* Set Grid to full width */}
          <Grid item xs={12}>
            {" "}
            {/* Full width for all screen sizes */}
            <Box
              sx={{
                margin: 3,
                bgcolor: "#FAF9F6",
                borderRadius: 2,
                padding: 3,
                width: "100%", // Ensure full width of Box
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
