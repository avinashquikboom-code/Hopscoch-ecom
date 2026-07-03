import { 
  Order, 
  ReturnRequest, 
  Refund, 
  PaymentTransaction, 
  Shipment,
  CourierPartner,
  OrderStatus,
  ReturnStatus,
  RefundStatus,
  PaymentStatus,
  ShipmentStatus,
  PaymentMethod 
} from '@/types/admin';

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    invoiceNumber: 'INV-001',
    customerId: 'CUST-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+1 234 567 8901',
    items: [
      {
        id: 'ITEM-001',
        productId: 'PROD-001',
        productName: 'Luxury Silk Blouse',
        productImage: '/images/products/blouse.jpg',
        variant: { size: 'M', color: 'Cream' },
        quantity: 2,
        price: 150,
        discount: 0,
        total: 300
      }
    ],
    subtotal: 300,
    discount: 30,
    couponCode: 'SUMMER20',
    couponDiscount: 30,
    shippingCharges: 10,
    tax: 27,
    total: 307,
    status: 'delivered',
    paymentStatus: 'successful',
    paymentMethod: 'credit_card',
    paymentGateway: 'Stripe',
    gatewayTransactionId: 'TXN-001234',
    deliveryAddress: {
      id: 'ADDR-001',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 234 567 8901',
      addressLine1: '123 Luxury Lane',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA'
    },
    billingAddress: {
      id: 'ADDR-001',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 234 567 8901',
      addressLine1: '123 Luxury Lane',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      country: 'USA'
    },
    courierPartner: 'FedEx',
    trackingNumber: 'FDX-123456789',
    awbNumber: 'AWB-123456789',
    expectedDeliveryDate: new Date('2024-01-15'),
    actualDeliveryDate: new Date('2024-01-14'),
    adminNotes: 'Customer requested gift wrap',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    timeline: [
      {
        id: 'TL-001',
        status: 'pending',
        date: new Date('2024-01-10'),
        time: '10:30 AM',
        updatedBy: 'System',
        remarks: 'Order placed successfully'
      },
      {
        id: 'TL-002',
        status: 'confirmed',
        date: new Date('2024-01-10'),
        time: '11:00 AM',
        updatedBy: 'Admin',
        remarks: 'Order confirmed'
      },
      {
        id: 'TL-003',
        status: 'packed',
        date: new Date('2024-01-11'),
        time: '09:00 AM',
        updatedBy: 'Warehouse',
        remarks: 'Order packed'
      },
      {
        id: 'TL-004',
        status: 'shipped',
        date: new Date('2024-01-11'),
        time: '02:00 PM',
        updatedBy: 'Courier',
        remarks: 'Shipped via FedEx'
      },
      {
        id: 'TL-005',
        status: 'delivered',
        date: new Date('2024-01-14'),
        time: '11:30 AM',
        updatedBy: 'Courier',
        remarks: 'Delivered successfully'
      }
    ]
  },
  {
    id: 'ORD-002',
    invoiceNumber: 'INV-002',
    customerId: 'CUST-002',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerPhone: '+1 234 567 8902',
    items: [
      {
        id: 'ITEM-002',
        productId: 'PROD-002',
        productName: 'Designer Trousers',
        productImage: '/images/products/trousers.jpg',
        variant: { size: 'L', color: 'Navy' },
        quantity: 1,
        price: 200,
        discount: 20,
        total: 180
      }
    ],
    subtotal: 180,
    discount: 0,
    couponDiscount: 0,
    shippingCharges: 10,
    tax: 19.8,
    total: 209.8,
    status: 'shipped',
    paymentStatus: 'successful',
    paymentMethod: 'upi',
    paymentGateway: 'Razorpay',
    gatewayTransactionId: 'TXN-001235',
    deliveryAddress: {
      id: 'ADDR-002',
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 234 567 8902',
      addressLine1: '456 Fashion Street',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90001',
      country: 'USA'
    },
    billingAddress: {
      id: 'ADDR-002',
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 234 567 8902',
      addressLine1: '456 Fashion Street',
      city: 'Los Angeles',
      state: 'CA',
      pincode: '90001',
      country: 'USA'
    },
    courierPartner: 'DHL',
    trackingNumber: 'DHL-987654321',
    awbNumber: 'AWB-987654321',
    expectedDeliveryDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    timeline: [
      {
        id: 'TL-006',
        status: 'pending',
        date: new Date('2024-01-15'),
        time: '14:00 PM',
        updatedBy: 'System',
        remarks: 'Order placed successfully'
      },
      {
        id: 'TL-007',
        status: 'confirmed',
        date: new Date('2024-01-15'),
        time: '14:30 PM',
        updatedBy: 'Admin',
        remarks: 'Order confirmed'
      },
      {
        id: 'TL-008',
        status: 'shipped',
        date: new Date('2024-01-16'),
        time: '10:00 AM',
        updatedBy: 'Courier',
        remarks: 'Shipped via DHL'
      }
    ]
  },
  {
    id: 'ORD-003',
    invoiceNumber: 'INV-003',
    customerId: 'CUST-003',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@email.com',
    customerPhone: '+1 234 567 8903',
    items: [
      {
        id: 'ITEM-003',
        productId: 'PROD-003',
        productName: 'Cashmere Sweater',
        productImage: '/images/products/sweater.jpg',
        variant: { size: 'S', color: 'Beige' },
        quantity: 1,
        price: 250,
        discount: 0,
        total: 250
      }
    ],
    subtotal: 250,
    discount: 25,
    couponCode: 'WELCOME10',
    couponDiscount: 25,
    shippingCharges: 0,
    tax: 22.5,
    total: 247.5,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    paymentGateway: 'N/A',
    deliveryAddress: {
      id: 'ADDR-003',
      fullName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 234 567 8903',
      addressLine1: '789 Elegance Avenue',
      city: 'Chicago',
      state: 'IL',
      pincode: '60601',
      country: 'USA'
    },
    billingAddress: {
      id: 'ADDR-003',
      fullName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 234 567 8903',
      addressLine1: '789 Elegance Avenue',
      city: 'Chicago',
      state: 'IL',
      pincode: '60601',
      country: 'USA'
    },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    timeline: [
      {
        id: 'TL-009',
        status: 'pending',
        date: new Date('2024-01-17'),
        time: '09:00 AM',
        updatedBy: 'System',
        remarks: 'Order placed successfully'
      }
    ]
  },
  {
    id: 'ORD-004',
    invoiceNumber: 'INV-004',
    customerId: 'CUST-004',
    customerName: 'James Brown',
    customerEmail: 'james.brown@email.com',
    customerPhone: '+1 234 567 8904',
    items: [
      {
        id: 'ITEM-004',
        productId: 'PROD-004',
        productName: 'Leather Jacket',
        productImage: '/images/products/jacket.jpg',
        variant: { size: 'XL', color: 'Black' },
        quantity: 1,
        price: 400,
        discount: 0,
        total: 400
      }
    ],
    subtotal: 400,
    couponDiscount: 0,
    discount: 0,
    shippingCharges: 15,
    tax: 41.5,
    total: 456.5,
    status: 'cancelled',
    paymentStatus: 'refund_completed',
    paymentMethod: 'credit_card',
    paymentGateway: 'Stripe',
    gatewayTransactionId: 'TXN-001236',
    deliveryAddress: {
      id: 'ADDR-004',
      fullName: 'James Brown',
      email: 'james.brown@email.com',
      phone: '+1 234 567 8904',
      addressLine1: '321 Prestige Road',
      city: 'Miami',
      state: 'FL',
      pincode: '33101',
      country: 'USA'
    },
    billingAddress: {
      id: 'ADDR-004',
      fullName: 'James Brown',
      email: 'james.brown@email.com',
      phone: '+1 234 567 8904',
      addressLine1: '321 Prestige Road',
      city: 'Miami',
      state: 'FL',
      pincode: '33101',
      country: 'USA'
    },
    adminNotes: 'Customer requested cancellation - out of stock',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-13'),
    timeline: [
      {
        id: 'TL-010',
        status: 'pending',
        date: new Date('2024-01-12'),
        time: '16:00 PM',
        updatedBy: 'System',
        remarks: 'Order placed successfully'
      },
      {
        id: 'TL-011',
        status: 'cancelled',
        date: new Date('2024-01-13'),
        time: '10:00 AM',
        updatedBy: 'Admin',
        remarks: 'Order cancelled - item out of stock'
      }
    ]
  },
  {
    id: 'ORD-005',
    invoiceNumber: 'INV-005',
    customerId: 'CUST-005',
    customerName: 'Olivia Martinez',
    customerEmail: 'olivia.martinez@email.com',
    customerPhone: '+1 234 567 8905',
    items: [
      {
        id: 'ITEM-005',
        productId: 'PROD-005',
        productName: 'Summer Dress',
        productImage: '/images/products/dress.jpg',
        variant: { size: 'M', color: 'Floral' },
        quantity: 2,
        price: 180,
        discount: 18,
        total: 324
      }
    ],
    couponDiscount: 0,
    subtotal: 324,
    discount: 0,
    shippingCharges: 10,
    tax: 33.4,
    total: 367.4,
    status: 'processing',
    paymentStatus: 'successful',
    paymentMethod: 'debit_card',
    paymentGateway: 'Stripe',
    gatewayTransactionId: 'TXN-001237',
    deliveryAddress: {
      id: 'ADDR-005',
      fullName: 'Olivia Martinez',
      email: 'olivia.martinez@email.com',
      phone: '+1 234 567 8905',
      addressLine1: '555 Boutique Boulevard',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94102',
      country: 'USA'
    },
    billingAddress: {
      id: 'ADDR-005',
      fullName: 'Olivia Martinez',
      email: 'olivia.martinez@email.com',
      phone: '+1 234 567 8905',
      addressLine1: '555 Boutique Boulevard',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94102',
      country: 'USA'
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-17'),
    timeline: [
      {
        id: 'TL-012',
        status: 'pending',
        date: new Date('2024-01-16'),
        time: '11:00 AM',
        updatedBy: 'System',
        remarks: 'Order placed successfully'
      },
      {
        id: 'TL-013',
        status: 'confirmed',
        date: new Date('2024-01-16'),
        time: '11:30 AM',
        updatedBy: 'Admin',
        remarks: 'Order confirmed'
      },
      {
        id: 'TL-014',
        status: 'processing',
        date: new Date('2024-01-17'),
        time: '09:00 AM',
        updatedBy: 'Warehouse',
        remarks: 'Order being processed'
      }
    ]
  }
];

// Mock Return Requests
export const mockReturnRequests: ReturnRequest[] = [
  {
    id: 'RET-001',
    orderId: 'ORD-001',
    orderInvoiceNumber: 'INV-001',
    customerId: 'CUST-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+1 234 567 8901',
    items: [
      {
        id: 'RET-ITEM-001',
        productId: 'PROD-001',
        productName: 'Luxury Silk Blouse',
        productImage: '/images/products/blouse.jpg',
        variant: { size: 'M', color: 'Cream' },
        quantity: 1,
        price: 150,
        reason: 'size_issue',
        images: ['/images/returns/return1.jpg', '/images/returns/return2.jpg']
      }
    ],
    status: 'approved',
    returnReason: 'Size does not fit properly',
    customerComments: 'The blouse is too tight around the shoulders. Would like to exchange for size L.',
    images: ['/images/returns/return1.jpg', '/images/returns/return2.jpg'],
    pickupStatus: 'scheduled',
    inspectionStatus: 'pending',
    refundStatus: 'pending',
    refundAmount: 150,
    adminNotes: 'Customer provided clear images. Approved for return.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    timeline: [
      {
        id: 'RTL-001',
        status: 'pending_review',
        date: new Date('2024-01-15'),
        time: '10:00 AM',
        updatedBy: 'System',
        remarks: 'Return request submitted'
      },
      {
        id: 'RTL-002',
        status: 'approved',
        date: new Date('2024-01-16'),
        time: '14:00 PM',
        updatedBy: 'Admin',
        remarks: 'Return approved'
      }
    ]
  },
  {
    id: 'RET-002',
    orderId: 'ORD-002',
    orderInvoiceNumber: 'INV-002',
    customerId: 'CUST-002',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    customerPhone: '+1 234 567 8902',
    items: [
      {
        id: 'RET-ITEM-002',
        productId: 'PROD-002',
        productName: 'Designer Trousers',
        productImage: '/images/products/trousers.jpg',
        variant: { size: 'L', color: 'Navy' },
        quantity: 1,
        price: 180,
        reason: 'damaged',
        images: ['/images/returns/return3.jpg']
      }
    ],
    status: 'quality_inspection',
    returnReason: 'Item arrived damaged',
    customerComments: 'The trousers have a small tear near the pocket.',
    images: ['/images/returns/return3.jpg'],
    pickupStatus: 'completed',
    inspectionStatus: 'in_progress',
    refundStatus: 'pending',
    refundAmount: 180,
    adminNotes: 'Item received at warehouse. Quality inspection in progress.',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-17'),
    timeline: [
      {
        id: 'RTL-003',
        status: 'pending_review',
        date: new Date('2024-01-14'),
        time: '09:00 AM',
        updatedBy: 'System',
        remarks: 'Return request submitted'
      },
      {
        id: 'RTL-004',
        status: 'approved',
        date: new Date('2024-01-14'),
        time: '14:00 PM',
        updatedBy: 'Admin',
        remarks: 'Return approved'
      },
      {
        id: 'RTL-005',
        status: 'picked_up',
        date: new Date('2024-01-15'),
        time: '10:00 AM',
        updatedBy: 'Courier',
        remarks: 'Item picked up'
      },
      {
        id: 'RTL-006',
        status: 'received',
        date: new Date('2024-01-16'),
        time: '09:00 AM',
        updatedBy: 'Warehouse',
        remarks: 'Item received at warehouse'
      },
      {
        id: 'RTL-007',
        status: 'quality_inspection',
        date: new Date('2024-01-17'),
        time: '10:00 AM',
        updatedBy: 'Quality Team',
        remarks: 'Quality inspection in progress'
      }
    ]
  }
];

// Mock Refunds
export const mockRefunds: Refund[] = [
  {
    id: 'REF-001',
    orderId: 'ORD-004',
    orderInvoiceNumber: 'INV-004',
    customerId: 'CUST-004',
    customerName: 'James Brown',
    customerEmail: 'james.brown@email.com',
    paymentMethod: 'credit_card',
    paymentGateway: 'Stripe',
    transactionId: 'TXN-001236',
    refundAmount: 456.5,
    refundType: 'full',
    status: 'completed',
    refundReason: 'Order cancelled - item out of stock',
    adminNotes: 'Full refund processed to original payment method',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-14'),
    completedAt: new Date('2024-01-14'),
    timeline: [
      {
        id: 'RFTL-001',
        status: 'pending',
        date: new Date('2024-01-13'),
        time: '10:00 AM',
        updatedBy: 'System',
        remarks: 'Refund initiated'
      },
      {
        id: 'RFTL-002',
        status: 'approved',
        date: new Date('2024-01-13'),
        time: '14:00 PM',
        updatedBy: 'Admin',
        remarks: 'Refund approved'
      },
      {
        id: 'RFTL-003',
        status: 'completed',
        date: new Date('2024-01-14'),
        time: '09:00 AM',
        updatedBy: 'Payment Gateway',
        remarks: 'Refund processed successfully'
      }
    ]
  }
];

// Mock Payment Transactions
export const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'PAY-001',
    paymentId: 'PAYID-001',
    gatewayTransactionId: 'TXN-001234',
    orderId: 'ORD-001',
    invoiceId: 'INV-001',
    customerId: 'CUST-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    amount: 300,
    tax: 27,
    shippingCharge: 10,
    discount: 30,
    couponCode: 'SUMMER20',
    total: 307,
    paymentGateway: 'Stripe',
    paymentMethod: 'credit_card',
    status: 'successful',
    date: new Date('2024-01-10'),
    time: '10:30 AM',
    gatewayResponse: 'Payment successful. Transaction ID: TXN-001234',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'PAY-002',
    paymentId: 'PAYID-002',
    gatewayTransactionId: 'TXN-001235',
    orderId: 'ORD-002',
    invoiceId: 'INV-002',
    customerId: 'CUST-002',
    customerEmail: 'michael.chen@email.com',
    amount: 180,
    customerName: 'Michael Chen',
    tax: 19.8,
    shippingCharge: 10,
    discount: 0,
    total: 209.8,
    paymentGateway: 'Razorpay',
    paymentMethod: 'upi',
    status: 'successful',
    date: new Date('2024-01-15'),
    time: '14:00 PM',
    gatewayResponse: 'Payment successful. Transaction ID: TXN-001235',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'PAY-003',
    paymentId: 'PAYID-003',
    gatewayTransactionId: 'TXN-001236',
    orderId: 'ORD-004',
    invoiceId: 'INV-004',
    customerId: 'CUST-004',
    customerName: 'James Brown',
    customerEmail: 'james.brown@email.com',
    amount: 400,
    tax: 41.5,
    shippingCharge: 15,
    discount: 0,
    total: 456.5,
    paymentGateway: 'Stripe',
    paymentMethod: 'credit_card',
    status: 'refund_completed',
    date: new Date('2024-01-12'),
    time: '16:00 PM',
    gatewayResponse: 'Payment successful. Transaction ID: TXN-001236',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'PAY-004',
    paymentId: 'PAYID-004',
    gatewayTransactionId: 'TXN-001237',
    orderId: 'ORD-005',
    invoiceId: 'INV-005',
    customerId: 'CUST-005',
    customerName: 'Olivia Martinez',
    customerEmail: 'olivia.martinez@email.com',
    amount: 324,
    tax: 33.4,
    shippingCharge: 10,
    discount: 0,
    total: 367.4,
    paymentGateway: 'Stripe',
    paymentMethod: 'debit_card',
    status: 'successful',
    date: new Date('2024-01-16'),
    time: '11:00 AM',
    gatewayResponse: 'Payment successful. Transaction ID: TXN-001237',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

// Mock Courier Partners
export const mockCourierPartners: CourierPartner[] = [
  {
    id: 'CP-001',
    name: 'FedEx',
    code: 'FDX',
    logo: '/images/couriers/fedex.png',
    trackingUrl: 'https://www.fedex.com/tracking',
    isActive: true
  },
  {
    id: 'CP-002',
    name: 'DHL',
    code: 'DHL',
    logo: '/images/couriers/dhl.png',
    trackingUrl: 'https://www.dhl.com/tracking',
    isActive: true
  },
  {
    id: 'CP-003',
    name: 'UPS',
    code: 'UPS',
    logo: '/images/couriers/ups.png',
    trackingUrl: 'https://www.ups.com/tracking',
    isActive: true
  },
  {
    id: 'CP-004',
    name: 'BlueDart',
    code: 'BD',
    logo: '/images/couriers/bluedart.png',
    trackingUrl: 'https://www.bluedart.com/tracking',
    isActive: true
  }
];

// Mock Shipments
export const mockShipments: Shipment[] = [
  {
    id: 'SHP-001',
    orderId: 'ORD-001',
    orderInvoiceNumber: 'INV-001',
    courierPartner: 'FedEx',
    trackingNumber: 'FDX-123456789',
    awbNumber: 'AWB-123456789',
    pickupDate: new Date('2024-01-11'),
    dispatchDate: new Date('2024-01-11'),
    estimatedDelivery: new Date('2024-01-15'),
    actualDelivery: new Date('2024-01-14'),
    status: 'delivered',
    currentLocation: 'New York, NY',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-14'),
    timeline: [
      {
        id: 'STL-001',
        status: 'packed',
        date: new Date('2024-01-11'),
        time: '09:00 AM',
        location: 'Warehouse',
        remarks: 'Order packed'
      },
      {
        id: 'STL-002',
        status: 'ready_to_ship',
        date: new Date('2024-01-11'),
        time: '10:00 AM',
        location: 'Warehouse',
        remarks: 'Ready to ship'
      },
      {
        id: 'STL-003',
        status: 'picked_up',
        date: new Date('2024-01-11'),
        time: '02:00 PM',
        location: 'Los Angeles, CA',
        remarks: 'Picked up by FedEx'
      },
      {
        id: 'STL-004',
        status: 'shipped',
        date: new Date('2024-01-11'),
        time: '04:00 PM',
        location: 'Los Angeles, CA',
        remarks: 'Shipped from origin'
      },
      {
        id: 'STL-005',
        status: 'reached_hub',
        date: new Date('2024-01-12'),
        time: '08:00 AM',
        location: 'Phoenix, AZ',
        remarks: 'Reached Phoenix hub'
      },
      {
        id: 'STL-006',
        status: 'out_for_delivery',
        date: new Date('2024-01-14'),
        time: '08:00 AM',
        location: 'New York, NY',
        remarks: 'Out for delivery'
      },
      {
        id: 'STL-007',
        status: 'delivered',
        date: new Date('2024-01-14'),
        time: '11:30 AM',
        location: 'New York, NY',
        remarks: 'Delivered successfully'
      }
    ]
  },
  {
    id: 'SHP-002',
    orderId: 'ORD-002',
    orderInvoiceNumber: 'INV-002',
    courierPartner: 'DHL',
    trackingNumber: 'DHL-987654321',
    awbNumber: 'AWB-987654321',
    pickupDate: new Date('2024-01-16'),
    dispatchDate: new Date('2024-01-16'),
    estimatedDelivery: new Date('2024-01-20'),
    status: 'shipped',
    currentLocation: 'Los Angeles, CA',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    timeline: [
      {
        id: 'STL-008',
        status: 'packed',
        date: new Date('2024-01-16'),
        time: '08:00 AM',
        location: 'Warehouse',
        remarks: 'Order packed'
      },
      {
        id: 'STL-009',
        status: 'ready_to_ship',
        date: new Date('2024-01-16'),
        time: '09:00 AM',
        location: 'Warehouse',
        remarks: 'Ready to ship'
      },
      {
        id: 'STL-010',
        status: 'picked_up',
        date: new Date('2024-01-16'),
        time: '10:00 AM',
        location: 'Los Angeles, CA',
        remarks: 'Picked up by DHL'
      },
      {
        id: 'STL-011',
        status: 'shipped',
        date: new Date('2024-01-16'),
        time: '02:00 PM',
        location: 'Los Angeles, CA',
        remarks: 'Shipped from origin'
      }
    ]
  }
];
