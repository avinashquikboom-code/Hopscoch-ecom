'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Eye, MoreHorizontal } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin';
import { StatusBadge } from '@/components/admin';
import { paymentService } from '@/services/admin';
import type { PaymentTransaction } from '@/types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PaymentsPage() {
  const transactions = paymentService.getAllTransactions();
  const stats = paymentService.getPaymentStats();

  const columns: ColumnDef<PaymentTransaction>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Transaction ID',
        cell: (info) => (
          <Link 
            href={`/admin/payments/${info.row.original.id}`}
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
        accessorKey: 'customerName',
        header: 'Customer',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => `$${info.row.original.total.toFixed(2)}`,
      },
      {
        accessorKey: 'paymentGateway',
        header: 'Gateway',
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Method',
        cell: (info) => <span className="capitalize">{info.row.original.paymentMethod.replace('_', ' ')}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.row.original.status} />,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => format(info.row.original.date, 'MMM dd, yyyy'),
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
                <Link href={`/admin/payments/${info.row.original.id}`} className="flex items-center">
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
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Manage all payment transactions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Export Transactions
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Transactions</div>
          <div className="text-2xl font-bold text-foreground mt-2">{stats.totalTransactions}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Successful</div>
          <div className="text-2xl font-bold text-green-600 mt-2">{stats.successful}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Failed</div>
          <div className="text-2xl font-bold text-red-600 mt-2">{stats.failed}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-primary mt-2">${stats.totalAmount.toFixed(2)}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <DataTable
          columns={columns}
          data={transactions}
          searchPlaceholder="Search transactions..."
          searchKey="customerName"
        />
      </div>
    </div>
  );
}
