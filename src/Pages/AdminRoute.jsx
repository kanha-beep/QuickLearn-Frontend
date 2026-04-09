import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const roles = localStorage.getItem("roles");
  const isLoggedIn = !!token && token !== "undefined" && token !== "null";
  const isAdmin = roles === "admin";

  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
