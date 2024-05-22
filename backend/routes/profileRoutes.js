const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const User = require("../models/User");

// GET /profile - Fetch the profile of the logged-in user
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /profile - Update the profile of the logged-in user
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, birthDate, contactDetails, gender, age } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, birthDate, contactDetails, gender, age },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET /members - Fetch all members (only accessible by admin/coach)
router.get("/members", authMiddleware, async (req, res) => {
  try {
    const members = await User.find({ role: "user" }); // Corrected role
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// PUT /profile/complete-workout - Mark a workout as complete
router.put("/profile/complete-workout", authMiddleware, async (req, res) => {
  const { workoutId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { completedWorkouts: workoutId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark workout as complete" });
  }
});

// GET /user/:id - Fetch the user data including completed workouts
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "completedWorkouts"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

module.exports = router;
