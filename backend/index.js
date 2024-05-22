const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
const Photo = require("./models/Photo");
const Workout = require("./models/Workout");
const authenticateToken = require("./middleware/authMiddleware");
const multer = require("multer");
const session = require("express-session");
const passport = require("./config/passport");
const passportRoutes = require("./routes/passportRoutes");
const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const profileRoutes = require("./routes/profileRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration
const allowedOrigins = [
  "https://wodfit-app-b8lo.vercel.app",
  "https://wodfit-app-b8lo-git-main-bjargas-projects.vercel.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/", passportRoutes);
app.use("/auth", authRoutes);
app.use("/photos", photoRoutes);
app.use("/profile", profileRoutes);
app.use(workoutRoutes);
app.use(scoreRoutes);

app.post("/register", async (req, res) => {
  const {
    email,
    password,
    name,
    birthDate,
    contactDetails,
    gender,
    age,
    role,
    groupName,
  } = req.body;
  try {
    const user = new User({
      email,
      password,
      name,
      birthDate,
      contactDetails,
      gender,
      age,
      role,
      profilePicture: "",
      groupName: role === "coach" ? groupName : null,
    });
    await user.save();
    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
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
      { expiresIn: "1h" }
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
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  "/upload",
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { caption } = req.body;
      const photo = new Photo({
        url: `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        caption,
      });
      await photo.save();
      res.status(201).json(photo);
    } catch (error) {
      console.error("Upload error:", error.message);
      res.status(500).send(error.message);
    }
  }
);

app.get("/photos", authenticateToken, async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    console.error("Get photos error:", error.message);
    res.status(500).send(error.message);
  }
});

app.delete("/photos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Photo.findByIdAndDelete(id);
    res.status(200).send("Photo deleted");
  } catch (error) {
    console.error("Delete photo error:", error.message);
    res.status(500).send(error.message);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/user/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = {
      name: req.body.name,
      birthDate: req.body.birthDate,
      contactDetails: req.body.contactDetails,
      gender: req.body.gender,
    };
    if (req.file) {
      updates.profilePicture = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = app;
