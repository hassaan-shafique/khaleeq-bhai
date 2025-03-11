import React, { useState } from "react";
import { Box } from "@mui/material";
import ActivityForm from "./ActivityForm"; 
import ActivityList from "./ActivityList"; 

const Activity = () => {
  const [refresh, setRefresh] = useState(false); 
 

  return (
    <Box sx={{ marginTop: 6, padding: 2 }}>
    
      <Box sx={{ marginBottom: 2 }}>
       
        <ActivityForm setRefresh={setRefresh} />
      </Box>
      <Box>
        <ActivityList refresh={refresh} />
      </Box>
    </Box>
  );
};

export default Activity;
