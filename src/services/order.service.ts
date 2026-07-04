import { Order, PaginatedResponse } from '@/types';
import { PAGINATION } from '@/constants';

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'AUR-78421', status: 'delivered',
    createdAt: '2026-06-12T10:22:00Z', updatedAt: '2026-06-16T14:15:00Z',
    total: 2999, subtotal: 2999, discount: 300, shipping: 0, tax: 540,
    items: [
      { id: 'i1', orderId: 'AUR-78421', productId: '1', quantity: 1, price: 1799, product: { id: '1', name: 'Premium Linen Blazer', images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80'] } as any } as any,
      { id: 'i2', orderId: 'AUR-78421', productId: '2', quantity: 1, price: 1200, product: { id: '2', name: 'Tailored Chinos', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&q=80'] } as any } as any,
    ],
    shippingAddress: { fullName: 'Avinash Magar', address: '42 Sunshine Lane', city: 'Pune', state: 'Maharashtra', zipCode: '411001', country: 'India' } as any,
    paymentMethod: 'card',
  } as any,
  {
    id: 'AUR-78316', status: 'shipped',
    createdAt: '2026-06-03T15:45:00Z', updatedAt: '2026-06-05T08:00:00Z',
    total: 1890, subtotal: 1890, discount: 0, shipping: 0, tax: 340,
    items: [
      { id: 'i3', orderId: 'AUR-78316', productId: '3', quantity: 1, price: 1890, product: { id: '3', name: 'Silk Wrap Dress', images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&q=80'] } as any } as any,
    ],
    shippingAddress: { fullName: 'Avinash Magar', address: 'Level 5, Tower B, Cybercity', city: 'Pune', state: 'Maharashtra', zipCode: '411013', country: 'India' } as any,
    paymentMethod: 'upi',
  } as any,
  {
    id: 'AUR-77904', status: 'processing',
    createdAt: '2026-05-25T18:30:00Z', updatedAt: '2026-05-25T18:45:00Z',
    total: 4799, subtotal: 4799, discount: 500, shipping: 0, tax: 864,
    items: [
      { id: 'i4', orderId: 'AUR-77904', productId: '4', quantity: 1, price: 3499, product: { id: '4', name: 'Cashmere Overcoat', images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=80'] } as any } as any,
      { id: 'i5', orderId: 'AUR-77904', productId: '5', quantity: 2, price: 650, product: { id: '5', name: 'Merino Turtleneck', images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&q=80'] } as any } as any,
    ],
    shippingAddress: { fullName: 'Avinash Magar', address: '42 Sunshine Lane', city: 'Pune', state: 'Maharashtra', zipCode: '411001', country: 'India' } as any,
    paymentMethod: 'netbanking',
  } as any,
];

export const orderService = {
  async getOrders(
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ): Promise<PaginatedResponse<Order>> {
    await delay(300);
    const start = (page - 1) * limit;
    const data = MOCK_ORDERS.slice(start, start + limit);
    return { data, total: MOCK_ORDERS.length, page, limit, totalPages: Math.ceil(MOCK_ORDERS.length / limit) } as any;
  },

  async getOrderById(id: string): Promise<Order> {
    await delay(200);
    const order = MOCK_ORDERS.find((o) => o.id === id || o.id === id.replace('#', ''));
    if (!order) throw { response: { data: { message: 'Order not found.' } } };
    return order;
  },

  async createOrder(_data: any): Promise<Order> {
    await delay(500);
    const newOrder: Order = {
      id: 'AUR-' + Math.floor(70000 + Math.random() * 10000),
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      total: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      items: [],
      shippingAddress: _data?.shippingAddress || {},
      paymentMethod: _data?.paymentMethod || 'card',
    } as any;
    MOCK_ORDERS.unshift(newOrder);
    return newOrder;
  },

  async cancelOrder(id: string, _reason?: string): Promise<Order> {
    await delay(400);
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (order) (order as any).status = 'cancelled';
    return order || MOCK_ORDERS[0];
  },

  async returnOrder(id: string, _reason: string): Promise<Order> {
    await delay(400);
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (order) (order as any).status = 'returned';
    return order || MOCK_ORDERS[0];
  },

  async trackOrder(id: string): Promise<Order> {
    await delay(200);
    return orderService.getOrderById(id);
  },
};
