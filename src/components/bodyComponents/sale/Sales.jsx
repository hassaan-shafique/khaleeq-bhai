
import { Grid, Box, Typography, Button } from "@mui/material";
import React, { Component } from "react";
import SaleForm from './SaleForm'

export default class Inventory extends Component {
  render() {
    return (
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
              
          
             <SaleForm/>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

