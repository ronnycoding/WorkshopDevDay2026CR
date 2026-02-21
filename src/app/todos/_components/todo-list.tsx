"use client";

import { useState } from "react";
import type { TodoStatus } from "~/server/db/schema";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<TodoStatus, string> = {
	PENDING: "Pending",
	IN_PROGRESS: "In Progress",
	DONE: "Done",
};

const STATUS_COLORS: Record<TodoStatus, string> = {
	PENDING: "bg-yellow-500/20 text-yellow-200",
	IN_PROGRESS: "bg-blue-500/20 text-blue-200",
	DONE: "bg-green-500/20 text-green-200",
};

const NEXT_STATUS: Record<TodoStatus, TodoStatus | null> = {
	PENDING: "IN_PROGRESS",
	IN_PROGRESS: "DONE",
	DONE: null,
};

export function CreateTodoForm() {
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const utils = api.useUtils();

	const createTodo = api.todo.create.useMutation({
		onSuccess: async () => {
			await utils.todo.list.invalidate();
			setDescription("");
			setError("");
		},
		onError: (err) => {
			const zodError = err.data?.zodError?.fieldErrors?.description;
			setError(zodError?.[0] ?? err.message);
		},
	});

	return (
		<form
			className="flex gap-2"
			onSubmit={(e) => {
				e.preventDefault();
				if (!description.trim()) {
					setError("Description is required");
					return;
				}
				createTodo.mutate({ description: description.trim() });
			}}
		>
			<div className="flex flex-1 flex-col">
				<input
					className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
					onChange={(e) => {
						setDescription(e.target.value);
						setError("");
					}}
					placeholder="What needs to be done?"
					type="text"
					value={description}
				/>
				{error && <p className="mt-1 text-red-300 text-sm">{error}</p>}
			</div>
			<button
				className="rounded-lg bg-[hsl(280,100%,70%)] px-6 py-3 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
				disabled={createTodo.isPending}
				type="submit"
			>
				{createTodo.isPending ? "Adding..." : "Add"}
			</button>
		</form>
	);
}

export function TodoList() {
	const [todos] = api.todo.list.useSuspenseQuery();
	const utils = api.useUtils();

	const updateStatus = api.todo.updateStatus.useMutation({
		onSuccess: () => utils.todo.list.invalidate(),
	});

	const deleteTodo = api.todo.delete.useMutation({
		onSuccess: () => utils.todo.list.invalidate(),
	});

	if (todos.length === 0) {
		return (
			<p className="py-8 text-center text-white/50">
				No todos yet. Add one above!
			</p>
		);
	}

	return (
		<ul className="space-y-2">
			{todos.map((item) => {
				const nextStatus = NEXT_STATUS[item.status as TodoStatus];
				return (
					<li
						className="flex items-center gap-3 rounded-lg bg-white/5 p-4"
						key={item.id}
					>
						<span
							className={`rounded-full px-3 py-1 font-medium text-xs ${STATUS_COLORS[item.status as TodoStatus]}`}
						>
							{STATUS_LABELS[item.status as TodoStatus]}
						</span>

						<span
							className={`flex-1 ${item.status === "DONE" ? "text-white/40 line-through" : "text-white"}`}
						>
							{item.description}
						</span>

						<div className="flex gap-2">
							{nextStatus && (
								<button
									className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20 disabled:opacity-50"
									disabled={updateStatus.isPending}
									onClick={() =>
										updateStatus.mutate({
											id: item.id,
											status: nextStatus,
										})
									}
									type="button"
								>
									{nextStatus === "IN_PROGRESS" ? "Start" : "Complete"}
								</button>
							)}
							<button
								className="rounded-lg bg-red-500/20 px-3 py-1 text-red-200 text-sm transition hover:bg-red-500/30 disabled:opacity-50"
								disabled={deleteTodo.isPending}
								onClick={() => deleteTodo.mutate({ id: item.id })}
								type="button"
							>
								Delete
							</button>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
