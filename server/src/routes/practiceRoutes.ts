import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { getCourseItem } from "../services/courseConfig.js";
import { generateQuestion, publicQuestion, signature } from "../services/questionGenerator/index.js";
import type { Section } from "../services/questionGenerator/index.js";
import { isNumericAnswer, normalizeAnswer, roundAccuracy } from "../services/scoring.js";

type RouterFactory = () => ReturnType<typeof Router>;

const sectionSchema = z.enum(["abacus", "vedic"]);
const startSchema = z.object({
  section: sectionSchema,
  moduleId: z.string().min(1),
  mode: z.literal("infinite").default("infinite")
});
const questionSchema = z.object({
  sessionId: z.string().uuid(),
  section: sectionSchema,
  moduleId: z.string().min(1)
});
const submitSchema = z.object({
  attemptId: z.string().uuid(),
  answer: z.string().min(1)
});

export function createPracticeRoutes(makeRouter: RouterFactory = () => Router()) {
const router = makeRouter();

router.post("/start", requireAuth, validateBody(startSchema), async (req, res) => {
  if (!getCourseItem(req.body.section, req.body.moduleId)) {
    return res.status(404).json({ message: "Unknown practice module." });
  }
  const session = await prisma.practiceSession.create({
    data: {
      userId: req.user!.id,
      section: req.body.section,
      moduleId: req.body.moduleId,
      mode: req.body.mode
    }
  });
  return res.status(201).json({ sessionId: session.id });
});

router.post("/question", requireAuth, validateBody(questionSchema), async (req, res) => {
  const session = await prisma.practiceSession.findFirst({
    where: { id: req.body.sessionId, userId: req.user!.id }
  });
  if (!session) return res.status(404).json({ message: "Practice session not found." });
  if (session.section !== req.body.section || session.moduleId !== req.body.moduleId) {
    return res.status(400).json({ message: "Question request does not match this practice session." });
  }

  const recent = await prisma.questionAttempt.findMany({
    where: { userId: req.user!.id, sessionId: session.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { questionSignature: true }
  });
  const recentSignatures = new Set(recent.map((item: { questionSignature: string }) => item.questionSignature));

  let generated = generateQuestion(req.body.section as Section, req.body.moduleId);
  let generatedSignature = signature(generated);
  for (let i = 0; i < 10 && recentSignatures.has(generatedSignature); i += 1) {
    generated = generateQuestion(req.body.section as Section, req.body.moduleId);
    generatedSignature = signature(generated);
  }

  const attempt = await prisma.questionAttempt.create({
    data: {
      userId: req.user!.id,
      sessionId: session.id,
      section: req.body.section,
      moduleId: req.body.moduleId,
      questionPayload: publicQuestion(generated),
      questionSignature: generatedSignature,
      correctAnswer: String(generated.correctAnswer)
    }
  });

  return res.status(201).json({ attemptId: attempt.id, ...publicQuestion(generated) });
});

router.post("/submit", requireAuth, validateBody(submitSchema), async (req, res) => {
  if (!isNumericAnswer(req.body.answer)) {
    return res.status(400).json({ message: "Answer must be numeric." });
  }

  const normalized = normalizeAnswer(req.body.answer);
  const attempt = await prisma.questionAttempt.findFirst({
    where: { id: req.body.attemptId, userId: req.user!.id }
  });
  if (!attempt) return res.status(404).json({ message: "Question attempt not found." });

  const correct = Number(normalized) === Number(attempt.correctAnswer);

  if (attempt.submitted) {
    const [session, progress] = await Promise.all([
      prisma.practiceSession.findUnique({ where: { id: attempt.sessionId } }),
      prisma.progress.findUnique({
        where: { userId_section_moduleId: { userId: req.user!.id, section: attempt.section, moduleId: attempt.moduleId } }
      })
    ]);
    return res.json({
      correct: attempt.isCorrect,
      correctAnswer: Number(attempt.correctAnswer),
      explanation: (attempt.questionPayload as { explanation?: string }).explanation,
      alreadySubmitted: true,
      sessionScore: {
        correct: session?.correct ?? 0,
        attempted: session?.attempted ?? 0,
        accuracy: roundAccuracy(session?.correct ?? 0, session?.attempted ?? 0)
      },
      progress: {
        moduleCorrect: progress?.correct ?? 0,
        moduleAttempted: progress?.attempted ?? 0,
        moduleAccuracy: roundAccuracy(progress?.correct ?? 0, progress?.attempted ?? 0),
        bestStreak: progress?.bestStreak ?? 0,
        currentStreak: progress?.currentStreak ?? 0
      }
    });
  }

  const responseMs = Date.now() - attempt.createdAt.getTime();
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const updatedAttempt = await tx.questionAttempt.update({
      where: { id: attempt.id },
      data: {
        userAnswer: normalized,
        isCorrect: correct,
        submitted: true,
        responseMs,
        answeredAt: new Date()
      }
    });

    const session = await tx.practiceSession.update({
      where: { id: attempt.sessionId },
      data: {
        attempted: { increment: 1 },
        correct: { increment: correct ? 1 : 0 }
      }
    });

    const current = await tx.progress.findUnique({
      where: { userId_section_moduleId: { userId: req.user!.id, section: attempt.section, moduleId: attempt.moduleId } }
    });

    const nextCurrentStreak = correct ? (current?.currentStreak ?? 0) + 1 : 0;
    const progress = current
      ? await tx.progress.update({
          where: { id: current.id },
          data: {
            attempted: { increment: 1 },
            correct: { increment: correct ? 1 : 0 },
            currentStreak: nextCurrentStreak,
            bestStreak: Math.max(current.bestStreak, nextCurrentStreak),
            lastPracticedAt: new Date()
          }
        })
      : await tx.progress.create({
          data: {
            userId: req.user!.id,
            section: attempt.section,
            moduleId: attempt.moduleId,
            attempted: 1,
            correct: correct ? 1 : 0,
            currentStreak: nextCurrentStreak,
            bestStreak: nextCurrentStreak,
            lastPracticedAt: new Date()
          }
        });

    return { updatedAttempt, session, progress };
  });

  return res.json({
    correct,
    correctAnswer: Number(attempt.correctAnswer),
    explanation: (result.updatedAttempt.questionPayload as { explanation?: string }).explanation,
    sessionScore: {
      correct: result.session.correct,
      attempted: result.session.attempted,
      accuracy: roundAccuracy(result.session.correct, result.session.attempted)
    },
    progress: {
      moduleCorrect: result.progress.correct,
      moduleAttempted: result.progress.attempted,
      moduleAccuracy: roundAccuracy(result.progress.correct, result.progress.attempted),
      bestStreak: result.progress.bestStreak,
      currentStreak: result.progress.currentStreak
    }
  });
});

return router;
}

export default createPracticeRoutes;
