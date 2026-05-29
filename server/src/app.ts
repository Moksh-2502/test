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

function pickFunction<T extends (...args: never[]) => unknown>(moduleValue: unknown, names: string[]) {
  const moduleRecord = moduleValue as Record<string, unknown> & { default?: unknown };
  const defaultRecord = moduleRecord.default as (Record<string, unknown> & { default?: unknown }) | undefined;
  const candidates = [
    moduleValue,
    moduleRecord.default,
    defaultRecord?.default,
    ...names.map((name) => moduleRecord[name]),
    ...names.map((name) => defaultRecord?.[name])
  ];
  const found = candidates.find((candidate) => typeof candidate === "function");
  if (!found) {
    throw new TypeError(`Could not resolve middleware function from ${names.join(", ")}`);
  }
  return found as T;
}

const cookieParser = pickFunction<typeof import("cookie-parser")>(cookieParserModule, ["cookieParser"]);
const cors = pickFunction<typeof import("cors")>(corsModule, ["cors"]);
const rateLimit = pickFunction<typeof import("express-rate-limit").rateLimit>(rateLimitModule, ["rateLimit"]);
const helmet = pickFunction<() => import("express").RequestHandler[]>(helmetModule, ["helmet"]);

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
