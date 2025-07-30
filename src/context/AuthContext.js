import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [moderator, setModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.email) {
      setUser({ email: stored.email });
      setAdmin(stored.role === "admin");
      setModerator(stored.role === "moderator");
    }
    setLoading(false);
  }, []);

  const login = (email, role) => {
    localStorage.setItem("user", JSON.stringify({ email, role }));
    setUser({ email });
    setAdmin(role === "admin");
    setModerator(role === "moderator");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAdmin(false);
    setModerator(false);
  };

  return (
    <AuthContext.Provider value={{ user, admin, moderator, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
