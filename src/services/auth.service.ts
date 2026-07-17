import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';
import { STORAGE_KEYS } from '@/constants';

// ── Helpers ────────────────────────────────────────────────────────────────
function delay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
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

// ── Mock Auth Service (no backend required) ────────────────────────────────
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(700);
    // Accept any non-empty email + password with min 4 chars
    if (!credentials.email || !credentials.password || credentials.password.length < 4) {
      throw { response: { data: { message: 'Invalid email or password.' } } };
    }
    const user = buildUser(credentials.email);
    return buildAuthResponse(user);
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay(800);
    if (!credentials.email || !credentials.password) {
      throw { response: { data: { message: 'Please fill all fields.' } } };
    }
    const user = buildUser(credentials.email, {
      firstName: (credentials as any).firstName || nameFromEmail(credentials.email).firstName,
      lastName:  (credentials as any).lastName  || nameFromEmail(credentials.email).lastName,
    });
    return buildAuthResponse(user);
  },

  async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  async refreshToken(_refreshToken: string): Promise<AuthResponse> {
    await delay(300);
    throw { response: { data: { message: 'Session expired.' } } };
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

  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    await delay(500);
    // Mock: always succeeds
  },
};
