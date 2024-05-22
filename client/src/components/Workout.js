import React, { useState, useEffect } from "react";
import axios from "axios";

// Workout component definition
function Workout({ token }) {
  // State to store the workout details
  const [workout, setWorkout] = useState(null);

  // useEffect to fetch the workout details from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setWorkout(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workout:", error);
      });
  }, [token]);

  // Render a loading message if the workout is not yet fetched
  if (!workout) return <div>Loading...</div>;

  // Render the Workout component
  return (
    <div className="workout-container">
      <h1>Workout of the Day</h1>
      <p>{workout.title}</p>
      <p>{workout.description}</p>
      <p>{workout.date}</p>
      <p>{workout.duration} minutes</p>
      <p>{workout.rounds} rounds</p>
    </div>
  );
}

export default Workout;
