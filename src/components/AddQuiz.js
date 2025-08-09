import React, { useEffect, useState } from "react";
import { ref, get, set } from "firebase/database";
import { database } from "../firebase";
import { FiEdit, FiPlusCircle } from "react-icons/fi";

const AddQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const coursesRef = ref(database, "courses");
    get(coursesRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCourses(Object.keys(snapshot.val()));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !question || !optionA || !optionB || !optionC || !optionD || !answer) {
      alert("Please fill all fields");
      return;
    }

    try {
      const quizListRef = ref(database, `courses/${selectedCourse}/quiz`);
      const snapshot = await get(quizListRef);
      const existingQuiz = snapshot.exists() ? snapshot.val() : {};
      const questionNumber = Object.keys(existingQuiz).length + 1;
      const questionId = `q${questionNumber}`;

      const quizRef = ref(database, `courses/${selectedCourse}/quiz/${questionId}`);
      await set(quizRef, {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        answer,
      });

      alert("Quiz added successfully!");

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setAnswer("");
    } catch (error) {
      console.error("Error adding quiz:", error);
      alert("Failed to add quiz. Please try again.");
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiEdit /> Add Quiz to Course
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            required
            
            style={{
              width: "100%",
              padding: "0rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
               resize: "none"
            }}
          />
        </div>

        {[
          ["A", optionA, setOptionA],
          ["B", optionB, setOptionB],
          ["C", optionC, setOptionC],
          ["D", optionD, setOptionD],
        ].map(([label, value, setter]) => (
          <div key={label}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Option {label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setter(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
            />
          </div>
        ))}

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "500" }}>Correct Answer</label>
          <select
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">-- Select Answer --</option>
            <option value="optionA">Option A</option>
            <option value="optionB">Option B</option>
            <option value="optionC">Option C</option>
            <option value="optionD">Option D</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FiPlusCircle /> Add Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;
