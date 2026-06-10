import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const pnpmDir = join(process.cwd(), "node_modules", ".pnpm");
const target = join(process.cwd(), "node_modules", ".prisma");

if (!existsSync(pnpmDir)) {
  console.log("No pnpm store found; skipping Prisma client copy.");
  process.exit(0);
}

const prismaClientPackage = readdirSync(pnpmDir).find((name) => name.startsWith("@prisma+client@"));
if (!prismaClientPackage) {
  console.log("No generated Prisma client package found; skipping Prisma client copy.");
  process.exit(0);
}

const source = join(pnpmDir, prismaClientPackage, "node_modules", ".prisma");
if (!existsSync(source)) {
  console.log("No generated .prisma directory found; skipping Prisma client copy.");
  process.exit(0);
}

rmSync(target, { force: true, recursive: true });
mkdirSync(join(process.cwd(), "node_modules"), { recursive: true });
cpSync(source, target, { recursive: true });
console.log(`Copied generated Prisma client to ${target}`);
