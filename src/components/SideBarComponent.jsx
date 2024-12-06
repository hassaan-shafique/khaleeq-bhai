import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Drawer,
  Box,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  MonetizationOnOutlined,
  CardTravelOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBarComponent() {
  const navigate = useNavigate();
  const navigateTo = (to) => {
    navigate(to);
  };

  const userRole =localStorage.getItem("userRole")
  const location = useLocation();
  const currentPage = location.pathname;

  const sideBarComponent = [
    {
      title: "Inventory",
      component: <Inventory2Outlined fontSize="medium" color="primary" />,
    },
    {
      title: "Sales",
      component: <CardTravelOutlined fontSize="medium" color="primary" />,
    },
    {
      title: "Glasses",
      component: <MonetizationOnOutlined fontSize="medium" color="primary" />,
    },
 

    {
      title: "Vendors",
      component: <SettingsOutlined fontSize="medium" color="primary" />,
    },

    {
      title: "Daily-Activity",
      component: <TrendingUpOutlined fontSize="medium" color="primary" />,
    },
    {
      title: "Expense",
      component: <TrendingUpOutlined fontSize="medium" color="primary" />,
    },
    {
      title: "Reports",
      component: <DescriptionOutlined fontSize="medium" color="primary" />,
    },
  ];

  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // For desktop sidebar toggle
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSelectedComponent = (event, index) => {
    setSelected(index);
    if (isMobile) setMobileOpen(false); // Close drawer on mobile after selection
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

 // Get role from localStorage

const sidebarContent = (
  <List>
    {sideBarComponent.map((comp, index) => (
      <ListItem disablePadding dense key={index}>
        <Box width="100%">
          {/* Check if the component is 'Vendors' and if the user is not an admin */}
          {comp.title === "Vendors" ? (
            userRole === "admin" && (
              <ListItemButton
                onClick={(event) => {
                  handleSelectedComponent(event, index);
                  navigateTo(comp.title.toLocaleLowerCase());
                }}
                selected={
                  index === selected &&
                  currentPage === "/" + comp.title.toLowerCase()
                }
                sx={{
                  mb: 3,
                  borderLeft: 0,
                  borderColor: "primary.main",
                  backgroundColor:
                    index === selected ? "darkblue" : "transparent", // Highlight selected item
                }}
              >
                <ListItemIcon>
                  <IconButton>{comp.component}</IconButton>
                </ListItemIcon>

                {!isMobile && sidebarOpen && (
                  <ListItemText
                    primary={comp.title}
                    primaryTypographyProps={{
                      fontSize: "large",
                      fontWeight: selected === index ? "bold" : "",
                      color: "white", // Make text white for all items
                    }}
                  />
                )}
              </ListItemButton>
            )
          ) : (
            <ListItemButton
              onClick={(event) => {
                handleSelectedComponent(event, index);
                navigateTo(comp.title.toLocaleLowerCase());
              }}
              selected={
                index === selected &&
                currentPage === "/" + comp.title.toLowerCase()
              }
              sx={{
                mb: 3,
                borderLeft: 0,
                borderColor: "primary.main",
                backgroundColor:
                  index === selected ? "darkblue" : "transparent", // Highlight selected item
              }}
            >
              <ListItemIcon>
                <IconButton>{comp.component}</IconButton>
              </ListItemIcon>

              {!isMobile && sidebarOpen && (
                <ListItemText
                  primary={comp.title}
                  primaryTypographyProps={{
                    fontSize: "large",
                    fontWeight: selected === index ? "bold" : "",
                    color: "white", // Make text white for all items
                  }}
                />
              )}
            </ListItemButton>
          )}
        </Box>
      </ListItem>
    ))}
  </List>
);

  

  return (
    <>
  

      {/* Mobile toggle button */}
      {isMobile && (
        <IconButton
          sx={{
            position: "fixed",
            top: 70,
            left: 9,
            zIndex: 11000,
            backgroundColor: "white",
            boxShadow: 3,
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "230px",
            backgroundColor: "#3884e7",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed", // Fixed position on the left
            top: "60px", // Adjust this value to position the sidebar below the navbar
            left: 0,
            width: sidebarOpen ? "230px" : "60px", // Toggle width
            height: "calc(100vh - 60px)", // Full height minus the height of the navbar
            backgroundColor: "#3884e7", // Sidebar background color
            padding: 1,
            zIndex: 10000,
            borderTopRightRadius: "10px", // Top left corner
            borderBottomRightRadius: "10px", // Bottom right corner
            transition: "width 0.3s ease", // Smooth transition
          }}
        >
          {/* Toggle arrow button */}
          <IconButton
            sx={{
              position: "absolute",
              top: "50%",
              right: "-20px",
              transform: "translateY(-50%)",
              backgroundColor: "white",
              boxShadow: 3,
              zIndex: 11000,
            }}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
          </IconButton>

          {sidebarContent}
        </Box>
      )}
    </>
  );
}
