'use client';

import Link from 'next/link';
import { useOrders } from '@/hooks/use-orders';
import {
  Package, Truck, CheckCircle, Clock, XCircle, RotateCcw,
  ShoppingBag, ChevronRight, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  pending:           { label: 'Pending',           color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   Icon: Clock },
  payment_pending:   { label: 'Payment Pending',   color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200',  Icon: Clock },
  confirmed:         { label: 'Confirmed',         color: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-200',    Icon: CheckCircle },
  processing:        { label: 'Processing',        color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    Icon: Package },
  packed:            { label: 'Packed',            color: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200',  Icon: Package },
  shipped:           { label: 'Shipped',           color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    Icon: Truck },
  in_transit:        { label: 'In Transit',        color: 'text-cyan-700',    bg: 'bg-cyan-50',    border: 'border-cyan-200',    Icon: Truck },
  out_for_delivery:  { label: 'Out for Delivery',  color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200',     Icon: Truck },
  delivered:         { label: 'Delivered',         color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: CheckCircle },
  cancelled:         { label: 'Cancelled',         color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     Icon: XCircle },
  return_requested:  { label: 'Return Requested',  color: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',    Icon: RotateCcw },
  returned:          { label: 'Returned',          color: 'text-gray-700',    bg: 'bg-gray-50',    border: 'border-gray-200',    Icon: RotateCcw },
  refund_processing: { label: 'Refund Processing', color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200',  Icon: RotateCcw },
  refund_completed:  { label: 'Refund Completed',  color: 'text-green-700',   bg: 'bg-green-50',   border: 'border-green-200',   Icon: CheckCircle },
};

function getStatus(status: string) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_CONFIG[key] || STATUS_CONFIG['processing'];
}

export default function OrdersPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useOrders(1, 20);
  const orders = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-[#334155] font-semibold">Failed to load orders.</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-semibold hover:bg-[#115E59] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 bg-[#F0FDFA] rounded-3xl flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[#0F766E]" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#0F172A] mb-1">No Orders Yet</h2>
          <p className="text-sm text-[#64748B]">When you place orders, they'll appear here.</p>
        </div>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-[#0F766E] text-white rounded-xl text-sm font-semibold hover:bg-[#115E59] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-lg font-bold text-[#0F172A]">My Orders</h1>
          <p className="text-xs text-[#64748B]">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {orders.map((order: any) => {
          const statusKey = (order.status || '').toLowerCase();
          const cfg = getStatus(statusKey);
          const StatusIcon = cfg.Icon;
          const rawId = order.id;
          const displayId = order.orderNumber || `#${order.id}`;
          const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '';
          const itemCount = (order.items || []).length;
          const total = Number(order.total || 0);
          // First product image for preview
          const firstImage = order.items?.[0]?.product?.images?.[0];

          return (
            <div
              key={rawId}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A] font-mono">{displayId}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{orderDate}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                </div>

                {/* Items preview row */}
                {itemCount > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {order.items.slice(0, 3).map((item: any, i: number) => {
                      const imgUrl = item.product?.images?.[0];
                      return imgUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          key={i}
                          src={imgUrl}
                          alt={item.product?.name || 'Product'}
                          className="w-12 h-14 object-cover rounded-lg border border-[#E2E8F0] flex-shrink-0"
                        />
                      ) : (
                        <div key={i} className="w-12 h-14 bg-[#F1F5F9] rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                      );
                    })}
                    {itemCount > 3 && (
                      <div className="w-12 h-14 bg-[#F1F5F9] rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#64748B]">+{itemCount - 3}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <div>
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Total</p>
                    <p className="text-base font-bold text-[#0F172A]">₹{total.toLocaleString('en-IN')}</p>
                  </div>
                  <Link
                    href={`/orders/${rawId}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#F0FDFA] hover:bg-[#0F766E] text-[#0F766E] hover:text-white border border-[#99F6E4] hover:border-[#0F766E] rounded-xl text-sm font-semibold transition-all"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
