import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Wishlist } from '@/types';

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    return apiClient.get<Wishlist>(API_ENDPOINTS.WISHLIST);
  },

  async addToWishlist(productId: string): Promise<Wishlist> {
    return apiClient.post<Wishlist>(API_ENDPOINTS.WISHLIST, { productId });
  },

  async removeFromWishlist(productId: string): Promise<Wishlist> {
    return apiClient.delete<Wishlist>(API_ENDPOINTS.WISHLIST_ITEM(productId));
  },

  async clearWishlist(): Promise<Wishlist> {
    return apiClient.delete<Wishlist>(API_ENDPOINTS.WISHLIST);
  },
};
