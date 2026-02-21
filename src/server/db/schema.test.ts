import { describe, expect, it } from "vitest";
import { todo, todoStatusValues } from "./schema";

describe("TODO Schema", () => {
	it("should define todoStatusValues as PENDING, IN_PROGRESS, DONE", () => {
		expect(todoStatusValues).toEqual(["PENDING", "IN_PROGRESS", "DONE"]);
	});

	it("should have exactly 3 status values", () => {
		expect(todoStatusValues).toHaveLength(3);
	});

	it("should have required columns", () => {
		const columnNames = Object.keys(todo);
		expect(columnNames).toContain("id");
		expect(columnNames).toContain("description");
		expect(columnNames).toContain("status");
		expect(columnNames).toContain("userId");
		expect(columnNames).toContain("createdAt");
		expect(columnNames).toContain("updatedAt");
	});

	it("should default status to PENDING", () => {
		const statusColumn = todo.status;
		expect(statusColumn.default).toBeDefined();
	});
});
