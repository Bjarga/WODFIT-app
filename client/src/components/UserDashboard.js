import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/userdashboard.css";
import Profile from "./Profile";
import Leaderboard from "./Leaderboard";
import UserWorkoutList from "./UserWorkoutList";
import logo from "../images/WOD_logo.png";
import axios from "axios";

// UserDashboard component definition
function UserDashboard() {
  // State to store the current user's data
  const [user, setUser] = useState(null);

  // State to store the list of workouts
  const [workouts, setWorkouts] = useState([]);

  // State to manage leaderboard refresh
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);

  // useEffect to fetch user data from the API when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in local storage");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // useEffect to fetch workouts from the API when the component mounts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/workouts");
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // Handler to update the user data
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Handler to refresh the leaderboard
  const handleScoreSubmitted = () => {
    setRefreshLeaderboard(!refreshLeaderboard);
  };

  // Render the UserDashboard component
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Left column for workout list */}
      <div className="column left-column">
        <div className="component">
          <h2>Workouts</h2>
          <UserWorkoutList
            workouts={workouts}
            onScoreSubmitted={handleScoreSubmitted}
          />
        </div>
      </div>

      {/* Center column for user profile and gallery link */}
      <div className="column center-column">
        <div className="component">
          <Profile user={user} onUpdateUser={handleUpdateUser} />
        </div>
        <div className="component gallery-link">
          <Link to="/gallery">
            <div className="logo-container">
              <img src={logo} alt="WODFIT Logo" className="logo" />
            </div>
            <div className="gallery-name">
              <span>Gallery</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Right column for leaderboard */}
      <div className="column right-column">
        <div className="component leaderboard">
          <Leaderboard refresh={refreshLeaderboard} />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
