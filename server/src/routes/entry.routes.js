const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { 
  getEntries, 
  createEntry, 
  reviewEntry, 
  updateEntry, 
  deleteEntry 
} = require('../controllers/entry.controller');

// --- Routes ---

// 1. Get all entries (GET /api/entries)
router.get('/', auth, getEntries);

// 2. Create new entry (POST /api/entries)
router.post('/', auth, createEntry);

// 3. Review an entry (POST /api/entries/:id/review)
router.post('/:id/review', auth, reviewEntry);

// 4. Update an entry (PUT /api/entries/:id)
router.put('/:id', auth, updateEntry);

// 5. Delete an entry (DELETE /api/entries/:id)
router.delete('/:id', auth, deleteEntry);

module.exports = router;