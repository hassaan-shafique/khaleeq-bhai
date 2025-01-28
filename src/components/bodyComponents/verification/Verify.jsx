import React, { useState, useEffect } from "react";
import VerifyList from "./VerifyList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../config/Firebase";

const Verify = () => {
  const [inventory, setInventory] = useState([]); 
  const [loading, setLoading] = useState(true); // Loading state

  const fetchInventory = async () => {
    try {
      setLoading(true); // Start loading
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(items); 
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return <VerifyList inventory={inventory} loading={loading} />;
};

export default Verify;
