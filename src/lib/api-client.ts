import { API_BASE, STORAGE_KEYS } from '@/constants';

/**
 * Reads a valid auth token from localStorage, filtering out undefined/null/mock strings.
 */
export function getValidToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('auth_token');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '' || token.startsWith('mock_token_')) {
    return null;
  }
  return token;
}

/**
 * Reads a valid refresh token from localStorage.
 */
export function getValidRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || localStorage.getItem('refresh_token');
  if (!token || token === 'undefined' || token === 'null' || token.trim() === '' || token.startsWith('mock_token_')) {
    return null;
  }
  return token;
}

/**
 * Returns standard auth headers with a valid Bearer token.
 */
export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getValidToken();
  return {
    'Content-Type': 'application/json',
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Unified authenticated fetch helper with automatic 401 token refresh & silent request retry.
 * Prevents premature session expiration and keeps user sessions active.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = getAuthHeaders(options.headers as Record<string, string> || {});
  let response = await fetch(url, { ...options, headers });

  // On 401 Unauthorized, attempt silent token refresh using stored refresh_token
  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshToken = getValidRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const data = refreshJson.data ?? refreshJson;
          const newToken = data.accessToken || data.token;
          if (newToken) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
            localStorage.setItem('auth_token', newToken);
            
            // Retry original request with newly acquired access token
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            };
            response = await fetch(url, { ...options, headers: retryHeaders });
          }
        } else {
          // Token refresh rejected by server: clear invalid tokens
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      } catch {
        // Network failure during refresh: do not clear tokens prematurely
      }
    }
  }

  return response;
}
