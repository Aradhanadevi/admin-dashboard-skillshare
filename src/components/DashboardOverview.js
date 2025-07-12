import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardOverview = () => {
  const data = {
    labels: ["Courses", "Users", "Registered Courses"],
    datasets: [
      {
        label: "Counts",
        data: [30, 15, 40],
        backgroundColor: ["#3182ce", "#38a169", "#d69e2e"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "System Overview",
      },
    },
  };

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardOverview;
