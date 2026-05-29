import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { authCookieName, authCookieOptions, csrfCookieName, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { hashPassword, makeCsrfToken, signAuthToken, verifyPassword } from "../services/auth.js";

function publicUser(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function setSessionCookies(res: import("express").Response, user: { id: string; name: string; email: string; role: string }) {
  const csrfToken = makeCsrfToken();
  res.cookie(authCookieName, signAuthToken(user), authCookieOptions(true));
  res.cookie(csrfCookieName, csrfToken, authCookieOptions(false));
  return csrfToken;
}

export function createAuthRoutes() {
  const router = Router();
  const registerSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8)
  });
  const loginSchema = z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1)
  });

  router.post("/register", validateBody(registerSchema), async (req, res) => {
    const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        passwordHash: await hashPassword(req.body.password)
      },
      select: { id: true, name: true, email: true, role: true }
    });
    const csrfToken = setSessionCookies(res, user);
    return res.status(201).json({ user: publicUser(user), csrfToken });
  });

  router.post("/login", validateBody(loginSchema), async (req, res) => {
    const user = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!user || !(await verifyPassword(req.body.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const csrfToken = setSessionCookies(res, user);
    return res.json({ user: publicUser(user), csrfToken });
  });

  router.post("/logout", (_req, res) => {
    res.clearCookie(authCookieName);
    res.clearCookie(csrfCookieName);
    return res.status(204).send();
  });

  router.get("/me", requireAuth, (req, res) => {
    return res.json({ user: req.user, csrfToken: req.cookies?.[csrfCookieName] });
  });

  return router;
}

const router = createAuthRoutes();

export { router as authRoutes };
export default router;
