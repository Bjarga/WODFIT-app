const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutTitle: { type: String, required: true },
  rounds: { type: Number, required: true },
  time: { type: String, required: true },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
