
import { Grid, Box, Typography, Button } from "@mui/material";
import React, { Component } from "react";

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
              <Typography
                variant="h5"
                sx={{
                  m: 3,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
               Sales
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#504099", m: 3, px: 12 }}
                >
                  Add Sale
                </Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
