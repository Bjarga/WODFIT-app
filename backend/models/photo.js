const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
});

// Check if the model is already compiled
const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);

module.exports = Photo;
