import React, { useState, useEffect } from "react";
import "../styles/workoutmodal.css";

// WorkoutModal component definition
const WorkoutModal = ({ workout, isEditing, onClose, onUpdateWorkout }) => {
  // State to store the workout title
  const [title, setTitle] = useState(workout.title);

  // State to store the workout date
  const [date, setDate] = useState(workout.date);

  // State to store the workout details
  const [workoutDetails, setWorkoutDetails] = useState(workout.workout);

  // useEffect to update the state when the workout prop changes
  useEffect(() => {
    setTitle(workout.title);
    setDate(workout.date);
    setWorkoutDetails(workout.workout);
  }, [workout]);

  // Handler to save the updated workout details
  const handleSave = async () => {
    const updatedWorkout = {
      ...workout,
      title,
      date,
      workout: workoutDetails,
    };

    try {
      await onUpdateWorkout(updatedWorkout);
      onClose();
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  // Render the WorkoutModal component
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{isEditing ? "Edit Workout" : "View Workout"}</h2>
        <div>
          <label>Title:</label>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <p>{title}</p>
          )}
        </div>
        <div>
          <label>Date:</label>
          {isEditing ? (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          ) : (
            <p>{date}</p>
          )}
        </div>
        <div>
          <label>Workout:</label>
          {isEditing ? (
            <textarea
              value={workoutDetails}
              onChange={(e) => setWorkoutDetails(e.target.value)}
            ></textarea>
          ) : (
            <p>{workoutDetails}</p>
          )}
        </div>
        {/* Show save button only in editing mode */}
        {isEditing && <button onClick={handleSave}>Save</button>}
      </div>
    </div>
  );
};

export default WorkoutModal;
