import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // ✅ Option 1: Check if user is authenticated from Redux store
  const user = useSelector((store) => store.user);
  const isAuthenticated = user && Object.keys(user).length > 0;

  // ✅ Option 2: Fallback to token check if Redux store is empty
  const token = localStorage.getItem("token");

  // ❌ If neither user nor token exists, redirect to login
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → Allow access to protected route
  return children;
};

export default ProtectedRoute;
