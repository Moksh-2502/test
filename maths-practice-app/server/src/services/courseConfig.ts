export type CourseItem = {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Challenge";
  methodTip?: string;
};

export const abacusLevels: CourseItem[] = [
  { id: "abacus-level-0", title: "Level 0: Numbers and Beads", description: "1-100 numbers, before/after, bead values, and single/double digit addition-subtraction.", difficulty: "Beginner" },
  { id: "abacus-level-1", title: "Level 1: 34 Formulas", description: "Big friend, small friend, combination formulas, plus 2-digit addition-subtraction.", difficulty: "Beginner" },
  { id: "abacus-level-2", title: "Level 2: 2-3 Digit Operations", description: "2-3 digit addition-subtraction and 1x2, 2x1, 3x1 multiplication.", difficulty: "Beginner" },
  { id: "abacus-level-3", title: "Level 3: Multiplication, Squares, Division", description: "2-4 digit addition-subtraction, 2x1 through 3x2 multiplication, squares to 20, and basic division.", difficulty: "Intermediate" },
  { id: "abacus-level-4", title: "Level 4: Larger With Abacus", description: "3-5 digit addition-subtraction, 3x1 through 4x2 multiplication, single-digit division, and squares to 35.", difficulty: "Intermediate" },
  { id: "abacus-level-5", title: "Level 5: Decimals and Bigger Division", description: "4-6 digit addition-subtraction, 2x2 through 3x3 multiplication, larger division, decimals, and squares to 50.", difficulty: "Advanced" },
  { id: "abacus-level-6", title: "Level 6: Negative and Decimal Multiplication", description: "Up to 6 digits, 3x2 through 4x3 multiplication, bigger division, decimals, and negative numbers.", difficulty: "Advanced" },
  { id: "abacus-level-7", title: "Level 7: Percentage Challenge", description: "Up to 7 digits, 4x2 through 5x3 multiplication, bigger division, decimals, negatives, and percentages.", difficulty: "Challenge" }
];

const tips = {
  five: "Multiply by 10, then halve.",
  eleven: "For two digits, add the digits and place the sum between them, carrying when needed.",
  lastFive: "For n5 squared, multiply the leading number by the next number, then append 25.",
  base: "Compare both numbers with the nearest base, cross-add the offset, then multiply offsets.",
  division: "Think multiplication in reverse and keep divisibility exact."
};

export const vedicModules: CourseItem[] = [
  ["vedic-1", "Addition by dot system", "Vertical addition of 3-6 numbers.", "Beginner", "Group carries cleanly with dots before writing the answer."],
  ["vedic-2", "Addition by 9", "Add 9, 99, or 999.", "Beginner", "Add the next power of 10, then subtract 1."],
  ["vedic-3", "Subtraction by best friends", "Complements to 10.", "Beginner", "Use number pairs that make 10 to borrow mentally."],
  ["vedic-4", "Subtraction: all from 9 and last from 10", "Subtract from 10, 100, 1000, and beyond.", "Beginner", "For 10^n - x, subtract every digit from 9 except the last from 10."],
  ["vedic-5", "Halving", "Halve even numbers.", "Beginner", "Split large numbers into place-value chunks, halve each, then combine."],
  ["vedic-6", "Multiply by 5 and 50, even number", "Even numbers times 5 or 50.", "Beginner", tips.five],
  ["vedic-7", "Doubling", "Double any number.", "Beginner", "Double from left to right and carry if needed."],
  ["vedic-8", "Multiply by 5 and 50, odd number", "Odd numbers times 5 or 50.", "Beginner", tips.five],
  ["vedic-9", "Division by 5 and 50", "Exact division by 5 or 50.", "Beginner", "Double, then divide by 10 or 100."],
  ["vedic-10", "Vertically and crosswise, 2x2", "2-digit by 2-digit multiplication.", "Intermediate", "Multiply vertically, crosswise, then vertically, handling carries."],
  ["vedic-11", "Multiply by 25, even number", "Even numbers times 25.", "Beginner", "Multiply by 100, then divide by 4."],
  ["vedic-12", "Multiply by 25, odd number", "Odd numbers times 25.", "Beginner", "Multiply by 100, then divide by 4."],
  ["vedic-13", "Division by 25", "Exact division by 25.", "Beginner", "Multiply by 4, then divide by 100."],
  ["vedic-14", "Vertically and crosswise, 3x2", "3-digit by 2-digit multiplication.", "Intermediate", "Extend the crosswise pattern across all digits."],
  ["vedic-15", "Vertically and crosswise, 3x3", "3-digit by 3-digit multiplication.", "Advanced", "Use crosswise groups from right to left."],
  ["vedic-16", "Using average", "Average or total of nearby numbers.", "Intermediate", "Use the center value and balance the offsets."],
  ["vedic-17", "Multiply by 9, parts 1, 2, 3", "Multiply by 9, 99, or 999.", "Intermediate", "Multiply by the next power of 10, then subtract the number."],
  ["vedic-18", "Base method: above base, below base, mixed base", "Pairs near 10, 100, or 1000.", "Intermediate", tips.base],
  ["vedic-19", "Base method: by proportion, sub-base", "Pairs near 50, 200, or 500.", "Advanced", tips.base],
  ["vedic-20", "Square near the base", "Numbers near 10, 100, or 1000.", "Intermediate", "Add the offset once, then append the square of the offset with base-width digits."],
  ["vedic-21", "Square: last digit 5", "Numbers ending in 5.", "Intermediate", tips.lastFive],
  ["vedic-22", "Multiplying near another base", "Pairs near non-standard bases.", "Advanced", tips.base],
  ["vedic-23", "Multiply by 11", "2-5 digit numbers times 11.", "Intermediate", tips.eleven],
  ["vedic-24", "Division by 11", "Exact division by 11.", "Intermediate", tips.division],
  ["vedic-25", "Starting digit same and last digits total 10", "Two-digit shortcut pattern.", "Intermediate", "Multiply the tens digit by the next tens digit, then append the ones product."],
  ["vedic-26", "Last digits same and starting digits total 10", "Two-digit shortcut pattern.", "Intermediate", "Multiply tens digits and add the common ones digit, then append ones squared."],
  ["vedic-27", "Square, 1 to 100", "Squares from 1 to 100.", "Beginner", "Build recall by checking the arithmetic pattern."],
  ["vedic-28", "Square root, 1 to 100", "Square roots of perfect squares.", "Beginner", "Recognize the square and answer its positive root."],
  ["vedic-29", "Cube, 1 to 100", "Cubes from 1 to 100.", "Advanced", "Use known cubes and place-value multiplication."],
  ["vedic-30", "Cube root, 1 to 100", "Cube roots of perfect cubes.", "Advanced", "Recognize the perfect cube and answer its root."],
  ["vedic-31", "Tables, 11 to 99", "Tables through multiplier 20.", "Intermediate", "Break one factor into tens and ones."],
  ["vedic-32", "Division, 2 to 9", "Exact division by single digits.", "Beginner", tips.division],
  ["vedic-33", "Division, 11 to 99", "Exact division by two digits.", "Advanced", tips.division]
].map(([id, title, description, difficulty, methodTip]) => ({
  id,
  title,
  description,
  difficulty: difficulty as CourseItem["difficulty"],
  methodTip
}));

export function getCourseItem(section: string, moduleId: string) {
  return section === "abacus"
    ? abacusLevels.find((item) => item.id === moduleId)
    : vedicModules.find((item) => item.id === moduleId);
}
