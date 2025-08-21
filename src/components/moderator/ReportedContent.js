import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "./../../firebase";
import "./ReportedContent.css";

const ReportedContent = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const coursesRef = ref(database, "courses");

    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const reportList = [];

      for (let courseId in data) {
        const course = data[courseId];
        if (course.reports) {
          reportList.push({
            id: courseId,
            name: course.courseName,
            reportCount: course.reports.reportCount || 0,
            reportedBy: course.reports.reportByUsers
              ? Object.keys(course.reports.reportByUsers)
              : [],
            approved: course.approved,
          });
        }
      }

      setReports(reportList);
    });

    return () => unsubscribe();
  }, []);

  const toggleApproval = async (courseId, currentStatus) => {
    const courseRef = ref(database, `courses/${courseId}`);
    await update(courseRef, { approved: !currentStatus });
    alert(
      `Course "${courseId}" has been ${
        currentStatus ? "disabled" : "enabled"
      }.`
    );
  };

  return (
    <div className="reported-content">
      <h2>Reported Courses</h2>
      {reports.length === 0 ? (
        <p className="empty">No reports found.</p>
      ) : (
        <div className="reported-table">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Report Count</th>
                <th>Reported By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.reportCount}</td>
                  <td>{report.reportedBy.join(", ") || "N/A"}</td>
                  <td>{report.approved ? "Approved" : "Disabled"}</td>
                  <td>
                    <button
                      onClick={() =>
                        toggleApproval(report.id, report.approved)
                      }
                    >
                      {report.approved ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedContent;
