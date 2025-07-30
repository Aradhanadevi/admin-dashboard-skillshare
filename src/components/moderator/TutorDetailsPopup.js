import React from "react";

const TutorDetailsPopup = ({ tutor, courses, onClose }) => {
  if (!tutor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-full max-w-xl mx-4 rounded-md shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tutor Details</h2>
        
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {tutor.name}</p>
          <p><span className="font-semibold">Email:</span> {tutor.email}</p>
          <p><span className="font-semibold">Bio:</span> {tutor.bio || "N/A"}</p>
        </div>

        <h3 className="text-lg font-medium mt-6 mb-2 border-b pb-1">Courses by {tutor.name}</h3>
        {courses.length > 0 ? (
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {courses.map((course, index) => (
              <li key={index}>{course.title || "Untitled Course"}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default TutorDetailsPopup;
