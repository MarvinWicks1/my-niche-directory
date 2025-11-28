"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";

export type Tool = {
	id: string;
	name: string;
	description: string | null;
	category: string;
	logo_url: string | null;
	website_url: string | null;
	affiliate_url: string | null;
	is_featured: boolean | null;
};

export type Category = {
	slug: string;
	name: string;
};

export default function MainPage({
	initialTools,
	categories,
}: {
	initialTools: Tool[];
	categories: Category[];
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

	const categoryLabelBySlug = useMemo(() => {
		const map: Record<string, string> = {};
		for (const c of categories) map[c.slug] = c.name;
		return map;
	}, [categories]);

	const toggleCategory = (slug: string) => {
		setSelectedCategories(prev => {
			const next = new Set(prev);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			return next;
		});
	};

	const filtered = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return initialTools.filter(t => {
			const matchesSearch =
				q.length === 0 ||
				t.name.toLowerCase().includes(q) ||
				(t.description ?? "").toLowerCase().includes(q);
			const matchesCategory =
				selectedCategories.size === 0 || selectedCategories.has(t.category);
			return matchesSearch && matchesCategory;
		});
	}, [initialTools, searchQuery, selectedCategories]);

	return (
		<div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
			{/* Search */}
			<div className="mb-6">
				<label htmlFor="search" className="sr-only">
					Search tools
				</label>
				<input
					id="search"
					type="search"
					placeholder="Search tools..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 outline-none ring-0 transition focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
				{/* Sidebar */}
				<aside className="md:col-span-3">
					<div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
						<h2 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
							Categories
						</h2>
						<div className="flex flex-col gap-2">
							{categories.map((cat) => {
								const checked = selectedCategories.has(cat.slug);
								return (
									<label
										key={cat.slug}
										className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
									>
										<input
											type="checkbox"
											checked={checked}
											onChange={() => toggleCategory(cat.slug)}
											className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:checked:bg-neutral-100 dark:checked:text-neutral-100"
										/>
										<span>{cat.name}</span>
									</label>
								);
							})}
						</div>
					</div>
				</aside>

				{/* Results */}
				<section className="md:col-span-9">
					{filtered.length === 0 ? (
						<p className="text-sm text-neutral-600 dark:text-neutral-300">
							No tools found. Try adjusting your search or filters.
						</p>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filtered.map((t) => (
								<ToolCard
									key={t.id}
									name={t.name}
									description={t.description ?? ""}
									category={categoryLabelBySlug[t.category] ?? t.category}
									logoUrl={t.logo_url ?? undefined}
									websiteUrl={t.website_url ?? undefined}
									affiliateUrl={t.affiliate_url ?? undefined}
									isFeatured={Boolean(t.is_featured)}
								/>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}


