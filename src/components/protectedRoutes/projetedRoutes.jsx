import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>; // Render a loading state
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect unauthenticated users
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // Redirect unauthorized users
  }

  return children;
};

export default ProtectedRoute;
