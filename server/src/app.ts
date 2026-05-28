import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "./config/env.js";
import { csrfProtection } from "./middleware/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

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
