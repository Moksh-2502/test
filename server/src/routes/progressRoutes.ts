import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { roundAccuracy } from "../services/scoring.js";

export function createProgressRoutes() {
  const router = Router();

  router.get("/", requireAuth, async (req, res) => {
    const progress = await prisma.progress.findMany({
      where: { userId: req.user!.id },
      orderBy: { lastPracticedAt: "desc" }
    });

    const totals = progress.reduce(
      (acc: {
        correct: number;
        attempted: number;
        bestStreak: number;
        abacus: { correct: number; attempted: number };
        vedic: { correct: number; attempted: number };
      }, item: ProgressRow) => {
        acc.correct += item.correct;
        acc.attempted += item.attempted;
        acc.bestStreak = Math.max(acc.bestStreak, item.bestStreak);
        if (item.section === "abacus") {
          acc.abacus.correct += item.correct;
          acc.abacus.attempted += item.attempted;
        } else {
          acc.vedic.correct += item.correct;
          acc.vedic.attempted += item.attempted;
        }
        return acc;
      },
      {
        correct: 0,
        attempted: 0,
        bestStreak: 0,
        abacus: { correct: 0, attempted: 0 },
        vedic: { correct: 0, attempted: 0 }
      }
    );

    return res.json({
      progress,
      summary: {
        correct: totals.correct,
        attempted: totals.attempted,
        accuracy: roundAccuracy(totals.correct, totals.attempted),
        bestStreak: totals.bestStreak,
        abacus: { ...totals.abacus, accuracy: roundAccuracy(totals.abacus.correct, totals.abacus.attempted) },
        vedic: { ...totals.vedic, accuracy: roundAccuracy(totals.vedic.correct, totals.vedic.attempted) }
      },
      recent: progress.slice(0, 8)
    });
  });

  return router;
}

const router = createProgressRoutes();

export { router as progressRoutes };
export default router;
type ProgressRow = {
  correct: number;
  attempted: number;
  bestStreak: number;
  section: string;
};
