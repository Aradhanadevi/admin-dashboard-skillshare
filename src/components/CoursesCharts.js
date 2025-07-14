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

const CoursesCharts = ({ courses = [] }) => {
  // Fallback dummy data for testing if courses array is empty
  const dataToUse =
    courses.length > 0
      ? courses
      : [
          { courseName: "React Basics", Category: "Web Dev", noofvideos: 10 },
          { courseName: "Python for Data Science", Category: "Data Science", noofvideos: 8 },
          { courseName: "UI/UX Design", Category: "Design", noofvideos: 12 },
        ];

  // Pie chart: number of courses per category
  const categoryCounts = dataToUse.reduce((acc, course) => {
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

  const pieOptions = {
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
        text: "Courses by Category",
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  // Bar chart: videos per course
  const barData = {
    labels: dataToUse.map((c) => c.courseName),
    datasets: [
      {
        label: "Number of Videos",
        data: dataToUse.map((c) => Number(c.noofvideos)),
        backgroundColor: "#3182ce",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
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
        text: "Videos per Course",
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#333",
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="courses-charts-container">
      <h3 className="section-title">Courses Analytics</h3>

      <div style={{ maxWidth: "400px", margin: "0 auto 30px" }}>
        <Pie data={pieData} options={pieOptions} />
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Bar data={barData} options={barOptions} />
      </div>
    </div>
  );
};

export default CoursesCharts;
