import { API_BASE } from '@/constants';
import { fetchWithAuth, getValidToken } from '@/lib/api-client';
import { Wishlist, WishlistItem } from '@/types';
import { useWishlistStore } from '@/store';
import { resolveImageUrl } from '@/lib/utils';

function normalizeWishlistItem(raw: any): WishlistItem {
  const p = raw.product || {};
  const rawImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images.map((i: any) => typeof i === 'string' ? i : (i.url || i.imageUrl))
    : [p.imageUrl || p.thumbnailUrl];

  const images = rawImages.map((img: any) => resolveImageUrl(img)).filter(Boolean);

  return {
    id: String(raw.id || raw.productId),
    productId: String(raw.productId || p.id),
    addedAt: raw.createdAt || raw.addedAt || new Date().toISOString(),
    product: {
      id: String(p.id || raw.productId),
      name: p.name || p.title || 'Product',
      description: p.description || '',
      price: Number(p.price || p.basePrice || 0),
      originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : (p.originalPrice ? Number(p.originalPrice) : undefined),
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600'],
      category: typeof p.category === 'string' ? p.category : (p.category?.name || 'clothing'),
      brand: typeof p.brand === 'string' ? p.brand : (p.brand?.name || 'Hopscotch'),
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 12,
      isNew: p.isNew || false,
      isTrending: p.isTrending || false,
      isFeatured: p.isFeatured || false,
      stock: p.stock ?? 10,
      tags: p.tags || [],
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
    },
  };
}

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const token = getValidToken();
    if (!token) {
      const current = useWishlistStore.getState().wishlist;
      return current || { id: 'guest', userId: '', items: [], updatedAt: new Date().toISOString() };
    }

    try {
      let res = await fetchWithAuth(`${API_BASE}/api/v1/web/wishlist`);
      if (!res.ok) {
        res = await fetchWithAuth(`${API_BASE}/api/wishlist`);
      }
      if (!res.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const json = await res.json();
      const rawList = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      const items = rawList.map(normalizeWishlistItem);
      const wishlist: Wishlist = {
        id: 'user_wishlist',
        userId: 'user',
        items,
        updatedAt: new Date().toISOString(),
      };
      useWishlistStore.getState().setWishlist(wishlist);
      return wishlist;
    } catch {
      const current = useWishlistStore.getState().wishlist;
      return current || { id: 'local', userId: '', items: [], updatedAt: new Date().toISOString() };
    }
  },

  async addToWishlist(productId: string): Promise<Wishlist> {
    const numericId = productId.replace(/\D/g, '') || productId;
    let res = await fetchWithAuth(`${API_BASE}/api/v1/web/wishlist/${numericId}`, {
      method: 'POST',
    });
    if (!res.ok && res.status !== 409) {
      res = await fetchWithAuth(`${API_BASE}/api/wishlist/${numericId}`, {
        method: 'POST',
      });
    }
    const json = await res.json();
    if (!res.ok && res.status !== 409) {
      throw new Error(json.message || 'Failed to add to wishlist');
    }
    return this.getWishlist();
  },

  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const numericId = productId.replace(/\D/g, '') || productId;
    let res = await fetchWithAuth(`${API_BASE}/api/v1/web/wishlist/${numericId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      res = await fetchWithAuth(`${API_BASE}/api/wishlist/${numericId}`, {
        method: 'DELETE',
      });
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to remove from wishlist');
    }
    return this.getWishlist();
  },

  async clearWishlist(): Promise<Wishlist> {
    const current = useWishlistStore.getState().wishlist;
    const items = current?.items || [];
    for (const item of items) {
      try {
        await this.removeFromWishlist(item.productId);
      } catch { /* ignore */ }
    }
    return this.getWishlist();
  },
};
