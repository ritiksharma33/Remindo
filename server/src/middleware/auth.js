// ✅ New Clerk middleware (modern)
const { requireAuth } = require('@clerk/express');

// Protect routes
const authMiddleware = requireAuth();

module.exports = authMiddleware;