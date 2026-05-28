import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { csrfProtection } from "./middleware/auth.js";
import * as adminRoutesModule from "./routes/adminRoutes.js";
import * as authRoutesModule from "./routes/authRoutes.js";
import * as courseRoutesModule from "./routes/courseRoutes.js";
import * as practiceRoutesModule from "./routes/practiceRoutes.js";
import * as progressRoutesModule from "./routes/progressRoutes.js";

const adminRoutes = (adminRoutesModule && (adminRoutesModule.default ?? adminRoutesModule)) as import("express").Router;
const authRoutes = (authRoutesModule && (authRoutesModule.default ?? authRoutesModule)) as import("express").Router;
const courseRoutes = (courseRoutesModule && (courseRoutesModule.default ?? courseRoutesModule)) as import("express").Router;
const practiceRoutes = (practiceRoutesModule && (practiceRoutesModule.default ?? practiceRoutesModule)) as import("express").Router;
const progressRoutes = (progressRoutesModule && (progressRoutesModule.default ?? progressRoutesModule)) as import("express").Router;

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(csrfProtection);

  app.get("/health", (_req, res) => res.json({ ok: true, service: "mathsprint-api" }));
  app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 }), authRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/practice", practiceRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

  return app;
}
