import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
// import "./TutorApproval.css"; // your styling file
import TutorDetailsPopup from "./TutorDetailsPopup";

const TutorApproval = () => {
  const [users, setUsers] = useState([]);
  const [popupTutor, setPopupTutor] = useState(null);
  const [popupCourses, setPopupCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(usersArray);
      }
    });
  }, []);

  const handleApprove = (id) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: true,
    });
  };

  const handleDecline = (id) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      wanttutorrights: false,
    });
  };

  const handleRevoke = (id) => {
    const moveToPending = window.confirm(
      "Do you want to move this tutor back to pending approval?"
    );

    const db = getDatabase();
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: false,
      wanttutorrights: moveToPending,
    });
  };

  const pendingTutors = users.filter(
    (user) => user.wanttutorrights && !user.approvedTutor
  );

  const approvedTutors = users.filter((user) => user.approvedTutor);

  const filteredPending = pendingTutors.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPending = [...filteredPending].sort((a, b) => {
    return sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentPending = sortedPending.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openPopup = (tutor) => {
    const courses = [];
    const db = getDatabase();
    const coursesRef = ref(db, "courses");
    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.values(data).forEach((course) => {
          if (course.tutorEmail === tutor.email) {
            courses.push(course);
          }
        });
        setPopupCourses(courses);
        setPopupTutor(tutor);
      }
    });
  };

  return (
    <div className="tutor-approval-container">
      <h2 className="title">Tutor Approval</h2>

      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <h3>Pending Tutor Requests</h3>
      {currentPending.length === 0 ? (
        <p>No pending tutor requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPending.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.tutorVerificationUrl || "/default-user.png"}
                    alt="Tutor Verification"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{user.name || "Unnamed"}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleApprove(user.id)}>
                    Approve
                  </button>
                  <button onClick={() => handleDecline(user.id)}>
                    Decline
                  </button>
                  <button onClick={() => openPopup(user)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        {Array.from({
          length: Math.ceil(sortedPending.length / usersPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <h3>Approved Tutors</h3>
      {approvedTutors.length === 0 ? (
        <p>No tutors approved yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Revoke</th>
            </tr>
          </thead>
          <tbody>
            {approvedTutors.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.tutorVerificationUrl || "/default-user.png"}
                    alt="Tutor Verification"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{user.name || "Unnamed"}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleRevoke(user.id)}>Revoke</button>
                  <button onClick={() => openPopup(user)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {popupTutor && (
        <TutorDetailsPopup
          tutor={popupTutor}
          courses={popupCourses}
          onClose={() => setPopupTutor(null)}
          onApprove={() => handleApprove(popupTutor.id)}
          onDecline={() => handleDecline(popupTutor.id)}
        />
      )}
    </div>
  );
};

export default TutorApproval;
