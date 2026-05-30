const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory,
  searchMemories
} = require("../controllers/memory.controller");

// Get all memories
router.get("/", getMemories);

// Search memories
router.get("/search", searchMemories);

// Get single memory
router.get("/:id", getMemoryById);

// Create memory
router.post("/", createMemory);

// Update memory
router.put("/:id", updateMemory);

// Delete memory
router.delete("/:id", deleteMemory);

module.exports = router;