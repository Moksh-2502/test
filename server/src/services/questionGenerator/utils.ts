import type { GeneratedQuestion } from "./types.js";

export function int(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function choice<T>(items: T[]) {
  return items[int(0, items.length - 1)];
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

export function compactExpression(expression: string) {
  return expression.replace(/\s+/g, "");
}

export function signature(question: GeneratedQuestion) {
  return `${question.section}:${question.moduleId}:${compactExpression(question.expression ?? question.prompt)}`;
}

export function publicQuestion(question: GeneratedQuestion) {
  const { correctAnswer: _correctAnswer, ...safe } = question;
  return safe;
}

export function exactDivision(divisorMin: number, divisorMax: number, quotientMin: number, quotientMax: number) {
  const divisor = int(divisorMin, divisorMax);
  const quotient = int(quotientMin, quotientMax);
  return { divisor, quotient, dividend: divisor * quotient };
}

export function nonNegativeAddSub(termCount: number, maxTerm: number) {
  const terms = Array.from({ length: termCount }, () => int(0, maxTerm));
  const ops: string[] = [];
  let total = terms[0];

  for (let i = 1; i < terms.length; i += 1) {
    const canSubtract = total - terms[i] >= 0;
    const op = canSubtract ? choice(["+", "-"]) : "+";
    ops.push(op);
    total = op === "+" ? total + terms[i] : total - terms[i];
  }

  const expression = terms.slice(1).reduce((acc, term, index) => `${acc} ${ops[index]} ${term}`, `${terms[0]}`);
  return { expression, terms, total };
}

export function evalLeftToRightParts(parts: Array<number | string>) {
  const normalized = parts.map(String);
  const multDiv: Array<number | string> = [];
  for (let i = 0; i < normalized.length; i += 1) {
    const token = normalized[i];
    if (token === "×" || token === "÷") {
      const prev = Number(multDiv.pop());
      const next = Number(normalized[++i]);
      multDiv.push(token === "×" ? prev * next : prev / next);
    } else {
      multDiv.push(token);
    }
  }

  let total = Number(multDiv[0]);
  for (let i = 1; i < multDiv.length; i += 2) {
    const op = multDiv[i];
    const n = Number(multDiv[i + 1]);
    total = op === "+" ? total + n : total - n;
  }
  return total;
}
