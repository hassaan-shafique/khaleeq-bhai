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
  const [inventoryRefresh, setInventoryRefresh] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10, 
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);

      let queryRef = query(
        collection(db, "inventory"),
        orderBy("name"),
        limit(pagination.pageSize) 
      );

      if (lastVisible) {
        queryRef = query(queryRef, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(queryRef);
      const inventoryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setInventory(inventoryData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
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
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setPagination((prev) => ({
        ...prev,
        pageSize: value === "" ? "" : parseInt(value, 10),
        pageNo: 0, 
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
              value={pagination.pageSize || ""}
              onChange={handlePageSizeChange}
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
