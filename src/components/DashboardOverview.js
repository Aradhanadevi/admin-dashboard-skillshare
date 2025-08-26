import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  TimeScale,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Radar, Pie, Doughnut } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { getDatabase, ref, onValue } from "firebase/database";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  Title,
  RadialLinearScale,
  Filler,
);

const DashboardPage = () => {
  const [totals, setTotals] = useState({ courses: 0, users: 0, registeredCourses: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skillOfferedCounts, setSkillOfferedCounts] = useState({});
  const [skillRequestedCounts, setSkillRequestedCounts] = useState({});
  const [courseCategoryCounts, setCourseCategoryCounts] = useState({});
  const [registeredCoursesCounts, setRegisteredCoursesCounts] = useState({});
  const [locationCounts, setLocationCounts] = useState({});
  const [selectedChart, setSelectedChart] = useState("overview");

  // // MODERATOR TILE STATES
  // const [courseApprovalCount, setCourseApprovalCount] = useState(0);
  // const [tutorRequestsCount, setTutorRequestsCount] = useState(0);
  // const [flaggedCoursesCount, setFlaggedCoursesCount] = useState(0);
  // const [reportedUsersCount, setReportedUsersCount] = useState(0);
  // const [systemMessagesCount, setSystemMessagesCount] = useState(0);

  const db = getDatabase();

  useEffect(() => {
    // Course-related data
    const coursesRef = ref(db, "courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const coursesArray = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      setCourses(coursesArray);
      setTotals((prev) => ({ ...prev, courses: coursesArray.length }));

      const catCounts = {};
      let approval = 0;
      let flagged = 0;

      coursesArray.forEach((course) => {
        const cat = course.Category || "Unknown";
        catCounts[cat] = (catCounts[cat] || 0) + 1;
        if (!course.approved) approval++;
        if (course.flagged) flagged++;
      });

      // setCourseApprovalCount(approval);
      // setFlaggedCoursesCount(flagged);
      setCourseCategoryCounts(catCounts);
    });

    // User-related data
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      let usersArray = [];
      let offered = {};
      let requested = {};
      let locations = {};
      let tutorReqs = 0;
      let reported = 0;
      let systemMsgs = 0;

      if (data) {
        usersArray = Object.entries(data).map(([key, value]) => ({ id: key, ...value }));

        usersArray.forEach((user) => {
          if (user.skilloffered) {
            user.skilloffered.split(",").map((s) => s.trim().toLowerCase()).forEach((skill) => {
              if (skill) offered[skill] = (offered[skill] || 0) + 1;
            });
          }
          if (user.skillrequested) {
            user.skillrequested.split(",").map((s) => s.trim().toLowerCase()).forEach((skill) => {
              if (skill) requested[skill] = (requested[skill] || 0) + 1;
            });
          }
          if (user.location) {
            const loc = user.location.trim().toLowerCase();
            if (loc) locations[loc] = (locations[loc] || 0) + 1;
          }
          if (user.wanttutorrights && !user.approvedTutor) tutorReqs++;
          if (user.reported) reported++;
          if (user.systemMessages && Array.isArray(user.systemMessages)) {
            systemMsgs += user.systemMessages.length;
          }
        });
      }

      setUsers(usersArray);
      setTotals((prev) => ({ ...prev, users: usersArray.length }));
      setSkillOfferedCounts(offered);
      setSkillRequestedCounts(requested);
      setLocationCounts(locations);
      // setTutorRequestsCount(tutorReqs);
      // setReportedUsersCount(reported);
      // setSystemMessagesCount(systemMsgs);
    });

    // Registered course data
    const regRef = ref(db, "registeredcourse");
    onValue(regRef, (snapshot) => {
      const data = snapshot.val();
      let regCount = 0;
      let courseCounts = {};

      if (data) {
        Object.entries(data).forEach(([courseName, usersObj]) => {
          const count = usersObj ? Object.keys(usersObj).length : 0;
          regCount += count;
          courseCounts[courseName] = count;
        });
      }

      setTotals((prev) => ({ ...prev, registeredCourses: regCount }));
      setRegisteredCoursesCounts(courseCounts);
    });
  }, []);

  const tiles = [
    { title: "Course Table", count: totals.courses || 0, link: "/courses" },
    { title: "User Table", count: totals.users || 0, link: "/users" },
    { title: "Add Quiz", count: null, link: "/addQuiz" },
    { title: "Add User Form", count: null, link: "/users/add" },
    { title: "Registered Courses Table", count: totals.registered || 0, link: "/registereds" },
    { title: "Add Course", count: null, link: "/addcourse" },
  ];

  const createBarData = (title, counts, color = "#93c5fd") => ({
    labels: Object.keys(counts),
    datasets: [{ label: title, data: Object.values(counts), backgroundColor: color }],
  });

  const barOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: "bold" },
        color: "#1f2937",
      },
    },
    scales: {
      x: { ticks: { color: "#374151" }, grid: { color: "#f3f4f6" } },
      y: { beginAtZero: true, ticks: { color: "#374151" }, grid: { color: "#f3f4f6" } },
    },
    maintainAspectRatio: false,
  });

  const overviewData = {
    labels: ["Courses", "Users", "Registered Courses"],
    datasets: [{
      label: "Total Count",
      data: [totals.courses, totals.users, totals.registeredCourses],
      backgroundColor: ["#CFA0EBFF", "#91BAF8FF", "#F7EE99FF"],
      borderRadius: 6,
    }],
  };

  const overviewOptions = barOptions("System Overview");

  // Helper
  const topN = (obj, n) =>
    Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, n));

  const totalOffered = Object.values(skillOfferedCounts).reduce((sum, n) => sum + n, 0);
  const totalRequested = Object.values(skillRequestedCounts).reduce((sum, n) => sum + n, 0);

  const pieData = {
    labels: ["Skills Offered", "Skills Requested"],
    datasets: [{
      data: [totalOffered, totalRequested],
      backgroundColor: ["#93c5fd", "#bbf7d0"],
      borderColor: "#ffffff",
      borderWidth: 2,
    }],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#374151", font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Total Skills Offered vs Requested",
        font: { size: 16, weight: "bold" },
        color: "#1f2937",
      },
    },
    maintainAspectRatio: false,
  };

  const coursesWithQuiz = courses.filter(
    (c) => c.quiz && Object.keys(c.quiz).length > 0
  ).length;
  const coursesWithoutQuiz = courses.length - coursesWithQuiz;

  const quizChartData = {
    labels: ["With Quiz", "Without Quiz"],
    datasets: [{ data: [coursesWithQuiz, coursesWithoutQuiz], backgroundColor: ["#36A2EB", "#FF6384"] }],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>Admin Dashboard</h2>

      {/* Moderator-style Tiles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
        {tiles.map((tile, index) => (
          <div
            key={index}
            style={{
              flex: "1 1 200px",
              backgroundColor: "#f3f4f6",
              padding: "20px",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
            onClick={() => (window.location.href = tile.link)}
          >
            <h3 style={{ color: "#1f2937", marginBottom: "8px" }}>{tile.title}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#3b82f6" }}>{tile.count}</p>
          </div>
        ))}
      </div>

      {/* Chart Selector */}
      <select
        value={selectedChart}
        onChange={(e) => setSelectedChart(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "20px",
          fontSize: "16px",
          color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: "4px",
        }}
      >
        <option value="overview">System Overview</option>
        <option value="skillsPie">Skills Pie Chart</option>
        <option value="coursesByCategory">Courses by Category</option>
        <option value="registeredUsers">Registered Users per Course</option>
        <option value="locations">User Locations</option>
        <option value="skillsOffered">Top 5 Skills Offered</option>
        <option value="skillsRequested">Top 5 Skills Requested</option>
        <option value="quizPresence">Courses With/Without Quiz</option>
      </select>

      {/* Charts */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {selectedChart === "overview" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Bar data={overviewData} options={overviewOptions} />
          </div>
        )}
        {selectedChart === "skillsPie" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        )}
        {selectedChart === "coursesByCategory" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Bar data={createBarData("Courses by Category", courseCategoryCounts, "#fde68a")} options={barOptions("Courses by Category")} />
          </div>
        )}
        {selectedChart === "registeredUsers" && (
          <div style={{ width: "450px", height: "400px" }}>
            <Bar
              data={createBarData("Registered Users per Course", registeredCoursesCounts, "#fca5a5")}
              options={{ ...barOptions("Registered Users per Course"), indexAxis: "y" }}
            />
          </div>
        )}
        {selectedChart === "locations" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Bar data={createBarData("User Locations", locationCounts, "#c4b5fd")} options={barOptions("User Locations")} />
          </div>
        )}
        {selectedChart === "skillsOffered" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Bar data={createBarData("Top 5 Skills Offered", topN(skillOfferedCounts, 5), "#93c5fd")} options={barOptions("Top 5 Skills Offered")} />
          </div>
        )}
        {selectedChart === "skillsRequested" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Bar data={createBarData("Top 5 Skills Requested", topN(skillRequestedCounts, 5), "#bbf7d0")} options={barOptions("Top 5 Skills Requested")} />
          </div>
        )}
        {selectedChart === "quizPresence" && (
          <div style={{ width: "350px", height: "300px" }}>
            <Doughnut data={quizChartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
