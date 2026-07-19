import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Order, PaginatedResponse } from '@/types';
import { API_BASE } from '@/constants';

// ── Response normalizer ─────────────────────────────────────────────────────
// Maps the backend's DB order shape to the storefront Order type
function normalizeOrder(raw: any): Order {
  const addr = raw.address || raw.shippingAddress || {};

  const shippingAddress = typeof addr === 'string'
    ? { fullName: '', address: addr, city: '', state: '', zipCode: '', country: '' }
    : {
        fullName: addr.fullName || `${raw.user?.firstName || ''} ${raw.user?.lastName || ''}`.trim(),
        address: addr.line1 || addr.addressLine1 || addr.address || '',
        city: addr.city || '',
        state: addr.state || '',
        zipCode: addr.pincode || addr.zipCode || addr.zip || '',
        country: addr.country || 'India',
      };

  const items = (raw.items || raw.orderItems || []).map((item: any) => ({
    id: String(item.id),
    orderId: String(raw.id),
    productId: String(item.productId),
    variantId: item.variantId ? String(item.variantId) : undefined,
    quantity: item.quantity || 1,
    price: Number(item.priceSnapshot ?? item.price ?? 0),
    product: {
      id: String(item.productId),
      name: item.productNameSnapshot || item.product?.name || 'Product',
      images: item.product?.images?.map((img: any) => img.url || img) || [],
    },
    variantSnapshot: item.variantSnapshot || {},
  }));

  const timeline = (raw.timeline || []).map((t: any) => ({
    status: t.status,
    note: t.note || '',
    createdAt: t.createdAt,
  }));

  return {
    id: String(raw.id),
    orderNumber: raw.orderNumber || String(raw.id),
    status: (raw.status || 'PENDING').toLowerCase(),
    paymentStatus: raw.payment?.status?.toLowerCase() || 'pending',
    paymentMethod: raw.payment?.method?.toLowerCase() || 'card',
    subtotal: Number(raw.subtotal || 0),
    tax: Number(raw.taxAmount || 0),
    shipping: Number(raw.shippingAmount || 0),
    discount: Number(raw.discountAmount || 0),
    total: Number(raw.totalAmount || 0),
    items,
    shippingAddress,
    timeline,
    trackingNumber: raw.shipment?.awb || raw.trackingNumber || null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  } as any;
}

// ── Helper to read auth token ────────────────────────────────────────────────
function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export const orderService = {
  /** List the authenticated user's orders (paginated) */
  async getOrders(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Order>> {
    const res = await fetch(
      `${API_BASE}/api/orders?page=${page}&limit=${limit}`,
      { headers: authHeaders() }
    );
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };

    const raw = json.data ?? json;
    const orders: Order[] = (raw.orders || raw.data || raw || []).map(normalizeOrder);
    const pagination = raw.pagination || { total: orders.length, page, limit, totalPages: 1 };

    return {
      data: orders,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    } as any;
  },

  /** Get a single order by numeric ID */
  async getOrderById(id: string): Promise<Order> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetch(
      `${API_BASE}/api/orders/${numericId}`,
      { headers: authHeaders() }
    );
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Create a new order from the cart — accepts { addressId } or legacy CheckoutFormData */
  async createOrder(data: any): Promise<Order> {
    // Support both { addressId } (new) and old CheckoutFormData shape
    const addressId = data.addressId ?? data.address?.id ?? '1';
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ addressId: String(addressId) }),
    });
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Cancel an order */
  async cancelOrder(id: string, _reason?: string): Promise<Order> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetch(
      `${API_BASE}/api/orders/${numericId}/cancel`,
      { method: 'PATCH', headers: authHeaders() }
    );
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Submit a return request via shipping service */
  async returnOrder(id: string, reason: string): Promise<Order> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetch(`${API_BASE}/api/v1/web/shipping/return`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ orderId: numericId, reason }),
    });
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    // Return the existing order after return request
    return orderService.getOrderById(id);
  },

  /** Get live tracking info for an order */
  async trackOrder(id: string): Promise<any> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetch(
      `${API_BASE}/api/v1/web/shipping/track/${numericId}`,
      { headers: authHeaders() }
    );
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return json.data ?? json;
  },
};
