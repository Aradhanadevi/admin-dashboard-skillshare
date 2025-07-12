import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";
import UsersCharts from "./UsersCharts";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    name: "",
    email: "",
    location: "",
    skills: "",
  });

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${id}`);
    remove(userRef)
      .then(() => alert("User deleted!"))
      .catch((err) => console.error(err));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const saveUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${editingUser.id}`);
    set(userRef, editingUser)
      .then(() => {
        alert("User updated!");
        setEditingUser(null);
      })
      .catch((err) => console.error(err));
  };

  const addNewUser = () => {
    const db = getDatabase();
    const userRef = ref(db, `users/${newUser.username}`);
    set(userRef, newUser)
      .then(() => {
        alert("User added!");
        setNewUser({
          username: "",
          name: "",
          email: "",
          location: "",
          skills: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>All Users</h2>

      {/* Charts */}
      {users.length > 0 && <UsersCharts users={users} />}

      {/* Add New User */}
      <h3>Add New User</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNewUser();
        }}
        style={{ marginBottom: "30px" }}
      >
        <input
          type="text"
          value={newUser.username}
          onChange={(e) =>
            setNewUser({ ...newUser, username: e.target.value })
          }
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={newUser.location}
          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
          placeholder="Location"
          required
        />
        <input
          type="text"
          value={newUser.skills}
          onChange={(e) => setNewUser({ ...newUser, skills: e.target.value })}
          placeholder="Skills"
          required
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Add User
        </button>
      </form>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search users by username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "300px" }}
      />

      {/* Users Table */}
      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Skills</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.location}</td>
              <td>{user.skills}</td>
              <td>
                <button
                  onClick={() => handleEdit(user)}
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
                  onClick={() => handleDelete(user.id)}
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

      {/* Edit User Form */}
      {editingUser && (
        <div style={{ marginTop: "30px" }}>
          <h3>Edit User: {editingUser.username}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveUser();
            }}
          >
            <input
              type="text"
              value={editingUser.username}
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
              placeholder="Username"
              required
            />
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              placeholder="Email"
              required
            />
            <input
              type="text"
              value={editingUser.location}
              onChange={(e) =>
                setEditingUser({ ...editingUser, location: e.target.value })
              }
              placeholder="Location"
              required
            />
            <input
              type="text"
              value={editingUser.skills}
              onChange={(e) =>
                setEditingUser({ ...editingUser, skills: e.target.value })
              }
              placeholder="Skills"
              required
            />
            <div style={{ marginTop: "10px" }}>
              <button type="submit" style={{ padding: "5px 15px" }}>
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={{ padding: "5px 15px", marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
