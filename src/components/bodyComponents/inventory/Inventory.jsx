import React, { useState, useEffect } from "react";
import { Grid, Box, TextField, Button } from "@mui/material";
import InventoryList from "./InventoryList";
import InventoryForm from "./InventoryForm";
import { db } from "../../../config/Firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [previousPages, setPreviousPages] = useState([]);
  const [inventoryRefresh, setInventoryRefresh] = useState(false);

  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 3000,
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);

      let queryRef = query(
        collection(db, "inventory"),
        orderBy("name"), 
        limit(pagination.pageSize)
      );

      if (pagination.pageNo > 0 && lastVisible) {
        queryRef = query(queryRef, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(queryRef);
      const inventoryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInventory(inventoryData);

      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setFirstVisible(querySnapshot.docs[0]);

        if (pagination.pageNo === 0) {
          setPreviousPages([]);
        } else {
          setPreviousPages((prev) => [...prev, querySnapshot.docs[0]]);
        }
      }
    } catch (error) {
      console.error("Error fetching Inventory: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [pagination]);

  const handlePageSizeChange = (e) => {
    const value = e.target.value;
  
    // Allow empty input and only numbers
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setPagination((prev) => ({
        ...prev,
        pageSize: value, // Temporarily store as a string
      }));
    }
  };
  
  const handlePageSizeBlur = () => {
    const parsedValue = parseInt(pagination.pageSize, 10);
  
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setPagination({ pageNo: 0, pageSize: parsedValue });
      setLastVisible(null);
    } else {
      setPagination((prev) => ({
        ...prev,
        pageSize: 10, // Default value if invalid input
      }));
    }
  };
  

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageNo: prev.pageNo + 1,
    }));
  };

  const handlePreviousPage = () => {
    if (pagination.pageNo > 0) {
      setPagination((prev) => ({
        ...prev,
        pageNo: prev.pageNo - 1,
      }));
      setLastVisible(previousPages[pagination.pageNo - 1] || null);
    }
  };

  return (
    <Box sx={{ width: "98%", marginTop: 6 }}>
      <Grid container sx={{ mx: 3, p: 3, width: "100%" }}>
        <Grid item md={12} sx={{ width: "98%" }}>
          <Box
            sx={{
              margin: 3,
              width: "98%",
              bgcolor: "white",
              borderRadius: 2,
              padding: 3,
              height: "100%",
            }}
          >
            <InventoryForm setRefresh={setInventoryRefresh} />

            
            <TextField
  type="number"
  label="Rows per page"
  variant="outlined"
  value={pagination.pageSize}
  onChange={handlePageSizeChange}
  onBlur={handlePageSizeBlur} 
  sx={{ mb: 2, width: 150 }}
/>


            {/* Inventory List */}
            <InventoryList
              inventory={inventory}
              setInventoryRefresh={setInventoryRefresh}
              loading={loading}
              pagination={pagination}
              setPagination={setPagination}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              fetchInventory={fetchInventory}
            />

            {/* Pagination Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                onClick={handlePreviousPage}
                disabled={pagination.pageNo === 0 || loading}
              >
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={loading}>
                Next
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;
