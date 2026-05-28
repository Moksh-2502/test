import type { NextFunction, Request, Response } from "express";
import { isProduction } from "../config/env.js";
import { verifyAuthToken } from "../services/auth.js";

export const authCookieName = "mathsprint_auth";
export const csrfCookieName = "mathsprint_csrf";

export function authCookieOptions(httpOnly = true) {
  return {
    httpOnly,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[authCookieName];
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = cookieToken ?? bearer;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = verifyAuthToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin" && req.user?.role !== "teacher") {
    return res.status(403).json({ message: "Teacher or admin access required" });
  }
  return next();
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  if (["/api/auth/login", "/api/auth/register"].includes(req.path)) return next();
  const header = req.header("x-csrf-token");
  const cookie = req.cookies?.[csrfCookieName];
  if (!header || !cookie || header !== cookie) {
    return res.status(403).json({ message: "Security token missing or expired. Refresh and try again." });
  }
  return next();
}
