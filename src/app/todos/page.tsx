import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";
import { CreateTodoForm, TodoList } from "./_components/todo-list";

export default async function TodosPage() {
	const session = await getSession();

	if (!session) {
		redirect("/sign-in");
	}

	void api.todo.list.prefetch();

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<div className="w-full max-w-2xl space-y-6 px-4 py-16">
					<div className="flex items-center justify-between">
						<h1 className="font-extrabold text-4xl tracking-tight">My TODOs</h1>
						<div className="flex items-center gap-4">
							<span className="text-sm text-white/60">
								{session.user.name ?? session.user.email}
							</span>
							<Link
								className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
								href="/sign-out"
							>
								Sign out
							</Link>
						</div>
					</div>

					<CreateTodoForm />

					<Suspense
						fallback={
							<p className="py-8 text-center text-white/50">Loading todos...</p>
						}
					>
						<TodoList />
					</Suspense>
				</div>
			</main>
		</HydrateClient>
	);
}
