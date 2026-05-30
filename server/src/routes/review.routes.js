const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getTodayReviews,
  submitReview,
  getReviewStats
} = require("../controllers/review.controller");

// Due reviews today
router.get("/today", auth, getTodayReviews);

// Review a memory
router.post("/:memoryId", auth, submitReview);

// Learning analytics
router.get("/stats", auth, getReviewStats);

module.exports = router;