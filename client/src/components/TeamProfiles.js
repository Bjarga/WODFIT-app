import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

// TeamProfiles component definition
const TeamProfiles = ({ token }) => {
  // State to store the list of users
  const [users, setUsers] = useState([]);

  // State to store the selected user for viewing profile details
  const [selectedUser, setSelectedUser] = useState(null);

  // useEffect to fetch team members from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/profile/members", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [token]);

  // Handler to view the profile of a selected user
  const handleViewProfile = (user) => {
    setSelectedUser(user);
  };

  // Handler to close the profile modal
  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  // Function to format the birth date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render the TeamProfiles component
  return (
    <div className="team-profiles">
      <h2>Team Profiles</h2>

      {/* List of team members */}
      <ul className="team-list">
        {users.map((user) => (
          <li key={user._id} className="team-item">
            <div className="member-info">
              <div className="member-avatar">
                <img
                  src={user.profilePicture || "default-profile.png"}
                  alt="Profile"
                  className="avatar-image"
                />
              </div>
              <span className="member-name">{user.name}</span>
              <button
                className="view-button"
                onClick={() => handleViewProfile(user)}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Profile modal for selected user */}
      {selectedUser && (
        <div className="profile-modal">
          <div className="profile-content">
            <button className="close-button" onClick={handleCloseProfile}>
              &times;
            </button>
            <div className="profile-details">
              <img
                src={selectedUser.profilePicture || "default-profile.png"}
                alt="Profile"
                className="profile-image"
              />
              <h2>{selectedUser.name}'s Profile</h2>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Birth Date:</strong>{" "}
                {formatDate(selectedUser.birthDate)}
              </p>
              <p>
                <strong>Contact Details:</strong> {selectedUser.contactDetails}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProfiles;
