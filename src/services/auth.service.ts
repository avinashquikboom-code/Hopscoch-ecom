import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';
import { STORAGE_KEYS, API_BASE } from '@/constants';

// ── Helpers ────────────────────────────────────────────────────────────────
function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

function nameFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split('@')[0] || 'User';
  const parts = local.split(/[._-]/);
  const firstName = parts[0]
    ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    : 'User';
  const lastName = parts[1]
    ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
    : 'Couture';
  return { firstName, lastName };
}

function buildUser(emailOrPhone: string, extra?: Partial<User>): User {
  const isEmail = emailOrPhone.includes('@');
  const email = isEmail ? emailOrPhone : `${emailOrPhone}@fciseller.com`;
  const phone = isEmail ? '' : emailOrPhone;
  const { firstName, lastName } = nameFromEmail(email);
  return {
    id: 'usr_' + Math.random().toString(36).slice(2, 10),
    email,
    firstName,
    lastName,
    phone,
    avatar: null,
    createdAt: new Date().toISOString(),
    ...extra,
  } as unknown as User;
}

function buildAuthResponse(user: User): AuthResponse {
  const token = 'mock_token_' + Math.random().toString(36).slice(2, 20);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }
  return { user, token } as unknown as AuthResponse;
}

// ── Real Auth Service (connects to backend /api/auth/*) ──────────────────────
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Invalid email or password.');
      }
      const data = json.data ?? json;
      const token = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      return { user, token } as unknown as AuthResponse;
    } catch (e: any) {
      throw { response: { data: { message: e.message || 'Invalid email or password.' } } };
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          firstName: (credentials as any).firstName || (credentials as any).name || nameFromEmail(credentials.email).firstName,
          lastName: (credentials as any).lastName || nameFromEmail(credentials.email).lastName,
          phone: (credentials as any).phone || '',
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Registration failed.');
      }
      const data = json.data ?? json;
      const token = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const user = data.user;

      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      return { user, token } as unknown as AuthResponse;
    } catch (e: any) {
      throw { response: { data: { message: e.message || 'Registration failed.' } } };
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Session expired.');
      const data = json.data ?? json;
      const token = data.accessToken || data.token;
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
      return { user: data.user, token } as unknown as AuthResponse;
    } catch (e: any) {
      throw { response: { data: { message: e.message || 'Session expired.' } } };
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await delay(600);
    if (!email) throw { response: { data: { message: 'Email is required.' } } };
    // Mock: just resolves
  },

  async resetPassword(_token: string, _password: string): Promise<void> {
    await delay(600);
  },

  async verifyOtp(_email: string, _otp: string): Promise<AuthResponse> {
    await delay(600);
    throw { response: { data: { message: 'OTP feature not available in demo.' } } };
  },

  async getProfile(): Promise<User> {
    await delay(300);
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_DATA)
      : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user) return parsed.state.user;
      } catch {/* ignore */}
    }
    throw { response: { data: { message: 'Not authenticated.' } } };
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(500);
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_DATA)
      : null;
    let user: User = buildUser('user@fciseller.com');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user) user = parsed.state.user;
      } catch {/* ignore */}
    }
    return { ...user, ...data };
  },

  /**
   * Upload a profile avatar image to the real backend.
   * Uses PATCH /api/users/me with multipart/form-data.
   * Returns the updated user object with the new avatarUrl.
   */
  async uploadAvatar(file: File): Promise<User> {
    const token = getStoredToken();
    if (!token) {
      throw { response: { data: { message: 'Not authenticated.' } } };
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch(`${API_BASE}/api/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw { response: { data: { message: err?.message || 'Avatar upload failed.' } } };
    }

    const json = await res.json();
    // Backend wraps response in { data: { ... } }
    const updated = json?.data ?? json;

    // Merge avatarUrl into the current locally-stored user state so it persists
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.USER_DATA)
      : null;
    let user: User = buildUser('user@fciseller.com');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user) user = parsed.state.user;
      } catch {/* ignore */}
    }

    return { ...user, avatar: updated.avatarUrl ?? updated.avatar ?? user.avatar };
  },

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await delay(500);
    // Mock: always succeeds
  },
};

