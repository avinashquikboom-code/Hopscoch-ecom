import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Cart, CartItem } from '@/types';

export const cartService = {
  async getCart(): Promise<Cart> {
    return apiClient.get<Cart>(API_ENDPOINTS.CART);
  },

  async addToCart(productId: string, quantity = 1, variantId?: string): Promise<Cart> {
    return apiClient.post<Cart>(API_ENDPOINTS.CART, {
      productId,
      quantity,
      variantId,
    });
  },

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    return apiClient.put<Cart>(API_ENDPOINTS.CART_ITEM(itemId), { quantity });
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(API_ENDPOINTS.CART_ITEM(itemId));
  },

  async clearCart(): Promise<Cart> {
    return apiClient.post<Cart>(API_ENDPOINTS.CART_CLEAR);
  },

  async applyCoupon(code: string): Promise<Cart> {
    return apiClient.post<Cart>(API_ENDPOINTS.APPLY_COUPON, { code });
  },

  async removeCoupon(): Promise<Cart> {
    return apiClient.delete<Cart>(API_ENDPOINTS.APPLY_COUPON);
  },
};
