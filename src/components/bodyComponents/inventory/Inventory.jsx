import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
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
  where,
} from "firebase/firestore";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventoryRefresh, setInventoryRefresh] = useState(false);
  const [refresh, setRefresh] = useState(false)
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 3000,
  });
  const [lastVisible, setLastVisible] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      let queryRef = query(collection(db, "inventory"));

      

      // Apply pagination
      queryRef = query(queryRef, orderBy("name"), limit(pagination.pageSize));

      if (lastVisible) {
        queryRef = query(queryRef, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(queryRef);

      const inventoryData = [];
      querySnapshot.forEach((doc) => {
        inventoryData.push({ id: doc.id, ...doc.data() });
      });

      setInventory(inventoryData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Inventory: ", error);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchInventory();
  }, [ pagination]);
 
  
  

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
            <InventoryForm
              setRefresh={setInventoryRefresh}
              
            />
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inventory;
