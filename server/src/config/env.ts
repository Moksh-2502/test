import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default("development-jwt-secret-change-me"),
  COOKIE_SECRET: z.string().min(16).default("development-cookie-secret"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000)
});

export const env = schema.parse(process.env);
export const isProduction = env.NODE_ENV === "production";
