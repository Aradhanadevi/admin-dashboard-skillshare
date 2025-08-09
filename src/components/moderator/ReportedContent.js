import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./../../firebase";
import "./ReportedContent.css";

const ReportedContent = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const reportsRef = ref(database, "reports"); // adjust path if needed

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      const reportList = [];

      for (let id in data) {
        reportList.push({
          id,
          ...data[id],
        });
      }

      setReports(reportList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="reported-content">
      <h2>Reported Content</h2>
      {reports.length === 0 ? (
        <p className="empty">No reports found.</p>
      ) : (
        <div className="reported-table">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reported By</th>
                <th>Content Type</th>
                <th>Content ID</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.reportedBy || "Unknown"}</td>
                  <td>{report.type || "N/A"}</td>
                  <td>{report.contentId || "N/A"}</td>
                  <td>{report.reason || "No reason provided"}</td>
                  <td>{report.date || "N/A"}</td>
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
