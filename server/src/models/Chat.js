const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },

    content: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      default: "New Chat"
    },

    messages: [MessageSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Chat", ChatSchema);