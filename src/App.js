// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";
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
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ModeratorDashboard from "./components/ModeratorDashboard";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

const navItems = [
  {
    id: "overview",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    path: "/dashboard",
  },
  { id: "courses", label: "Courses", icon: <FaBook />, path: "/courses" },
  { id: "users", label: "Users", icon: <FaUser />, path: "/users" },
  {
    id: "registered",
    label: "Registered",
    icon: <FaClipboardList />,
    path: "/registered",
  },
  {
    id: "addcourse",
    label: "Add Course",
    icon: <FaPlus />,
    path: "/addcourse",
  },
];

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Admin Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute adminOnly={true}>
                <div className={`dashboard ${collapsed ? "collapsed" : ""}`}>
                  {/* Sidebar */}
                  <aside className="sidebar">
                    <button
                      className="collapse-btn"
                      onClick={() => setCollapsed(!collapsed)}
                    >
                      {collapsed ? "➤" : "◀"}
                    </button>

                    {!collapsed && <h2 className="logo">SkillShare Admin</h2>}

                    <nav>
                      <ul>
                        {navItems.map(({ id, label, icon, path }) => (
                          <li key={id}>
                            <NavLink
                              to={path}
                              title={label}
                              className={({ isActive }) =>
                                isActive ? "active" : ""
                              }
                            >
                              {icon}
                              {!collapsed && <span>{label}</span>}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="dark-mode-wrapper">
                      <DarkModeToggle />
                    </div>
                  </aside>

                  {/* Main Content */}
                  <main className="main-content">
                    <Routes>
                      <Route
                        path="/dashboard"
                        element={
                          <section className="section section-card full-width-graph">
                            <DashboardOverview />
                          </section>
                        }
                      />
                      <Route
                        path="/courses"
                        element={
                          <section className="section section-card">
                            <CoursesTable />
                          </section>
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <section className="section section-card">
                            <UsersTable />
                          </section>
                        }
                      />
                      <Route
                        path="/registered"
                        element={
                          <section className="section section-card">
                            <RegisteredCoursesTable />
                          </section>
                        }
                      />
                      <Route
                        path="/addcourse"
                        element={
                          <section className="section section-card">
                            <AddCourse />
                          </section>
                        }
                      />
                      {/* Fallback Route */}
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                      <Route
                        path="/moderator"
                        element={
                          <section className="section section-card">
                            <ModeratorDashboard />
                          </section>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
