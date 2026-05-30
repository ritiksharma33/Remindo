const mongoose = require("mongoose");

const AISettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },

    provider: {
      type: String,
      enum: ["gemini", "openai"],
      default: "gemini"
    },

    model: {
      type: String,
      default: "gemini-2.5-flash"
    },

    apiKey: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AISettings", AISettingsSchema);