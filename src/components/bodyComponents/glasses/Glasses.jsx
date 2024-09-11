import React from 'react'
import { Grid, Box, Typography, Button } from "@mui/material";
import GlassesFrom from './GlassesFrom'

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
             
              <GlassesFrom/>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
    
  )
}

export default Revenue
