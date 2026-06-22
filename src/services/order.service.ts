import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, PAGINATION } from '@/constants';
import { Order, CheckoutFormData, PaginatedResponse } from '@/types';

export const orderService = {
  async getOrders(
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>(API_ENDPOINTS.ORDERS, {
      params: { page, limit },
    });
  },

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get<Order>(API_ENDPOINTS.ORDER_DETAILS(id));
  },

  async createOrder(data: CheckoutFormData): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS, data);
  },

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.CANCEL_ORDER(id), { reason });
  },

  async returnOrder(id: string, reason: string): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.RETURN_ORDER(id), { reason });
  },

  async trackOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(API_ENDPOINTS.ORDER_TRACKING(id));
  },
};
