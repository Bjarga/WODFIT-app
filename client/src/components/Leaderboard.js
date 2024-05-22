import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

// Leaderboard component definition
const Leaderboard = ({ refresh }) => {
  // State to store the selected workout title
  const [workoutTitle, setWorkoutTitle] = useState("");

  // State to store the list of workout titles
  const [workoutTitles, setWorkoutTitles] = useState([]);

  // State to store the scores
  const [scores, setScores] = useState([]);

  // API URL from environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  // useEffect to fetch workout titles from the API when the component mounts
  useEffect(() => {
    const fetchWorkoutTitles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/workouts/titles`);
        setWorkoutTitles(response.data);
      } catch (error) {
        console.error("Error fetching workout titles:", error);
      }
    };

    fetchWorkoutTitles();
  }, [apiUrl]);

  // useEffect to fetch scores from the API when the workout title or refresh changes
  useEffect(() => {
    const fetchScores = async () => {
      if (!workoutTitle) return;
      try {
        const response = await axios.get(`${apiUrl}/scores`, {
          params: { workoutTitle },
        });
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, [workoutTitle, refresh, apiUrl]);

  // Render the Leaderboard component
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {/* Dropdown to select workout title */}
      <div className="leaderboard-filters">
        <select
          value={workoutTitle}
          onChange={(e) => setWorkoutTitle(e.target.value)}
        >
          <option value="" disabled>
            Select Workout
          </option>
          {workoutTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>
      {/* List of scores */}
      <ul className="leaderboard-list">
        {scores.map((score) => (
          <li key={score._id} className="leaderboard-item">
            <span>{score.userId.name}</span>
            <span>{score.rounds} rounds</span>
            <span>{score.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
