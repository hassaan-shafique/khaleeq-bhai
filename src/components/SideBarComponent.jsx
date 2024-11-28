import React, { useState } from "react";
import "../../public/styles/links.css";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
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

  const handlSelectedComponent = (event, index) => {
    setSelected(index);
  };

  return (
    <Box
      sx={{
        position: "fixed", // Fixed position on the left
        top: "60px", // Adjust this value to position the sidebar below the navbar
        left: 0,
        width: "230px", // Sidebar width
        height: "calc(100vh - 60px)", // Full height minus the height of the navbar
        backgroundColor: "#3884e7 ", // Sidebar background color
        padding: 1,
        zIndex: 10000,
        borderTopRightRadius: "10px", // Top left corner
        borderBottomRightRadius: "10px", // Bottom right corner// Make sure the sidebar stays on top of content
      }}
    >
      <List>
        {sideBarComponent.map((comp, index) => (
          <ListItem disablePadding dense key={index}>
            <Box width="100%">
              <ListItemButton
                onClick={(event) => {
                  handlSelectedComponent(event, index);
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

                <ListItemText
                  primary={comp.title}
                  primaryTypographyProps={{
                    fontSize: "large",
                    fontWeight: selected === index ? "bold" : "",
                    color: "white", // Make text white for all items
                  }}
                />
              </ListItemButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
