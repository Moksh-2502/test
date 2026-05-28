import type { GeneratedQuestion } from "./types.js";
import { choice, exactDivision, formatNumber, int } from "./utils.js";

const expression = (moduleId: string, exp: string, answer: number, prompt = "Calculate"): GeneratedQuestion => ({
  section: "vedic",
  moduleId,
  prompt,
  displayType: "expression",
  expression: exp,
  correctAnswer: answer,
  explanation: `${exp} = ${formatNumber(answer)}`
});

const vertical = (moduleId: string, operands: number[], answer: number): GeneratedQuestion => ({
  section: "vedic",
  moduleId,
  prompt: "Add",
  displayType: "vertical",
  operands,
  operator: "+",
  expression: operands.join(" + "),
  correctAnswer: answer,
  explanation: `${operands.join(" + ")} = ${formatNumber(answer)}`
});

function near(base: number, span: number) {
  return base + int(-span, span);
}

export const vedicGenerators: Record<string, () => GeneratedQuestion> = {
  "vedic-1": () => {
    const operands = Array.from({ length: int(3, 6) }, () => int(10, 9999));
    return vertical("vedic-1", operands, operands.reduce((a, b) => a + b, 0));
  },
  "vedic-2": () => {
    const n = int(10, 9999);
    const add = choice([9, 99, 999]);
    return expression("vedic-2", `${formatNumber(n)} + ${add}`, n + add);
  },
  "vedic-3": () => {
    const a = int(20, 9999);
    const b = int(2, Math.min(999, a));
    return expression("vedic-3", `${formatNumber(a)} - ${b}`, a - b);
  },
  "vedic-4": () => {
    const power = choice([100, 1000, 10000, 100000]);
    const x = int(1, power - 1);
    return expression("vedic-4", `${formatNumber(power)} - ${formatNumber(x)}`, power - x);
  },
  "vedic-5": () => {
    const n = int(1, 499999) * 2;
    return expression("vedic-5", `Half of ${formatNumber(n)}`, n / 2, "Find the half");
  },
  "vedic-6": () => {
    const n = int(1, 9999) * 2;
    const by = choice([5, 50]);
    return expression("vedic-6", `${formatNumber(n)} × ${by}`, n * by);
  },
  "vedic-7": () => {
    const n = int(1, 99999);
    return expression("vedic-7", `Double ${formatNumber(n)}`, n * 2, "Double the number");
  },
  "vedic-8": () => {
    const n = int(1, 9999) * 2 + 1;
    const by = choice([5, 50]);
    return expression("vedic-8", `${formatNumber(n)} × ${by}`, n * by);
  },
  "vedic-9": () => {
    const by = choice([5, 50]);
    const quotient = int(1, 9999);
    return expression("vedic-9", `${formatNumber(quotient * by)} ÷ ${by}`, quotient);
  },
  "vedic-10": () => {
    const a = int(10, 99);
    const b = int(10, 99);
    return expression("vedic-10", `${a} × ${b}`, a * b);
  },
  "vedic-11": () => {
    const n = int(1, 9999) * 2;
    return expression("vedic-11", `${formatNumber(n)} × 25`, n * 25);
  },
  "vedic-12": () => {
    const n = int(1, 9999) * 2 + 1;
    return expression("vedic-12", `${formatNumber(n)} × 25`, n * 25);
  },
  "vedic-13": () => {
    const q = int(1, 9999);
    return expression("vedic-13", `${formatNumber(q * 25)} ÷ 25`, q);
  },
  "vedic-14": () => {
    const a = int(100, 999);
    const b = int(10, 99);
    return expression("vedic-14", `${a} × ${b}`, a * b);
  },
  "vedic-15": () => {
    const a = int(100, 999);
    const b = int(100, 999);
    return expression("vedic-15", `${a} × ${b}`, a * b);
  },
  "vedic-16": () => {
    const center = int(20, 200);
    const offsets = Array.from({ length: int(3, 7) }, () => int(-5, 5));
    const nums = offsets.map((offset) => center + offset);
    const total = nums.reduce((a, b) => a + b, 0);
    return expression("vedic-16", `Average of ${nums.join(", ")}`, Math.round(total / nums.length), "Find the average");
  },
  "vedic-17": () => {
    const n = int(10, 9999);
    const by = choice([9, 99, 999]);
    return expression("vedic-17", `${formatNumber(n)} × ${by}`, n * by);
  },
  "vedic-18": () => {
    const base = choice([10, 100, 1000]);
    const a = near(base, Math.max(4, Math.floor(base * 0.08)));
    const b = near(base, Math.max(4, Math.floor(base * 0.08)));
    return expression("vedic-18", `${formatNumber(a)} × ${formatNumber(b)}`, a * b);
  },
  "vedic-19": () => {
    const base = choice([50, 200, 500]);
    const a = near(base, Math.floor(base * 0.08));
    const b = near(base, Math.floor(base * 0.08));
    return expression("vedic-19", `${formatNumber(a)} × ${formatNumber(b)}`, a * b);
  },
  "vedic-20": () => {
    const base = choice([10, 100, 1000]);
    const n = near(base, Math.max(3, Math.floor(base * 0.08)));
    return expression("vedic-20", `${formatNumber(n)}²`, n * n);
  },
  "vedic-21": () => {
    const n = int(1, 99) * 10 + 5;
    return expression("vedic-21", `${formatNumber(n)}²`, n * n);
  },
  "vedic-22": () => {
    const base = choice([50, 200, 500]);
    const a = near(base, Math.floor(base * 0.05));
    const b = near(base, Math.floor(base * 0.05));
    return expression("vedic-22", `${formatNumber(a)} × ${formatNumber(b)}`, a * b);
  },
  "vedic-23": () => {
    const n = int(10, 99999);
    return expression("vedic-23", `${formatNumber(n)} × 11`, n * 11);
  },
  "vedic-24": () => {
    const q = int(10, 99999);
    return expression("vedic-24", `${formatNumber(q * 11)} ÷ 11`, q);
  },
  "vedic-25": () => {
    const tens = int(1, 9);
    const ones = int(1, 9);
    const a = tens * 10 + ones;
    const b = tens * 10 + (10 - ones);
    return expression("vedic-25", `${a} × ${b}`, a * b);
  },
  "vedic-26": () => {
    const ones = int(1, 9);
    const tens = int(1, 9);
    const a = tens * 10 + ones;
    const b = (10 - tens) * 10 + ones;
    return expression("vedic-26", `${a} × ${b}`, a * b);
  },
  "vedic-27": () => {
    const n = int(1, 100);
    return expression("vedic-27", `${n}²`, n * n);
  },
  "vedic-28": () => {
    const n = int(1, 100);
    return { ...expression("vedic-28", `√${formatNumber(n * n)}`, n, "Find the square root"), displayType: "root" };
  },
  "vedic-29": () => {
    const n = int(1, 100);
    return expression("vedic-29", `${n}³`, n ** 3);
  },
  "vedic-30": () => {
    const n = int(1, 100);
    return { ...expression("vedic-30", `∛${formatNumber(n ** 3)}`, n, "Find the cube root"), displayType: "root" };
  },
  "vedic-31": () => {
    const a = int(11, 99);
    const b = int(1, 20);
    return expression("vedic-31", `${a} × ${b}`, a * b);
  },
  "vedic-32": () => {
    const { divisor, quotient, dividend } = exactDivision(2, 9, 1, 999);
    return expression("vedic-32", `${formatNumber(dividend)} ÷ ${divisor}`, quotient);
  },
  "vedic-33": () => {
    const { divisor, quotient, dividend } = exactDivision(11, 99, 1, 999);
    return expression("vedic-33", `${formatNumber(dividend)} ÷ ${divisor}`, quotient);
  }
};
