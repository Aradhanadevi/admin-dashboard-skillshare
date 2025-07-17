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
import { Bar, Line, Radar, Pie } from "react-chartjs-2";

import "chartjs-adapter-date-fns";
import { getDatabase, ref, onValue } from "firebase/database";

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
  Filler
);

const DashboardPage = () => {
  const [totals, setTotals] = useState({
    courses: 0,
    users: 0,
    registeredCourses: 0,
  });

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skillOfferedCounts, setSkillOfferedCounts] = useState({});
  const [skillRequestedCounts, setSkillRequestedCounts] = useState({});
  const [courseCategoryCounts, setCourseCategoryCounts] = useState({});
  const [registeredCoursesCounts, setRegisteredCoursesCounts] = useState({});
  const [locationCounts, setLocationCounts] = useState({});
  const [selectedChart, setSelectedChart] = useState("overview");

  const allSkillsSet = new Set([
    ...Object.keys(skillOfferedCounts),
    ...Object.keys(skillRequestedCounts),
  ]);

  const allSkills = Array.from(allSkillsSet).sort();

  const offeredRadarData = allSkills.map(
    (skill) => skillOfferedCounts[skill] || 0
  );
  const requestedRadarData = allSkills.map(
    (skill) => skillRequestedCounts[skill] || 0
  );

  const radarData = {
    labels: allSkills,
    datasets: [
      {
        label: "Offered Skills",
        data: offeredRadarData,
        backgroundColor: "rgba(147, 197, 253, 0.4)",
        borderColor: "rgba(147, 197, 253, 1)",
        borderWidth: 2,
      },
      {
        label: "Requested Skills",
        data: requestedRadarData,
        backgroundColor: "rgba(187, 247, 208, 0.4)",
        borderColor: "rgba(187, 247, 208, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Skill Coverage: Offered vs Requested",
        font: { size: 16, weight: "bold" },
        color: "#1f2937",
      },
      legend: {
        position: "top",
        labels: { color: "#374151" },
      },
    },
    scales: {
      r: {
        angleLines: { color: "#f3f4f6" },
        grid: { color: "#f3f4f6" },
        pointLabels: { color: "#374151" },
        ticks: {
          color: "#374151",
          beginAtZero: true,
        },
      },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const db = getDatabase();

    const coursesRef = ref(db, "courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const coursesArray = data
        ? Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }))
        : [];
      setCourses(coursesArray);
      setTotals((prev) => ({
        ...prev,
        courses: coursesArray.length,
      }));

      const catCounts = {};
      coursesArray.forEach((course) => {
        const cat = course.Category || "Unknown";
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      });
      setCourseCategoryCounts(catCounts);
    });

    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      let usersArray = [];
      let offered = {};
      let requested = {};
      let locations = {};

      if (data) {
        usersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        usersArray.forEach((user) => {
          if (user.skilloffered) {
            user.skilloffered
              .split(",")
              .map((s) => s.trim().toLowerCase())
              .forEach((skill) => {
                if (skill) {
                  offered[skill] = (offered[skill] || 0) + 1;
                }
              });
          }
          if (user.skillrequested) {
            user.skillrequested
              .split(",")
              .map((s) => s.trim().toLowerCase())
              .forEach((skill) => {
                if (skill) {
                  requested[skill] = (requested[skill] || 0) + 1;
                }
              });
          }
          if (user.location) {
            const loc = user.location.trim().toLowerCase();
            if (loc) {
              locations[loc] = (locations[loc] || 0) + 1;
            }
          }
        });
      }

      setUsers(usersArray);
      setTotals((prev) => ({
        ...prev,
        users: usersArray.length,
      }));
      setSkillOfferedCounts(offered);
      setSkillRequestedCounts(requested);
      setLocationCounts(locations);
    });

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

      setTotals((prev) => ({
        ...prev,
        registeredCourses: regCount,
      }));
      setRegisteredCoursesCounts(courseCounts);
    });
  }, []);

  const createBarData = (title, counts, color = "#93c5fd") => ({
    labels: Object.keys(counts),
    datasets: [
      {
        label: title,
        data: Object.values(counts),
        backgroundColor: color,
      },
    ],
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
      x: {
        ticks: { color: "#374151" },
        grid: { color: "#f3f4f6" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#374151" },
        grid: { color: "#f3f4f6" },
      },
    },
    maintainAspectRatio: false,
  });

  const overviewData = {
    labels: ["Courses", "Users", "Registered Courses"],
    datasets: [
      {
        label: "Total Count",
        data: [totals.courses, totals.users, totals.registeredCourses],
        backgroundColor: ["#CFA0EBFF", "#91BAF8FF", "#F7EE99FF"],
        borderRadius: 6,
      },
    ],
  };

  const overviewOptions = barOptions("System Overview");

  const registrations = users
    .filter((u) => u.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const lineData = {
    labels: registrations.map((u) => new Date(u.createdAt)),
    datasets: [
      {
        label: "Cumulative Users",
        data: registrations.map((_, i) => i + 1),
        fill: false,
        borderColor: "#5eead4",
        backgroundColor: "#5eead4",
        tension: 0.2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "User Registrations Over Time",
        font: { size: 16, weight: "bold" },
        color: "#1f2937",
      },
    },
    scales: {
      x: {
        type: "time",
        time: { unit: "month" },
        ticks: { color: "#374151" },
        title: {
          display: true,
          text: "Date",
          color: "#4A8FFFFF",
        },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#5999FFFF" },
        title: {
          display: true,
          text: "Cumulative Users",
          color: "#B0CEFFFF",
        },
      },
    },
    maintainAspectRatio: false,
  };

  const totalOffered = Object.values(skillOfferedCounts).reduce(
    (sum, n) => sum + n,
    0
  );
  const totalRequested = Object.values(skillRequestedCounts).reduce(
    (sum, n) => sum + n,
    0
  );

  const pieData = {
    labels: ["Skills Offered", "Skills Requested"],
    datasets: [
      {
        data: [totalOffered, totalRequested],
        backgroundColor: ["#93c5fd", "#bbf7d0"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 14 },
        },
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

  const topN = (obj, n) =>
    Object.fromEntries(
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .slice(0, n)
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
        Dashboard Overview
      </h2>

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
        <option value="registrations">User Registrations</option>
        <option value="skillsOffered">Top 5 Skills Offered</option>
        <option value="skillsRequested">Top 5 Skills Requested</option>
        <option value="radar">Radar Chart</option>
        <option value="coursesByCategory">Courses by Category</option>
        <option value="registeredUsers">Registered Users per Course</option>
        <option value="locations">User Locations</option>
        <option value="skillsPie">Skills Pie Chart</option>
      </select>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "350px", height: "300px" }}>
          <Bar data={overviewData} options={overviewOptions} />
        </div>

        {selectedChart === "registrations" && registrations.length > 0 && (
          <div style={{ width: "350px", height: "300px" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        )}

        {selectedChart === "skillsOffered" &&
          Object.keys(skillOfferedCounts).length > 0 && (
            <div style={{ width: "350px", height: "300px" }}>
              <Bar
                data={createBarData(
                  "Top 5 Skills Offered",
                  topN(skillOfferedCounts, 5),
                  "#93c5fd"
                )}
                options={barOptions("Top 5 Skills Offered")}
              />
            </div>
          )}

        {selectedChart === "skillsRequested" &&
          Object.keys(skillRequestedCounts).length > 0 && (
            <div style={{ width: "350px", height: "300px" }}>
              <Bar
                data={createBarData(
                  "Top 5 Skills Requested",
                  topN(skillRequestedCounts, 5),
                  "#bbf7d0"
                )}
                options={barOptions("Top 5 Skills Requested")}
              />
            </div>
          )}

        {selectedChart === "radar" && allSkills.length > 0 && (
          <div style={{ width: "400px", height: "400px" }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        )}

        {selectedChart === "coursesByCategory" &&
          Object.keys(courseCategoryCounts).length > 0 && (
            <div style={{ width: "350px", height: "300px" }}>
              <Bar
                data={createBarData(
                  "Courses by Category",
                  courseCategoryCounts,
                  "#fde68a"
                )}
                options={barOptions("Courses by Category")}
              />
            </div>
          )}

        {selectedChart === "registeredUsers" &&
          Object.keys(registeredCoursesCounts).length > 0 && (
            <div style={{ width: "450px", height: "400px" }}>
              <Bar
                data={createBarData(
                  "Registered Users per Course",
                  registeredCoursesCounts,
                  "#fca5a5"
                )}
                options={{
                  ...barOptions("Registered Users per Course"),
                  indexAxis: "y",
                  scales: {
                    y: {
                      ticks: { color: "#639FFFFF" },
                      grid: { color: "#ADC8FFFF" },
                    },
                    x: {
                      beginAtZero: true,
                      ticks: { color: "#C2F1FFFF" },
                      grid: { color: "#90B5FFFF" },
                    },
                  },
                }}
              />
            </div>
          )}

        {selectedChart === "locations" &&
          Object.keys(locationCounts).length > 0 && (
            <div style={{ width: "350px", height: "300px" }}>
              <Bar
                data={createBarData(
                  "User Locations",
                  locationCounts,
                  "#c4b5fd"
                )}
                options={barOptions("User Locations")}
              />
            </div>
          )}

        {selectedChart === "skillsPie" &&
          totalOffered + totalRequested > 0 && (
            <div style={{ width: "350px", height: "300px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
      </div>
    </div>
  );
};

export default DashboardPage;
