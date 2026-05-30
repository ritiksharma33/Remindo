const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getAISettings,
  updateAISettings
} = require("../controllers/settings.controller");

router.get(
  "/ai",
  auth,
  getAISettings
);

router.put(
  "/ai",
  auth,
  updateAISettings
);

module.exports = router;