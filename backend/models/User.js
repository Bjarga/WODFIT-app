const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  contactDetails: { type: String, required: true },
  role: { type: String, required: true, enum: ["coach", "user"] },
  profilePicture: String,
  groupName: { type: String },
  completedWorkouts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
