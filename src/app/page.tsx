import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";

export default async function Home() {
	const session = await getSession();

	if (session) {
		redirect("/todos");
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
				<h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
					TODO <span className="text-[hsl(280,100%,70%)]">App</span>
				</h1>
				<p className="max-w-md text-center text-lg text-white/60">
					A simple task management tool. Track your tasks from creation through
					completion.
				</p>
				<div className="flex gap-4">
					<Link
						className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,60%)]"
						href="/sign-up"
					>
						Get Started
					</Link>
					<Link
						className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
						href="/sign-in"
					>
						Sign In
					</Link>
				</div>
			</div>
		</main>
	);
}
