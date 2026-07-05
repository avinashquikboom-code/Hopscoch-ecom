import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';
import { toast } from '@/components/ui/toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const method = (config.method || 'GET').toUpperCase();
        const url = config.url || '';
        const path = url.toLowerCase();
        
        const isSlowMutation = method !== 'GET' && (
          path.includes('/upload') ||
          path.includes('/settings') ||
          path.includes('/checkout') ||
          path.includes('/process') ||
          path.includes('/import') ||
          path.includes('/export')
        );

        if (isSlowMutation) {
          let loadingMsg = "Processing request...";
          if (path.includes("/upload")) loadingMsg = "ℹ Product is being uploaded...";
          else if (path.includes("/export") || path.includes("/import")) loadingMsg = "ℹ Processing request... Please wait...";
          
          const loadingToastId = toast.loading(loadingMsg);
          (config as any)._loadingToastId = loadingToastId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const loadingToastId = (response.config as any)._loadingToastId;
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        let reqData = response.config.data;
        if (typeof reqData === 'string') {
          try {
            reqData = JSON.parse(reqData);
          } catch (_) {}
        }

        toast.handleApiResponse(
          response.config.method || 'GET',
          response.config.url || '',
          response.status,
          reqData,
          response.data
        );

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const canAttemptRefresh = error.response?.status === 401 && !originalRequest?._retry && this.getRefreshToken();

        if (canAttemptRefresh) {
          originalRequest._retry = true;
          try {
            const refreshToken = this.getRefreshToken();
            const response = await this.client.post('/auth/refresh', {
              refreshToken,
            });

            const { token } = response.data;
            this.setToken(token);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            const loadingToastId = (error.config as any)?._loadingToastId;
            if (loadingToastId) {
              toast.dismiss(loadingToastId);
            }
            this.clearTokens();
            toast.handleApiResponse(
              error.config?.method || 'GET',
              error.config?.url || '',
              401,
              error.config?.data ? JSON.parse(error.config.data) : null,
              { message: "Session expired." }
            );
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        const loadingToastId = (error.config as any)?._loadingToastId;
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        let reqData = error.config?.data;
        if (typeof reqData === 'string') {
          try {
            reqData = JSON.parse(reqData);
          } catch (_) {}
        }

        toast.handleApiResponse(
          error.config?.method || 'GET',
          error.config?.url || '',
          error.response?.status || 0,
          reqData,
          error.response?.data
        );

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
