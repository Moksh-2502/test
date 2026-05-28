import { api } from "./client";

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  correct: number;
  attempted: number;
  accuracy: number;
  bestStreak: number;
};

export const adminApi = {
  summary: () =>
    api<{
      classroomAverage: number;
      totalStudents: number;
      totalAttempts: number;
      totalCorrect: number;
      students: AdminStudent[];
      recentAttempts: Array<{ id: string; userId: string; section: string; moduleId: string; isCorrect: boolean }>;
    }>("/api/admin/summary"),
  classrooms: () => api<{ classrooms: unknown[] }>("/api/admin/classrooms"),
  createClassroom: (name: string) =>
    api<{ classroom: unknown }>("/api/admin/classrooms", { method: "POST", body: JSON.stringify({ name }) }),
  enroll: (classroomId: string, email: string) =>
    api<{ enrollment: unknown }>("/api/admin/classrooms/enroll", {
      method: "POST",
      body: JSON.stringify({ classroomId, email })
    })
};
