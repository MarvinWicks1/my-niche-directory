import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ToolCard from "@/components/ToolCard";

export const revalidate = 3600; // ISR for fresher content + SEO

type PageProps = {
	params: { slug: string };
};

async function getClients() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!supabaseUrl || !supabaseAnonKey) return null;
	return createClient(supabaseUrl, supabaseAnonKey);
}

export async function generateStaticParams() {
	const supabase = await getClients();
	if (!supabase) return [];
	const { data } = await supabase.from("categories").select("slug");
	return (data ?? []).map((c: { slug: string }) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const supabase = await getClients();
	if (!supabase) {
		return {
			title: `Best AI Tools for ${params.slug} | AI Interior Tools`,
			description: `Discover top AI tools for ${params.slug} to speed up workflows and elevate interior design outcomes.`,
			alternates: {
				canonical: `/category/${params.slug}`,
			},
			openGraph: {
				type: "website",
				url: `/category/${params.slug}`,
				title: `Best AI Tools for ${params.slug} | AI Interior Tools`,
				description: `Discover top AI tools for ${params.slug} to speed up workflows and elevate interior design outcomes.`,
			},
			twitter: {
				card: "summary_large_image",
				title: `Best AI Tools for ${params.slug} | AI Interior Tools`,
				description: `Discover top AI tools for ${params.slug} to speed up workflows and elevate interior design outcomes.`,
			},
		};
	}
	const { data: category } = await supabase
		.from("categories")
		.select("name, slug")
		.eq("slug", params.slug)
		.maybeSingle();

	const categoryName = category?.name ?? params.slug;
	return {
		title: `Best AI Tools for ${categoryName} | AI Interior Tools`,
		description: `Discover top AI tools for ${categoryName} to speed up workflows and elevate interior design outcomes.`,
		alternates: {
			canonical: `/category/${params.slug}`,
		},
		openGraph: {
			type: "website",
			url: `/category/${params.slug}`,
			title: `Best AI Tools for ${categoryName} | AI Interior Tools`,
			description: `Discover top AI tools for ${categoryName} to speed up workflows and elevate interior design outcomes.`,
		},
		twitter: {
			card: "summary_large_image",
			title: `Best AI Tools for ${categoryName} | AI Interior Tools`,
			description: `Discover top AI tools for ${categoryName} to speed up workflows and elevate interior design outcomes.`,
		},
	};
}

export default async function CategoryPage({ params }: PageProps) {
	const supabase = await getClients();
	if (!supabase) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16 text-sm text-neutral-700 dark:text-neutral-300">
				Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
			</div>
		);
	}

	const [{ data: category }, { data: tools }] = await Promise.all([
		supabase.from("categories").select("name, slug").eq("slug", params.slug).maybeSingle(),
		supabase
			.from("tools")
			.select("id, name, description, category, logo_url, website_url")
			.eq("category", params.slug)
			.order("name", { ascending: true }),
	]);

	if (!category) notFound();

	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
			<header className="mb-6">
				<h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
					{category.name}
				</h1>
				<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
					{tools?.length ?? 0} tool{(tools?.length ?? 0) === 1 ? "" : "s"} in this category
				</p>
			</header>

			{!tools || tools.length === 0 ? (
				<p className="text-sm text-neutral-600 dark:text-neutral-300">
					No tools found for this category.
				</p>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{tools.map((t) => (
						<ToolCard
							key={t.id}
							href={t.website_url ?? "#"}
							name={t.name}
							description={t.description ?? ""}
							category={category.name}
							logoUrl={t.logo_url ?? undefined}
						/>
					))}
				</div>
			)}
		</div>
	);
}


