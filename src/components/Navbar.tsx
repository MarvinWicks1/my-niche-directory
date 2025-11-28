import Link from "next/link";
import Image from "next/image";
import { Plus, Sparkles } from "lucide-react";

export default function Navbar() {
	return (
		<header className="w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-neutral-800/60 dark:bg-neutral-950/70">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
				{/* Left: Logo */}
				<Link href="/" className="flex items-center gap-2 group">
					{/* Prefer an SVG/PNG logo in /public if available; fallback to icon + text */}
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-100 text-neutral-800 ring-1 ring-inset ring-neutral-200 group-hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-800">
						<Sparkles className="h-5 w-5" aria-hidden="true" />
					</span>
					<span className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
						AI Interior Tools
					</span>
				</Link>

				{/* Right: Submit button */}
				<Link
					href="/submit"
					className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					<Plus className="h-4 w-4" aria-hidden="true" />
					<span>Submit a Tool</span>
				</Link>
			</nav>
		</header>
	);
}


