import { describe, expect, it } from "vitest";
import { abacusGenerators } from "../src/services/questionGenerator/abacusGenerators.js";
import { vedicGenerators } from "../src/services/questionGenerator/vedicGenerators.js";
import { publicQuestion } from "../src/services/questionGenerator/index.js";

describe("question generators", () => {
  it("generates every Smart Brain Abacus level without exposing answers publicly", () => {
    for (const [moduleId, generator] of Object.entries(abacusGenerators)) {
      const question = generator();
      expect(question.moduleId).toBe(moduleId);
      expect(Number.isFinite(question.correctAnswer)).toBe(true);
      expect(publicQuestion(question)).not.toHaveProperty("correctAnswer");
    }
  });

  it("generates all 33 Vedic modules with numeric answers", () => {
    expect(Object.keys(vedicGenerators)).toHaveLength(33);
    for (const [moduleId, generator] of Object.entries(vedicGenerators)) {
      const question = generator();
      expect(question.moduleId).toBe(moduleId);
      expect(Number.isFinite(question.correctAnswer)).toBe(true);
      expect(publicQuestion(question)).not.toHaveProperty("correctAnswer");
    }
  });
});
