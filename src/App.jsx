import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme, Box } from "@mui/material";
import RootComponent from "./components/RootComponent";

import DataTable from "./test/DataTable";
import Hello from "./test/Hello";
// import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Inventory from "./components/bodyComponents/inventory/Inventory";
// import Customer from "./components/bodyComponents/customer/Customer";
import Glasses from "./components/bodyComponents/glasses/Glasses";
import Expense from "./components/bodyComponents/expense/Expense";
import Report from "./components/bodyComponents/report/Report";
import reportExpense from "./components/bodyComponents/report/reportExpense";
import Vendors from "./components/bodyComponents/Vendors/Vendors";
import Sales from "./components/bodyComponents/sale/Sales";
import OrderModal from "./components/bodyComponents/sale/OrderModal";
import Login from './components/Login'
import Signup from "./components/Signup";

import { app } from "./config/Firebase";
import { getAuth } from "firebase/auth";



function App() {

  const auth = getAuth(app);
  const authToken  = localStorage.getItem("authToken") ?? "";
  console.log({authToken});
 

  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "light",
    },

    typography: {
      fontFamily: "Inter",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Raleway'), local('Raleway-Regular'), url(${Inter}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
  });
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/glasses" element={<Glasses />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/reports/expense" element= { <reportExpense/>} />
        <Route path="/vendors" element={<Vendors />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
