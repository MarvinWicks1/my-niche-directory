import MainPage from "@/components/MainPage";
import { createClient } from "@supabase/supabase-js";

export default async function Home() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16 text-sm text-neutral-700 dark:text-neutral-300">
				Missing Supabase environment variables. Please set
				NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
			</div>
		);
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const [{ data: tools, error: toolsError }, { data: categories, error: categoriesError }] =
		await Promise.all([
			supabase
				.from("tools")
				.select("id, name, description, category, logo_url, website_url, affiliate_url, is_featured")
				.order("is_featured", { ascending: false })
				.order("name", { ascending: true }),
			supabase.from("categories").select("slug, name").order("name", { ascending: true }),
		]);

	if (toolsError || categoriesError) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16 text-sm text-red-600 dark:text-red-400">
				Failed to load data from Supabase.
			</div>
		);
	}

	return <MainPage initialTools={tools ?? []} categories={categories ?? []} />;
}
