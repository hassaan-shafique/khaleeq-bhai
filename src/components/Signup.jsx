import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/Firebase";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import Logo from "../../public/khurshid-Bhai-logo-png.png"; // Ensure this path is correct
import { setDoc ,doc} from "firebase/firestore";
import { db } from "../config/Firebase";

const auth = getAuth(app);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [role, setRole] =useState("");
  const navigate = useNavigate();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    console.log("Selected Role:", event.target.value);
  };

  const signupUser = async (e) => {
    e.preventDefault();

     if (!email.endsWith("@kbcwoptics.com")) {
       alert("Only @kbcwoptics.com emails are allowed.");
       return;
     }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
       
        email,
        password
      );
      const user =userCredential.user;
      await setDoc(doc(db,"users" ,user.uid),{
        name,
        email,
        role,
      })
      console.log("User signed up successfully:", userCredential.user);
      setMessage("Registered Successfully!");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage("Error signing up: " + error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 90, height: 90 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registration
        </Typography>
        <form onSubmit={signupUser} style={{ width: "100%", marginTop: 2 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {message && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {message}
            </Typography>
          )}

          <FormControl sx={{ width: "40%", mt: 1 , ml: 60 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={role}
              name="role"
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="verifyer">Verifyer</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Signup
          </Button>
        </form>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link sx={{ color: "black" }} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
