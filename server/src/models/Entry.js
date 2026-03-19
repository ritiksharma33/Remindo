const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: {
    type: String, // ✅ Clerk userId
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  srs: {
    stage: { type: Number, default: 0 },
    nextReviewDate: { 
      type: Date, 
      default: () => Date.now() + 24*60*60*1000 
    },
    interval: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ['Learning', 'Reviewing', 'Mastered'], 
      default: 'Learning' 
    }
  }
});

module.exports = mongoose.model('Entry', EntrySchema);