import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; // Adjust path if needed
import "./ModeratorDashboard.css";

const ModeratorDashboard = () => {
  const [pendingCourses, setPendingCourses] = useState(0);
  const [pendingTutors, setPendingTutors] = useState(0);

  useEffect(() => {
    const coursesRef = ref(database, "courses");
    const usersRef = ref(database, "users");

    // Fetch pending courses
    onValue(coursesRef, (snapshot) => {
      let count = 0;
      snapshot.forEach((child) => {
        const course = child.val();
        if (course.status === "pending") count++;
      });
      setPendingCourses(count);
    });

    // Fetch pending tutor requests
    onValue(usersRef, (snapshot) => {
      let count = 0;
      snapshot.forEach((child) => {
        const user = child.val();
        if (user.roleRequest === "tutor" && user.role !== "tutor") count++;
      });
      setPendingTutors(count);
    });
  }, []);

  const tiles = [
    { title: "Course Approval", count: pendingCourses, link: "/moderator/courses" },
    { title: "Tutor Requests", count: pendingTutors, link: "/moderator/tutor-approval" },
    { title: "Flagged Courses", count: 3, link: "/moderator/flagged-courses" },
    { title: "Reported Users", count: 1, link: "/moderator/reported-users" },
    { title: "Platform Stats", count: "-", link: "/moderator/stats" },
    { title: "System Messages", count: 0, link: "/moderator/messages" }
  ];

  return (
    <div className="moderator-dashboard">
      <h1>Moderator Dashboard</h1>
      <div className="tiles-grid">
        {tiles.map((tile, index) => (
          <div
            className="tile"
            key={index}
            onClick={() => (window.location.href = tile.link)}
          >
            <h2>{tile.title}</h2>
            <p className="count">{tile.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
