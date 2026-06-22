import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wishlist, WishlistItem } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface WishlistState {
  wishlist: Wishlist | null;
  
  setWishlist: (wishlist: Wishlist) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: null,

      setWishlist: (wishlist: Wishlist) => {
        set({ wishlist });
      },

      addItem: (item: WishlistItem) => {
        set((state) => {
          if (!state.wishlist) {
            return {
              wishlist: {
                id: 'temp',
                userId: '',
                items: [item],
                updatedAt: new Date().toISOString(),
              },
            };
          }

          const exists = state.wishlist.items.some(
            (i) => i.productId === item.productId
          );

          if (exists) return state;

          return {
            wishlist: {
              ...state.wishlist,
              items: [...state.wishlist.items, item],
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => {
          if (!state.wishlist) return state;

          return {
            wishlist: {
              ...state.wishlist,
              items: state.wishlist.items.filter(
                (item) => item.productId !== productId
              ),
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      clearWishlist: () => {
        set({
          wishlist: {
            id: 'temp',
            userId: '',
            items: [],
            updatedAt: new Date().toISOString(),
          },
        });
      },

      isInWishlist: (productId: string) => {
        const { wishlist } = get();
        if (!wishlist) return false;
        return wishlist.items.some((item) => item.productId === productId);
      },
    }),
    {
      name: STORAGE_KEYS.WISHLIST_DATA,
    }
  )
);
