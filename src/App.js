import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBook,
  FaUser,
  FaClipboardList,
  FaPlus,
} from "react-icons/fa";

import CoursesTable from "./components/CoursesTable";
import UsersTable from "./components/UsersTable";
import RegisteredCoursesTable from "./components/RegisteredCoursesTable";
import DarkModeToggle from "./components/DarkModeToggle";
import DashboardOverview from "./components/DashboardOverview";
import AddCourse from "./components/AddCourse";

import "./App.css";

const navItems = [
  { id: "overview", label: "Dashboard", icon: <FaTachometerAlt /> },
  { id: "courses", label: "Courses", icon: <FaBook /> },
  { id: "users", label: "Users", icon: <FaUser /> },
  { id: "registered", label: "Registered", icon: <FaClipboardList /> },
  { id: "addcourse", label: "Add Course", icon: <FaPlus /> },
];

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Sidebar Navigation">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? "➤" : "◀"}
        </button>

        {!collapsed && <h2 className="logo">SkillShare Admin</h2>}

        <nav>
          <ul>
            {navItems.map(({ id, label, icon }) => (
              <li key={id}>
                <a href={`#${id}`} title={label}>
                  {icon}
                  {!collapsed && <span>{label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <DarkModeToggle />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>SkillShare Admin Dashboard</h1>
        </header>

        {/* Two-Column Layout */}
        <div className="grid-layout">
          <div className="grid-column">
            <section id="addcourse" className="section section-card">
              <h2>Add New Course</h2>
              <AddCourse />
            </section>

            <section id="courses" className="section section-card">
              <h2>Courses</h2>
              <CoursesTable />
            </section>
          </div>

          <div className="grid-column">
            <section id="users" className="section section-card">
              <h2>Users</h2>
              <UsersTable />
            </section>

            <section id="registered" className="section section-card">
              <h2>Registered Courses</h2>
              <RegisteredCoursesTable />
            </section>
          </div>
        </div>

        {/* Full-width Graphs at the Bottom */}
        <section id="overview" className="section section-card full-width-graph">
          <h2>Analytics & Insights</h2>
          <DashboardOverview />
        </section>
      </main>
    </div>
  );
}

export default App;
