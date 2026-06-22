'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Package } from 'lucide-react';
import { ORDER_STATUS, PAYMENT_STATUS, CURRENCY } from '@/constants';

export default function OrdersPage() {
  const router = useRouter();

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      orderNumber: 'ORD-2024-001',
      orderStatus: 'delivered' as const,
      paymentStatus: 'completed' as const,
      total: 5999,
      createdAt: '2024-01-15T10:30:00Z',
      items: [
        { name: 'Wireless Bluetooth Headphones', quantity: 1, price: 2999 },
        { name: 'Smart Watch Series 5', quantity: 1, price: 2999 },
      ],
    },
    {
      id: 'ORD-002',
      orderNumber: 'ORD-2024-002',
      orderStatus: 'shipped' as const,
      paymentStatus: 'completed' as const,
      total: 1499,
      createdAt: '2024-01-18T14:20:00Z',
      items: [
        { name: 'Premium Cotton T-Shirt', quantity: 2, price: 599 },
        { name: 'Stainless Steel Water Bottle', quantity: 1, price: 299 },
      ],
    },
  ];

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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your orders here."
          action={{
            label: 'Start Shopping',
            onClick: () => router.push('/products'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
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

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {CURRENCY.SYMBOL}
                      {(item.price * item.quantity).toLocaleString(CURRENCY.LOCALE)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="font-bold text-gray-900 dark:text-white">
                  Total: {CURRENCY.SYMBOL}
                  {order.total.toLocaleString(CURRENCY.LOCALE)}
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
