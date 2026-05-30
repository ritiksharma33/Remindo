require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const { clerkMiddleware } = require("@clerk/express");

const app = express();

/*
=================================
DATABASE
=================================
*/
connectDB();

/*
=================================
MIDDLEWARE
=================================
*/
app.use(cors());

app.use(
  express.json({
    limit: "50mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/*
=================================
CLERK AUTH
=================================
*/
app.use(clerkMiddleware());

/*
=================================
HEALTH CHECK
=================================
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Remindo AI Backend Running 🚀"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date()
  });
});

/*
=================================
ROUTES
=================================
*/

app.use(
  "/api/memories",
  require("./routes/memory.routes")
);

app.use(
  "/api/missions",
  require("./routes/mission.routes")
);

app.use(
  "/api/reviews",
  require("./routes/review.routes")
);

app.use(
  "/api/ai",
  require("./routes/ai.routes")
);

app.use(
  "/api/chats",
  require("./routes/chat.routes")
);

app.use(
  "/api/settings",
  require("./routes/settings.routes")
);

/*
=================================
404 HANDLER
=================================
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/*
=================================
GLOBAL ERROR HANDLER
=================================
*/
app.use((err, req, res, next) => {

  console.error("GLOBAL ERROR:");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error"
  });

});

module.exports = app;