import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Derive a safe absolute site URL for metadataBase:
// - Prefer NEXT_PUBLIC_SITE_URL when it's a non-empty absolute URL
// - Fall back to VERCEL_URL when available (prepend https://)
// - Finally fall back to localhost
const envSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
const vercelUrl = (process.env.VERCEL_URL || "").trim();
const siteUrl =
  envSiteUrl && /^https?:\/\//i.test(envSiteUrl)
    ? envSiteUrl
    : vercelUrl
    ? `https://${vercelUrl}`
    : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Interior Tools",
    template: "%s | AI Interior Tools",
  },
  description:
    "Discover the best AI tools for interior designers. Explore categories, compare features, and boost your workflow.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "AI Interior Tools",
    title: "AI Interior Tools",
    description:
      "Discover the best AI tools for interior designers. Explore categories, compare features, and boost your workflow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interior Tools",
    description:
      "Discover the best AI tools for interior designers. Explore categories, compare features, and boost your workflow.",
    creator: "@",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
