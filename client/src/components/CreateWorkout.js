import React, { useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

// CreateWorkout component definition
const CreateWorkout = ({ onWorkoutCreated }) => {
  // State to store the workout title
  const [title, setTitle] = useState("");

  // State to store the workout date
  const [date, setDate] = useState("");

  // State to store the workout details
  const [workout, setWorkout] = useState("");

  // Handler to create a new workout
  const handleCreateWorkout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/workouts", {
        title,
        date,
        workout,
      });
      // Reset form fields after successful creation
      setTitle("");
      setDate("");
      setWorkout("");
      // Notify parent component about the new workout
      onWorkoutCreated(response.data);
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  // Render the CreateWorkout component
  return (
    <div className="create-workout">
      <h2>Create a Workout</h2>
      {/* Input for workout title */}
      <input
        type="text"
        placeholder="Workout Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Input for workout date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {/* Textarea for workout details */}
      <textarea
        placeholder="Workout"
        value={workout}
        onChange={(e) => setWorkout(e.target.value)}
      />
      {/* Button to post the workout */}
      <button onClick={handleCreateWorkout}>Post</button>
    </div>
  );
};

export default CreateWorkout;
