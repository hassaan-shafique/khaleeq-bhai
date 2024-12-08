import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/Firebase";
import { getDoc, doc } from "firebase/firestore"; // To fetch role from Firestore
import { db } from "../config/Firebase";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Logo from "../../public/khurshid-Bhai-logo-png.png"; // Ensure this path is correct

const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Successfully logged in:", userCredential.user);

      // Get user role from Firestore
      const userId = userCredential.user.uid; // Logged-in user's UID
      const userDocRef = doc(db, "users", userId); // Reference to Firestore document
      const userDoc = await getDoc(userDocRef); // Fetch document

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role; // Assuming 'role' is stored in Firestore

        console.log("User role:", userRole);

        // Store user role in localStorage or context for use in the app
        localStorage.setItem("userRole", userRole);

        // Navigate to the common dashboard or home page
        navigate("/sales");
      } else {
        setError("User role not found. Please contact the administrator.");
        console.error("No user document found in Firestore.");
      }

      // Clear input fields
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Incorrect Email or Password");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isSmallScreen ? 2 : 3,
          boxShadow: 3,
          borderRadius: 2,
          width: "100%",
        }}
      >
        <Avatar
          sx={{
            m: isSmallScreen ? 2 : 4,
            bgcolor: "primary.main",
            width: isSmallScreen ? 250 : 370,
            height: isSmallScreen ? 150 : 240,
            boxShadow: 3,
            borderRadius: "20px",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Avatar>

        <Typography
          component="h1"
          variant="h5"
          sx={{ mt: isSmallScreen ? 1 : 2 }}
        >
          Welcome Back, Login Here
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%", marginTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography
                  color="error"
                  sx={{ marginBottom: 2, textAlign: "center" }}
                >
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginTop: 2,
              padding: isSmallScreen ? 1 : 2,
            }}
          >
            Login
          </Button>
        </form>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
