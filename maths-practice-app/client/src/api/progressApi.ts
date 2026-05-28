import { api } from "./client";
import type { Progress } from "../types";

export type ProgressSummary = {
  correct: number;
  attempted: number;
  accuracy: number;
  bestStreak: number;
  abacus: { correct: number; attempted: number; accuracy: number };
  vedic: { correct: number; attempted: number; accuracy: number };
};

export const progressApi = {
  all: () => api<{ progress: Progress[]; summary: ProgressSummary; recent: Progress[] }>("/api/progress")
};
