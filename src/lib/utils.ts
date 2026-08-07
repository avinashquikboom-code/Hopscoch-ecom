import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE } from "@/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves a potentially relative avatar URL from the backend into a full absolute URL.
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
  const path = resolved.startsWith('/') ? resolved : `/${resolved}`;
  return `${API_BASE}${path}`;
}

/**
 * Resolves any image URL from the backend (rewriting production domains, relative paths,
 * JSON strings, arrays, and fallback placeholdering), ensuring maximum resolution and high DPI quality.
 */
export function resolveImageUrl(url?: any): string {
  const fallback = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=95&auto=format&fit=crop';
  if (!url) return fallback;

  // 1. Handle object or array inputs
  if (typeof url === 'object') {
    if (Array.isArray(url)) {
      url = url[0];
    } else {
      url = url.url || url.imageUrl || url.image_url || url.path || url.src || '';
    }
    if (!url) return fallback;
  }

  if (typeof url !== 'string') return fallback;

  let trimmed = url.trim();
  if (!trimmed) return fallback;

  // 2. Handle JSON stringified arrays or objects
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      return resolveImageUrl(parsed);
    } catch { /* continue string handling */ }
  }

  // 3. Strip surrounding quotes
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  let resolved = trimmed;
  if (resolved.includes('api.fciseller.com')) {
    resolved = resolved.replace(/https?:\/\/api\.fciseller\.com/g, API_BASE);
  }

  // 4. Optimize Cloudinary URLs for High DPR / Ultra-High Quality Rendering
  if (resolved.includes('res.cloudinary.com') || resolved.includes('cloudinary.com')) {
    // If URL has upload/, inject high quality auto format parameters if missing
    if (resolved.includes('/upload/') && !resolved.includes('/f_auto')) {
      resolved = resolved.replace('/upload/', '/upload/f_auto,q_auto:best,dpr_auto/');
    }
  }

  // 5. Optimize Unsplash fallback URLs for crisp 4K/Retina rendering
  if (resolved.includes('images.unsplash.com')) {
    if (resolved.includes('w=200') || resolved.includes('w=400') || resolved.includes('w=600')) {
      resolved = resolved.replace(/w=\d+/, 'w=1920').replace(/q=\d+/, 'q=95');
    }
  }

  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return resolved;
  }
  const path = resolved.startsWith('/') ? resolved : `/${resolved}`;
  return `${API_BASE}${path}`;
}
