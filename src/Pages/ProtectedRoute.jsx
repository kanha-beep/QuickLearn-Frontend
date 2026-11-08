import React from "react";
import { Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loading } from "../Components/Loading.jsx";

export default function ProtectedRoute({
  children,
  isAuthenticated,
  isCheckingAuth,
  loadingFallback,
}) {
  if (isCheckingAuth) {
    return loadingFallback || <Loading loading />;
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
}
