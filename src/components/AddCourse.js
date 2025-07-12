import React, { useState } from "react";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import Papa from "papaparse";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    Category: "",
    Description: "",
    Tutor: "",
    language: "",
    location: "",
    noofvideos: 0,
    playlistlink: "",
    price: 0,
    skils: "",
    imageUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // 🔶 Handle manual form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔶 Handle manual single-course submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const courseId = formData.courseName;
    const courseRef = ref(database, `courses/${courseId}`);

    set(courseRef, {
      ...formData,
      noofvideos: Number(formData.noofvideos),
      price: Number(formData.price),
    })
      .then(() => {
        alert("Course added successfully!");
        setFormData({
          courseName: "",
          Category: "",
          Description: "",
          Tutor: "",
          language: "",
          location: "",
          noofvideos: 0,
          playlistlink: "",
          price: 0,
          skils: "",
          imageUrl: "",
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to add course");
      });
  };

  // 🔶 Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 🔶 Upload file contents to Firebase
  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;

      if (selectedFile.name.endsWith(".json")) {
        try {
          const jsonData = JSON.parse(content);
          saveCoursesToFirebase(jsonData);
        } catch (err) {
          alert("Invalid JSON file!");
        }
      } else if (selectedFile.name.endsWith(".csv")) {
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            saveCoursesToFirebase(results.data);
          },
        });
      } else {
        alert("Unsupported file type!");
      }
    };

    reader.readAsText(selectedFile);
  };

  // 🔶 Save multiple courses to Firebase
  const saveCoursesToFirebase = (coursesArray) => {
    coursesArray.forEach((course) => {
      if (!course.courseName) return; // skip empty rows

      const courseId = course.courseName;
      const courseRef = ref(database, `courses/${courseId}`);

      const payload = {
        ...course,
        noofvideos: Number(course.noofvideos),
        price: Number(course.price),
      };

      set(courseRef, payload)
        .then(() => console.log(`Saved course: ${course.courseName}`))
        .catch((err) => console.error(err));
    });

    alert("All courses uploaded!");
    setSelectedFile(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Course</h2>

      {/* 🔶 FILE UPLOAD SECTION */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload" style={{ marginRight: "10px" }}>
          Import Courses (JSON or CSV):
        </label>
        <input
          type="file"
          accept=".json,.csv"
          id="fileUpload"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleUpload}
          style={{
            marginLeft: "10px",
            padding: "5px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
          }}
        >
          Upload File
        </button>
      </div>

      {/* 🔶 MANUAL SINGLE COURSE FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Category"
          placeholder="Category"
          value={formData.Category}
          onChange={handleChange}
        />
        <textarea
          name="Description"
          placeholder="Description"
          value={formData.Description}
          onChange={handleChange}
        ></textarea>
        <input
          type="text"
          name="Tutor"
          placeholder="Tutor"
          value={formData.Tutor}
          onChange={handleChange}
        />
        <input
          type="text"
          name="language"
          placeholder="Language"
          value={formData.language}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="noofvideos"
          placeholder="No. of Videos"
          value={formData.noofvideos}
          onChange={handleChange}
        />
        <input
          type="text"
          name="playlistlink"
          placeholder="Playlist Link"
          value={formData.playlistlink}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="skils"
          placeholder="Skills"
          value={formData.skils}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
          }}
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
