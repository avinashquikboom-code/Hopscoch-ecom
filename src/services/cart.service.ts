import { Cart, CartItem } from '@/types';
import { API_BASE } from '@/constants';
import { resolveImageUrl } from '@/lib/utils';
import { productService } from './product.service';
import { fetchWithAuth, getValidToken } from '@/lib/api-client';

// ── Auth helper ────────────────────────────────────────────────────────────
function getToken(): string | null {
  return getValidToken();
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
        ? p.images.map(resolveImageUrl)
        : [resolveImageUrl(p.imageUrl)];

    return {
      id: String(item.id),
      productId: String(item.productId || p.id),
      quantity: item.quantity,
      addedAt: item.createdAt || new Date().toISOString(),
      product: {
        id: String(p.id || item.productId),
        name: p.name || 'Product',
        slug: p.slug || '',
        description: p.description || '',
        price: Number(item.price || item.unitPrice || p.price || p.basePrice || 0),
        salePrice: p.salePrice ? Number(p.salePrice) : undefined,
        images,
        category: p.category?.name || p.category || '',
        stock: p.stock || 99,
        isNew: p.isNew || false,
        rating: p.rating || 4.5,
        reviewCount: p.reviewCount || 0,
        tags: p.tags || [],
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      },
      variant: item.variant
        ? {
            id: String(item.variant.id),
            productId: String(item.productId),
            name: item.variant.name || 'Default',
            value: item.variant.value || item.variant.size || item.variant.color || '',
            price: Number(item.variant.price || item.price || p.price || 0),
            stock: item.variant.stock || 10,
            sku: item.variant.sku,
            color: item.variant.color,
            size: item.variant.size,
          }
        : undefined,
    };
  });

  const subtotal = Number(raw.subtotal !== undefined ? raw.subtotal : (raw.total || 0));
  const discount = Number(raw.discountAmount || raw.discount || 0);
  const taxAmount = Number(raw.taxAmount || 0);
  const shippingAmount = Number(raw.shippingFee !== undefined ? raw.shippingFee : (raw.shippingAmount !== undefined ? raw.shippingAmount : (subtotal > 999 || subtotal === 0 ? 0 : 99)));
  const total = Number(raw.total !== undefined ? raw.total : (subtotal - discount + shippingAmount + taxAmount));

  return {
    id: String(raw.id || 'server'),
    userId: String(raw.userId || ''),
    items,
    subtotal,
    discount,
    taxAmount,
    shippingAmount,
    shippingFee: shippingAmount,
    total,
    couponCode: raw.couponCode,
    updatedAt: raw.updatedAt || new Date().toISOString(),
  } as any;
}

// ── Guest Cart Helpers (localStorage) ──────────────────────────────────────
const GUEST_CART_KEY = 'guest_cart';

function getGuestCart(): Cart {
  if (typeof window === 'undefined') {
    return { id: 'guest', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
  }
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return { id: 'guest', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
    return JSON.parse(raw);
  } catch {
    return { id: 'guest', userId: '', items: [], subtotal: 0, discount: 0, total: 0, updatedAt: new Date().toISOString() } as any;
  }
}

function saveGuestCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch { /* ignore */ }
}

function recalcGuestCart(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => {
    const unitPrice = item.variant?.price || (item.product as any)?.salePrice || item.product.price || 0;
    return sum + unitPrice * item.quantity;
  }, 0);
  const discount = cart.discount || 0;
  const shippingAmount = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shippingAmount);
  return { ...cart, subtotal, shippingAmount, shippingFee: shippingAmount, total, updatedAt: new Date().toISOString() };
}

// ── Cart Service Export ───────────────────────────────────────────────────
export const cartService = {
  /** Merge local guest cart into authenticated backend cart upon login */
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
        await fetchWithAuth(`${API_BASE}/api/v1/web/cart`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      } catch { /* ignore individual merge errors */ }
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem(GUEST_CART_KEY);
    }
  },

  async getCart(): Promise<Cart> {
    const token = getToken();
    if (!token) return getGuestCart();

    // Auto-merge guest cart items into persistent user cart on login
    await this.mergeGuestCart();

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/web/cart`);
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
      // Authenticated: call backend API with fetchWithAuth
      try {
        const body: any = { productId: Number(productId), quantity };
        if (variantId) body.variantId = Number(variantId);
        const res = await fetchWithAuth(`${API_BASE}/api/v1/web/cart`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        if (res.ok) {
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
        const res = await fetchWithAuth(`${API_BASE}/api/v1/web/cart/${itemId}`, {
          method: 'PATCH',
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
        const res = await fetchWithAuth(`${API_BASE}/api/v1/web/cart/${itemId}`, {
          method: 'DELETE',
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
        await fetchWithAuth(`${API_BASE}/api/v1/web/cart`, { method: 'DELETE' });
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
    const updated = { ...cart, discount, total: Math.max(0, cart.subtotal - discount + (cart.shippingAmount || 0)), couponCode: code.toUpperCase() };
    if (!getToken()) saveGuestCart(updated);
    return updated;
  },

  async removeCoupon(): Promise<Cart> {
    const cart = await this.getCart();
    const updated = { ...cart, discount: 0, total: cart.subtotal + (cart.shippingAmount || 0), couponCode: undefined };
    if (!getToken()) saveGuestCart(updated);
    return updated;
  },
};
