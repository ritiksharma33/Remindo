const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure this path points to your existing auth middleware
const { getMissions, createMission, deleteMission } = require('../controllers/mission.controller');

// All routes are protected by 'auth' middleware
router.get('/', auth, getMissions);
router.post('/', auth, createMission);
router.delete('/:id', auth, deleteMission);

module.exports = router;