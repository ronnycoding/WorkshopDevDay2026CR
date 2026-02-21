import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todo, todoStatusValues } from "~/server/db/schema";

export const todoRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({ description: z.string().min(1, "Description is required") }),
		)
		.mutation(async ({ ctx, input }) => {
			const [newTodo] = await ctx.db
				.insert(todo)
				.values({
					description: input.description,
					userId: ctx.session.user.id,
				})
				.returning();
			return newTodo;
		}),

	list: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.query.todo.findMany({
			where: eq(todo.userId, ctx.session.user.id),
			orderBy: (todo, { desc }) => [desc(todo.createdAt)],
		});
	}),

	updateStatus: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				status: z.enum(todoStatusValues),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [updated] = await ctx.db
				.update(todo)
				.set({ status: input.status })
				.where(and(eq(todo.id, input.id), eq(todo.userId, ctx.session.user.id)))
				.returning();
			return updated;
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.delete(todo)
				.where(
					and(eq(todo.id, input.id), eq(todo.userId, ctx.session.user.id)),
				);
		}),
});
