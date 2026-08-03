'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/use-orders';
import { orderService } from '@/services';
import {
  Package, Truck, CheckCircle, Clock, XCircle, RotateCcw,
  ShoppingBag, ChevronRight, Loader2, Search, ArrowLeft, Filter,
  ExternalLink, Calendar, CreditCard, ShieldCheck, Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { resolveImageUrl } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  pending:           { label: 'Pending',           color: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800',   Icon: Clock },
  payment_pending:   { label: 'Payment Pending',   color: 'text-orange-700 dark:text-orange-400',  bg: 'bg-orange-50 dark:bg-orange-950/40',  border: 'border-orange-200 dark:border-orange-800',  Icon: Clock },
  confirmed:         { label: 'Confirmed',         color: 'text-teal-700 dark:text-teal-400',    bg: 'bg-teal-50 dark:bg-teal-950/40',    border: 'border-teal-200 dark:border-teal-800',    Icon: CheckCircle },
  processing:        { label: 'Processing',        color: 'text-blue-700 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-200 dark:border-blue-800',    Icon: Package },
  packed:            { label: 'Packed',            color: 'text-violet-700 dark:text-violet-400',  bg: 'bg-violet-50 dark:bg-violet-950/40',  border: 'border-violet-200 dark:border-violet-800',  Icon: Package },
  shipped:           { label: 'Shipped',           color: 'text-cyan-700 dark:text-cyan-400',    bg: 'bg-cyan-50 dark:bg-cyan-950/40',    border: 'border-cyan-200 dark:border-cyan-800',    Icon: Truck },
  in_transit:        { label: 'In Transit',        color: 'text-cyan-700 dark:text-cyan-400',    bg: 'bg-cyan-50 dark:bg-cyan-950/40',    border: 'border-cyan-200 dark:border-cyan-800',    Icon: Truck },
  out_for_delivery:  { label: 'Out for Delivery',  color: 'text-sky-700 dark:text-sky-400',     bg: 'bg-sky-50 dark:bg-sky-950/40',     border: 'border-sky-200 dark:border-sky-800',     Icon: Truck },
  delivered:         { label: 'Delivered',         color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', Icon: CheckCircle },
  cancelled:         { label: 'Cancelled',         color: 'text-red-700 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-950/40',     border: 'border-red-200 dark:border-red-800',     Icon: XCircle },
  return_requested:  { label: 'Return Requested',  color: 'text-rose-700 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-950/40',    border: 'border-rose-200 dark:border-rose-800',    Icon: RotateCcw },
  returned:          { label: 'Returned',          color: 'text-slate-700 dark:text-slate-400',    bg: 'bg-slate-50 dark:bg-slate-900',    border: 'border-slate-200 dark:border-slate-800',    Icon: RotateCcw },
  refund_processing: { label: 'Refund Processing', color: 'text-purple-700 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-950/40',  border: 'border-purple-200 dark:border-purple-800',  Icon: RotateCcw },
  refund_completed:  { label: 'Refund Completed',  color: 'text-emerald-700 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-950/40',   border: 'border-emerald-200 dark:border-emerald-800',   Icon: CheckCircle },
};

function getStatus(status: string) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_CONFIG[key] || STATUS_CONFIG['processing'];
}

type TabCategory = 'all' | 'in_progress' | 'delivered' | 'cancelled_returned';

export default function OrdersPage() {
  const router = useRouter();
  const storeAuth = useAuthStore((s: any) => s.isAuthenticated);
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const isAuthenticated = storeAuth || !!(token && token !== 'undefined' && token !== 'null' && token.trim() !== '');

  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch } = useOrders(1, 50);
  const rawOrders = data?.data || [];

  // Filter logic
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((order: any) => {
      const status = (order.status || '').toLowerCase();
      
      // Category tab match
      let matchCategory = true;
      if (activeTab === 'in_progress') {
        matchCategory = ['pending', 'payment_pending', 'confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery'].includes(status);
      } else if (activeTab === 'delivered') {
        matchCategory = status === 'delivered';
      } else if (activeTab === 'cancelled_returned') {
        matchCategory = ['cancelled', 'return_requested', 'returned', 'refund_processing', 'refund_completed'].includes(status);
      }

      // Search match
      let matchSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const orderNum = (order.orderNumber || `#${order.id}`).toLowerCase();
        const hasMatchingProduct = (order.items || []).some((i: any) => 
          (i.product?.name || i.product?.title || '').toLowerCase().includes(q)
        );
        matchSearch = orderNum.includes(q) || hasMatchingProduct;
      }

      return matchCategory && matchSearch;
    });
  }, [rawOrders, activeTab, searchQuery]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] bg-slate-50/80 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/50 rounded-full flex items-center justify-center border border-teal-200 dark:border-teal-800">
          <ShoppingBag className="w-10 h-10 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Please Sign In to View Orders</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center">
          Sign in to track your current deliveries, manage returns, and view order invoices.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-teal-600/20"
        >
          Sign In / Register
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[80vh] bg-slate-50/80 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-12 h-12 text-rose-500" />
        <p className="text-slate-800 dark:text-slate-200 font-semibold">Failed to fetch order history</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 pb-16">
      
      {/* Header Sticky Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/profile')}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Back to Account"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rawOrders.length} total order{rawOrders.length !== 1 ? 's' : ''} placed
                </p>
              </div>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Order # or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-teal-500/50 rounded-xl focus:outline-none text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled_returned', label: 'Cancelled & Returned' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabCategory)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Order List Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/50 rounded-full flex items-center justify-center mx-auto border border-teal-200 dark:border-teal-800">
              <ShoppingBag className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Orders Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {searchQuery ? `No orders matched "${searchQuery}"` : 'You have no orders in this category yet.'}
              </p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const statusKey = (order.status || '').toLowerCase();
            const cfg = getStatus(statusKey);
            const StatusIcon = cfg.Icon;
            const rawId = order.id;
            const displayId = order.orderNumber || `#${order.id}`;
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '';
            const items = order.items || [];
            const itemCount = items.length;
            const total = Number(order.total || 0);

            return (
              <div
                key={rawId}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all space-y-0"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Card Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-base font-bold text-slate-900 dark:text-white">{displayId}</p>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {orderDate}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border} self-start sm:self-auto`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Product Thumbnails Preview */}
                  {itemCount > 0 && (
                    <div className="flex items-center gap-3 overflow-x-auto py-1">
                      {items.slice(0, 4).map((item: any, i: number) => {
                        const rawImg = item.product?.images?.[0] || item.product?.imageUrl || item.imageUrl || item.image || item.variantSnapshot?.imageUrl || item.variantSnapshot?.image;
                        const imgUrl = resolveImageUrl(rawImg);
                        const name = item.product?.name || 'Product';
                        return (
                          <div key={i} className="relative group flex-shrink-0">
                            {imgUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={imgUrl}
                                alt={name}
                                className="w-16 h-18 sm:w-20 sm:h-22 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600';
                                }}
                              />
                            ) : (
                              <div className="w-16 h-18 sm:w-20 sm:h-22 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {itemCount > 4 && (
                        <div className="w-16 h-18 sm:w-20 sm:h-22 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">+{itemCount - 4} more</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Actions & Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">₹{total.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="text-xs text-slate-400">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          orderService.downloadInvoice(rawId);
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                        title="Download Tax Invoice"
                      >
                        <Download className="w-3.5 h-3.5 text-teal-600" />
                        Invoice
                      </button>

                      <Link
                        href={`/orders/${rawId}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-600/20"
                      >
                        View Order Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}

      </div>

    </div>
  );
}
