export function normalizeAnswer(answer: string) {
  return answer.trim().replace(/,/g, "");
}

export function isNumericAnswer(answer: string) {
  return /^-?\d+(\.\d+)?$/.test(normalizeAnswer(answer));
}

export function roundAccuracy(correct: number, attempted: number) {
  if (attempted === 0) return 0;
  return Math.round((correct / attempted) * 1000) / 10;
}
