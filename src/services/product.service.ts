import { mockProducts, mockCategories } from '@/lib/mock-data';
import { Product, Category, Review, ProductFilters, PaginatedResponse } from '@/types';
import { PAGINATION } from '@/constants';

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

function applyFilters(products: Product[], filters?: ProductFilters): Product[] {
  let result = [...products];
  if (!filters) return result;

  if (filters.category) {
    result = result.filter((p) =>
      (p as any).category?.toLowerCase() === filters.category!.toLowerCase() ||
      (p as any).subcategory?.toLowerCase() === filters.category!.toLowerCase()
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || (p as any).description?.toLowerCase().includes(q)
    );
  }
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    result = result.filter((p) => p.price >= min && p.price <= max);
  }
  if (filters.rating !== undefined) result = result.filter((p) => ((p as any).rating || 0) >= filters.rating!);
  if (filters.inStock) result = result.filter((p) => ((p as any).stock || 0) > 0);

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':   result.sort((a, b) => a.price - b.price); break;
      case 'price_desc':  result.sort((a, b) => b.price - a.price); break;
      case 'rating':      result.sort((a, b) => ((b as any).rating || 0) - ((a as any).rating || 0)); break;
      case 'newest':      result.sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime()); break;
      case 'popular':     result.sort((a, b) => ((b as any).reviewCount || 0) - ((a as any).reviewCount || 0)); break;
    }
  }
  return result;
}

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userId: 'u1', productId: '1', rating: 5, comment: 'Absolutely premium quality! Worth every rupee.', createdAt: '2026-06-01', helpfulCount: 24, user: { firstName: 'Priya', lastName: 'S.' } } as any,
  { id: 'r2', userId: 'u2', productId: '1', rating: 4, comment: 'Great fit and finish. Delivery was fast too.', createdAt: '2026-05-20', helpfulCount: 10, user: { firstName: 'Rahul', lastName: 'M.' } } as any,
  { id: 'r3', userId: 'u3', productId: '1', rating: 5, comment: 'Loved the packaging and the product quality exceeded expectations!', createdAt: '2026-05-10', helpfulCount: 18, user: { firstName: 'Ananya', lastName: 'K.' } } as any,
];

export const productService = {
  async getProducts(
    filters?: ProductFilters,
    pagination: { page: number; limit: number } = { page: PAGINATION.DEFAULT_PAGE, limit: PAGINATION.DEFAULT_LIMIT }
  ): Promise<PaginatedResponse<Product>> {
    await delay(300);
    const filtered = applyFilters(mockProducts, filters);
    const start = (pagination.page - 1) * pagination.limit;
    const data = filtered.slice(start, start + pagination.limit);
    return {
      data,
      total: filtered.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(filtered.length / pagination.limit),
    } as any;
  },

  async getProductById(id: string): Promise<Product> {
    await delay(200);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw { response: { data: { message: 'Product not found.' } } };
    return product;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(200);
    return mockProducts.filter((p) => p.isFeatured || p.rating >= 4.5).slice(0, 10);
  },

  async getTrendingProducts(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 10);
  },

  async getNewArrivals(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 10);
  },

  async getBestSellers(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(250);
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  },

  async getCategories(): Promise<Category[]> {
    await delay(150);
    return mockCategories;
  },

  async getProductReviews(
    productId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Review>> {
    await delay(200);
    const reviews = MOCK_REVIEWS.map((r) => ({ ...r, productId }));
    return { data: reviews, total: reviews.length, page, limit, totalPages: 1 } as any;
  },

  async addReview(_productId: string, review: any): Promise<Review> {
    await delay(400);
    return {
      id: 'r_new_' + Date.now(),
      userId: 'local',
      ...review,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      user: { firstName: 'You', lastName: '' },
    } as any;
  },

  async markReviewHelpful(_reviewId: string): Promise<void> {
    await delay(200);
  },
};
