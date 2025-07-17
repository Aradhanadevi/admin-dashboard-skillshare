import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false, children }) => {
  const authData = JSON.parse(localStorage.getItem("auth") || "{}");

  if (!authData.email) {
    return <Navigate to="/login" />;
  }

  // TEMP: Disable role-based check
  // if (adminOnly && authData.role !== "admin") {
  //   return <div style={{ padding: "2rem" }}>Not Authorized</div>;
  // }

  return children;
};



export default ProtectedRoute;
