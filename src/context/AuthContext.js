// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role }

  const login = (email) => {
    const formattedEmail = email.replace(/\./g, "_").replace(/@/g, "_");
    const db = getDatabase();
    const userRef = ref(db, `users/${formattedEmail}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUser({ email, role: userData.role });
        localStorage.setItem("user", JSON.stringify({ email, role: userData.role }));
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

//cut start
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  try {
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  } catch (err) {
    console.error("Failed to parse stored user:", err);
    localStorage.removeItem("user"); // cleanup bad value
  }
}, []);
//cut finish
  //aradhanas code
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
