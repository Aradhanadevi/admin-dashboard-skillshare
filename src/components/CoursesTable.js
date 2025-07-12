import React, { useEffect, useState } from "react";
import CoursesCharts from "./CoursesCharts";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  set,
  query,
  orderByKey,
  startAfter,
  limitToFirst,
} from "firebase/database";

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState([null]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;

  const loadCourses = (page) => {
    setLoading(true);

    const db = getDatabase();
    const coursesRef = ref(db, "courses");

    let dbQuery;
    const cursor = pageCursors[page - 1];

    if (cursor) {
      dbQuery = query(
        coursesRef,
        orderByKey(),
        startAfter(cursor),
        limitToFirst(pageSize + 1)
      );
    } else {
      dbQuery = query(coursesRef, orderByKey(), limitToFirst(pageSize + 1));
    }

    onValue(
      dbQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setCourses([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        const items = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        let newHasMore = false;
        if (items.length > pageSize) {
          newHasMore = true;
          items.pop();
        }

        setCourses(items);
        setHasMore(newHasMore);
        setLoading(false);
      },
      { onlyOnce: true }
    );
  };

  useEffect(() => {
    loadCourses(1);
  }, []);

const nextPage = () => {
  if (!hasMore) return;
  const lastCourse = courses[courses.length - 1];
  const nextCursor = lastCourse?.id || null;

  const nextPageNumber = currentPage + 1;
  const newCursors = [...pageCursors];
  newCursors[nextPageNumber - 1] = nextCursor;

  setPageCursors(newCursors);
  setCurrentPage(nextPageNumber);
  loadCourses(nextPageNumber);
};

const prevPage = () => {
  if (currentPage <= 1) return;

  const prevPageNumber = currentPage - 1;
  setCurrentPage(prevPageNumber);
  loadCourses(prevPageNumber);
};


  const handleDelete = (id) => {
    const db = getDatabase();
    remove(ref(db, `courses/${id}`))
      .then(() => {
        alert("Course deleted!");
        loadCourses(currentPage);
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const saveCourse = () => {
    const db = getDatabase();
    const courseRef = ref(db, `courses/${editingCourse.id}`);
    set(courseRef, {
      ...editingCourse,
      noofvideos: Number(editingCourse.noofvideos),
      price: Number(editingCourse.price),
    })
      .then(() => {
        alert("Course updated!");
        setEditingCourse(null);
        loadCourses(currentPage);
      })
      .catch((err) => console.error("Update error:", err));
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      (course.courseName || "").toLowerCase().includes(term) ||
      (course.Category || "").toLowerCase().includes(term) ||
      (course.Description || "").toLowerCase().includes(term) ||
      (course.Tutor || "").toLowerCase().includes(term) ||
      (course.language || "").toLowerCase().includes(term) ||
      (course.location || "").toLowerCase().includes(term) ||
      (course.skils || "").toLowerCase().includes(term)
    );
  });

  const exportToJSON = () => {
    const jsonString = JSON.stringify(courses, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "courses.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCSV = () => {
    if (courses.length === 0) return alert("No data to export!");
    const headers = [
      "Course Name",
      "Category",
      "Description",
      "Tutor",
      "Language",
      "Location",
      "No of Videos",
      "Playlist Link",
      "Price",
      "Skills",
      "Image URL",
    ];
    const rows = courses.map((course) => [
      course.courseName,
      course.Category,
      course.Description,
      course.Tutor,
      course.language,
      course.location,
      course.noofvideos,
      course.playlistlink,
      course.price,
      course.skils,
      course.imageUrl,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "courses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>All Courses</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={searchTerm}
          placeholder="Search courses..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={exportToCSV}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export as CSV
        </button>
        <button
          onClick={exportToJSON}
          style={{
            padding: "8px 12px",
            background: "#17a2b8",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export as JSON
        </button>
      </div>

      {loading ? (
        <div style={{ margin: "30px 0", fontSize: "18px", color: "#007bff" }}>
          Loading...
        </div>
      ) : (
        <>
          <table
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead style={{ backgroundColor: "#f0f0f0" }}>
              <tr>
                <th>Image</th>
                <th>Course Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Tutor</th>
                <th>Language</th>
                <th>Location</th>
                <th>Videos</th>
                <th>Skills</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.courseName}
                        style={{
                          width: "60px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </td>
                  <td>{course.courseName}</td>
                  <td>{course.Category}</td>
                  <td>{course.Description}</td>
                  <td>{course.Tutor}</td>
                  <td>{course.language}</td>
                  <td>{course.location}</td>
                  <td>{course.noofvideos}</td>
                  <td>{course.skils}</td>
                  <td>₹{course.price}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(course)}
                      style={{
                        marginRight: "5px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{
                marginRight: "10px",
                padding: "8px 12px",
                background: currentPage === 1 ? "#ccc" : "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: currentPage === 1 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px", fontWeight: "bold" }}>
              Page {currentPage}
            </span>
            <button
              onClick={nextPage}
              disabled={!hasMore}
              style={{
                padding: "8px 12px",
                background: hasMore ? "#007bff" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: hasMore ? "pointer" : "default",
              }}
            >
              Next
            </button>
          </div>

          {filteredCourses.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <CoursesCharts courses={filteredCourses} />
            </div>
          )}
        </>
      )}

      {editingCourse && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveCourse();
          }}
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxWidth: "600px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Edit Course: {editingCourse.courseName}</h3>
          <input
            value={editingCourse.courseName}
            onChange={(e) =>
              setEditingCourse({
                ...editingCourse,
                courseName: e.target.value,
              })
            }
            placeholder="Course Name"
            required
          />
          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={{ padding: "5px 15px" }}>
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingCourse(null)}
              style={{ padding: "5px 15px", marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CoursesTable;
