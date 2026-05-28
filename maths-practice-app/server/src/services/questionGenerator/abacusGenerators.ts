import type { GeneratedQuestion } from "./types.js";
import { choice, exactDivision, evalLeftToRightParts, formatNumber, int, nonNegativeAddSub } from "./utils.js";

const q = (moduleId: string, expression: string, correctAnswer: number, prompt = "Solve"): GeneratedQuestion => ({
  section: "abacus",
  moduleId,
  prompt,
  displayType: expression.includes("beads") || expression.includes("Before") || expression.includes("After") ? "word" : "expression",
  expression,
  correctAnswer,
  explanation: `${expression} = ${formatNumber(correctAnswer)}`
});

function numberDigits(digits: number) {
  if (digits === 1) return int(1, 9);
  return int(10 ** (digits - 1), 10 ** digits - 1);
}

function addSub(moduleId: string, digits: number, terms = int(3, 6), allowNegative = false, decimal = false) {
  if (decimal) {
    const nums = Array.from({ length: terms }, () => Number((Math.random() * 1000).toFixed(1)));
    let total = nums[0];
    const exp = nums.slice(1).reduce((acc, n) => {
      const op = allowNegative ? choice(["+", "-"]) : total - n >= 0 ? choice(["+", "-"]) : "+";
      total = op === "+" ? total + n : total - n;
      return `${acc} ${op} ${n}`;
    }, `${nums[0]}`);
    return q(moduleId, exp, Number(total.toFixed(1)));
  }
  const max = 10 ** digits - 1;
  if (!allowNegative) {
    const generated = nonNegativeAddSub(terms, max);
    return q(moduleId, generated.expression, generated.total);
  }
  const nums = Array.from({ length: terms }, () => int(0, max));
  let total = nums[0];
  const exp = nums.slice(1).reduce((acc, n) => {
    const op = choice(["+", "-"]);
    total = op === "+" ? total + n : total - n;
    return `${acc} ${op} ${n}`;
  }, `${nums[0]}`);
  return q(moduleId, exp, total);
}

function multiplyByPattern(moduleId: string, patterns: Array<[number, number]>) {
  const [aDigits, bDigits] = choice(patterns);
  const a = numberDigits(aDigits);
  const b = numberDigits(bDigits);
  return q(moduleId, `${formatNumber(a)} × ${formatNumber(b)}`, a * b);
}

function square(moduleId: string, max: number) {
  const n = int(1, max);
  return q(moduleId, `${n}²`, n * n);
}

function equation(moduleId: string, max: number) {
  const a = int(2, max);
  const b = int(2, 12);
  const c = int(1, max);
  const expression = `${a}² + ${b} × ${c}`;
  return q(moduleId, expression, a * a + b * c);
}

function division(moduleId: string, dividendDigits: number[], divisorDigits: number[]) {
  const divisorDigit = choice(divisorDigits);
  const divisor = divisorDigit === 1 ? int(2, 9) : numberDigits(divisorDigit);
  const quotientDigits = Math.max(1, choice(dividendDigits) - divisorDigit);
  const quotient = numberDigits(quotientDigits);
  return q(moduleId, `${formatNumber(divisor * quotient)} ÷ ${formatNumber(divisor)}`, quotient);
}

function mixed(moduleId: string, maxSquare: number) {
  const kind = choice(["addSub", "multiply", "division", "square", "equation"]);
  if (kind === "division") return division(moduleId, [2, 3, 4], [1]);
  if (kind === "square") return square(moduleId, maxSquare);
  if (kind === "equation") return equation(moduleId, maxSquare);
  if (kind === "multiply") return multiplyByPattern(moduleId, [[2, 1], [3, 1], [2, 2]]);
  return addSub(moduleId, 3, int(4, 7));
}

function level0() {
  const kind = choice(["number", "before", "after", "beads", "addSub"]);
  if (kind === "number") {
    const n = int(1, 100);
    return q("abacus-level-0", `Type the number ${n}`, n, "Read the number");
  }
  if (kind === "before") {
    const n = int(2, 100);
    return q("abacus-level-0", `Before ${n}`, n - 1, "Find the before number");
  }
  if (kind === "after") {
    const n = int(1, 99);
    return q("abacus-level-0", `After ${n}`, n + 1, "Find the after number");
  }
  if (kind === "beads") {
    const n = int(1, 100);
    return q("abacus-level-0", `Beads show ${n}. Write the number.`, n, "Convert beads to number");
  }
  return addSub("abacus-level-0", choice([1, 2]), int(2, 4));
}

function level1() {
  const kind = choice(["formula", "withAbacus", "mental"]);
  if (kind === "formula") {
    const target = choice([5, 10]);
    const part = int(1, target - 1);
    return q("abacus-level-1", `Best friend of ${part} for ${target}`, target - part, "Complete the formula pair");
  }
  if (kind === "mental") return addSub("abacus-level-1", 1, int(3, 6));
  return addSub("abacus-level-1", 2, int(3, 6));
}

function level2() {
  const kind = choice(["addSubWith", "addSubMental", "multiply"]);
  if (kind === "multiply") return multiplyByPattern("abacus-level-2", [[1, 2], [2, 1], [3, 1]]);
  return addSub("abacus-level-2", kind === "addSubWith" ? choice([2, 3]) : choice([1, 2]), int(3, 6));
}

function level3() {
  const kind = choice(["addSub", "mental", "multiplyWith", "multiplyMental", "square", "equation", "division"]);
  if (kind === "multiplyWith") return multiplyByPattern("abacus-level-3", [[2, 1], [3, 1], [4, 1], [2, 2], [3, 2]]);
  if (kind === "multiplyMental") return multiplyByPattern("abacus-level-3", [[2, 1], [3, 1]]);
  if (kind === "square") return square("abacus-level-3", 20);
  if (kind === "equation") return equation("abacus-level-3", 20);
  if (kind === "division") return division("abacus-level-3", [2, 3], [1]);
  return addSub("abacus-level-3", kind === "addSub" ? choice([2, 3, 4]) : choice([2, 3]), int(4, 7));
}

function level4() {
  const kind = choice(["addSub", "mental", "multiplyWith", "multiplyMental", "division", "square", "equation"]);
  if (kind === "multiplyWith") return multiplyByPattern("abacus-level-4", [[3, 1], [4, 1], [5, 1], [2, 2], [3, 2], [4, 2]]);
  if (kind === "multiplyMental") return multiplyByPattern("abacus-level-4", [[3, 1], [4, 1], [5, 1], [2, 2]]);
  if (kind === "division") return division("abacus-level-4", [1, 2, 3], [1]);
  if (kind === "square") return square("abacus-level-4", 35);
  if (kind === "equation") return equation("abacus-level-4", 35);
  return addSub("abacus-level-4", kind === "addSub" ? choice([3, 4, 5]) : choice([2, 3]), int(4, 8));
}

function level5() {
  const kind = choice(["addSub", "mental", "multiplyWith", "multiplyMental", "divisionWith", "divisionMental", "decimal", "square", "equation"]);
  if (kind === "multiplyWith") return multiplyByPattern("abacus-level-5", [[2, 2], [3, 2], [4, 2], [5, 2], [3, 3]]);
  if (kind === "multiplyMental") return multiplyByPattern("abacus-level-5", [[3, 1], [4, 1], [5, 1], [2, 2], [3, 2]]);
  if (kind === "divisionWith") return division("abacus-level-5", [3, 4, 5, 6], [1, 2]);
  if (kind === "divisionMental") return division("abacus-level-5", [2, 3], [1]);
  if (kind === "decimal") return addSub("abacus-level-5", 3, int(3, 5), false, true);
  if (kind === "square") return square("abacus-level-5", 50);
  if (kind === "equation") return equation("abacus-level-5", 50);
  return addSub("abacus-level-5", kind === "addSub" ? choice([4, 5, 6]) : choice([3, 4]), int(4, 8));
}

function level6() {
  const kind = choice(["addSub", "mental", "multiplyWith", "multiplyMental", "divisionWith", "divisionMental", "decimal", "negative", "equation"]);
  if (kind === "multiplyWith") return multiplyByPattern("abacus-level-6", [[3, 2], [4, 2], [5, 2], [3, 3], [4, 3]]);
  if (kind === "multiplyMental") return multiplyByPattern("abacus-level-6", [[3, 1], [4, 1], [5, 1], [2, 2], [3, 2], [4, 2]]);
  if (kind === "divisionWith") return division("abacus-level-6", [5, 6], [1, 2]);
  if (kind === "divisionMental") return division("abacus-level-6", [2, 3, 4], [1]);
  if (kind === "decimal") {
    const a = Number((Math.random() * 100).toFixed(1));
    const b = int(2, 9);
    return q("abacus-level-6", `${a} × ${b}`, Number((a * b).toFixed(1)));
  }
  if (kind === "negative") return addSub("abacus-level-6", 4, int(4, 7), true);
  if (kind === "equation") return equation("abacus-level-6", 50);
  return addSub("abacus-level-6", kind === "addSub" ? 6 : choice([3, 4]), int(5, 8));
}

function level7() {
  const kind = choice(["addSub", "mental", "multiplyWith", "multiplyMental", "divisionWith", "divisionMental", "decimal", "negative", "percentage", "equation"]);
  if (kind === "multiplyWith") return multiplyByPattern("abacus-level-7", [[4, 2], [5, 2], [3, 3], [4, 3], [5, 3]]);
  if (kind === "multiplyMental") return multiplyByPattern("abacus-level-7", [[2, 2], [3, 2], [4, 2], [5, 2]]);
  if (kind === "divisionWith") return division("abacus-level-7", [5, 6], [1, 2]);
  if (kind === "divisionMental") return division("abacus-level-7", [3, 4, 5], [1]);
  if (kind === "decimal") return addSub("abacus-level-7", 4, int(4, 7), true, true);
  if (kind === "negative") return addSub("abacus-level-7", 5, int(5, 8), true);
  if (kind === "percentage") {
    const percent = choice([5, 10, 12, 15, 20, 25, 50, 75]);
    const base = int(10, 999) * 4;
    return q("abacus-level-7", `${percent}% of ${formatNumber(base)}`, (percent * base) / 100, "Find the percentage");
  }
  if (kind === "equation") {
    const parts: Array<number | string> = [int(10, 999), "+", int(10, 99), "×", int(2, 12), "-", int(10, 99)];
    const total = evalLeftToRightParts(parts);
    return q("abacus-level-7", parts.join(" "), total);
  }
  return addSub("abacus-level-7", kind === "addSub" ? 7 : choice([4, 5]), int(5, 9));
}

export const abacusGenerators: Record<string, () => GeneratedQuestion> = {
  "abacus-level-0": level0,
  "abacus-level-1": level1,
  "abacus-level-2": level2,
  "abacus-level-3": level3,
  "abacus-level-4": level4,
  "abacus-level-5": level5,
  "abacus-level-6": level6,
  "abacus-level-7": level7
};
