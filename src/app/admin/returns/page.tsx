'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin';
import { StatusBadge } from '@/components/admin';
import { returnService } from '@/services/admin';
import type { ReturnRequest } from '@/types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ReturnsPage() {
  const returns = returnService.getAllReturns();

  const columns: ColumnDef<ReturnRequest>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Return ID',
        cell: (info) => (
          <Link 
            href={`/admin/returns/${info.row.original.id}`}
            className="font-medium text-primary hover:underline"
          >
            {info.row.original.id}
          </Link>
        ),
      },
      {
        accessorKey: 'orderId',
        header: 'Order ID',
        cell: (info) => (
          <Link 
            href={`/admin/orders/${info.row.original.orderId}`}
            className="font-medium text-primary hover:underline"
          >
            {info.row.original.orderId}
          </Link>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
      },
      {
        accessorKey: 'refundAmount',
        header: 'Refund Amount',
        cell: (info) => `$${info.row.original.refundAmount.toFixed(2)}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.row.original.status} />,
      },
      {
        accessorKey: 'refundStatus',
        header: 'Refund Status',
        cell: (info) => <StatusBadge status={info.row.original.refundStatus} />,
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
                <Link href={`/admin/returns/${info.row.original.id}`} className="flex items-center">
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
          <h1 className="text-3xl font-bold text-foreground">Returns</h1>
          <p className="text-muted-foreground mt-1">Manage all return requests</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Export Returns
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Returns</div>
          <div className="text-2xl font-bold text-foreground mt-2">{returns.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {returns.filter(r => r.status === 'pending_review').length}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Approved</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {returns.filter(r => r.status === 'approved').length}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Completed</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {returns.filter(r => r.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <DataTable
          columns={columns}
          data={returns}
          searchPlaceholder="Search returns..."
          searchKey="customerName"
        />
      </div>
    </div>
  );
}
