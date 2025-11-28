import Link from "next/link";
import Image from "next/image";

export type ToolCardProps = {
	name: string;
	description: string;
	category: string;
	logoUrl?: string | null;
	websiteUrl?: string | null;
	affiliateUrl?: string | null;
	isFeatured?: boolean;
};

export default function ToolCard({
	name,
	description,
	category,
	logoUrl,
	websiteUrl,
	affiliateUrl,
	isFeatured = false,
}: ToolCardProps) {
	const destination = affiliateUrl ?? websiteUrl ?? "#";
	const isAffiliate = Boolean(affiliateUrl);
	const rel = isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer";
	const baseCard =
		"group block rounded-lg border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:bg-neutral-950";
	const nonFeaturedBorder = "border-neutral-200/70 dark:border-neutral-800/70";
	const featuredBorder = "border-yellow-400";
	const featuredBg = "bg-yellow-50/70 dark:bg-yellow-950/20";

	return (
		<Link
			href={destination}
			aria-label={`Visit ${name} website`}
			className={`${baseCard} ${isFeatured ? featuredBorder : nonFeaturedBorder} ${isFeatured ? featuredBg : ""} relative`}
			target="_blank"
			rel={rel}
			onClick={() => {
				// Simple analytics placeholder
				// eslint-disable-next-line no-console
				console.log(`Outbound Click: ${name}`);
			}}
		>
			{isFeatured && (
				<span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-800 ring-1 ring-inset ring-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-200 dark:ring-yellow-700">
					Featured
				</span>
			)}
			<div className="flex items-start gap-4">
				<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800">
					{logoUrl ? (
						<Image
							src={logoUrl}
							alt={`${name} logo`}
							fill
							sizes="48px"
							className="object-contain p-1"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm font-medium text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
							{name.slice(0, 1).toUpperCase()}
						</div>
					)}
				</div>

				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-center gap-2">
						<h3 className="truncate text-base font-semibold text-neutral-900 group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-200">
							{name}
						</h3>
						<span className="ml-auto inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:ring-neutral-800">
							{category}
						</span>
					</div>
					<p className="text-sm text-neutral-600 dark:text-neutral-300 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
						{description}
					</p>

					{/* CTA styled as a button; the entire card is the link */}
					<span
						className="mt-3 inline-flex rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition group-hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:group-hover:bg-neutral-200"
						aria-hidden="true"
					>
						Visit Website
					</span>
				</div>
			</div>
		</Link>
	);
}


