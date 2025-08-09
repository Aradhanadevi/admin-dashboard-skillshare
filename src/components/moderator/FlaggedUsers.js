import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase"; // Adjust if path differs
import "./FlaggedUsers.css"; // Create this CSS file if needed

const FlaggedUsers = () => {
  const [flaggedUsers, setFlaggedUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, "users");

    onValue(usersRef, (snapshot) => {
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.isFlagged) {
          users.push({
            id: childSnapshot.key,
            name: user.name || "N/A",
            email: user.email || "N/A",
            reason: user.flagReason || "Not specified",
          });
        }
      });

      setFlaggedUsers(users);
    });
  }, []);

  return (
    <div className="flagged-users">
      <h2>Flagged Users</h2>

      {flaggedUsers.length === 0 ? (
        <p>No flagged users found.</p>
      ) : (
        <div className="flagged-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {flaggedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FlaggedUsers;
