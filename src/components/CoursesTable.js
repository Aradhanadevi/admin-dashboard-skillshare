import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { FaTrashAlt } from "react-icons/fa";

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const db = getDatabase();
    const coursesRef = ref(db, "courses");

    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coursesArray = Object.entries(data).map(([courseName, details]) => ({
          courseName,
          ...details,
        }));
        setCourses(coursesArray);
      } else {
        setCourses([]);
      }
    });
  }, []);

  const handleDeleteCourse = (courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`))
      return;

    const db = getDatabase();
    const courseRef = ref(db, `courses/${courseName}`);

    remove(courseRef)
      .then(() => alert(`Course "${courseName}" deleted.`))
      .catch((err) => console.error(err));
  };

  const filtered = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(search.toLowerCase()) ||
      (course.Category &&
        course.Category.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedCourses = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="courses-container">
      {/* Search Bar */}
      <div className="courses-header">
        <div>
          <h2 className="section-title">Courses</h2>
          <p className="section-subtitle">Manage your available courses below.</p>
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Tutor</th>
              <th>Language</th>
              <th>Location</th>
              <th>No. of Videos</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCourses.map((course, index) => (
              <tr key={index}>
                <td>
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.courseName}
                      style={{
                        width: "60px",
                        height: "auto",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td>{course.courseName}</td>
                <td>{course.Category || "-"}</td>
                <td>{course.Tutor || "-"}</td>
                <td>{course.language || "-"}</td>
                <td>{course.location || "-"}</td>
                <td>{course.noofvideos || 0}</td>
                <td>{course.price ? `$${course.price}` : "-"}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleDeleteCourse(course.courseName)}
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </td>
              </tr>
            ))}

            {paginatedCourses.length === 0 && (
              <tr>
                <td colSpan="9" className="empty-msg">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > pageSize && (
          <div className="pagination-controls" style={{ marginTop: "16px" }}>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              style={{
                background: "#eee",
                border: "1px solid #ccc",
                padding: "6px 10px",
                marginRight: "8px",
                cursor: "pointer",
              }}
            >
              Prev
            </button>
            <span style={{ fontSize: "14px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{
                background: "#eee",
                border: "1px solid #ccc",
                padding: "6px 10px",
                marginLeft: "8px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesTable;
