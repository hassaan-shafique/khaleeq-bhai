import React, { useState, useEffect } from 'react'
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
  Collapse
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

import {
  Inventory2Outlined,
  SettingsOutlined,
  DescriptionOutlined,
  MonetizationOnOutlined,
  CardTravelOutlined,
  TrendingUpOutlined
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function SideBarComponent() {
  const navigate = useNavigate()
  const navigateTo = to => {
    navigate(to)
  }

  const userRole = localStorage.getItem('userRole')
  const location = useLocation()
  const currentPage = location.pathname

  const [openReports, setOpenReports] = useState(false)

  const sideBarComponent = [
    { title: 'Inventory', component: <Inventory2Outlined fontSize='medium' /> },
    { title: 'Sales', component: <CardTravelOutlined fontSize='medium' /> },
    { title: 'Glasses', component: <MonetizationOnOutlined fontSize='medium' /> },
    { title: 'Vendors', component: <SettingsOutlined fontSize='medium' /> },
    { title: 'Daily-Activity', component: <TrendingUpOutlined fontSize='medium' /> },
    { title: 'Expense', component: <TrendingUpOutlined fontSize='medium' /> },
    {
      title: 'Reports',
      component: <DescriptionOutlined fontSize='medium' />,
      children: [
        { title: 'Cash in Hand', path: 'cash-in-hand' },
        { title: 'Sales Details', path: 'sales-details' },
        { title: 'Expense Report', path: 'expense-report' },
        { title: 'Product Details', path: 'product-details' },
        { title: 'Product Quantity', path: 'product-quantity' }
      ]
    },
    { title: 'Verification', component: <TrendingUpOutlined fontSize='medium' /> },
    { title: 'Contact', component: <TrendingUpOutlined fontSize='medium' /> }
  ]

  const [selected, setSelected] = useState(1)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery('(max-width:600px)')

  const handleSelectedComponent = (event, index) => {
    setSelected(index)
    if (isMobile) setMobileOpen(false)
  }

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const checkSelection = comp => {
    return currentPage === '/' + comp.title.toLowerCase()
  }

  const handleReportsClick = () => {
    setOpenReports(!openReports)
  }

  const reportUrls = ['/cash-in-hand', '/sales-details', '/expense-report', '/product-details', '/product-quantity']

  useEffect(() => {
    if (currentPage) {
      const check = reportUrls.includes(currentPage)
      setOpenReports(check)
    }
  }, [currentPage])

  const sidebarContent = (
    <List>
      {sideBarComponent
        .filter(comp => {
          if (userRole === 'verifyer') return comp.title === 'Verification'
          if (userRole === 'productController') return comp.title === 'Inventory' || comp.title === 'Reports'
          if (comp.title === 'Vendors' && userRole !== 'admin') return false
          return true
        })
        .map((comp, index) => (
          <Box key={index} width='100%'>
            <ListItem disablePadding dense>
              <ListItemButton
                onClick={event => {
                  if (comp.title === 'Reports') {
                    handleReportsClick()
                  } else {
                    handleSelectedComponent(event, index)
                    navigateTo(comp.title.toLowerCase())
                  }
                }}
                sx={{
                  mb: 1,
                  borderRadius: '8px',
                  backgroundColor: checkSelection(comp) ? '#1E3A8A' : 'transparent',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1E40AF'
                  }
                }}
              >
                <ListItemIcon>
                  <IconButton sx={{ color: 'white' }}>{comp.component}</IconButton>
                </ListItemIcon>

                {!isMobile && sidebarOpen && (
                  <ListItemText
                    primary={comp.title}
                    primaryTypographyProps={{
                      fontSize: 'large',
                      fontWeight: selected === index ? 'bold' : '',
                      color: 'white'
                    }}
                  />
                )}

                {comp.children && sidebarOpen && (openReports ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {comp.children && (
              <Collapse in={openReports} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {comp.children.map((child, childIndex) => (
                    <ListItemButton
                      key={childIndex}
                      sx={{
                        pl: 4,
                        ml: 8,
                        borderRadius: '8px',
                        backgroundColor: currentPage === '/' + child.path ? '#1E3A8A' : 'transparent',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#1E40AF'
                        }
                      }}
                      onClick={() => navigateTo(child.path)}
                    >
                      <ListItemText
                        primary={child.title}
                        primaryTypographyProps={{ fontSize: 'medium', color: 'white' }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
    </List>
  )

  return (
    <Box
      sx={{
        width: sidebarOpen ? '300px' : '100px',
        transition: 'width 0.3s ease',
        backgroundColor: '#3884e7',
        color: 'white',
        height: '100vh',
        padding: 2,
        paddingTop: 20,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Sidebar Toggle Button */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          {sidebarOpen ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
        </IconButton>
      </Box> */}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src='/glasses.png'
          alt='Logo'
          style={{
            width: sidebarOpen ? '100px' : '50px',
            height: sidebarOpen ? '100px' : '50px',
            transition: 'width 0.3s ease'
          }}
        />
      </Box>

      {/* Sidebar Content */}
      {sidebarContent}
    </Box>
  )
}
