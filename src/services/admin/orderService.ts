import { Order, OrderFilters, OrderStatus, OrderTimeline } from '@/types/admin';
import { mockOrders } from './mockData';

class OrderService {
  private orders: Order[] = [...mockOrders];

  getAllOrders(filters?: OrderFilters): Order[] {
    let filteredOrders = [...this.orders];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredOrders = filteredOrders.filter(order => 
          filters.status!.includes(order.status)
        );
      }

      if (filters.paymentStatus && filters.paymentStatus.length > 0) {
        filteredOrders = filteredOrders.filter(order => 
          filters.paymentStatus!.includes(order.paymentStatus)
        );
      }

      if (filters.dateRange) {
        filteredOrders = filteredOrders.filter(order => 
          order.createdAt >= filters.dateRange!.from && 
          order.createdAt <= filters.dateRange!.to
        );
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.id.toLowerCase().includes(searchLower) ||
          order.invoiceNumber.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  getOrderById(orderId: string): Order | null {
    return this.orders.find(order => order.id === orderId) || null;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, updatedBy: string, remarks?: string): Order {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    order.status = status;
    order.updatedAt = new Date();

    const timelineItem: OrderTimeline = {
      id: `TL-${Date.now()}`,
      status,
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks
    };

    order.timeline.push(timelineItem);
    this.orders[orderIndex] = order;

    return order;
  }

  addOrderNote(orderId: string, note: string, updatedBy: string): Order {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    order.adminNotes = note;
    order.updatedAt = new Date();
    this.orders[orderIndex] = order;

    return order;
  }

  assignCourier(orderId: string, courierPartner: string, trackingNumber: string, awbNumber: string, updatedBy: string): Order {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    order.courierPartner = courierPartner;
    order.trackingNumber = trackingNumber;
    order.awbNumber = awbNumber;
    order.updatedAt = new Date();

    const timelineItem: OrderTimeline = {
      id: `TL-${Date.now()}`,
      status: order.status,
      date: new Date(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      updatedBy,
      remarks: `Courier assigned: ${courierPartner}, Tracking: ${trackingNumber}`
    };

    order.timeline.push(timelineItem);
    this.orders[orderIndex] = order;

    return order;
  }

  updateExpectedDelivery(orderId: string, expectedDate: Date, updatedBy: string): Order {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = this.orders[orderIndex];
    order.expectedDeliveryDate = expectedDate;
    order.updatedAt = new Date();
    this.orders[orderIndex] = order;

    return order;
  }

  getOrderStats() {
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = this.orders.filter(o => o.status === 'confirmed').length;
    const processingOrders = this.orders.filter(o => o.status === 'processing').length;
    const shippedOrders = this.orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = this.orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = this.orders.filter(o => o.status === 'cancelled').length;

    const totalRevenue = this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    };
  }
}

export const orderService = new OrderService();
