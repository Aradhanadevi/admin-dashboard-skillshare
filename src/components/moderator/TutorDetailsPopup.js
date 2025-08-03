import React, { useState } from "react";

const TutorDetailsPopup = ({ tutor, courses, onClose, onApprove, onDecline }) => {
  const [status, setStatus] = useState(null); // null, "approved", or "declined"

  const handleApproveClick = () => {
    onApprove();
    setStatus("approved");
  };

  const handleDeclineClick = () => {
    onDecline();
    setStatus("declined");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#999",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
          Tutor Details
        </h2>

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={tutor.photourl || "/default-user.png"}
            alt="Tutor Visual"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 10px",
            }}
          />
        </div>

        <p><strong>Name:</strong> {tutor.name || "N/A"}</p>
        <p><strong>Email:</strong> {tutor.email || "N/A"}</p>
        <p><strong>Bio:</strong> {tutor.bio || "N/A"}</p>

        <h3 style={{ marginTop: "15px", fontWeight: "bold" }}>Courses</h3>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul style={{ paddingLeft: "20px" }}>
            {courses.map((course, index) => (
              <li key={index}>{course.title || "Untitled Course"}</li>
            ))}
          </ul>
        )}

        {/* ✅ Conditional buttons or message */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {status === "approved" && (
            <p style={{ color: "green", fontWeight: "bold" }}>✅ Approved</p>
          )}
          {status === "declined" && (
            <p style={{ color: "red", fontWeight: "bold" }}>❌ Declined</p>
          )}

          {status === null && (
            <>
              <button
                onClick={handleApproveClick}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "8px 12px",
                  marginRight: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Approve
              </button>
              <button
                onClick={handleDeclineClick}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsPopup;
