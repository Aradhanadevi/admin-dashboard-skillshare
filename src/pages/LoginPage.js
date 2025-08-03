import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const snapshot = await get(ref(database, "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();

        const user = Object.values(users).find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          let role = "user";
          if (user.isAdmin) role = "admin";
          else if (user.isModerator) role = "moderator";

          localStorage.setItem("auth", JSON.stringify({ email, role }));

          alert("Login successful");

          if (role === "admin") navigate("/dashboard");
          else if (role === "moderator") navigate("/moderator");
          else navigate("/dashboard");
        } else {
          alert("Invalid email or password");
        }
      } else {
        alert("No users found.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Admin / Moderator Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <label style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span style={styles.checkboxLabel}>Show Password</span>
        </label>

        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    minWidth: "320px",
  },
  heading: {
    marginBottom: "20px",
    fontWeight: "600",
    fontSize: "1.5rem",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "5px",
    marginBottom: "15px",
  },
  checkboxLabel: {
    marginLeft: "8px",
    fontSize: "0.9rem",
    color: "#555",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default LoginPage;
