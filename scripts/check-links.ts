import { createClient } from "@supabase/supabase-js";

type ToolRow = {
	id: string;
	name: string;
	website_url: string | null;
	affiliate_url: string | null;
};

const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function headOk(url: string): Promise<{ ok: boolean; status?: number }> {
	try {
		const res = await fetch(url, { method: "HEAD", redirect: "follow" });
		// Treat 404 as failure; other statuses like 405 (Method Not Allowed) should not fail the check
		if (res.status === 404) {
			return { ok: false, status: res.status };
		}
		return { ok: true, status: res.status };
	} catch {
		return { ok: false };
	}
}

async function main() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!supabaseUrl || !supabaseAnonKey) {
		console.error(
			`${RED}Missing env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY${RESET}`
		);
		process.exit(1);
	}

	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase
		.from("tools")
		.select("id, name, website_url, affiliate_url")
		.order("name", { ascending: true });

	if (error) {
		console.error(`${RED}Failed to fetch tools: ${error.message}${RESET}`);
		process.exit(1);
	}

	const tools = (data ?? []) as ToolRow[];
	let totalChecked = 0;
	let totalFailed = 0;

	for (const t of tools) {
		const urls = [t.affiliate_url, t.website_url].filter(
			(u): u is string => !!u && /^https?:\/\//i.test(u)
		);
		for (const url of urls) {
			totalChecked += 1;
			const { ok, status } = await headOk(url);
			if (!ok) {
				totalFailed += 1;
				console.log(
					`${RED}Bad link [${status ?? "ERR"}]: ${t.name} (id=${t.id}) -> ${url}${RESET}`
				);
			}
			// 500ms delay between requests to avoid rate limiting
			await sleep(500);
		}
	}

	console.log(
		`Checked ${totalChecked} link(s). ${totalFailed > 0 ? RED : ""}${totalFailed} failed${RESET}.`
	);
}

// Execute if run directly
// Run with: npx tsx scripts/check-links.ts
main().catch((e) => {
	console.error(`${RED}Unexpected error: ${e?.message ?? e}${RESET}`);
	process.exit(1);
});


