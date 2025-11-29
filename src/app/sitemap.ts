import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
	const vercelUrl = (process.env.VERCEL_URL || "").trim();
	const siteUrl =
		envSiteUrl && /^https?:\/\//i.test(envSiteUrl)
			? envSiteUrl
			: vercelUrl
			? `https://${vercelUrl}`
			: "http://localhost:3000";
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	let categorySlugs: string[] = [];
	if (supabaseUrl && supabaseAnonKey) {
		try {
			const supabase = createClient(supabaseUrl, supabaseAnonKey);
			const { data } = await supabase.from("categories").select("slug");
			categorySlugs = (data ?? []).map((c: { slug: string }) => c.slug);
		} catch {
			// ignore and fallback to only root
		}
	}

	const entries: MetadataRoute.Sitemap = [
		{
			url: `${siteUrl}/`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		...categorySlugs.map<MetadataRoute.Sitemap[number]>((slug) => ({
			url: `${siteUrl}/category/${slug}`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		})),
	];

	return entries;
}


