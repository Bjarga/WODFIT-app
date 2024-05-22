const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCoaches,
} = require("../controllers/authcontroller");

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get all coaches
router.get("/coaches", getCoaches);

module.exports = router;
