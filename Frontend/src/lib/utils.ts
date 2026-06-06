import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get correct image URL (handles both Cloudinary URLs and local uploads)
export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  // If it's already a full URL (Cloudinary), return as-is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  // Otherwise, prepend API URL for local uploads
  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
}
