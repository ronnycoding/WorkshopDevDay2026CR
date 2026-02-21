import { describe, expect, it } from "vitest";
import { z } from "zod";
import { todoStatusValues } from "~/server/db/schema";

describe("TODO Router validation", () => {
	const createInput = z.object({
		description: z.string().min(1, "Description is required"),
	});

	const updateStatusInput = z.object({
		id: z.number(),
		status: z.enum(todoStatusValues),
	});

	const deleteInput = z.object({ id: z.number() });

	describe("create input", () => {
		it("should accept valid description", () => {
			const result = createInput.safeParse({ description: "Buy groceries" });
			expect(result.success).toBe(true);
		});

		it("should reject empty description", () => {
			const result = createInput.safeParse({ description: "" });
			expect(result.success).toBe(false);
		});

		it("should reject missing description", () => {
			const result = createInput.safeParse({});
			expect(result.success).toBe(false);
		});
	});

	describe("updateStatus input", () => {
		it("should accept valid status transitions", () => {
			for (const status of todoStatusValues) {
				const result = updateStatusInput.safeParse({ id: 1, status });
				expect(result.success).toBe(true);
			}
		});

		it("should reject invalid status", () => {
			const result = updateStatusInput.safeParse({
				id: 1,
				status: "INVALID",
			});
			expect(result.success).toBe(false);
		});

		it("should reject non-numeric id", () => {
			const result = updateStatusInput.safeParse({
				id: "abc",
				status: "PENDING",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("delete input", () => {
		it("should accept valid id", () => {
			const result = deleteInput.safeParse({ id: 1 });
			expect(result.success).toBe(true);
		});

		it("should reject missing id", () => {
			const result = deleteInput.safeParse({});
			expect(result.success).toBe(false);
		});
	});
});
