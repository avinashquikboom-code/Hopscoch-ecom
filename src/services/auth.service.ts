import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials);
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, credentials);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.LOGOUT);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  async forgotPassword(email: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.RESET_PASSWORD, { token, password });
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.VERIFY_OTP, { email, otp });
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.USER_PROFILE);
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.USER_PROFILE, data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },
};
