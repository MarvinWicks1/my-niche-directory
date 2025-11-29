import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
	const vercelUrl = (process.env.VERCEL_URL || "").trim();
	const siteUrl =
		envSiteUrl && /^https?:\/\//i.test(envSiteUrl)
			? envSiteUrl
			: vercelUrl
			? `https://${vercelUrl}`
			: "http://localhost:3000";
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${siteUrl}/sitemap.xml`,
		host: siteUrl,
	};
}


