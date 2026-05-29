import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { roundAccuracy } from "../services/scoring.js";

type RouterFactory = () => ReturnType<typeof Router>;

type ProgressRow = {
  userId: string;
  correct: number;
  attempted: number;
  bestStreak: number;
};

export function createAdminRoutes(makeRouter: RouterFactory = () => Router()) {
  const router = makeRouter();
  const createClassSchema = z.object({ name: z.string().trim().min(1) });
  const enrollSchema = z.object({ classroomId: z.string().uuid(), email: z.string().email().toLowerCase() });

  router.use(requireAuth, requireAdmin);

  router.get("/summary", async (_req, res) => {
    const [students, progress, attempts] = await Promise.all([
      prisma.user.findMany({
        where: { role: "student" },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.progress.findMany(),
      prisma.questionAttempt.findMany({
        where: { submitted: true },
        orderBy: { answeredAt: "desc" },
        take: 20,
        select: { id: true, userId: true, section: true, moduleId: true, isCorrect: true, answeredAt: true }
      })
    ]);

    const studentRows = students.map((student: { id: string; name: string; email: string; createdAt: Date }) => {
      const rows = progress.filter((item: ProgressRow) => item.userId === student.id);
      const correct = rows.reduce((sum: number, item: ProgressRow) => sum + item.correct, 0);
      const attempted = rows.reduce((sum: number, item: ProgressRow) => sum + item.attempted, 0);
      const bestStreak = rows.reduce((best: number, item: ProgressRow) => Math.max(best, item.bestStreak), 0);
      return { ...student, correct, attempted, accuracy: roundAccuracy(correct, attempted), bestStreak };
    });

    const totals = studentRows.reduce(
      (acc: { correct: number; attempted: number }, student: { correct: number; attempted: number }) => {
        acc.correct += student.correct;
        acc.attempted += student.attempted;
        return acc;
      },
      { correct: 0, attempted: 0 }
    );

    return res.json({
      classroomAverage: roundAccuracy(totals.correct, totals.attempted),
      totalStudents: students.length,
      totalAttempts: totals.attempted,
      totalCorrect: totals.correct,
      students: studentRows,
      recentAttempts: attempts
    });
  });

  router.get("/classrooms", async (req, res) => {
    const classrooms = await prisma.classroom.findMany({
      where: { teacherId: req.user!.id },
      include: { enrollments: { include: { user: { select: { id: true, name: true, email: true } } } } },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ classrooms });
  });

  router.post("/classrooms", validateBody(createClassSchema), async (req, res) => {
    const classroom = await prisma.classroom.create({
      data: { name: req.body.name, teacherId: req.user!.id }
    });
    return res.status(201).json({ classroom });
  });

  router.post("/classrooms/enroll", validateBody(enrollSchema), async (req, res) => {
    const student = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (!student) return res.status(404).json({ message: "Student not found." });

    const enrollment = await prisma.classEnrollment.create({
      data: { classroomId: req.body.classroomId, userId: student.id }
    });
    return res.status(201).json({ enrollment });
  });

  return router;
}

export default createAdminRoutes;
