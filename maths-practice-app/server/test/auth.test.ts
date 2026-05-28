import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/services/auth.js";

describe("password hashing", () => {
  it("hashes and verifies passwords without storing raw text", async () => {
    const hash = await hashPassword("StrongPassword123");
    expect(hash).not.toBe("StrongPassword123");
    expect(await verifyPassword("StrongPassword123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});
