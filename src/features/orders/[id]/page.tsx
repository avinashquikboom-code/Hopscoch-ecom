'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Truck, Package, CheckCircle, XCircle } from 'lucide-react';
import { ORDER_STATUS, PAYMENT_STATUS, CURRENCY } from '@/constants';

export default function OrderDetailsPage() {
  const router = useRouter();

  // Mock order data
  const order = {
    id: 'ORD-001',
    orderNumber: 'ORD-2024-001',
    orderStatus: 'delivered' as const,
    paymentStatus: 'completed' as const,
    paymentMethod: 'credit_card' as const,
    subtotal: 5998,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 5998,
    createdAt: '2024-01-15T10:30:00Z',
    estimatedDelivery: '2024-01-20T00:00:00Z',
    trackingNumber: 'TRK123456789',
    trackingUrl: 'https://tracking.example.com/TRK123456789',
    shippingAddress: {
      fullName: 'John Doe',
      phone: '+91 98765 43210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
    },
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 2999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
      },
      {
        id: '2',
        name: 'Smart Watch Series 5',
        quantity: 1,
        price: 2999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const timeline = [
    { status: 'confirmed', label: 'Order Confirmed', completed: true, date: 'Jan 15, 2024' },
    { status: 'processing', label: 'Processing', completed: true, date: 'Jan 15, 2024' },
    { status: 'shipped', label: 'Shipped', completed: true, date: 'Jan 16, 2024' },
    { status: 'delivered', label: 'Delivered', completed: true, date: 'Jan 20, 2024' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/orders')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>

              {order.trackingNumber && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tracking Information</p>
                    <p className="font-medium">{order.trackingNumber}</p>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 bg-current rounded-full" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${
                            item.completed ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {CURRENCY.SYMBOL}
                      {(item.price * item.quantity).toLocaleString(CURRENCY.LOCALE)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Address & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.addressLine1}
                </p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shippingAddress.addressLine2}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.country}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">
                  {CURRENCY.SYMBOL}
                  {order.subtotal.toLocaleString(CURRENCY.LOCALE)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium">
                  {CURRENCY.SYMBOL}
                  {order.shipping.toLocaleString(CURRENCY.LOCALE)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium">
                  {CURRENCY.SYMBOL}
                  {order.tax.toLocaleString(CURRENCY.LOCALE)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{CURRENCY.SYMBOL}
                    {order.discount.toLocaleString(CURRENCY.LOCALE)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">
                  {CURRENCY.SYMBOL}
                  {order.total.toLocaleString(CURRENCY.LOCALE)}
                </span>
              </div>
            </CardContent>
          </Card>

          {order.orderStatus !== 'delivered' && (
            <Button variant="outline" className="w-full">
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
