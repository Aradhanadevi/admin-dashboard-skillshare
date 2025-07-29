import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";

const TutorApproval = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const pending = [];
      const approved = [];

      for (let uid in data) {
        const user = data[uid];

        if (user.wanttutorrights === true && user.approvedTutor !== true) {
          pending.push({ id: uid, ...user });
        }

        if (user.approvedTutor === true) {
          approved.push({ id: uid, ...user });
        }
      }

      setPendingTutors(pending);
      setApprovedTutors(approved);
    });
  }, []);

  const handleApprove = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: true,
      wanttutorrights: false,
    });
  };

  const handleDecline = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      wanttutorrights: false,
    });
  };

  const handleRevoke = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: false,
    });
  };

  const filterTutors = (list) =>
    list.filter(
      (tutor) =>
        (tutor.name && tutor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tutor.username && tutor.username.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by name or username..."
        className="mb-4 p-2 border w-full md:w-1/2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Tutors Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Pending Tutor Requests</h2>
          {filterTutors(pendingTutors).length === 0 ? (
            <p>No pending tutor requests.</p>
          ) : (
            <table className="min-w-full bg-white border shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Username</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterTutors(pendingTutors).map((tutor) => (
                  <tr key={tutor.id}>
                    <td className="py-2 px-4 border">{tutor.name || "-"}</td>
                    <td className="py-2 px-4 border">{tutor.username}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button
                        onClick={() => handleApprove(tutor.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(tutor.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Approved Tutors Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Approved Tutors</h2>
          {filterTutors(approvedTutors).length === 0 ? (
            <p>No tutors approved yet.</p>
          ) : (
            <table className="min-w-full bg-white border shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Username</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterTutors(approvedTutors).map((tutor) => (
                  <tr key={tutor.id}>
                    <td className="py-2 px-4 border">{tutor.name || "-"}</td>
                    <td className="py-2 px-4 border">{tutor.username}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleRevoke(tutor.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorApproval;
