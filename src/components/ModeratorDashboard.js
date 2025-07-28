import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../firebase";

const ModeratorDashboard = () => {
  const [unapprovedCourses, setUnapprovedCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    const db = getDatabase(app);
    const coursesRef = ref(db, "courses");

  try {
    const snapshot = await get(coursesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const unapproved = [];
      const approved = [];

      Object.entries(data).forEach(([courseName, courseData]) => {
        const isApproved = courseData.approved === true;
        const fullCourse = { courseName, ...courseData };
        if (isApproved) {
          approved.push(fullCourse);
        } else {
          unapproved.push(fullCourse);
        }
      });

      setApprovedCourses(approved);
      setUnapprovedCourses(unapproved);
    } else {
      setApprovedCourses([]);
      setUnapprovedCourses([]);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }

  setLoading(false);
};

const handleStatusChange = async (courseName, approved) => {
  const db = getDatabase(app);
  const courseRef = ref(db, `courses/${courseName}`);
  try {
    await update(courseRef, { approved });
    fetchCourses(); // refresh
  } catch (error) {
    console.error("Error updating course:", error);
  }
};

useEffect(() => {
  fetchCourses();
}, []);

return (
  <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
    <h1 style={{ fontSize: "26px", marginBottom: "20px", textAlign: "center" }}>Moderator Dashboard</h1>

    {loading ? (
      <p style={{ textAlign: "center" }}>⏳ Loading or no data found.</p>
    ) : (
      <>
        <h2 style={{ marginTop: "30px", fontSize: "22px", borderBottom: "2px solid #ccc" }}>🚫 Unapproved Courses</h2>
        {unapprovedCourses.length === 0 ? (
          <p>No unapproved courses found.</p>
        ) : (
          unapprovedCourses.map((course, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.title}>{course.courseName}</h3>
              <p><strong>Category:</strong> {course.Category}</p>
              <p><strong>Language:</strong> {course.language}</p>
              <p><strong>Tutor:</strong> {course.Tutor}</p>
              <p><strong>Description:</strong> {course.Description}</p>
              <div style={styles.btnGroup}>
                <button onClick={() => handleStatusChange(course.courseName, true)} style={styles.approve}>Approve</button>
              </div>
            </div>
          ))
        )}

        <h2 style={{ marginTop: "30px", fontSize: "22px", borderBottom: "2px solid #ccc" }}>✅ Approved Courses</h2>
        {approvedCourses.length === 0 ? (
          <p>No approved courses found.</p>
        ) : (
          approvedCourses.map((course, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.title}>{course.courseName}</h3>
              <p><strong>Category:</strong> {course.Category}</p>
              <p><strong>Language:</strong> {course.language}</p>
              <p><strong>Tutor:</strong> {course.Tutor}</p>
              <p><strong>Description:</strong> {course.Description}</p>
              <div style={styles.btnGroup}>
                <button onClick={() => handleStatusChange(course.courseName, false)} style={styles.disapprove}>Disapprove</button>
              </div>
            </div>
          ))
        )}
      </>
    )}
  </div>
);
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "15px",
    margin: "15px 0",
    backgroundColor: "#f9f9f9"
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    color: "#333"
  },
  btnGroup: {
    marginTop: "10px"
  },
  approve: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px"
  },
  disapprove: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer",
    borderRadius: "4px"
  }
};

export default ModeratorDashboard;
