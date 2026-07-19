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
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Relative path — prepend API base
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE}${path}`;
}
