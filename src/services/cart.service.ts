import { Cart, CartItem } from '@/types';
import { API_BASE } from '@/constants';
import { resolveImageUrl } from '@/lib/utils';
import { productService } from './product.service';

// ── Auth helper ────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Map backend cart response → local Cart shape ───────────────────────────
function mapBackendCart(raw: any): Cart {
  const items: CartItem[] = (raw.items || []).map((item: any) => {
    const p = item.product || {};
    const images =
      p.images && p.images.length > 0
        ? p.images.map((img: any) => resolveImageUrl(img.url || img))
        : [resolveImageUrl(p.thumbnailUrl)];

    return {
      id: String(item.id),
      cartId: String(item.cartId || raw.id),
      productId: String(item.productId),
      variantId: item.variantId ? String(item.variantId) : undefined,
      quantity: Number(item.quantity || 1),
      product: {
        id: String(p.id),
        name: p.name || '',
        description: p.description || '',
        price: Number(p.basePrice || p.price || 0),
        originalPrice: Number(p.basePrice || p.price || 0),
        discount: 0,
        images,
        category: p.category?.name || '',
        brand: p.brand?.name || '',
        stock: Number(p.stock || 0),
        rating: Number(p.avgRating || 4.5),
        reviewCount: Number(p.reviewCount || 0),
        tags: p.tags || [],
        variants: [],
        sizes: [],
        colors: [],
        isNew: false,
        isFeatured: false,
        isTrending: false,
        taxPercent: Number(p.taxPercent || 0),
        taxType: p.taxType || 'NONE',
        taxAmount: Number(p.taxAmount || 0),
        shippingCharge: Number(p.shippingCharge || 0),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      } as any,
      variant: item.variant
        ? {
            id: String(item.variant.id),
            productId: String(item.variant.productId),
            name: 'variant',
            value: item.variant.size || item.variant.color || '',
            price: Number(item.variant.price || 0),
            stock: Number(item.variant.stock || 0),
            color: item.variant.color,
            size: item.variant.size,
          }
        : undefined,
    };
  });

  return {
    id: String(raw.id),
    userId: String(raw.userId || ''),
    items,
    subtotal: Number(raw.subtotal || 0),
    discount: Number(raw.discount || 0),
    taxAmount: Number(raw.taxAmount || 0),
    totalExclusiveTax: Number(raw.totalExclusiveTax || 0),
    totalInclusiveTax: Number(raw.totalInclusiveTax || 0),
    shippingAmount: Number(raw.shippingAmount || 0),
    total: Number(raw.total || 0),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  } as any;
}

// ── Guest-cart helpers (localStorage, for unauthenticated users) ──────────
function getGuestCart(): Cart {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('guest_cart') : null;
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { id: 'guest', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
}

function recalcGuestCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce((s, i) => {
    const unitPrice = Number(i.variant?.price ?? i.product?.price ?? 0);
    return s + unitPrice * Number(i.quantity || 1);
  }, 0);
  const discount = Number(cart.discount || 0);
  const total = Math.max(0, subtotal - discount);
  return { ...cart, subtotal, total };
}

function saveGuestCart(cart: Cart) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_cart', JSON.stringify(cart));
  }
}

// ── Main cart service ──────────────────────────────────────────────────────
export const cartService = {
  async mergeGuestCart(): Promise<void> {
    const token = getToken();
    if (!token) return;
    const guestCart = getGuestCart();
    if (!guestCart.items || guestCart.items.length === 0) return;

    for (const item of guestCart.items) {
      try {
        const body: any = {
          productId: Number(item.productId),
          quantity: item.quantity,
        };
        if (item.variant?.id) {
          body.variantId = Number(item.variant.id);
        }
        await fetch(`${API_BASE}/api/cart`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(body),
        });
      } catch { /* ignore individual merge errors */ }
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('guest_cart');
    }
  },

  async getCart(): Promise<Cart> {
    const token = getToken();
    if (!token) return getGuestCart();

    // Auto-merge guest cart items into persistent user cart on login
    await this.mergeGuestCart();

    try {
      const res = await fetch(`${API_BASE}/api/cart`, { headers: authHeaders() });
      if (!res.ok) return getGuestCart();
      const json = await res.json();
      return mapBackendCart(json.data ?? json);
    } catch {
      return getGuestCart();
    }
  },

  async addToCart(productId: string, quantity = 1, variantId?: string, productData?: any): Promise<Cart> {
    const token = getToken();

    if (token) {
      // Authenticated: call backend API
      try {
        const body: any = { productId: Number(productId), quantity };
        if (variantId) body.variantId = Number(variantId);
        const res = await fetch(`${API_BASE}/api/cart`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(body),
        });
        if (res.ok) {
          // Fetch fresh cart after add
          return this.getCart();
        }
      } catch { /* fall through to guest */ }
    }

    // Guest or API fallback: populate full product details
    let fullProduct = productData;
    if (!fullProduct || !fullProduct.price) {
      try {
        fullProduct = await productService.getProductById(productId);
      } catch {
        fullProduct = { id: productId, name: 'Product', price: 0, images: [] };
      }
    }

    const cart = getGuestCart();
    const existingIndex = cart.items.findIndex(
      (i) => i.productId === productId && (i.variant?.id ?? 'default') === (variantId ?? 'default')
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      if ((!cart.items[existingIndex].product.price || cart.items[existingIndex].product.price === 0) && fullProduct.price > 0) {
        cart.items[existingIndex].product = fullProduct;
      }
    } else {
      const matchedVariant = fullProduct.variants?.find((v: any) => String(v.id) === String(variantId));
      cart.items.push({
        id: `${productId}:${variantId || 'default'}:${Date.now()}`,
        productId,
        quantity,
        addedAt: new Date().toISOString(),
        product: fullProduct,
        variant: matchedVariant ? {
          id: String(matchedVariant.id),
          productId: String(productId),
          name: 'variant',
          value: matchedVariant.value || matchedVariant.size || matchedVariant.color || '',
          price: Number(matchedVariant.price || fullProduct.price || 0),
          stock: Number(matchedVariant.stock || 10),
          color: matchedVariant.color,
          size: matchedVariant.size,
        } : undefined,
      } as CartItem);
    }

    const updated = recalcGuestCart(cart);
    saveGuestCart(updated);
    return updated;
  },

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const token = getToken();

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart/${itemId}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ quantity }),
        });
        if (res.ok) return this.getCart();
      } catch { /* fall through */ }
    }

    // Guest update
    const cart = getGuestCart();
    cart.items = cart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    const updated = recalcGuestCart(cart);
    saveGuestCart(updated);
    return updated;
  },

  async removeFromCart(itemId: string): Promise<Cart> {
    const token = getToken();

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/cart/${itemId}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
        if (res.ok) return this.getCart();
      } catch { /* fall through */ }
    }

    // Guest remove
    const cart = getGuestCart();
    cart.items = cart.items.filter((i) => i.id !== itemId);
    const updated = recalcGuestCart(cart);
    saveGuestCart(updated);
    return updated;
  },

  async clearCart(): Promise<Cart> {
    const token = getToken();

    if (token) {
      try {
        await fetch(`${API_BASE}/api/cart`, { method: 'DELETE', headers: authHeaders() });
      } catch { /* ignore */ }
    }

    const empty: Cart = {
      id: token ? 'server' : 'guest',
      userId: '',
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    } as any;
    saveGuestCart(empty);
    return empty;
  },

  async applyCoupon(code: string): Promise<Cart> {
    const cart = await this.getCart();
    const validCoupons: Record<string, number> = {
      'FCI10': 0.10,
      'WELCOME200': 200,
      'FESTIVE30': 0.30,
    };
    const val = validCoupons[code.toUpperCase()];
    if (!val) throw { response: { data: { message: 'Invalid coupon code.' } } };
    const discount = val < 1 ? Math.round(cart.subtotal * val) : val;
    return { ...cart, discount, total: cart.subtotal - discount };
  },

  async removeCoupon(): Promise<Cart> {
    const cart = await this.getCart();
    return { ...cart, discount: 0, total: cart.subtotal };
  },
};
