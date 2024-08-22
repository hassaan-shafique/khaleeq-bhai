import React from 'react'
import { Grid, Box, Typography, Button } from "@mui/material";

const Revenue = () => {
  return (
    <>
       <Box>
        <Grid container sx={{ mx: 3, p: 3 }}>
          <Grid item md={9}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "white",
                borderRadius: 2,
                padding: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  m: 3,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
              Glasses
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#504099", m: 3, px: 12 }}
                >
                  Add 
                  
                </Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
    
  )
}

export default Revenue
