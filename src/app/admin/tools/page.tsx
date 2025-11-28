"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Tool = {
	id: string;
	name: string;
	website_url: string | null;
	is_featured: boolean | null;
};

const ADMIN_PASSWORD = "letmein123"; // basic hardcoded gate; replace as needed

type Toast = { id: number; message: string; type?: "success" | "error" };

export default function AdminToolsPage() {
	const [authed, setAuthed] = useState(false);
	const [password, setPassword] = useState("");
	const [tools, setTools] = useState<Tool[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (message: string, type: "success" | "error" = "success") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 2500);
	};

	const loadTools = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("tools")
			.select("id, name, website_url, is_featured")
			.order("is_featured", { ascending: false })
			.order("name", { ascending: true });
		if (error) {
			addToast("Failed to load tools", "error");
		}
		setTools(data ?? []);
		setLoading(false);
	};

	useEffect(() => {
		if (authed) {
			loadTools();
		}
	}, [authed]);

	const handleToggleFeatured = async (toolId: string, next: boolean) => {
		// optimistic UI
		setTools((prev) =>
			(prev ?? []).map((t) => (t.id === toolId ? { ...t, is_featured: next } : t))
		);
		try {
			const res = await fetch("/api/admin/feature-tool", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-admin-password": password,
				},
				body: JSON.stringify({ id: toolId, is_featured: next }),
			});
			if (!res.ok) {
				throw new Error("Request failed");
			}
			addToast("Updated featured status", "success");
		} catch (e) {
			// revert on failure
			setTools((prev) =>
				(prev ?? []).map((t) => (t.id === toolId ? { ...t, is_featured: !next } : t))
			);
			addToast("Failed to update", "error");
		}
	};

	if (!authed) {
		return (
			<div className="mx-auto max-w-sm px-4 py-16">
				<h1 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
					Admin Login
				</h1>
				<label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
					Password
				</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="mb-3 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
				/>
				<button
					type="button"
					onClick={() => setAuthed(password === ADMIN_PASSWORD)}
					className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					Enter
				</button>
				{password && password !== ADMIN_PASSWORD && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-400">Incorrect password</p>
				)}
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
			<h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
				Admin — Tools
			</h1>

			<div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
				<table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
					<thead className="bg-neutral-50 dark:bg-neutral-900">
						<tr>
							<th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
								Name
							</th>
							<th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
								URL
							</th>
							<th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
								Featured
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
						{loading && (
							<tr>
								<td colSpan={3} className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
									Loading...
								</td>
							</tr>
						)}
						{!loading && tools?.length === 0 && (
							<tr>
								<td colSpan={3} className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-300">
									No tools found.
								</td>
							</tr>
						)}
						{!loading &&
							tools?.map((t) => (
								<tr key={t.id}>
									<td className="px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100">
										{t.name}
									</td>
									<td className="px-4 py-2 text-sm">
										{t.website_url ? (
											<a
												href={t.website_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-neutral-700 underline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
											>
												{t.website_url}
											</a>
										) : (
											<span className="text-neutral-500 dark:text-neutral-400">—</span>
										)}
									</td>
									<td className="px-4 py-2">
										<input
											type="checkbox"
											checked={Boolean(t.is_featured)}
											onChange={(e) => handleToggleFeatured(t.id, e.target.checked)}
											className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:checked:bg-neutral-100 dark:checked:text-neutral-100"
										/>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			{/* Simple toast stack */}
			<div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={`pointer-events-auto rounded-md px-3 py-2 text-sm shadow ${
							t.type === "error"
								? "bg-red-600 text-white"
								: "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
						}`}
					>
						{t.message}
					</div>
				))}
			</div>
		</div>
	);
}


