import React, { useState } from "react";
import "../styles/profile.css";
import EditProfile from "./EditProfile";

// Profile component definition
function Profile({ user, onUpdateUser }) {
  // State to manage the editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Handler to enable editing mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handler to close the edit modal
  const handleCloseModal = () => {
    setIsEditing(false);
  };

  // Handler to update the profile with new user data
  const handleUpdateProfile = (updatedUser) => {
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  // Function to format the birth date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render the Profile component
  return (
    <div className="profile-container">
      {/* Profile header section */}
      <div className="profile-header">
        <h2>{user.name}</h2>
      </div>

      {/* Profile content section */}
      <div className="profile-content">
        {/* Left side with profile picture */}
        <div className="profile-left">
          <div className="profile-picture">
            <img
              src={user.profilePicture || "default-profile.png"}
              alt="Profile"
            />
          </div>
        </div>

        {/* Right side with profile details */}
        <div className="profile-right">
          <div className="profile-details">
            <p>
              <strong>Birth Date:</strong>
              <br /> {formatDate(user.birthDate)}
            </p>
            <p>
              <strong>Contact Details:</strong> {user.contactDetails}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>

          {/* Edit profile button */}
          <div className="profile-actions">
            <button className="edit-profile" onClick={handleEditClick}>
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      {isEditing && (
        <EditProfile
          user={user}
          onClose={handleCloseModal}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
}

export default Profile;
