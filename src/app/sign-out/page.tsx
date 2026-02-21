"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "~/server/better-auth/client";

export default function SignOutPage() {
	const router = useRouter();
	const [signingOut, setSigningOut] = useState(true);

	useEffect(() => {
		async function performSignOut() {
			await authClient.signOut();
			setSigningOut(false);
			router.push("/sign-in");
			router.refresh();
		}
		void performSignOut();
	}, [router]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="text-center">
				<h1 className="font-extrabold text-4xl tracking-tight">
					{signingOut ? "Signing out..." : "Signed out"}
				</h1>
				<p className="mt-2 text-white/60">
					{signingOut ? "Please wait" : "Redirecting to sign in..."}
				</p>
			</div>
		</main>
	);
}
