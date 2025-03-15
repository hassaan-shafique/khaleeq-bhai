import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  collection,
  getDocs,

} from "firebase/firestore";
import { db } from "../../../config/Firebase";
import ActivityForm from "./ActivityForm"; 
import ActivityList from "./ActivityList"; 

const Activity = () => {
  const [refresh, setRefresh] = useState(false);
  const [activities, setActivities] = useState([]);
  
  const fetchActivities = async () => {
    try {
      const dailyActivityCollectionRef = collection(db, "daily-activity");
      const querySnapshot = await getDocs(dailyActivityCollectionRef);
      const activitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(), 
      }));
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };


 
  useEffect(() => {
    fetchActivities();
  }, [refresh]);
 

  return (
    <Box sx={{ marginTop: 6, padding: 2 }}>
    
      <Box sx={{ marginBottom: 2 }}>
       
        <ActivityForm setRefresh={setRefresh} />
      </Box>
      <Box>
        <ActivityList refresh={refresh} activities={activities} />
      </Box>
    </Box>
  );
};

export default Activity;
