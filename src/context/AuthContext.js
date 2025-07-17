import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("auth") || "{}");
    if (stored.email) {
      setUser({ email: stored.email });
      setAdmin(stored.role === "admin");
    } else {
      setUser(null);
      setAdmin(false);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
