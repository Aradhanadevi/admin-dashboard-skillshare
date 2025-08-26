import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFavourites, setExpandedFavourites] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const pageSize = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([username, details]) => ({
          username,
          ...details,
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });
  }, []);

  const handleDeleteUser = (username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`))
      return;

    const db = getDatabase();
    const userRef = ref(db, `users/${username}`);

    remove(userRef)
      .then(() => alert(`User "${username}" deleted.`))
      .catch((err) => console.error(err));
  };

  const toggleExpandFavourites = (username) => {
    setExpandedFavourites((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const renderFavouritesCell = (user) => {
    const text = user.favourites
      ? Object.keys(user.favourites).join(", ")
      : "-";

    if (text === "-") return "-";

    if (expandedFavourites[user.username]) {
      return (
        <div style={{ whiteSpace: "normal" }}>
          {text}
          <button
            onClick={() => toggleExpandFavourites(user.username)}
            style={{
              border: "none",
              background: "transparent",
              color: "#3498db",
              cursor: "pointer",
              marginLeft: "6px",
            }}
          >
            Read Less
          </button>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: "normal",
          maxWidth: "300px",
        }}
      >
        {text}
        {text.length > 60 && (
          <button
            onClick={() => toggleExpandFavourites(user.username)}
            style={{
              border: "none",
              background: "transparent",
              color: "#3498db",
              cursor: "pointer",
              marginLeft: "6px",
            }}
          >
            Read More
          </button>
        )}
      </div>
    );
  };

  // 🔹 filter users
  const filtered = users.filter((user) => {
    if (user.role === "admin" || user.isAdmin) return false;

    const term = search.toLowerCase();
    const roles = [];
    if (user.approvedTutor) roles.push("tutor");
    if (user.isModerator || user.moderator) roles.push("moderator");
    if (roles.length === 0) roles.push("user");

    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.location?.toLowerCase().includes(term) ||
      user.skills?.toLowerCase().includes(term) ||
      user.skilloffered?.toLowerCase().includes(term) ||
      user.skillrequested?.toLowerCase().includes(term) ||
      roles.some((r) => r.includes(term)) ||
      Object.keys(user.favourites || {}).some((fav) =>
        fav.toLowerCase().includes(term)
      )
    );
  });

  // 🔹 pagination calculation
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="users-container" style={{ padding: "20px" }}>
      <h2 className="section-title" style={{ marginBottom: "20px" }}>Users</h2>

      {/* ✅ Search Bar */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset to first page when searching
          }}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "6px 10px",
            width: "300px",
            background: "#f9f9f9",
            fontSize: "16px",
          }}
        />
      </div>

      <div className="table-wrapper" style={{ marginTop: "30px", overflowX: "auto" }}>
        <table className="styled-table" style={{ width: "100%", minWidth: "1000px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Skill Offered</th>
              <th>Skill Requested</th>
              <th>Favourites</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => {
              if (user.role === "admin" || user.isAdmin) return null;

              const roles = [];
              if (user.approvedTutor) roles.push("Tutor");
              if (user.isModerator || user.moderator) roles.push("Moderator");
              if (roles.length === 0) roles.push("User");

              return (
                <tr key={idx} onClick={() => setSelectedUser(user)} style={{ cursor: "pointer" }}>
                  <td>{user.username}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.name || "-"}</td>
                  <td>{roles.join(", ")}</td>
                  <td>{user.location || "-"}</td>
                  <td>{user.skills || "-"}</td>
                  <td>{user.skilloffered || "-"}</td>
                  <td>{user.skillrequested || "-"}</td>
                  <td>{renderFavouritesCell(user)}</td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.username); }}
                      style={{ background: "#e74c3c", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls */}
      {filtered.length > pageSize && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* ✅ User Details Popup */}
      {selectedUser && (
        <div className="popup-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center"
        }}>
          <div className="popup" style={{
            background: "#fff", padding: "20px", borderRadius: "8px",
            width: "500px", maxHeight: "80vh", overflowY: "auto"
          }}>
            <h3>{selectedUser.username} — Details</h3>
            <p><strong>Email:</strong> {selectedUser.email || "-"}</p>
            <p><strong>Name:</strong> {selectedUser.name || "-"}</p>
            <p><strong>Location:</strong> {selectedUser.location || "-"}</p>

            {selectedUser.approvedTutor && (
              <>
                <h4>Tutor Info</h4>
                <p><strong>Skills:</strong> {selectedUser.skills || "-"}</p>
                <p><strong>Skill Offered:</strong> {selectedUser.skilloffered || "-"}</p>
                <p><strong>Skill Requested:</strong> {selectedUser.skillrequested || "-"}</p>
              </>
            )}

            {(selectedUser.isModerator || selectedUser.moderator) && (
              <>
                <h4>Moderator Privileges</h4>
                <p>✅ Can approve/reject tutors</p>
                <p>✅ Can manage flagged content</p>
              </>
            )}

            {!selectedUser.approvedTutor && !selectedUser.isModerator && !selectedUser.moderator && (
              <p>This user is a regular User.</p>
            )}

            <button onClick={() => setSelectedUser(null)} style={{
              marginTop: "20px", padding: "8px 16px", background: "#3498db",
              color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer"
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
