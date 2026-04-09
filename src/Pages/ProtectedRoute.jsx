import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, setUserRoles }) {
  const token = localStorage.getItem("token");
  const hasValidToken = !!token && token !== "undefined" && token !== "null";
  if (!hasValidToken) return <Navigate to="/auth" replace />;

  return children;
}
