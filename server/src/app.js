const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ✅ Correct import
const { clerkMiddleware } = require('@clerk/express');

const app = express();

// 1. Connect DB
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 3. Clerk Middleware ✅
app.use(clerkMiddleware());

// 4. Routes
app.use('/api/entries', require('./routes/entry.routes'));
app.use('/api/missions', require('./routes/missions.routes'));

// 5. Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Garden internal error' });
});

module.exports = app;