// // src/pages/LoginPage.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ref, get } from "firebase/database";
// import { database } from "../firebase";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const snapshot = await get(ref(database, "users"));
//       if (snapshot.exists()) {
//         const users = snapshot.val();
//         const userEntry = Object.values(users).find(
//           (user) => user.email === email && user.password === password
//         );

//         if (userEntry) {
//           localStorage.setItem(
//             "auth",
//             JSON.stringify({ email: userEntry.email, role: userEntry.isAdmin ? "admin" : "user" })
//           );

//           alert("Login successful");
//           navigate("/dashboard"); // navigate directly to dashboard
//         } else {
//           alert("Invalid email or password");
//         }
//       } else {
//         alert("No users found in database");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "15px",
//           width: "300px",
//           padding: "20px",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//         }}
//       >
//         <h2>Admin Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logged-in moderator or admin user
    localStorage.setItem(
      "auth",
      JSON.stringify({ email: "mod@example.com", role: "moderator" }) // or "admin"
    );
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Bypassing Login...</h2>
    </div>
  );
};

export default LoginPage;
