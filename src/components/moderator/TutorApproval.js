import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";

const TutorApproval = () => {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [tutorCourses, setTutorCourses] = useState([]);

  const [pendingSortField, setPendingSortField] = useState("name");
  const [pendingSortOrder, setPendingSortOrder] = useState("asc");
  const [approvedSortField, setApprovedSortField] = useState("name");
  const [approvedSortOrder, setApprovedSortOrder] = useState("asc");

  const [pendingPage, setPendingPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const pageSize = 5;

  const db = getDatabase();

  useEffect(() => {
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const pending = [];
      const approved = [];

      for (let uid in data) {
        const user = data[uid];
        const entry = { id: uid, ...user };

        if (user.wanttutorrights === true && user.approvedTutor !== true) {
          pending.push(entry);
        }

        if (user.approvedTutor === true) {
          approved.push(entry);
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
  const handleTutorClick = (tutor) => {
    setSelectedTutor(tutor);

    const db = getDatabase();
    const coursesRef = ref(db, "courses");

    onValue(coursesRef, (snapshot) => {
      const allCourses = snapshot.val() || {};
      const tutorCourses = Object.values(allCourses).filter(
        (course) => course.userid === tutor.id
      );
      setTutorCourses(tutorCourses);
    });
  };

  const closePopup = () => {
    setSelectedTutor(null);
    setTutorCourses([]);
  };

  const handleDecline = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: false,
      wanttutorrights: false,
    });
  };

  const handleRevoke = (id) => {
    const userRef = ref(db, `users/${id}`);
    update(userRef, {
      approvedTutor: false,
    });
  };

  const sortList = (list, field, order) => {
    return [...list].sort((a, b) => {
      const aVal = (a[field] || "").toLowerCase();
      const bVal = (b[field] || "").toLowerCase();
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filterSearch = (list) => {
    return list.filter(
      (tutor) =>
        (tutor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutor.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const paginate = (list, page) => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  };

  const sortedPending = sortList(
    filterSearch(pendingTutors),
    pendingSortField,
    pendingSortOrder
  );
  const sortedApproved = sortList(
    filterSearch(approvedTutors),
    approvedSortField,
    approvedSortOrder
  );

  const pendingTotalPages = Math.ceil(sortedPending.length / pageSize);
  const approvedTotalPages = Math.ceil(sortedApproved.length / pageSize);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Search */}
      <div className="col-span-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or username"
          className="border px-4 py-2 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pending Tutors */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Pending Tutor Requests</h2>
        {sortedPending.length === 0 ? (
          <p>No pending tutor requests.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="py-2 px-4 border cursor-pointer"
                    onClick={() => {
                      setPendingSortField("name");
                      setPendingSortOrder((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="py-2 px-4 border cursor-pointer"
                    onClick={() => {
                      setPendingSortField("username");
                      setPendingSortOrder((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Username
                  </th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(sortedPending, pendingPage).map((tutor) => (
                 <tr key={tutor.id} onClick={() => handleTutorClick(tutor)} className="cursor-pointer hover:bg-gray-50">

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

            {/* Pagination */}
            <div className="mt-2 flex justify-between items-center">
              <button
                disabled={pendingPage <= 1}
                onClick={() => setPendingPage(pendingPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {pendingPage} of {pendingTotalPages}
              </span>
              <button
                disabled={pendingPage >= pendingTotalPages}
                onClick={() => setPendingPage(pendingPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Approved Tutors */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Approved Tutors</h2>
        {sortedApproved.length === 0 ? (
          <p>No tutors approved yet.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="py-2 px-4 border cursor-pointer"
                    onClick={() => {
                      setApprovedSortField("name");
                      setApprovedSortOrder((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Name
                  </th>
                  <th
                    className="py-2 px-4 border cursor-pointer"
                    onClick={() => {
                      setApprovedSortField("username");
                      setApprovedSortOrder((prev) =>
                        prev === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Username
                  </th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(sortedApproved, approvedPage).map((tutor) => (
                  <tr key={tutor.id} onClick={() => handleTutorClick(tutor)} className="cursor-pointer hover:bg-gray-50">

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

            {/* Pagination */}
            <div className="mt-2 flex justify-between items-center">
              <button
                disabled={approvedPage <= 1}
                onClick={() => setApprovedPage(approvedPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {approvedPage} of {approvedTotalPages}
              </span>
              <button
                disabled={approvedPage >= approvedTotalPages}
                onClick={() => setApprovedPage(approvedPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
              {selectedTutor && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 p-6 overflow-auto">
                  <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                    <button
                      onClick={closePopup}
                      className="absolute top-3 right-4 text-xl text-black hover:text-red-600"
                    >
                      &times;
                    </button>

                    <h2 className="text-2xl font-semibold mb-4 text-black">
                      Tutor Details
                    </h2>

                    <div className="space-y-3 text-black">
                      <div>
                        <strong>Name:</strong> {selectedTutor.name || "-"}
                      </div>
                      <div>
                        <strong>Username:</strong>{" "}
                        {selectedTutor.username || "-"}
                      </div>
                      <div>
                        <strong>Email:</strong> {selectedTutor.email || "-"}
                      </div>
                      <div>
                        <strong>User ID:</strong>{" "}
                        <span className="break-all">{selectedTutor.id}</span>
                      </div>
                      <div>
                        <strong>Skill Offered:</strong>{" "}
                        {selectedTutor.skilloffered || "N/A"}
                      </div>
                      <div>
                        <strong>Skill Requested:</strong>{" "}
                        {selectedTutor.skillrequested || "N/A"}
                      </div>
                      <div>
                        <strong>Courses:</strong>
                        {tutorCourses.length === 0 ? (
                          <p className="text-sm text-gray-600 mt-1">
                            No courses found.
                          </p>
                        ) : (
                          <ul className="list-disc ml-5 text-sm mt-1 space-y-1">
                            {tutorCourses.map((course, idx) => (
                              <li key={idx}>
                                {course.title || "Untitled Course"}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorApproval;
