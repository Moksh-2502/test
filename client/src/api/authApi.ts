import { api } from "./client";
import type { User } from "../types";

export const authApi = {
  register: (payload: { name: string; email: string; password: string }) =>
    api<{ user: User; csrfToken: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: { email: string; password: string }) =>
    api<{ user: User; csrfToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  logout: () => api<void>("/api/auth/logout", { method: "POST" }),
  me: () => api<{ user: User; csrfToken?: string }>("/api/auth/me")
};
