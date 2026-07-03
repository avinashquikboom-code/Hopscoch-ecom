'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin';
import { StatusBadge } from '@/components/admin';
import { orderService } from '@/services/admin';
import type { Order } from '@/types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OrdersPage() {
  const orders = orderService.getAllOrders();

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: (info) => (
          <Link 
            href={`/admin/orders/${info.row.original.id}`}
            className="font-medium text-primary hover:underline"
          >
            {info.row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice',
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
      },
      {
        accessorKey: 'customerEmail',
        header: 'Email',
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => `$${info.row.original.total.toFixed(2)}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.row.original.status} />,
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Payment',
        cell: (info) => <StatusBadge status={info.row.original.paymentStatus} />,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: (info) => format(info.row.original.createdAt, 'MMM dd, yyyy'),
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
                <Link href={`/admin/orders/${info.row.original.id}`} className="flex items-center">
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
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage all customer orders</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Export Orders
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Orders</div>
          <div className="text-2xl font-bold text-foreground mt-2">{orders.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Delivered</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder="Search orders..."
          searchKey="customerName"
        />
      </div>
    </div>
  );
}
