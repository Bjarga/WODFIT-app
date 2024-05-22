const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

router.post("/api/scores", scoreController.createScore);
router.get("/api/scores", scoreController.getScoresByWorkoutTitle);

module.exports = router;
