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
  // ✅ fallback dummy data for testing if users array is empty
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

  // Role distribution
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
        backgroundColor: ["#36a2eb", "#ff6384", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  // Registration Over Time
  const registrations = usersToUse
    .filter((u) => u.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const registrationData = {
    labels: registrations.map((u) => new Date(u.createdAt)),
    datasets: [
      {
        label: "New Users",
        data: registrations.map((_, idx) => idx + 1),
        fill: false,
        borderColor: "#36a2eb",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h3>User Analytics</h3>

      <div style={{ maxWidth: "400px", marginBottom: "30px" }}>
        <Pie data={roleData} />
      </div>

      {registrations.length > 0 && (
        <div style={{ maxWidth: "600px", marginBottom: "30px" }}>
          <Line
            data={registrationData}
            options={{
              scales: {
                x: {
                  type: "time",
                  time: { unit: "month" },
                  title: {
                    display: true,
                    text: "Registration Date",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Cumulative Users",
                  },
                  beginAtZero: true,
                  precision: 0,
                },
              },
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UsersCharts;
