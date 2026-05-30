const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  summarizeMemory,
  generateFlashcards,
  askAI,
  generateTags,
  semanticSearch
} = require("../controllers/ai.controller");

// Summarize memory
router.post("/summarize", auth, summarizeMemory);

// Generate flashcards
router.post("/flashcards", auth, generateFlashcards);

// Ask AI
router.post("/chat", auth, askAI);

// Auto tag memory
router.post("/tags", auth, generateTags);

// Semantic search
router.post("/search", auth, semanticSearch);

module.exports = router;