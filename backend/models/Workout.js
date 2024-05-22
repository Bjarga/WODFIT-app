const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  workout: { type: String, required: true },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
