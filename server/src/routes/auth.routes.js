


const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "Auth handled by Clerk" });
});

module.exports = router;