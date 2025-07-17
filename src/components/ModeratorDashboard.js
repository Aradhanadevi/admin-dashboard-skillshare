import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, get } from "firebase/database";
import {
  FaHome,
  FaClipboardCheck,
  FaFlag,
  FaChartBar,
  FaBell,
} from "react-icons/fa";

const Sidebar = () => (
  <div className="w-64 bg-white border-r h-screen p-6 text-sm">
    <h2 className="text-lg font-bold mb-6">Moderator Panel</h2>
    <ul className="space-y-4 text-gray-700">
      <li className="flex items-center gap-2 font-medium text-black">
        <FaHome /> Dashboard
      </li>
      <li className="flex items-center gap-2 hover:text-black cursor-pointer">
        <FaClipboardCheck /> Pending Approvals
      </li>
      <li className="flex items-center gap-2 hover:text-black cursor-pointer">
        <FaFlag /> Reported Content
      </li>
      <li className="flex items-center gap-2 hover:text-black cursor-pointer">
        <FaChartBar /> Analytics
      </li>
      <li className="flex items-center gap-2 hover:text-black cursor-pointer">
        <FaBell /> Notifications
      </li>
    </ul>
  </div>
);

const ModeratorDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await get(ref(database, "courses"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const courseList = Object.keys(data).map((key) => ({
          ...data[key],
          key,
        }));
        setCourses(courseList);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-gray-500 mb-1">Pending Approvals</p>
            <h2 className="text-2xl font-bold">{courses.length}</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-gray-500 mb-1">Reported Content</p>
            <h2 className="text-2xl font-bold">5</h2>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-gray-500 mb-1">Resolved Reports</p>
            <h2 className="text-2xl font-bold">20</h2>
          </div>
        </div>

        {/* Course Approval Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Course Approvals</h2>

          <input
            type="text"
            placeholder="🔍 Search courses"
            className="w-full mb-4 px-4 py-2 border rounded-md bg-gray-100 text-sm"
          />

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Course Title</th>
                <th>Instructor</th>
                <th>Submitted Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3">{course.courseName}</td>
                  <td>{course.Tutor}</td>
                  <td>2025-07-15</td>
                  <td className="text-right text-blue-600 font-medium">
                    <span className="cursor-pointer hover:underline">Approve</span> /{" "}
                    <span className="cursor-pointer hover:underline text-red-500">Reject</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reported Content Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Reported Content Review</h2>
          <p className="text-gray-500 text-sm italic">
            Reported content integration coming soon…
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
