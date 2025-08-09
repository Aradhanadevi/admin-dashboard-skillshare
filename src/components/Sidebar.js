// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed, navItems = [], role }) => {
  return (
    <aside className="sidebar">
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "➤" : "◀"}
      </button>

      {!collapsed && (
        <h2 className="logo">
          SkillShare {role === "admin" ? "Admin" : role === "moderator" ? "Moderator" : ""}
        </h2>
      )}

      <nav>
        <ul>
          {(navItems || []).map(({ id, label, icon, path }) => (
            <li key={id}>
              <NavLink
                to={path}
                title={label}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {icon}
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="dark-mode-wrapper">
        <DarkModeToggle collapsed={collapsed} />
      </div>
    </aside>
  );
};

export default Sidebar;
