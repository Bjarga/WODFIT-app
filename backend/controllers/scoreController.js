const Score = require("../models/Score");

// Utility function to convert time string "HH:MM:SS" to seconds
const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Create a score
exports.createScore = async (req, res) => {
  try {
    const { userId, workoutTitle, rounds, time } = req.body;
    const newScore = new Score({ userId, workoutTitle, rounds, time });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: "Error creating score" });
  }
};

// Get scores by workout title
exports.getScoresByWorkoutTitle = async (req, res) => {
  try {
    const { workoutTitle } = req.query;
    const scores = await Score.find({ workoutTitle }).populate(
      "userId",
      "name avatar"
    );

    // Sort scores by rounds (desc) and time (asc)
    scores.sort((a, b) => {
      if (a.rounds !== b.rounds) {
        return b.rounds - a.rounds; // Higher rounds first
      }
      return convertTimeToSeconds(a.time) - convertTimeToSeconds(b.time); // Lower time first
    });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores" });
  }
};
