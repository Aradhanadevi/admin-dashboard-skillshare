import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";
import { app } from "../../firebase";
import {
  BookText,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  LayoutDashboard,
  Search,
} from "lucide-react";

const CourseApproval = () => {
  const [unapprovedCourses, setUnapprovedCourses] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
          const fullCourse = { courseName, ...courseData };
          if (courseData.approved) {
            approved.push(fullCourse);
          } else {
            unapproved.push(fullCourse);
          }
        });

        setUnapprovedCourses(unapproved);
        setApprovedCourses(approved);
      } else {
        setUnapprovedCourses([]);
        setApprovedCourses([]);
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
      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = (courses) =>
    courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.Tutor || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const CourseCard = ({ course, approved }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div style={styles.card}>
        <div style={styles.cardContent}>
          <div style={{ flex: 1 }}>
            <h3 style={styles.courseName}>
              <BookText size={18} style={styles.icon} />
              {course.courseName}
            </h3>

            <p style={styles.text}>
              <User size={16} style={styles.icon} />
              <strong>{course.Tutor || "Unknown Tutor"}</strong>
            </p>

            <div style={styles.text}>
              <FileText size={16} style={styles.icon} />
              <div>
                <p
                  style={{
                    ...styles.description,
                    ...(isExpanded ? {} : styles.truncated),
                  }}
                >
                  {course.Description || "No description available."}
                </p>
                {course.Description?.length > 100 && (
                  <button onClick={() => setIsExpanded(!isExpanded)} style={styles.readMoreBtn}>
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: "10px" }}>
              {approved ? (
                <button
                  style={styles.disapproveButton}
                  onClick={() => handleStatusChange(course.courseName, false)}
                >
                  <XCircle size={16} style={styles.icon} /> Disapprove
                </button>
              ) : (
                <button
                  style={styles.approveButton}
                  onClick={() => handleStatusChange(course.courseName, true)}
                >
                  <CheckCircle size={16} style={styles.icon} /> Approve
                </button>
              )}
            </div>
          </div>

          {course.imageUrl && (
            <img src={course.imageUrl} alt="Course" style={styles.thumbnail} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        <LayoutDashboard size={24} style={{ marginRight: "8px" }} />
        Course Approval
      </h1>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <Search size={16} style={{ marginRight: "8px", color: "#777" }} />
        <input
          type="text"
          placeholder="Search by course or tutor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <section>
        <h2 style={styles.sectionHeading}>⏳ Pending Approval</h2>
        <div style={styles.scrollSection}>
          {loading ? (
            <p style={styles.loading}>
              <Loader2 size={18} className="animate-spin" /> Loading...
            </p>
          ) : filtered(unapprovedCourses).length === 0 ? (
            <p>No unapproved courses.</p>
          ) : (
            filtered(unapprovedCourses).map((course) => (
              <CourseCard key={course.courseName} course={course} approved={false} />
            ))
          )}
        </div>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2 style={styles.sectionHeading}>✅ Approved Courses</h2>
        <div style={styles.scrollSection}>
          {loading ? (
            <p style={styles.loading}>
              <Loader2 size={18} className="animate-spin" /> Loading...
            </p>
          ) : filtered(approvedCourses).length === 0 ? (
            <p>No approved courses.</p>
          ) : (
            filtered(approvedCourses).map((course) => (
              <CourseCard key={course.courseName} course={course} approved={true} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f8",
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: "28px",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "6px 12px",
    marginBottom: "25px",
    width: "100%",
    maxWidth: "400px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "15px",
    width: "100%",
    background: "transparent",
  },
  sectionHeading: {
    fontSize: "20px",
    marginBottom: "12px",
    color: "#34495e",
  },
  scrollSection: {
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "6px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  courseName: {
    fontSize: "18px",
    marginBottom: "6px",
    color: "#2d3436",
    display: "flex",
    alignItems: "center",
  },
  text: {
    fontSize: "14px",
    color: "#636e72",
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  icon: {
    marginRight: "6px",
    color: "#2d3436",
  },
  approveButton: {
    backgroundColor: "#27ae60",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  disapproveButton: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  truncated: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  readMoreBtn: {
    background: "none",
    border: "none",
    color: "#2980b9",
    cursor: "pointer",
    fontSize: "13px",
    marginTop: "4px",
  },
  thumbnail: {
    width: "160px",
    height: "110px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#888",
  },
};

export default CourseApproval;
