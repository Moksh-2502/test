import express from "express";
import type { NextFunction, Request, Response } from "express";
import { env } from "./config/env.js";
import { csrfProtection } from "./middleware/auth.js";
import * as adminRoutesModule from "./routes/adminRoutes.js";
import * as authRoutesModule from "./routes/authRoutes.js";
import * as courseRoutesModule from "./routes/courseRoutes.js";
import * as practiceRoutesModule from "./routes/practiceRoutes.js";
import * as progressRoutesModule from "./routes/progressRoutes.js";

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
}

function simpleCors(req: Request, res: Response, next: NextFunction) {
  const origin = req.header("origin");
  if (origin && origin === env.FRONTEND_URL) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-csrf-token");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).send();
    return;
  }
  next();
}

function parseCookies(header: string | undefined) {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) continue;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
  }
  return cookies;
}

function simpleCookieParser(req: Request, _res: Response, next: NextFunction) {
  req.cookies = parseCookies(req.header("cookie"));
  next();
}

function authRateLimit() {
  return (_req: unknown, _res: Response, next: () => void) => next();
}

const adminRoutes = (adminRoutesModule.adminRoutes ?? adminRoutesModule.default) as import("express").Router;
const authRoutes = (authRoutesModule.authRoutes ?? authRoutesModule.default) as import("express").Router;
const courseRoutes = (courseRoutesModule.courseRoutes ?? courseRoutesModule.default) as import("express").Router;
const practiceRoutes = (practiceRoutesModule.practiceRoutes ?? practiceRoutesModule.default) as import("express").Router;
const progressRoutes = (progressRoutesModule.progressRoutes ?? progressRoutesModule.default) as import("express").Router;

export function createApp() {
  const app = express();

  app.use(securityHeaders);
  app.use(simpleCors);
  app.use(express.json({ limit: "1mb" }));
  app.use(simpleCookieParser);
  app.use(csrfProtection);

  app.get("/health", (_req, res) => res.json({ ok: true, service: "mathsprint-api" }));
  app.use("/api/auth", authRateLimit(), authRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/practice", practiceRoutes);
  app.use("/api/admin", adminRoutes);

  app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

  return app;
}
