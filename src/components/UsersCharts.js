import React from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

const UsersCharts = ({ users = [] }) => {
  // Fallback dummy data for testing if no users passed
  const usersToUse =
    users.length > 0
      ? users
      : [
          {
            id: "u1",
            username: "john_doe",
            role: "Admin",
            createdAt: "2025-05-10T10:00:00Z",
          },
          {
            id: "u2",
            username: "jane_smith",
            role: "Student",
            createdAt: "2025-06-01T14:30:00Z",
          },
          {
            id: "u3",
            username: "sam_wilson",
            role: "Student",
            createdAt: "2025-06-15T09:15:00Z",
          },
        ];

  // Pie chart - User roles
  const roleCounts = usersToUse.reduce((acc, user) => {
    const role = user.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const roleData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: "User Roles",
        data: Object.values(roleCounts),
        backgroundColor: [
          "#3182ce",
          "#38a169",
          "#d69e2e",
          "#805ad5",
          "#e53e3e",
          "#00b5d8",
        ],
      },
    ],
  };

  const roleOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "User Roles Distribution",
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  // Line chart - User registrations over time
  const registrations = usersToUse
    .filter((u) => u.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const registrationData = {
    labels: registrations.map((u) => new Date(u.createdAt)),
    datasets: [
      {
        label: "Cumulative Users",
        data: registrations.map((_, idx) => idx + 1),
        fill: false,
        borderColor: "#3182ce",
        backgroundColor: "#3182ce",
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "User Registrations Over Time",
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
        ticks: {
          color: "#333",
        },
        title: {
          display: true,
          text: "Registration Date",
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#333",
          precision: 0,
        },
        title: {
          display: true,
          text: "Cumulative Users",
          color: "#333",
        },
      },
    },
  };

  return (
    <div className="users-charts-container">
      <h3 className="section-title">User Analytics</h3>

      <div style={{ maxWidth: "400px", margin: "0 auto 30px" }}>
        <Pie data={roleData} options={roleOptions} />
      </div>

      {registrations.length > 0 && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Line data={registrationData} options={lineOptions} />
        </div>
      )}
    </div>
  );
};

export default UsersCharts;
