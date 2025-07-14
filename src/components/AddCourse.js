import React, { useState } from "react";
import { database } from "../firebase";
import { ref, set } from "firebase/database";
import Papa from "papaparse";
import { FaCloudUploadAlt, FaSave } from "react-icons/fa";

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
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.courseName) {
      alert("Course Name is required.");
      return;
    }

    const courseId = formData.courseName;
    const courseRef = ref(database, `courses/${courseId}`);

    const payload = {
      ...formData,
      noofvideos: Number(formData.noofvideos),
      price: Number(formData.price),
    };

    set(courseRef, payload)
      .then(() => {
        alert("Course added successfully!");
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to add course.");
      });
  };

  const resetForm = () => {
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
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file!");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;

      if (selectedFile.name.endsWith(".json")) {
        try {
          const jsonData = JSON.parse(content);
          saveCoursesToFirebase(Array.isArray(jsonData) ? jsonData : Object.values(jsonData));
        } catch (error) {
          console.error(error);
          alert("Invalid JSON file.");
          setUploading(false);
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
        setUploading(false);
      }
    };

    reader.readAsText(selectedFile);
  };

  const saveCoursesToFirebase = (coursesArray) => {
    let savedCount = 0;

    coursesArray.forEach((course) => {
      if (!course.courseName) return;

      const courseId = course.courseName;
      const courseRef = ref(database, `courses/${courseId}`);

      const payload = {
        ...course,
        noofvideos: Number(course.noofvideos || 0),
        price: Number(course.price || 0),
      };

      set(courseRef, payload)
        .then(() => {
          console.log(`Saved course: ${course.courseName}`);
          savedCount++;
        })
        .catch((error) => console.error(error));
    });

    alert(`Upload complete! Saved ${savedCount} courses.`);
    setUploading(false);
    setSelectedFile(null);
  };

  return (
    <div className="add-course-card">
      {/* Upload Section */}
      <div className="upload-box">
        <label htmlFor="fileUpload" className="upload-title">
          Import Courses (.json or .csv)
        </label>
        <div className="upload-actions">
          <input
            type="file"
            accept=".json,.csv"
            id="fileUpload"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            <FaCloudUploadAlt className="btn-icon" />
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

     <form className="form-container" onSubmit={handleSubmit}>
  <div className="form-group">
    <label htmlFor="courseName">Course Name *</label>
    <input
      id="courseName"
      className="form-input"
      type="text"
      name="courseName"
      placeholder="Enter course name"
      value={formData.courseName}
      onChange={handleChange}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="Category">Category</label>
    <input
      id="Category"
      className="form-input"
      type="text"
      name="Category"
      placeholder="Enter course category"
      value={formData.Category}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="Description">Description</label>
    <textarea
      id="Description"
      className="form-input"
      name="Description"
      placeholder="Enter course description"
      value={formData.Description}
      onChange={handleChange}
    ></textarea>
  </div>

  <div className="form-group">
    <label htmlFor="Tutor">Tutor</label>
    <input
      id="Tutor"
      className="form-input"
      type="text"
      name="Tutor"
      placeholder="Enter tutor name"
      value={formData.Tutor}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="language">Language</label>
    <input
      id="language"
      className="form-input"
      type="text"
      name="language"
      placeholder="Enter language"
      value={formData.language}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="location">Location</label>
    <input
      id="location"
      className="form-input"
      type="text"
      name="location"
      placeholder="Enter course location"
      value={formData.location}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="noofvideos">Number of Videos</label>
    <input
      id="noofvideos"
      className="form-input"
      type="number"
      name="noofvideos"
      placeholder="Enter number of videos"
      value={formData.noofvideos}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="playlistlink">Playlist URL</label>
    <input
      id="playlistlink"
      className="form-input"
      type="text"
      name="playlistlink"
      placeholder="Enter playlist URL"
      value={formData.playlistlink}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="price">Price</label>
    <input
      id="price"
      className="form-input"
      type="number"
      name="price"
      placeholder="Enter course price"
      value={formData.price}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="skils">Skills</label>
    <input
      id="skils"
      className="form-input"
      type="text"
      name="skils"
      placeholder="Enter skills"
      value={formData.skils}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label htmlFor="imageUrl">Image URL</label>
    <input
      id="imageUrl"
      className="form-input"
      type="text"
      name="imageUrl"
      placeholder="Enter image URL"
      value={formData.imageUrl}
      onChange={handleChange}
    />
  </div>

  <button className="form-button" type="submit">
    Add Course
  </button>
</form>

    </div>
  );
};

export default AddCourse;
