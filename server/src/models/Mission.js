const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    deadline: {
      type: Date,
      required: true
    },

    linkedMemories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Mission", MissionSchema);