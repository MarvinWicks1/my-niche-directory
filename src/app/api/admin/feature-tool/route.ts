import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = "letmein123"; // must match client gate

export async function POST(req: Request) {
	try {
		const { id, is_featured } = await req.json();
		const pass = req.headers.get("x-admin-password") ?? "";
		if (pass !== ADMIN_PASSWORD) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		if (!id || typeof is_featured !== "boolean") {
			return NextResponse.json({ error: "Invalid body" }, { status: 400 });
		}

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
		if (!supabaseUrl || !serviceKey) {
			return NextResponse.json({ error: "Server not configured" }, { status: 500 });
		}

		const supabase = createClient(supabaseUrl, serviceKey, {
			auth: { persistSession: false, autoRefreshToken: false },
		});

		const { error } = await supabase
			.from("tools")
			.update({ is_featured })
			.eq("id", id);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ ok: true });
	} catch (e: any) {
		return NextResponse.json({ error: "Bad Request" }, { status: 400 });
	}
}


