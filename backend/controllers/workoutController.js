const Workout = require("../models/Workout");

exports.createWorkout = async (req, res) => {
  try {
    const { title, date, workout } = req.body;
    const newWorkout = new Workout({ title, date, workout });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ message: "Error creating workout" });
  }
};

exports.getWorkoutsByDate = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts" });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Error updating workout" });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.status(200).json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting workout" });
  }
};

exports.getWorkoutTitles = async (req, res) => {
  try {
    const titles = await Workout.distinct("title");
    res.status(200).json(titles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workout titles" });
  }
};
