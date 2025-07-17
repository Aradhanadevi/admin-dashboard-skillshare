import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const AddUserForm = () => {
  const navigate = useNavigate();

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
        navigate("/users");
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving user.");
      });
  };

  return (
    <div className="users-container">
      <h2 className="section-title">Add New User</h2>

      <button
        className="form-button"
        style={{ marginBottom: "16px" }}
        onClick={() => navigate("/users")}
      >
        ← Back to Users
      </button>

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
          Save User
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
