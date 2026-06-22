import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS, PAGINATION } from '@/constants';
import { Product, Category, Review, ProductFilters, PaginatedResponse } from '@/types';

export const productService = {
  async getProducts(
    filters?: ProductFilters,
    pagination: { page: number; limit: number } = { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT }
  ): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
      params: { ...filters, ...pagination },
    });
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_DETAILS(id));
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS);
  },

  async getTrendingProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ENDPOINTS.TRENDING_PRODUCTS);
  },

  async getNewArrivals(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ENDPOINTS.NEW_ARRIVALS);
  },

  async getBestSellers(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ENDPOINTS.BEST_SELLERS);
  },

  async searchProducts(query: string): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ENDPOINTS.SEARCH_PRODUCTS, {
      params: { q: query },
    });
  },

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_ENDPOINTS.PRODUCT_CATEGORIES);
  },

  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>(API_ENDPOINTS.PRODUCT_REVIEWS(productId), {
      params: { page, limit },
    });
  },

  async addReview(productId: string, review: Omit<Review, 'id' | 'userId' | 'user' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Review> {
    return apiClient.post<Review>(API_ENDPOINTS.PRODUCT_REVIEWS(productId), review);
  },

  async markReviewHelpful(reviewId: string): Promise<void> {
    return apiClient.post<void>(`/reviews/${reviewId}/helpful`);
  },
};
