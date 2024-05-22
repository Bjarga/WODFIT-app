const express = require("express");
const multer = require("multer");
const Photo = require("../models/Photo");
const authenticateToken = require("../middleware/authmiddleware");

const router = express.Router();

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload a photo
router.post(
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
      res.status(500).send(error.message);
    }
  }
);

// Get all photos
router.get("/photos", authenticateToken, async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a photo
router.delete("/photos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Photo.findByIdAndDelete(id);
    res.status(200).send("Photo deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
