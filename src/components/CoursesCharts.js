import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const CoursesCharts = ({ courses }) => {
  // Example: Pie chart of categories
  const categoryCounts = courses.reduce((acc, course) => {
    const category = course.Category || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Number of Courses",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };

  // Example: Bar chart of videos per course
  const barData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        label: "Number of Videos",
        data: courses.map((course) => Number(course.noofvideos)),
        backgroundColor: "#36a2eb",
      },
    ],
  };

  return (
    <div>
      <h3>Courses Analytics</h3>
      <div style={{ maxWidth: "400px", marginBottom: "30px" }}>
        <Pie data={pieData} />
      </div>
      <div style={{ maxWidth: "600px" }}>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default CoursesCharts;
