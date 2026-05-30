const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    title: {
      type: String,
      default: ""
    },

    content: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["text", "image", "voice", "link"],
      default: "text"
    },

    imageUrl: {
      type: String,
      default: ""
    },

    transcript: {
      type: String,
      default: ""
    },

    sourceUrl: {
      type: String,
      default: ""
    },

    tags: [
      {
        type: String
      }
    ],

    summary: {
      type: String,
      default: ""
    },

    embedding: [
      {
        type: Number
      }
    ],

    srs: {
      stage: {
        type: Number,
        default: 0
      },

      interval: {
        type: Number,
        default: 1
      },

      nextReviewDate: {
        type: Date,
        default: () =>
          new Date(Date.now() + 24 * 60 * 60 * 1000)
      },

      status: {
        type: String,
        enum: ["Learning", "Reviewing", "Mastered"],
        default: "Learning"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Memory", MemorySchema);