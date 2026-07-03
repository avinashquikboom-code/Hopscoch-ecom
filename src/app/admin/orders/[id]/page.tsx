'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Package, Truck, Download, Printer, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin';
import { Timeline } from '@/components/admin';
import { orderService } from '@/services/admin';
import type { Order } from '@/types/admin';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const order = orderService.getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
          <p className="text-muted-foreground mt-1">{order.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium text-foreground">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-medium text-foreground">{order.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium text-foreground">{format(order.createdAt, 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-medium text-foreground">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{order.customerPhone}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Delivery Address</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress.addressLine1}</p>
                {order.deliveryAddress.addressLine2 && (
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress.addressLine2}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress.country}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Billing Address</p>
                <p className="text-sm text-muted-foreground">{order.billingAddress.addressLine1}</p>
                {order.billingAddress.addressLine2 && (
                  <p className="text-sm text-muted-foreground">{order.billingAddress.addressLine2}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{order.billingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.variant.size} | Color: {item.variant.color}
                      </p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium text-foreground capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.courierPartner ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Courier Partner</p>
                    <p className="font-medium text-foreground">{order.courierPartner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-medium text-foreground">{order.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AWB Number</p>
                    <p className="font-medium text-foreground">{order.awbNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Delivery</p>
                    <p className="font-medium text-foreground">
                      {order.expectedDeliveryDate ? format(order.expectedDeliveryDate, 'MMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Shipping information not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount</span>
                <span className="font-medium text-foreground">-${order.discount.toFixed(2)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Coupon Discount</span>
                  <span className="font-medium text-foreground">-${order.couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">${order.shippingCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === 'pending' && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Order
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Order
                  </Button>
                </>
              )}
              {order.status === 'confirmed' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Package className="mr-2 h-4 w-4" />
                  Pack Order
                </Button>
              )}
              {order.status === 'packed' && (
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Truck className="mr-2 h-4 w-4" />
                  Ship Order
                </Button>
              )}
              {order.status === 'shipped' && (
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Clock className="mr-2 h-4 w-4" />
                  Mark Out for Delivery
                </Button>
              )}
              {order.status === 'out_for_delivery' && (
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Delivered
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={order.timeline} />
            </CardContent>
          </Card>

          {order.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
