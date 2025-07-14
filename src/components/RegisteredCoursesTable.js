import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";

const RegisteredCoursesTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const db = getDatabase();

    const usersRef = ref(db, "users");
    onValue(usersRef, (usersSnap) => {
      const usersData = usersSnap.val() || {};

      const regRef = ref(db, "registeredcourse");
      onValue(regRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const regArray = [];

          for (const courseName in data) {
            const usersInCourse = Object.keys(data[courseName]);

            usersInCourse.forEach((username) => {
              const userDetails = usersData[username] || {};
              regArray.push({
                courseName,
                username,
                userEmail: userDetails.email || "-",
                userLocation: userDetails.location || "-",
              });
            });
          }

          setRegistrations(regArray);
        } else {
          setRegistrations([]);
        }
      });
    });
  }, []);

  const handleDeleteRegistration = (courseName, username) => {
    const db = getDatabase();
    const regRef = ref(db, `registeredcourse/${courseName}/${username}`);
    remove(regRef)
      .then(() => alert("Registration removed"))
      .catch((err) => console.error("Remove error:", err));
  };

  const filtered = registrations.filter(
    (reg) =>
      reg.courseName.toLowerCase().includes(search.toLowerCase()) ||
      reg.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="registered-container">
      <h2 className="section-title">Registered Courses</h2>

      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search by course or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Username</th>
              <th>User Email</th>
              <th>User Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg, index) => (
              <tr key={index}>
                <td>{reg.courseName}</td>
                <td>{reg.username}</td>
                <td>{reg.userEmail}</td>
                <td>{reg.userLocation}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() =>
                      handleDeleteRegistration(reg.courseName, reg.username)
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-msg">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredCoursesTable;
