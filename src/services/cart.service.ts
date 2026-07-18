import { Cart } from '@/types';
import { useCartStore } from '@/store';

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

function getLocalCart(): Cart {
  // Read directly from Zustand store via localStorage persistence
  try {
    const stored = typeof window !== 'undefined'
      ? localStorage.getItem('cart_data')
      : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.state?.cart) return parsed.state.cart;
    }
  } catch { /* ignore */ }
  return { id: 'local', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    await delay(200);
    return getLocalCart();
  },

  async addToCart(productId: string, quantity = 1, _variantId?: string): Promise<Cart> {
    await delay(300);
    // Actual add is handled by useCartStore.addItem — just return current cart
    return getLocalCart();
  },

  async updateCartItem(_itemId: string, _quantity: number): Promise<Cart> {
    await delay(200);
    return getLocalCart();
  },

  async removeFromCart(_itemId: string): Promise<Cart> {
    await delay(200);
    return getLocalCart();
  },

  async clearCart(): Promise<Cart> {
    await delay(200);
    return { id: 'local', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
  },

  async applyCoupon(code: string): Promise<Cart> {
    await delay(400);
    const cart = getLocalCart();
    const validCoupons: Record<string, number> = {
      'FCI10': 0.10,
      'WELCOME200': 200,
      'FESTIVE30': 0.30,
    };
    const val = validCoupons[code.toUpperCase()];
    if (!val) throw { response: { data: { message: 'Invalid coupon code.' } } };
    const discount = val < 1
      ? Math.round(cart.subtotal * val)
      : val;
    return { ...cart, discount, total: cart.subtotal - discount } as any;
  },

  async removeCoupon(): Promise<Cart> {
    await delay(200);
    const cart = getLocalCart();
    return { ...cart, discount: 0, total: cart.subtotal } as any;
  },
};
