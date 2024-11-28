import React, { useState } from "react";
import { Box } from "@mui/material";
import ActivityForm from "./ActivityForm"; // Adjust path as necessary
import ActivityList from "./ActivityList"; // Adjust path as necessary

const Activity = () => {
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
 

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
