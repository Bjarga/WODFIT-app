const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const {
    email,
    password,
    name,
    birthDate,
    contactDetails,
    role, // User selects role: "coach" or "user"
    groupName, // Optional field to associate with a coach's group
  } = req.body;
  try {
    const user = new User({
      email,
      password, // Plain text password, will be hashed by the pre-save hook
      name,
      birthDate,
      contactDetails,
      role,
      profilePicture: "",
      groupName: role === "coach" ? groupName : groupName || null, // Set groupName if role is coach or user joining a group
    });
    await user.save();

    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password.");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        groupName: user.groupName,
      },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
      groupName: user.groupName,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send(error.message);
  }
};

const getCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" });
    res.json(coaches);
  } catch (error) {
    console.error("Error fetching coaches:", error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCoaches,
};
