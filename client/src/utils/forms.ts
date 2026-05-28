import type { ZodSchema } from "zod";

export function zodResolver<T>(schema: ZodSchema<T>, value: unknown): { ok: true; value: T } | { ok: false; message: string } {
  const parsed = schema.safeParse(value);
  if (parsed.success) return { ok: true, value: parsed.data };
  return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid form" };
}
