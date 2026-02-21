"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/server/better-auth/client";

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		const { error: signUpError } = await authClient.signUp.email({
			name,
			email,
			password,
		});

		if (signUpError) {
			setError(signUpError.message ?? "Sign up failed");
			setLoading(false);
			return;
		}

		router.push("/");
		router.refresh();
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="w-full max-w-md space-y-8 px-4">
				<div className="text-center">
					<h1 className="font-extrabold text-4xl tracking-tight">Sign Up</h1>
					<p className="mt-2 text-white/60">Create your account</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					{error && (
						<div className="rounded-lg bg-red-500/20 p-3 text-center text-red-200 text-sm">
							{error}
						</div>
					)}

					<div>
						<label className="mb-1 block text-sm text-white/80" htmlFor="name">
							Name
						</label>
						<input
							autoComplete="name"
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
							id="name"
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							required
							type="text"
							value={name}
						/>
					</div>

					<div>
						<label className="mb-1 block text-sm text-white/80" htmlFor="email">
							Email
						</label>
						<input
							autoComplete="email"
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
							id="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							type="email"
							value={email}
						/>
					</div>

					<div>
						<label
							className="mb-1 block text-sm text-white/80"
							htmlFor="password"
						>
							Password
						</label>
						<input
							autoComplete="new-password"
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(280,100%,70%)]"
							id="password"
							minLength={8}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Min. 8 characters"
							required
							type="password"
							value={password}
						/>
					</div>

					<button
						className="w-full rounded-lg bg-[hsl(280,100%,70%)] px-4 py-3 font-semibold text-white transition hover:bg-[hsl(280,100%,60%)] disabled:opacity-50"
						disabled={loading}
						type="submit"
					>
						{loading ? "Creating account..." : "Sign Up"}
					</button>
				</form>

				<p className="text-center text-sm text-white/60">
					Already have an account?{" "}
					<Link
						className="text-[hsl(280,100%,70%)] hover:underline"
						href="/sign-in"
					>
						Sign in
					</Link>
				</p>
			</div>
		</main>
	);
}
