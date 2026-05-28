export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type CourseItem = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Challenge";
  methodTip?: string;
};

export type Progress = {
  id: string;
  section: "abacus" | "vedic";
  moduleId: string;
  correct: number;
  attempted: number;
  bestStreak: number;
  currentStreak: number;
  lastPracticedAt?: string;
};

export type GeneratedQuestion = {
  attemptId: string;
  section: "abacus" | "vedic";
  moduleId: string;
  prompt: string;
  displayType: "expression" | "vertical" | "root" | "word";
  expression?: string;
  operands?: number[];
  operator?: string;
  explanation?: string;
};

export type SubmitResult = {
  correct: boolean;
  correctAnswer: number;
  explanation?: string;
  sessionScore: { correct: number; attempted: number; accuracy: number };
  progress: {
    moduleCorrect: number;
    moduleAttempted: number;
    moduleAccuracy: number;
    bestStreak: number;
    currentStreak: number;
  };
};
