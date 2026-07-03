'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin';
import { StatusBadge } from '@/components/admin';
import { shipmentService } from '@/services/admin';
import type { Shipment } from '@/types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ShippingPage() {
  const shipments = shipmentService.getAllShipments();
  const stats = shipmentService.getShipmentStats();

  const columns: ColumnDef<Shipment>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Shipment ID',
        cell: (info) => (
          <Link 
            href={`/admin/shipping/${info.row.original.id}`}
            className="font-medium text-primary hover:underline"
          >
            {info.row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: 'orderId',
        header: 'Order ID',
      },
      {
        accessorKey: 'courierPartner',
        header: 'Courier',
      },
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking',
      },
      {
        accessorKey: 'currentLocation',
        header: 'Location',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.row.original.status} />,
      },
      {
        accessorKey: 'estimatedDelivery',
        header: 'Est. Delivery',
        cell: (info) => info.row.original.estimatedDelivery ? format(info.row.original.estimatedDelivery, 'MMM dd, yyyy') : 'N/A',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/admin/shipping/${info.row.original.id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shipping</h1>
          <p className="text-muted-foreground mt-1">Manage all shipments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Export Shipments
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Shipments</div>
          <div className="text-2xl font-bold text-foreground mt-2">{stats.totalShipments}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">In Transit</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{stats.inTransit + stats.shipped}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Delivered</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.delivered}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Out for Delivery</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">{stats.outForDelivery}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <DataTable
          columns={columns}
          data={shipments}
          searchPlaceholder="Search shipments..."
          searchKey="trackingNumber"
        />
      </div>
    </div>
  );
}
