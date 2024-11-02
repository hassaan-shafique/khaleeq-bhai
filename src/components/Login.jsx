import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/Firebase";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import Logo from "../../public/khurshid-Bhai-logo-png.png"; // Ensure this path is correct

const auth = getAuth(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Successfully logged in:", userCredential.user);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);
      setEmail("");
      setPassword("");
      navigate("/inventory");
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
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Avatar
          sx={{
            m: 4,
            bgcolor: "primary.main",
            width: 370,
            height: 240,
            boxShadow: 3, 
            borderRadius: "44px", 
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Avatar>

        <Typography component="h1" variant="h5">
          Welcome Back, Login Here
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%", marginTop: 2 }}>
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
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account?
            <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
