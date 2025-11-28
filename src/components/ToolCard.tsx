import Link from "next/link";
import Image from "next/image";

export type ToolCardProps = {
	href: string;
	name: string;
	description: string;
	category: string;
	logoUrl?: string | null;
};

export default function ToolCard({
	href,
	name,
	description,
	category,
	logoUrl,
}: ToolCardProps) {
	return (
		<Link
			href={href}
			aria-label={`View ${name}`}
			className="group block rounded-lg border border-neutral-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800/70 dark:bg-neutral-950"
		>
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
					<div className="mb-1 flex items-center gap-2">
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
				</div>
			</div>
		</Link>
	);
}


