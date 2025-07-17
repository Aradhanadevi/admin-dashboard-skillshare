import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedFavourites, setExpandedFavourites] = useState({});
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

  const filtered = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.location?.toLowerCase().includes(term) ||
      user.skills?.toLowerCase().includes(term) ||
      user.skilloffered?.toLowerCase().includes(term) ||
      user.skillrequested?.toLowerCase().includes(term) ||
      Object.keys(user.favourites || {}).some((fav) =>
        fav.toLowerCase().includes(term)
      )
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedUsers = filtered.slice(
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
    <div className="users-container" style={{ padding: "20px" }}>
      <h2 className="section-title" style={{ marginBottom: "20px" }}>
        Users
      </h2>

      {/* Search Bar */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "6px 10px",
            width: "300px",
            background: "#f9f9f9",
          }}
        >
          <span style={{ marginRight: "8px", color: "#666" }}></span>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              width: "100%",
              outline: "none",
              fontSize: "16px",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "transparent",
                color: "#999",
                cursor: "pointer",
                fontSize: "16px",
                marginLeft: "4px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <button
        className="form-button"
        onClick={() => navigate("/users/add")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          background: "#3498db",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        + Add User
      </button>

      <div
        className="table-wrapper"
        style={{
          marginTop: "30px",
          overflowX: "auto",
        }}
      >
        <table
          className="styled-table"
          style={{
            width: "100%",
            minWidth: "1000px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f1f1f1" }}>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Location</th>
              <th>Skills</th>
              <th>Skill Offered</th>
              <th>Skill Requested</th>
              <th>Favourites</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.username}</td>
                <td>{user.email || "-"}</td>
                <td>{user.name || "-"}</td>
                <td>{user.location || "-"}</td>
                <td>{user.skills || "-"}</td>
                <td>{user.skilloffered || "-"}</td>
                <td>{user.skillrequested || "-"}</td>
                <td>{renderFavouritesCell(user)}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleDeleteUser(user.username)}
                    style={{
                      background: "#e74c3c",
                      border: "none",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan="9"
                  className="empty-msg"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {filtered.length > pageSize && (
          <div
            className="pagination-controls"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
            <span style={{ margin: "0 10px" }}>
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

export default UsersTable;
