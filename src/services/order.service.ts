import { API_BASE } from '@/constants';
import { Order, PaginatedResponse } from '@/types';
import { fetchWithAuth, getValidToken } from '@/lib/api-client';
import { resolveImageUrl } from '@/lib/utils';

// ── Convert status string to wizard step index ──────────────────────────────
function statusToStep(status: string): number {
  const map: Record<string, number> = {
    pending: 1,
    payment_pending: 1,
    confirmed: 2,
    processing: 2,
    packed: 3,
    shipped: 3,
    in_transit: 4,
    out_for_delivery: 4,
    delivered: 5,
  };
  return map[(status || '').toLowerCase()] ?? 1;
}

// ── Convert status string to badge styling ──────────────────────────────────
function statusToColor(status: string): string {
  const map: Record<string, string> = {
    pending:           'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    payment_pending:   'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    confirmed:         'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    processing:        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    packed:            'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    shipped:           'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    in_transit:        'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    out_for_delivery:  'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    delivered:         'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    cancelled:         'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    return_requested:  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    returned:          'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    refund_processing: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    refund_completed:  'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  };
  return map[(status || '').toLowerCase()] ?? 'bg-teal-500/10 text-teal-600 border-teal-500/20';
}

// ── Normalize raw backend order object to UI shape ─────────────────────────
function normalizeOrder(raw: any): Order {
  const addr = raw.shippingAddress || raw.address || {};
  const shippingAddress = {
    fullName:      addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim() || 'Customer',
    phone:         addr.phone || addr.phoneNumber || '',
    streetAddress: addr.streetAddress || addr.line1 || addr.addressLine1 || '',
    city:          addr.city || '',
    state:         addr.state || addr.stateProvince || '',
    zipCode:       addr.zipCode || addr.pincode || addr.zipPostal || '',
    country:       addr.country || 'India',
  };

  const timeline = [
    { title: 'Order Placed', time: raw.createdAt ? new Date(raw.createdAt).toLocaleString() : '', done: true },
    { title: 'Confirmed',    time: raw.confirmedAt ? new Date(raw.confirmedAt).toLocaleString() : '', done: statusToStep(raw.status) >= 2 },
    { title: 'Shipped',      time: raw.shippedAt ? new Date(raw.shippedAt).toLocaleString() : '', done: statusToStep(raw.status) >= 3 },
    { title: 'Out for Delivery', time: '', done: statusToStep(raw.status) >= 4 },
    { title: 'Delivered',    time: raw.deliveredAt ? new Date(raw.deliveredAt).toLocaleString() : '', done: statusToStep(raw.status) >= 5 },
  ];

  return {
    id: String(raw.id),
    orderNumber: raw.orderNumber || `#${raw.id}`,
    status: raw.status || 'pending',
    step: statusToStep(raw.status),
    color: statusToColor(raw.status),
    total: Number(raw.total || 0),
    subtotal: Number(raw.subtotal || raw.total || 0),
    taxAmount: Number(raw.taxAmount || 0),
    shippingFee: Number(raw.shippingFee || raw.shippingCost || 0),
    discountAmount: Number(raw.discountAmount || 0),
    paymentMethod: raw.paymentMethod || 'COD',
    paymentStatus: raw.paymentStatus || 'PENDING',
    items: (raw.items || []).map((i: any) => {
      let resolvedImages: string[] = [];
      const prodImgs = i.product?.images || i.productImages || i.images;
      if (Array.isArray(prodImgs) && prodImgs.length > 0) {
        resolvedImages = prodImgs
          .map((img: any) => resolveImageUrl(img))
          .filter((url: string) => Boolean(url));
      } else if (i.product?.imageUrl || i.imageUrl || i.image || i.variantSnapshot?.imageUrl || i.variantSnapshot?.image) {
        resolvedImages = [resolveImageUrl(i.product?.imageUrl || i.imageUrl || i.image || i.variantSnapshot?.imageUrl || i.variantSnapshot?.image)];
      }

      if (resolvedImages.length === 0) {
        resolvedImages = ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600'];
      }

      return {
        id: String(i.id),
        product: {
          id: String(i.product?.id || i.productId || ''),
          name: i.product?.name || i.productNameSnapshot || i.title || 'Product',
          images: resolvedImages,
        },
        quantity: i.quantity || 1,
        unitPrice: Number(i.unitPrice || i.price || i.priceSnapshot || 0),
        totalPrice: Number(i.totalPrice || (i.unitPrice || i.price || i.priceSnapshot || 0) * (i.quantity || 1)),
      };
    }),
    shippingAddress,
    timeline,
    trackingNumber: raw.shipment?.awb || raw.trackingNumber || null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  } as any;
}

export const orderService = {
  /** List the authenticated user's orders (paginated) */
  async getOrders(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Order>> {
    if (!getValidToken()) {
      return { data: [], total: 0, page, limit, totalPages: 0 } as any;
    }
    const res = await fetchWithAuth(
      `${API_BASE}/api/v1/web/orders?page=${page}&limit=${limit}`
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
    const res = await fetchWithAuth(
      `${API_BASE}/api/v1/web/orders/${numericId}`
    );
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Create a new order from the cart — accepts { addressId } or legacy CheckoutFormData */
  async createOrder(data: any): Promise<Order> {
    const addressId = data.addressId ?? data.address?.id ?? '1';
    const res = await fetchWithAuth(`${API_BASE}/api/v1/web/orders`, {
      method: 'POST',
      body: JSON.stringify({ addressId: String(addressId) }),
    });
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Cancel an order */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/web/orders/${numericId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || 'Cancelled by user' }),
    });
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Return request */
  async returnOrder(id: string, reason: string): Promise<Order> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/web/orders/${numericId}/return`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Track order */
  async trackOrder(id: string): Promise<any> {
    const numericId = id.replace(/\D/g, '') || id;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/web/orders/${numericId}`);
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return normalizeOrder(json.data ?? json);
  },

  /** Get invoice URL for printing / downloading */
  getInvoiceUrl(id: string): string {
    const cleanId = encodeURIComponent(String(id || '').trim());
    return `${API_BASE}/api/v1/web/orders/${cleanId}/invoice`;
  },

  /** Trigger download / print window for order invoice */
  downloadInvoice(id: string): void {
    if (typeof window !== 'undefined' && id) {
      const url = this.getInvoiceUrl(id);
      window.open(url, '_blank');
    }
  },
};
