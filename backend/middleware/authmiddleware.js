const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const SECRET = process.env.SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = authenticateToken;
