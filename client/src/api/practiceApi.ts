import { api } from "./client";
import type { GeneratedQuestion, SubmitResult } from "../types";

export const practiceApi = {
  start: (payload: { section: "abacus" | "vedic"; moduleId: string; mode: "infinite" }) =>
    api<{ sessionId: string }>("/api/practice/start", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  question: (payload: { sessionId: string; section: "abacus" | "vedic"; moduleId: string }) =>
    api<GeneratedQuestion>("/api/practice/question", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  submit: (payload: { attemptId: string; answer: string }) =>
    api<SubmitResult>("/api/practice/submit", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
