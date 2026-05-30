const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    memoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memory",
      required: true
    },

    rating: {
      type: String,
      enum: ["Again", "Hard", "Good", "Easy"],
      required: true
    },

    reviewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Review", ReviewSchema);