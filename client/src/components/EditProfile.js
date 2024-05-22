import React, { useState } from "react";
import axios from "axios";
import "../styles/editProfile.css";

// EditProfile component definition
function EditProfile({ user, onClose, onUpdate }) {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: user.name || "",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
    contactDetails: user.contactDetails || "",
    gender: user.gender || "",
    profilePicture: user.profilePicture || "",
  });

  // Handler for input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handler for file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profilePicture: file }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Update parent component with new data
      onUpdate(response.data);
      // Close the modal window
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Render the EditProfile component
  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-content">
        {/* Close button for the modal */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {/* Form for editing profile */}
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Edit Profile</h2>
          {/* Input for name */}
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          {/* Input for birth date */}
          <input
            className="form-input"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="Birth Date"
          />
          {/* Input for contact details */}
          <input
            className="form-input"
            type="text"
            name="contactDetails"
            value={formData.contactDetails}
            onChange={handleChange}
            placeholder="Contact Details"
            required
          />
          {/* Input for profile picture */}
          <input
            className="form-input"
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            accept="image/*"
          />
          {/* Submit button for saving changes */}
          <button className="form-submit" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
