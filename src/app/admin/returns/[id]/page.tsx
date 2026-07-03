'use client';

import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Package, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/admin';
import { Timeline } from '@/components/admin';
import { returnService } from '@/services/admin';
import type { ReturnRequest } from '@/types/admin';

export default function ReturnDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const returnId = params.id as string;
  
  const returnRequest = returnService.getReturnById(returnId);

  if (!returnRequest) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Return Request Not Found</h2>
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
          <h1 className="text-3xl font-bold text-foreground">Return Details</h1>
          <p className="text-muted-foreground mt-1">{returnRequest.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Return ID</p>
                  <p className="font-medium text-foreground">{returnRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium text-foreground">{returnRequest.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p className="font-medium text-foreground">{format(returnRequest.createdAt, 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge status={returnRequest.status} />
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
                <p className="font-medium text-foreground">{returnRequest.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{returnRequest.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{returnRequest.customerPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Return Reason</p>
                <p className="font-medium text-foreground">{returnRequest.returnReason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer Comments</p>
                <p className="font-medium text-foreground">{returnRequest.customerComments}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refund Amount</p>
                <p className="font-bold text-foreground">${returnRequest.refundAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refund Method</p>
                <p className="font-medium text-foreground capitalize">{returnRequest.refundMethod}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnRequest.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {returnRequest.status === 'pending_review' && (
                <>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Return
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Return
                  </Button>
                </>
              )}
              {returnRequest.status === 'approved' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Truck className="mr-2 h-4 w-4" />
                  Schedule Pickup
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={returnRequest.timeline} />
            </CardContent>
          </Card>

          {returnRequest.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{returnRequest.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
