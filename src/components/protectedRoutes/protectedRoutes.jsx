import React from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return children;
};

export default ProtectedRoute;
