import React from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "../Components/Loading.jsx";

export default function ProtectedRoute({ children, isAuthenticated, isCheckingAuth }) {
  if (isCheckingAuth) {
    return <Loading loading />;
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}
