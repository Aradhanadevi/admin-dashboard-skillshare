import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; // Adjust if needed
import "./ModeratorDashboard.css";

const ModeratorDashboard = () => {
  const [courseApprovalCount, setCourseApprovalCount] = useState(0);
  const [tutorRequestsCount, setTutorRequestsCount] = useState(0);
  const [flaggedCoursesCount, setFlaggedCoursesCount] = useState(0);
  const [reportedUsersCount, setReportedUsersCount] = useState(0);
  const [systemMessagesCount, setSystemMessagesCount] = useState(0);

  useEffect(() => {
    const coursesRef = ref(database, "courses");
    const usersRef = ref(database, "users");

    // Fetch course data
    onValue(coursesRef, (snapshot) => {
      let courseApproval = 0;
      let flagged = 0;

      snapshot.forEach((child) => {
        const course = child.val();
        if (!course.approved) courseApproval++;
        if (course.flagged) flagged++;
      });

      setCourseApprovalCount(courseApproval);
      setFlaggedCoursesCount(flagged);
    });

    // Fetch user data
    onValue(usersRef, (snapshot) => {
      let tutorReqs = 0;
      let reported = 0;
      let systemMsgs = 0;

      snapshot.forEach((child) => {
        const user = child.val();
        if (user.wanttutorrights && !user.approvedTutor) tutorReqs++;
        if (user.reported) reported++;
        if (user.systemMessages && Array.isArray(user.systemMessages)) {
          systemMsgs += user.systemMessages.length;
        }
      });

      setTutorRequestsCount(tutorReqs);
      setReportedUsersCount(reported);
      setSystemMessagesCount(systemMsgs);
    });
  }, []);

  const tiles = [
    { title: "Course Approval", count: courseApprovalCount, link: "/moderator/courses" },
    { title: "Tutor Requests", count: tutorRequestsCount, link: "/moderator/tutor-approval" },
    { title: "Flagged Courses", count: flaggedCoursesCount, link: "/moderator/flagged-users" },
    { title: "Reported Users", count: reportedUsersCount, link: "/moderator/reported-content" },
    { title: "Platform Stats", count: "-", link: "/moderator/stats" },
    { title: "System Messages", count: systemMessagesCount, link: "/moderator/messages" }
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
