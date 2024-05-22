import React, { useState } from "react";
import WorkoutModal from "./WorkoutModal";
import "../styles/dashboard.css";

// WorkoutList component definition
const WorkoutList = ({
  workouts,
  isCoach,
  onDeleteWorkout,
  onUpdateWorkout,
}) => {
  // State to store the selected workout for viewing or editing
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // State to manage the editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Handler to view the details of a selected workout
  const handleViewWorkout = (workout) => {
    setSelectedWorkout(workout);
    setIsEditing(false);
  };

  // Handler to edit a selected workout
  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setIsEditing(true);
  };

  // Handler to close the workout modal
  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  // Render the WorkoutList component
  return (
    <div className="workout-list">
      <h2 className="Headers-dash">Workout List</h2>
      {/* Map through the workouts and render each workout item */}
      {workouts.map((workout) => (
        <div key={workout._id} className="workout-item">
          <div>
            {workout.date} <p className="workout-title">{workout.title}</p>
          </div>

          <div className="buttons">
            {/* Button to view workout details */}
            <button onClick={() => handleViewWorkout(workout)}>View</button>
            {isCoach && (
              <>
                {/* Button to edit workout */}
                <button onClick={() => handleEditWorkout(workout)}>Edit</button>
                {/* Button to delete workout */}
                <button onClick={() => onDeleteWorkout(workout._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {/* Render the WorkoutModal if a workout is selected */}
      {selectedWorkout && (
        <WorkoutModal
          workout={selectedWorkout}
          isEditing={isEditing}
          onClose={handleCloseModal}
          onUpdateWorkout={onUpdateWorkout}
        />
      )}
    </div>
  );
};

export default WorkoutList;
