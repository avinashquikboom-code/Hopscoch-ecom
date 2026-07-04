// Order Types
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'completed';

export type PaymentStatus = 
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'successful'
  | 'failed'
  | 'cancelled'
  | 'refund_initiated'
  | 'refund_completed';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'upi'
  | 'net_banking'
  | 'wallet'
  | 'cod';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Address {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  gatewayTransactionId?: string;
  deliveryAddress: Address;
  billingAddress: Address;
  courierPartner?: string;
  trackingNumber?: string;
  awbNumber?: string;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: OrderTimeline[];
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  date: Date;
  time: string;
  updatedBy: string;
  remarks?: string;
}

// Return Types
export type ReturnStatus = 
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'received'
  | 'quality_inspection'
  | 'refund_approved'
  | 'refund_completed'
  | 'completed';

export type ReturnReason = 
  | 'wrong_item'
  | 'damaged'
  | 'defective'
  | 'not_as_described'
  | 'size_issue'
  | 'quality_issue'
  | 'changed_mind'
  | 'other';

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: {
    size: string;
    color: string;
  };
  quantity: number;
  price: number;
  reason: ReturnReason;
  images: string[];
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderInvoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: ReturnItem[];
  status: ReturnStatus;
  returnReason: string;
  customerComments: string;
  images: string[];
  pickupStatus: string;
  inspectionStatus: string;
  refundStatus: string;
  refundMethod?: string;
  refundAmount: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: ReturnTimeline[];
}

export interface ReturnTimeline {
  id: string;
  status: ReturnStatus;
  date: Date;
  time: string;
  updatedBy: string;
  remarks?: string;
}

// Refund Types
export type RefundStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed'
  | 'failed';

export type RefundType = 'full' | 'partial';

export interface Refund {
  id: string;
  orderId: string;
  orderInvoiceNumber: string;
  returnId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  paymentGateway: string;
  transactionId: string;
  refundAmount: number;
  refundType: RefundType;
  status: RefundStatus;
  refundReason: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  timeline: RefundTimeline[];
}

export interface RefundTimeline {
  id: string;
  status: RefundStatus;
  date: Date;
  time: string;
  updatedBy: string;
  remarks?: string;
}

// Payment Types
export interface PaymentTransaction {
  id: string;
  paymentId: string;
  gatewayTransactionId: string;
  orderId: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  tax: number;
  shippingCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentGateway: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  date: Date;
  time: string;
  gatewayResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shipment Types
export type ShipmentStatus = 
  | 'packed'
  | 'ready_to_ship'
  | 'picked_up'
  | 'shipped'
  | 'reached_hub'
  | 'transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface CourierPartner {
  id: string;
  name: string;
  code: string;
  logo: string;
  trackingUrl: string;
  isActive: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  orderInvoiceNumber: string;
  courierPartner: string;
  trackingNumber: string;
  awbNumber: string;
  pickupDate?: Date;
  dispatchDate?: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  status: ShipmentStatus;
  currentLocation?: string;
  createdAt: Date;
  updatedAt: Date;
  timeline: ShipmentTimeline[];
}

export interface ShipmentTimeline {
  id: string;
  status: ShipmentStatus;
  date: Date;
  time: string;
  location: string;
  remarks?: string;
}

// Notification Types
export type NotificationType = 
  | 'order_confirmed'
  | 'order_packed'
  | 'order_shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'return_approved'
  | 'return_rejected'
  | 'refund_approved'
  | 'refund_completed'
  | 'payment_successful'
  | 'payment_failed';

export interface Notification {
  id: string;
  type: NotificationType;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  title: string;
  message: string;
  orderId?: string;
  returnId?: string;
  refundId?: string;
  isRead: boolean;
  sentVia: ('email' | 'sms' | 'push')[];
  createdAt: Date;
}

// Report Types
export type ReportType = 
  | 'orders'
  | 'shipping'
  | 'payments'
  | 'refunds'
  | 'returns'
  | 'courier';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  startDate: Date;
  endDate: Date;
  generatedBy: string;
  fileUrl: string;
  format: ExportFormat;
  createdAt: Date;
}

// Filter Types
export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface ReturnFilters {
  status?: ReturnStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface RefundFilters {
  status?: RefundStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface PaymentFilters {
  status?: PaymentStatus[];
  paymentMethod?: PaymentMethod[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface ShipmentFilters {
  status?: ShipmentStatus[];
  courierPartner?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}
