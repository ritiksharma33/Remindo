const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  linkMemory
} = require("../controllers/mission.controller");

// Get all missions
router.get("/", auth, getMissions);

// Get one mission
router.get("/:id", auth, getMissionById);

// Create mission
router.post("/", auth, createMission);

// Update mission
router.put("/:id", auth, updateMission);

// Delete mission
router.delete("/:id", auth, deleteMission);

// Link memory to mission
router.post("/:id/link-memory", auth, linkMemory);

module.exports = router;