import * as cookieParserModule from "cookie-parser";
import * as corsModule from "cors";
import express from "express";
import * as rateLimitModule from "express-rate-limit";
import * as helmetModule from "helmet";
import { env } from "./config/env.js";
import { csrfProtection } from "./middleware/auth.js";
import * as adminRoutesModule from "./routes/adminRoutes.js";
import * as authRoutesModule from "./routes/authRoutes.js";
import * as courseRoutesModule from "./routes/courseRoutes.js";
import * as practiceRoutesModule from "./routes/practiceRoutes.js";
import * as progressRoutesModule from "./routes/progressRoutes.js";

const cookieParser = (cookieParserModule.default ?? cookieParserModule) as typeof import("cookie-parser");
const cors = (corsModule.default ?? corsModule) as typeof import("cors");
const rateLimit = (rateLimitModule.default ?? rateLimitModule.rateLimit) as typeof import("express-rate-limit").rateLimit;
const helmet = (helmetModule.default ?? helmetModule) as unknown as () => import("express").RequestHandler[];

const adminRoutes = (adminRoutesModule.adminRoutes ?? adminRoutesModule.default) as import("express").Router;
const authRoutes = (authRoutesModule.authRoutes ?? authRoutesModule.default) as import("express").Router;
const courseRoutes = (courseRoutesModule.courseRoutes ?? courseRoutesModule.default) as import("express").Router;
const practiceRoutes = (practiceRoutesModule.practiceRoutes ?? practiceRoutesModule.default) as import("express").Router;
const progressRoutes = (progressRoutesModule.progressRoutes ?? progressRoutesModule.default) as import("express").Router;

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
