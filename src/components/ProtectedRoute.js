// src/auth/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false, modOnly = false, children }) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  if (!auth.email) return <Navigate to="/login" />;

  if (adminOnly && auth.role !== "admin") {
    return <div style={{ padding: "2rem" }}>Not authorized (admin only)</div>;
  }

  if (modOnly && auth.role !== "moderator") {
    return <div style={{ padding: "2rem" }}>Not authorized (moderator only)</div>;
  }

  return children;
};

export default ProtectedRoute;
