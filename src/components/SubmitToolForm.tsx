"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ImageUpload from "@/components/ImageUpload";

type Category = { slug: string; name: string };

type SubmitToolFormProps = {
	categories: Category[];
	onSubmitted?: (newToolId: string) => void;
};

export default function SubmitToolForm({ categories, onSubmitted }: SubmitToolFormProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [websiteUrl, setWebsiteUrl] = useState("");
	const [affiliateUrl, setAffiliateUrl] = useState("");
	const [pricingModel, setPricingModel] = useState<"free" | "paid">("free");
	const [category, setCategory] = useState(categories[0]?.slug ?? "");
	const [logoUrl, setLogoUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const categoryOptions = useMemo(
		() => categories.map((c) => ({ value: c.slug, label: c.name })),
		[categories]
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setIsSubmitting(true);

		try {
			if (!name.trim()) throw new Error("Name is required.");
			if (!category) throw new Error("Category is required.");
			if (!websiteUrl.trim()) throw new Error("Website URL is required.");

			const { data, error: insertError } = await supabase
				.from("tools")
				.insert([
					{
						name,
						description: description || null,
						website_url: websiteUrl,
						affiliate_url: affiliateUrl || null,
						pricing_model: pricingModel,
						category,
						logo_url: logoUrl || null,
					},
				])
				.select("id")
				.single();

			if (insertError) throw insertError;
			setSuccess("Tool submitted successfully.");
			if (onSubmitted && data?.id) onSubmitted(data.id as string);

			// Reset minimal fields; keep logo preview
			setName("");
			setDescription("");
			setWebsiteUrl("");
			setAffiliateUrl("");
			setPricingModel("free");
			setCategory(categories[0]?.slug ?? "");
			// keep logoUrl as-is so user sees uploaded asset
		} catch (err: any) {
			setError(err?.message ?? "Submission failed.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
					Tool name
				</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g., RoomAI"
					className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
					required
				/>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
					Description
				</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={3}
					placeholder="Short summary of what the tool does"
					className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
						Website URL
					</label>
					<input
						type="url"
						value={websiteUrl}
						onChange={(e) => setWebsiteUrl(e.target.value)}
						placeholder="https://example.com"
						className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
						Affiliate URL (optional)
					</label>
					<input
						type="url"
						value={affiliateUrl}
						onChange={(e) => setAffiliateUrl(e.target.value)}
						placeholder="https://affiliate.example.com"
						className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
						Pricing model
					</label>
					<select
						value={pricingModel}
						onChange={(e) => setPricingModel(e.target.value as "free" | "paid")}
						className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
					>
						<option value="free">Free</option>
						<option value="paid">Paid</option>
					</select>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
						Category
					</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
					>
						{categoryOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<ImageUpload
					label="Logo"
					onUploadComplete={(url) => setLogoUrl(url)}
				/>
				{logoUrl && (
					<p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 break-all">
						Logo URL: {logoUrl}
					</p>
				)}
			</div>

			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					{isSubmitting ? "Submitting..." : "Submit Tool"}
				</button>
				{error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
				{success && <span className="text-sm text-green-600 dark:text-green-400">{success}</span>}
			</div>
		</form>
	);
}


