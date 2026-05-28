export type Section = "abacus" | "vedic";
export type DisplayType = "expression" | "vertical" | "root" | "word";

export type GeneratedQuestion = {
  section: Section;
  moduleId: string;
  prompt: string;
  displayType: DisplayType;
  expression?: string;
  operands?: number[];
  operator?: string;
  correctAnswer: number;
  explanation?: string;
};

export type PublicQuestion = Omit<GeneratedQuestion, "correctAnswer">;
