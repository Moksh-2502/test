import { abacusGenerators } from "./abacusGenerators.js";
import { vedicGenerators } from "./vedicGenerators.js";
import type { GeneratedQuestion, Section } from "./types.js";

export { publicQuestion, signature } from "./utils.js";
export type { GeneratedQuestion, PublicQuestion, Section } from "./types.js";

export function generateQuestion(section: Section, moduleId: string): GeneratedQuestion {
  const registry = section === "abacus" ? abacusGenerators : vedicGenerators;
  const generator = registry[moduleId];
  if (!generator) {
    throw new Error(`Unknown module: ${section}/${moduleId}`);
  }
  return generator();
}
