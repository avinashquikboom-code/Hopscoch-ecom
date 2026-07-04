import { Wishlist } from '@/types';
import { STORAGE_KEYS } from '@/constants';

function delay(ms = 250) {
  return new Promise((res) => setTimeout(res, ms));
}

function getLocalWishlist(): Wishlist {
  try {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.WISHLIST_DATA)
      : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.wishlist) return parsed.state.wishlist;
    }
  } catch { /* ignore */ }
  return { id: 'local', userId: '', items: [], updatedAt: new Date().toISOString() } as any;
}

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    await delay();
    return getLocalWishlist();
  },

  async addToWishlist(_productId: string): Promise<Wishlist> {
    await delay(200);
    return getLocalWishlist();
  },

  async removeFromWishlist(_productId: string): Promise<Wishlist> {
    await delay(200);
    return getLocalWishlist();
  },

  async clearWishlist(): Promise<Wishlist> {
    await delay(200);
    return { id: 'local', userId: '', items: [], updatedAt: new Date().toISOString() } as any;
  },
};
