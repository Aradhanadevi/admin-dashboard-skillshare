import { useAuth, AuthProvider } from "./context/AuthContext";
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
  FaCheck,
  FaExclamationTriangle,
  FaFlag,
} from "react-icons/fa";
import CourseApproval from "./components/moderator/CourseApproval";
import TutorApproval from "./components/moderator/TutorApproval";
import FlaggedUsers from "./components/moderator/FlaggedUsers";
import ReportedContent from "./components/moderator/ReportedContent";
import Sidebar from "./components/Sidebar";
import CoursesTable from "./components/CoursesTable";
import UsersTable from "./components/UsersTable";
import AddUserForm from "./components/AddUserForm";
import RegisteredCoursesTable from "./components/RegisteredCoursesTable";
import DarkModeToggle from "./components/DarkModeToggle";
import DashboardOverview from "./components/DashboardOverview";
import AddCourse from "./components/AddCourse";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ModeratorDashboard from "./components/ModeratorDashboard";

import "./App.css";
import AddQuiz from "./components/AddQuiz";

const AppLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Get role from AuthContext or from localStorage if page reloads
  //RemoveLocalStorage.getItem("auth") in production
  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const role = user?.role || storedAuth?.role || "user";

  const isAdmin = role === "admin";
  const isModerator = role === "moderator";

  const adminNavItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    { id: "courses", label: "Courses", icon: <FaBook />, path: "/courses" },
    { id: "users", label: "Users", icon: <FaUser />, path: "/users" },
    { id: "addquiz", label: "Add Quiz", icon: <FaPlus />, path: "/addquiz" },
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
    { id: "adduser", label: "Add User", icon: <FaPlus />, path: "/users/add" },
  ];

  const moderatorNavItems = [
    {
      id: "moderator-dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/moderator",
    },
    {
      id: "review-courses",
      label: "Review Courses",
      icon: <FaCheck />,
      path: "/moderator/courses",
    },
    {
      id: "tutor-approval",
      label: "Tutor Approval",
      icon: <FaUser />,
      path: "/moderator/tutor-approval",
    },
    // {
    //   id: "flagged-users",
    //   label: "Flagged Users",
    //   icon: <FaFlag />,
    //   path: "/moderator/flagged-users",
    // },
    {
      id: "reported-content",
      label: "Reported Content",
      icon: <FaExclamationTriangle />,
      path: "/moderator/reported-content",
    },
  ];

  // Decide sidebar items
  const navItems = isAdmin
    ? adminNavItems
    : isModerator
    ? moderatorNavItems
    : [];

  return (
    <div className={`dashboard ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        navItems={navItems}
        role={user?.role}
      />
      {/* Main Content */}
      <main className="main-content">
        <Routes>
          {/* Admin Routes */}
          <>
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
              path="/addquiz"
              element={
                <section className="section section-card">
                  <AddQuiz />
                </section>
              }
            />

            <Route
              path="/users/add"
              element={
                <section className="section section-card">
                  <AddUserForm />
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
          </>

          {/* Moderator Routes */}
          <>
            <Route
              path="/moderator"
              element={
                <section className="section section-card">
                  <ModeratorDashboard />
                </section>
              }
            />
            <Route
              path="/moderator/courses"
              element={
                <section className="section section-card">
                  <CourseApproval />
                </section>
              }
            />
            <Route
              path="/moderator/tutor-approval"
              element={
                <section className="section section-card">
                  <TutorApproval />
                </section>
              }
            />
            <Route
              path="/moderator/flagged-users"
              element={
                <section className="section section-card">
                  <FlaggedUsers />
                </section>
              }
            />
            <Route
              path="/moderator/reported-content"
              element={
                <section className="section section-card">
                  <ReportedContent />
                </section>
              }
            />
          </>

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={isAdmin ? "/dashboard" : "/moderator"} />}
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              localStorage.getItem("auth") ? (
                <Navigate
                  to={
                    JSON.parse(localStorage.getItem("auth"))?.role === "admin"
                      ? "/dashboard"
                      : "/moderator"
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
