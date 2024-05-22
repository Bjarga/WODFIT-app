const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

router.post("/api/workouts", workoutController.createWorkout);
router.get("/api/workouts", workoutController.getWorkoutsByDate);
router.put("/api/workouts/:id", workoutController.updateWorkout);
router.get("/api/workouts/titles", workoutController.getWorkoutTitles);
router.delete("/api/workouts/:id", workoutController.deleteWorkout);

module.exports = router;
