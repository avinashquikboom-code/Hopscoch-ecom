import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE } from "@/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a potentially relative avatar URL from the backend (e.g. /uploads/file.jpg)
 * into a full absolute URL. Returns null if the input is empty/null.
 */
export function resolveAvatarUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') return null;
  const trimmed = url.trim();
  let resolved = trimmed;
  if (resolved.includes('api.fciseller.com')) {
    resolved = resolved.replace(/https?:\/\/api\.fciseller\.com/g, API_BASE);
  }
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return resolved;
  }
  // Relative path — prepend API base
  const path = resolved.startsWith('/') ? resolved : `/${resolved}`;
  return `${API_BASE}${path}`;
}

/**
 * Resolves any image URL from the backend (rewriting production domains to the current local API base in development).
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') {
    return 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600';
  }
  const trimmed = url.trim();
  let resolved = trimmed;
  if (resolved.includes('api.fciseller.com')) {
    resolved = resolved.replace(/https?:\/\/api\.fciseller\.com/g, API_BASE);
  }
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return resolved;
  }
  const path = resolved.startsWith('/') ? resolved : `/${resolved}`;
  return `${API_BASE}${path}`;
}
