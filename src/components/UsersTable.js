import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    location: "",
    skills: "",
    skilloffered: "",
    skillrequested: "",
    favourites: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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

  const filtered = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      alert("Username and email are required.");
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${formData.username}`);

    let favouritesObj = {};
    if (formData.favourites) {
      const favs = formData.favourites.split(",").map((f) => f.trim());
      favouritesObj = favs.reduce((acc, fav) => {
        if (fav) acc[fav] = true;
        return acc;
      }, {});
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      name: formData.name,
      password: formData.password,
      location: formData.location,
      skills: formData.skills,
      skilloffered: formData.skilloffered,
      skillrequested: formData.skillrequested,
      favourites: favouritesObj,
    };

    set(userRef, payload)
      .then(() => {
        alert("User saved successfully!");
        setFormData({
          username: "",
          email: "",
          name: "",
          password: "",
          location: "",
          skills: "",
          skilloffered: "",
          skillrequested: "",
          favourites: "",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving user.");
      });
  };

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
    <div className="users-container">
      <h2 className="section-title">Users</h2>

      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="skilloffered"
          placeholder="Skill Offered"
          value={formData.skilloffered}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="skillrequested"
          placeholder="Skill Requested"
          value={formData.skillrequested}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="text"
          name="favourites"
          placeholder="Favourites (comma separated)"
          value={formData.favourites}
          onChange={handleChange}
        />
        <button className="form-button" type="submit">
          Add User
        </button>
      </form>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
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
                {/* <td>
                  {user.favourites
                    ? Object.keys(user.favourites).join(", ")
                    : "-"}
                </td> */}
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleDeleteUser(user.username)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 && (
              <tr>
                <td colSpan="9" className="empty-msg">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {filtered.length > pageSize && (
          <div className="pagination-controls">
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
            <span>
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
