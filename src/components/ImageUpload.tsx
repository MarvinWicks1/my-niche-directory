"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ImageUploadProps = {
	onUploadComplete: (publicUrl: string) => void;
	disabled?: boolean;
	className?: string;
	label?: string;
};

export default function ImageUpload({
	onUploadComplete,
	disabled,
	className,
	label = "Upload logo",
}: ImageUploadProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
			}
		};
	}, []);

	const accept = useMemo(() => "image/png,image/jpeg", []);

	function getExtension(file: File): string {
		// Prefer extension from MIME type for safety
		if (file.type === "image/png") return "png";
		if (file.type === "image/jpeg") return "jpg";
		const fromName = file.name.split(".").pop()?.toLowerCase();
		if (fromName === "png" || fromName === "jpg" || fromName === "jpeg") {
			return fromName === "jpeg" ? "jpg" : fromName;
		}
		return "png";
	}

	function uniqueName(ext: string): string {
		const uid =
			(typeof crypto !== "undefined" && "randomUUID" in crypto && crypto.randomUUID())
				? (crypto.randomUUID() as string)
				: Math.random().toString(36).slice(2);
		return `${Date.now()}-${uid}.${ext}`;
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);

		// Validate type
		if (!["image/png", "image/jpeg"].includes(file.type)) {
			setError("Please select a PNG or JPG image.");
			return;
		}

		// Preview
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
		}
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setPreviewUrl(url);

		// Upload
		setIsUploading(true);
		try {
			const ext = getExtension(file);
			const filePath = uniqueName(ext);

			const { error: uploadError } = await supabase.storage
				.from("logos")
				.upload(filePath, file, {
					cacheControl: "3600",
					upsert: false,
					contentType: file.type,
				});

			if (uploadError) {
				throw uploadError;
			}

			const { data } = supabase.storage.from("logos").getPublicUrl(filePath);
			const publicUrl = data.publicUrl;
			if (!publicUrl) {
				throw new Error("Could not generate public URL.");
			}

			onUploadComplete(publicUrl);
		} catch (err: any) {
			setError(err?.message ?? "Upload failed. Please try again.");
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div className={className}>
			<label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
				{label}
			</label>
			<input
				type="file"
				accept={accept}
				onChange={handleFileChange}
				disabled={disabled || isUploading}
				className="block w-full cursor-pointer rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-800 dark:bg-neutral-950 dark:file:bg-neutral-900 dark:hover:file:bg-neutral-800"
			/>
			{isUploading && (
				<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">Uploading...</p>
			)}
			{error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
			{previewUrl && (
				<div className="mt-3">
					<img
						src={previewUrl}
						alt="Selected preview"
						className="h-20 w-20 rounded-md object-contain ring-1 ring-inset ring-neutral-200 dark:ring-neutral-800"
					/>
				</div>
			)}
		</div>
	);
}


