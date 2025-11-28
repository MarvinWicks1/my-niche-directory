import SubmitToolForm from "@/components/SubmitToolForm";
import { createClient } from "@supabase/supabase-js";

export default async function SubmitPage() {
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
	const { data: categories } = await supabase
		.from("categories")
		.select("slug, name")
		.order("name", { ascending: true });

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
			<h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
				Submit a Tool
			</h1>
			<SubmitToolForm categories={categories ?? []} />
		</div>
	);
}


