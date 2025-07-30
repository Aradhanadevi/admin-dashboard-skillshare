import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRouteModerator = ({ children }) => {
  const { user, moderator, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || !moderator) return <Navigate to="/" />;

  return children;
};

export default ProtectedRouteModerator;
