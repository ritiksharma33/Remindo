const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getChats,
  getChatById,
  createChat,
  deleteChat
} = require("../controllers/chat.controller");

// All chat sessions
router.get("/", auth, getChats);

// Single chat
router.get("/:id", auth, getChatById);

// Create chat
router.post("/", auth, createChat);

// Delete chat
router.delete("/:id", auth, deleteChat);

module.exports = router;