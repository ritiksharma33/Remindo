const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ Clerk userId
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mission', MissionSchema);