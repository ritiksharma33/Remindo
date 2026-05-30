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
/**
 * @swagger
 * /api/memories:
 *   get:
 *     summary: Get all memories
 *     tags:
 *       - Memories
 *     responses:
 *       200:
 *         description: List of memories
 */


// Get all memories
router.get("/", getMemories);

// Search memories
router.get("/search", searchMemories);

// Get single memory
router.get("/:id", getMemoryById);
/**
 * @swagger
 * /api/memories:
 *   post:
 *     summary: Create memory
 *     tags:
 *       - Memories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Memory created
 */
// Create memory
router.post("/", createMemory);

// Update memory
router.put("/:id", updateMemory);

// Delete memory
router.delete("/:id", deleteMemory);

module.exports = router;