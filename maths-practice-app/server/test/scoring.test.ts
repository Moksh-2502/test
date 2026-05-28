import { describe, expect, it } from "vitest";
import { isNumericAnswer, normalizeAnswer, roundAccuracy } from "../src/services/scoring.js";

describe("scoring helpers", () => {
  it("normalizes formatted numeric answers", () => {
    expect(normalizeAnswer(" 1,200 ")).toBe("1200");
    expect(isNumericAnswer("-5")).toBe(true);
    expect(isNumericAnswer("abc")).toBe(false);
  });

  it("rounds accuracy to one decimal place", () => {
    expect(roundAccuracy(8, 10)).toBe(80);
    expect(roundAccuracy(2, 3)).toBe(66.7);
    expect(roundAccuracy(0, 0)).toBe(0);
  });
});
