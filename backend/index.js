import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import DB from "./server/connections/DB.connections.js";
import errorHandler from "./server/Middleware/errorHandler.middleware.js";

// Routers
import authRouter from "./server/routers/auth.route.js";
import adminRouter from "./server/routers/admin.route.js";
import studentRouter from "./server/routers/student.route.js";
import facultyRouter from "./server/routers/faculty.route.js";
import classRouter from "./server/routers/class.route.js";

// ─── Database ───────────────────────────────────────────────────────────────

const mongoUrl =
  process.env.STATUS === "development"
    ? process.env.MONGO_DB_URL_LOCAL
    : process.env.MONGO_DB_URL;

DB.connect(mongoUrl);

// ─── Express App ─────────────────────────────────────────────────────────────

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────

app.use(
  cors({
    origin:
      process.env.STATUS === "development"
        ? `http://localhost:${process.env.CLIENT_PORT}`
        : `http://${process.env.NETWORK_IP}:${process.env.CLIENT_PORT}`,
    credentials: true, // Required: allows cookies cross-origin
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/students", studentRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api/class", classRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// MUST be registered after all routes and middleware

app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `[Server] Running in ${process.env.STATUS || "development"} mode on port ${PORT}`
  );
});
