import React, { useEffect, useState } from "react";

const DarkModeToggle = ({ collapsed }) => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.className = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div style={{ padding: "10px", textAlign: collapsed ? "center" : "right" }}>
      <button
        onClick={() => setDark(!dark)}
        style={{
          background: dark ? "#f1f1f1" : "#333",
          color: dark ? "#333" : "#fff",
          border: "none",
          padding: collapsed ? "8px" : "8px 16px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {collapsed ? (dark ? "🌞" : "🌙") : dark ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default DarkModeToggle;
