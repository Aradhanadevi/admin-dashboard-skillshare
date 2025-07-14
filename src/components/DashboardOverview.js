import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { getDatabase, ref, onValue } from "firebase/database";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
  const [totals, setTotals] = useState({
    courses: 0,
    users: 0,
    registeredCourses: 0,
  });

  useEffect(() => {
    const db = getDatabase();

    // Fetch total courses
    const coursesRef = ref(db, "courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      setTotals((prev) => ({ ...prev, courses: count }));
    });

    // Fetch total users
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      setTotals((prev) => ({ ...prev, users: count }));
    });

    // Fetch total registered courses count
    const regRef = ref(db, "registeredcourse");
    onValue(regRef, (snapshot) => {
      const data = snapshot.val();
      let regCount = 0;

      if (data) {
        Object.values(data).forEach((course) => {
          regCount += Object.keys(course || {}).length;
        });
      }

      setTotals((prev) => ({
        ...prev,
        registeredCourses: regCount,
      }));
    });
  }, []);

  const data = {
    labels: ["Courses", "Users", "Registered Courses"],
    datasets: [
      {
        label: "Total Count",
        data: [
          totals.courses,
          totals.users,
          totals.registeredCourses,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "System Overview",
        color: "#111827",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151",
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#374151",
          font: {
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
    },
  };

  return (
    <div className="dashboard-overview">
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardOverview;
