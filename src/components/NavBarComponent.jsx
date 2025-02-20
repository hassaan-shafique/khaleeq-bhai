import {
  Box,
  Grid,
  AppBar,
  Container,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  NotificationsOutlined,
  Settings,
  Logout,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { useState ,useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../config/Firebase";
import {doc, getDoc} from "firebase/firestore"

const auth = getAuth(app);

export default function NavBarComponent() {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState(""); // State to store the user's name
  const auth = getAuth();
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);
  const handleAvatarClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationClicked = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const notificationHandleClose = () => {
    setNotificationAnchorEl(null);
  };

  const navigate = useNavigate();

useEffect(() => {
  const fetchUserName = async () => {
    try {
      const user = auth.currentUser; // Get the current logged-in user
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch Firestore document by UID
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.name) {
            setUserName(userData.name); // Set the user's name
          } else {
            console.error("Name field does not exist in Firestore document.");
          }
        } else {
          console.error("User document does not exist in Firestore.");
        }
      } else {
        console.error("No user is currently logged in.");
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
    }
  };

  fetchUserName();
}, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      console.log("Successfully logged out");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
        <AppBar
  sx={{
    padding: 2,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backgroundColor: "#616161", // Changed background color to grey
  }}
  position="static"
>
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="a"
                  href="/"
                  sx={{
                    mx: 2,
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                > 
               
                        <img
                          src='/glasses.png'
                          alt='Logo'
                         height={40}
                         width={50}
                        />
                      
                 Kbcw Shop
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={handleAvatarClicked}
                    size="small"
                    sx={{ mx: 2 }}
                    aria-haspopup="true"
                  >
                    <Tooltip title="account settings">
                      <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                    </Tooltip>
                  </IconButton>
                  {/* Display the user's name */}
                  <Typography fontFamily={"Inter"}>
                    {userName || "user"}
                  </Typography>
                </Box>

                <Menu
                  open={open}
                  anchorEl={anchorEl}
                  onClick={handleClose}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleLogout()}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}
