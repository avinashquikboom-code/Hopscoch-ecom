import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, DollarSign, Package, Truck, Users, TrendingUp } from 'lucide-react';
import { orderService, returnService, refundService, paymentService, shipmentService } from '@/services/admin';
import type { Order, ReturnRequest } from '@/types/admin';

export default function AdminDashboard() {
  const orderStats = orderService.getOrderStats();
  const returnStats = returnService.getReturnStats();
  const refundStats = refundService.getRefundStats();
  const paymentStats = paymentService.getPaymentStats();
  const shipmentStats = shipmentService.getShipmentStats();

  const statsCards = [
    {
      title: 'Total Orders',
      value: orderStats.totalOrders,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `$${orderStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Orders',
      value: orderStats.pendingOrders,
      icon: Package,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      change: '-2.3%',
      changeType: 'negative' as const,
    },
    {
      title: 'Active Shipments',
      value: shipmentStats.shipped + shipmentStats.inTransit,
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+5.1%',
      changeType: 'positive' as const,
    },
    {
      title: 'Return Requests',
      value: returnStats.pendingReview,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+3.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Refunds Pending',
      value: refundStats.pending,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '-1.5%',
      changeType: 'negative' as const,
    },
  ];

  const recentOrders = orderService.getAllOrders().slice(0, 5);
  const recentReturns = returnService.getAllReturns().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to AURA Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${order.total}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Returns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
            <CardDescription>Latest 5 return requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReturns.map((ret: ReturnRequest) => (
                <div key={ret.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{ret.id}</p>
                      <p className="text-sm text-muted-foreground">{ret.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${ret.refundAmount}</p>
                    <p className="text-xs text-muted-foreground">
                      {ret.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orderStats.deliveredOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{orderStats.cancelledOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Refunds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${refundStats.totalRefundAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payment Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {((paymentStats.successful / paymentStats.totalTransactions) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
