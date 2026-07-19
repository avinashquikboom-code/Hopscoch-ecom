import { Product, Category, Review, ProductFilters, PaginatedResponse } from '@/types';
import { PAGINATION, API_BASE } from '@/constants';
import { resolveImageUrl } from '@/lib/utils';

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#6b7280',
  grey: '#6b7280',
  beige: '#f5f5dc',
  brown: '#78350f',
  navy: '#1e3a8a',
  teal: '#0d9488',
  olive: '#808000',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  magenta: '#d946ef',
  gold: '#fbbf24',
  silver: '#cbd5e1',
};

export function getColorCode(colorName: string): string {
  if (!colorName) return '#cbd5e1';
  const name = colorName.toLowerCase().trim();
  if (name.startsWith('#')) return colorName;
  return COLOR_MAP[name] || name;
}

function mapBackendProductToFrontend(raw: any): Product {
  const price = Number(raw.basePrice || raw.price || 0);
  const images = (raw.images && raw.images.length > 0)
    ? raw.images.map((img: any) => resolveImageUrl(img.url))
    : [resolveImageUrl(raw.thumbnailUrl)];

  const variants = raw.variants?.map((v: any) => ({
    id: String(v.id),
    productId: String(v.productId),
    name: 'variant',
    value: v.size || v.color || '',
    price: v.price ? Number(v.price) : price,
    stock: v.stock !== undefined ? Number(v.stock) : 0,
    image: undefined,
    color: v.color || undefined,
    size: v.size || undefined,
  })) || [];

  const sizes = Array.from(new Set(raw.variants?.map((v: any) => v.size).filter(Boolean) as string[])) as string[];
  const colors = Array.from(new Set(raw.variants?.map((v: any) => v.color).filter(Boolean) as string[])) as string[];

  const totalStock = raw.variants && raw.variants.length > 0
    ? raw.variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)
    : (raw.stock !== undefined ? Number(raw.stock) : 10);

  return {
    id: String(raw.id),
    name: raw.name,
    description: raw.description,
    price: price,
    originalPrice: price,
    discount: raw.discountValue ? Number(raw.discountValue) : 0,
    images: images,
    category: raw.category?.name || 'Collections',
    brand: raw.brand?.name || 'FCISeller',
    stock: totalStock,
    rating: Number(raw.avgRating || 4.5),
    reviewCount: Number(raw.reviewCount || 0),
    tags: raw.tags || [],
    variants: variants,
    sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
    colors: colors.length > 0 ? colors : ['Beige', 'Black', 'Olive'],
    isNew: raw.isNewArrival || false,
    isFeatured: raw.isFeatured || false,
    isTrending: raw.isTrending || false,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
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
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch products');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        const filtered = applyFilters(mapped, filters);
        const start = (pagination.page - 1) * pagination.limit;
        const data = filtered.slice(start, start + pagination.limit);
        return {
          data,
          total: filtered.length,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(filtered.length / pagination.limit),
        } as any;
      }
      return { data: [], total: 0, page: 1, limit: 12, totalPages: 1 } as any;
    } catch (e) {
      console.error('Backend products fetch failed:', e);
      throw e;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Product not found');
      if (json.data) {
        return mapBackendProductToFrontend(json.data);
      }
      throw new Error('Product not found');
    } catch (e) {
      console.error(`Backend fetch for product ${id} failed:`, e);
      throw e;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch featured products');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        return mapped.filter((p) => p.isFeatured || p.rating >= 4.5).slice(0, 10);
      }
      return [];
    } catch (e) {
      console.error('Backend featured fetch failed:', e);
      return [];
    }
  },

  async getTrendingProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch trending products');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        return [...mapped].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 10);
      }
      return [];
    } catch (e) {
      console.error('Backend trending fetch failed:', e);
      return [];
    }
  },

  async getNewArrivals(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch new arrivals');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        return [...mapped].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 10);
      }
      return [];
    } catch (e) {
      console.error('Backend new arrivals fetch failed:', e);
      return [];
    }
  },

  async getBestSellers(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch best sellers');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        return [...mapped].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
      }
      return [];
    } catch (e) {
      console.error('Backend best sellers fetch failed:', e);
      return [];
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Search failed');
      const raw = json.data ?? json.products ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapped = raw.map(mapBackendProductToFrontend);
        const q = query.toLowerCase();
        return mapped.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        );
      }
      return [];
    } catch (e) {
      console.error('Backend search fetch failed:', e);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch categories');
      const raw = json.data ?? json ?? [];
      if (Array.isArray(raw)) {
        const mapCategory = (cat: any): Category => ({
          id: String(cat.id),
          name: cat.name,
          slug: cat.slug,
          parentId: cat.parentId ? String(cat.parentId) : undefined,
          productCount: cat.productCount || 0,
          icon: (cat.iconUrl && (cat.iconUrl.includes('/') || cat.iconUrl.startsWith('http'))) ? resolveImageUrl(cat.iconUrl) : (cat.iconUrl || '👗'),
          image: resolveImageUrl(cat.bannerUrl),
          subcategories: cat.children ? cat.children.map(mapCategory) : undefined,
        });
        return raw.map(mapCategory);
      }
      return [];
    } catch (e) {
      console.error('Backend categories fetch failed:', e);
      return [];
    }
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
