import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import Leaderboard from "./Leaderboard";
import TeamProfiles from "./TeamProfiles";
import CreateWorkout from "./CreateWorkout";
import WorkoutList from "./WorkoutList";
import logo from "../images/WOD_logo.png";
import axios from "axios";

// CoachDashboard component definition
function CoachDashboard() {
  // State to store the authentication token
  const [token] = useState(localStorage.getItem("token"));

  // State to store the list of workouts
  const [workouts, setWorkouts] = useState([]);

  // State to manage leaderboard refresh
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);

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

  // Handler for creating a new workout
  const handleWorkoutCreated = (newWorkout) => {
    setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    setRefreshLeaderboard(!refreshLeaderboard);
  };

  // Handler for deleting a workout
  const handleDeleteWorkout = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout._id !== id)
      );
      setRefreshLeaderboard(!refreshLeaderboard);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  // Handler for updating a workout
  const handleUpdateWorkout = async (updatedWorkout) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/workouts/${updatedWorkout._id}`,
        updatedWorkout
      );
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) =>
          workout._id === updatedWorkout._id ? response.data : workout
        )
      );
      setRefreshLeaderboard(!refreshLeaderboard);
    } catch (error) {
      console.error("Error updating workout:", error);
    }
  };

  // Render the CoachDashboard component
  return (
    <div className="dashboard-container">
      {/* Column for team profiles */}
      <div className="column">
        <div className="component">
          <TeamProfiles token={token} />
        </div>
      </div>

      {/* Column for creating workouts and gallery link */}
      <div className="column">
        <div className="component create-workout">
          <CreateWorkout onWorkoutCreated={handleWorkoutCreated} />
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

      {/* Column for the workout list */}
      <div className="column">
        <div className="component workout-list">
          <WorkoutList
            workouts={workouts}
            isCoach={true}
            onDeleteWorkout={handleDeleteWorkout}
            onUpdateWorkout={handleUpdateWorkout}
          />
        </div>
      </div>

      {/* Column for the leaderboard */}
      <div className="column">
        <div className="component leaderboard">
          <Leaderboard refresh={refreshLeaderboard} />
        </div>
      </div>
    </div>
  );
}

export default CoachDashboard;
