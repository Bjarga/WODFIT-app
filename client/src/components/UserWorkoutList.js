import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/userworkoutlist.css";

// UserWorkoutList component definition
const UserWorkoutList = ({ token, onScoreSubmitted }) => {
  // State to store the list of workouts
  const [workouts, setWorkouts] = useState([]);

  // State to store the selected workout for viewing details
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // State to store the number of rounds completed
  const [rounds, setRounds] = useState("");

  // State to store the time taken to complete the workout
  const [time, setTime] = useState("");

  // State to store the list of completed workouts
  const [completedWorkouts, setCompletedWorkouts] = useState([]);

  // useEffect to fetch workouts and completed workouts from the API when the component mounts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    const fetchCompletedWorkouts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCompletedWorkouts(
          response.data.completedWorkouts.map((workout) => workout._id)
        );
      } catch (error) {
        console.error("Error fetching completed workouts:", error);
      }
    };

    fetchWorkouts();
    fetchCompletedWorkouts();
  }, [token]);

  // Handler to submit the score for a workout
  const handleScoreSubmit = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post("http://localhost:5000/api/scores", {
        userId,
        workoutTitle: selectedWorkout.title,
        rounds,
        time,
      });
      console.log("Score submitted:", response.data);
      alert("Score submitted successfully!");
      setRounds("");
      setTime("");
      setSelectedWorkout(null);
      onScoreSubmitted();
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Failed to submit score.");
    }
  };

  // Handler to view the details of a selected workout
  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
  };

  // Handler to close the workout details modal
  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  // Filter the workouts to exclude the completed ones
  const filteredWorkouts = workouts.filter(
    (workout) => !completedWorkouts.includes(workout._id)
  );

  // Render the UserWorkoutList component
  return (
    <div className="user-workout-list">
      {/* List of available workouts */}
      <ul className="workout-list">
        {filteredWorkouts.map((workout) => (
          <li key={workout._id} className="workout-item">
            <div className="workout-info">
              <p className="workout-date">{workout.date}</p>
              <p className="workout-title">{workout.title}</p>
            </div>
            <div className="workout-actions">
              <button onClick={() => handleViewWorkout(workout)}>View</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal to display workout details and submit score */}
      {selectedWorkout && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{selectedWorkout.title}</h2>
            <p>{selectedWorkout.workout}</p>
            <div className="score-input">
              <label>
                Rounds:
                <input
                  type="number"
                  value={rounds}
                  onChange={(e) => setRounds(e.target.value)}
                />
              </label>
              <label>
                Time:
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="HH:MM:SS"
                />
              </label>
              <button onClick={handleScoreSubmit}>Submit Score</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWorkoutList;
