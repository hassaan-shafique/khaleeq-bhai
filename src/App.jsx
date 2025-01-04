import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline, createTheme, CircularProgress, Box } from '@mui/material'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Inter from '../public/static/fonts/Inter.ttf'

// Component Imports
import RootComponent from './components/RootComponent'
import Login from './components/Login'
import Signup from './components/Signup'
import Inventory from './components/bodyComponents/inventory/Inventory'
import Glasses from './components/bodyComponents/glasses/Glasses'
import Expense from './components/bodyComponents/expense/Expense'
import Report from './components/bodyComponents/report/Report'
import reportExpense from './components/bodyComponents/report/reportExpense'
import Vendors from './components/bodyComponents/Vendors/Vendors'
import Activity from './components/bodyComponents/activity/Activity'
import Sales from './components/bodyComponents/sale/Sales'
import ViewProducts from './components/bodyComponents/sale/Products/ViewProducts'
import { app } from './config/Firebase'
import { db } from './config/Firebase'
import { collection, getDocs, doc } from 'firebase/firestore'

// Custom Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to='/login' replace />
}

function App() {
  const auth = getAuth(app)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('') // Role state to manage user role
  const [expenses, setExpenses] = useState([])
  const [refresh, setRefresh] = useState(false)
  const userRole = localStorage.getItem('userRole')

  const fetchExpenses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'expenses'))
      const expenseData = []
      querySnapshot.forEach(doc => {
        expenseData.push({ id: doc.id, ...doc.data() })
      })
      setExpenses(expenseData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching expenses: ', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [refresh])

  // Check authentication state and user role on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setIsAuthenticated(!!user)
      setLoading(false)

      if (user) {
        localStorage.setItem('authToken', user.accessToken)
      } else {
        localStorage.removeItem('authToken')
        setRole('') // Clear role when logged out
      }
    })

    return () => unsubscribe() // Cleanup subscription
  }, [auth])

  // Theme configuration
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' }
    },
    typography: {
      fontFamily: 'Inter, Arial, sans-serif'
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            src: url(${Inter}) format('truetype');
          }
        `
      }
    }
  })

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={isAuthenticated ? <Navigate to='/sales' replace /> : <Navigate to='/login' replace />}
          />

          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RootComponent />
              </ProtectedRoute>
            }
          >
            <Route path='inventory' element={<Inventory />} />
            <Route path='sales' element={<Sales />} />
            <Route path='sales/:id/products' element={<ViewProducts />} />
            <Route path='glasses' element={<Glasses />} />
            <Route path='daily-activity' element={<Activity />} />
            <Route path='expense' element={<Expense expenses={expenses} loading={loading} setRefresh={setRefresh} />} />
            <Route path='reports' element={<Report />} />
            <Route path='vendors' element={<Vendors />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
