'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, CreditCard, Star, RefreshCw, PhoneCall,
  ChevronRight, Download, MessageSquare, RotateCcw, ShieldCheck, Loader2
} from 'lucide-react';
import { useOrder } from '@/hooks/use-orders';

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
  refund_processing: { label: 'Refund Processing', color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200',  Icon: RefreshCw },
  refund_completed:  { label: 'Refund Completed',  color: 'text-green-700',   bg: 'bg-green-50',   border: 'border-green-200',   Icon: CheckCircle },
};

function getStatusCfg(status: string) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_CONFIG[key] || STATUS_CONFIG['processing'];
}

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = (params.id as string) || '';
  const cleanId = rawId.replace('#', '');

  const { data: order, isLoading, isError, refetch } = useOrder(cleanId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-12 h-12 text-red-400" />
        <p className="text-[#334155] font-semibold">Order not found or could not be loaded.</p>
        <div className="flex gap-3">
          <Link href="/orders" className="px-5 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-xl text-sm font-semibold hover:bg-[#F8FAFC] transition-colors">
            Back to Orders
          </Link>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-semibold hover:bg-[#115E59] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusKey = (order.status || '').toLowerCase().replace(/\s+/g, '_');
  const status = getStatusCfg(statusKey);
  const StatusIcon = status.Icon;

  // Build timeline from backend data
  const timelineEvents: any[] = (order as any).timeline || [];
  // Map backend OrderTimelineEvent to UI steps
  const timelineSteps = timelineEvents.length > 0
    ? timelineEvents.map((t: any) => ({
        label: (t.status || '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        time: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '',
        note: t.note || '',
        done: true,
      }))
    : [{ label: 'Order Placed', time: 'Just now', done: true }];

  const lastDone = timelineSteps.filter((t: any) => t.done).length;

  // Address
  const addr = (order as any).shippingAddress || {};
  const addressStr = typeof addr === 'string'
    ? addr
    : [addr.fullName, addr.address, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean).join(', ');

  // Items
  const items = (order as any).items || [];

  const displayId = (order as any).orderNumber || `#${order.id}`;
  const orderDate = (order as any).createdAt
    ? new Date((order as any).createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const total = Number((order as any).total || 0);
  const subtotal = Number((order as any).subtotal || total);
  const tax = Number((order as any).tax || 0);
  const shipping = Number((order as any).shipping || 0);
  const discount = Number((order as any).discount || 0);
  const paymentMethod = ((order as any).paymentMethod || 'card').toUpperCase();
  const trackingNumber = (order as any).trackingNumber;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/orders" className="p-2 rounded-xl hover:bg-[#F0FDFA] text-[#64748B] hover:text-[#0F766E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#0F172A]">Order {displayId}</h1>
            <p className="text-xs text-[#64748B]">Placed on {orderDate}</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Track Order', icon: Truck, href: `/orders/${cleanId}/track`, primary: true },
            { label: 'Return / Exchange', icon: RotateCcw, href: `/orders/${cleanId}/return`, primary: false },
            { label: 'Write Review', icon: Star, href: `/orders/${cleanId}/review`, primary: false },
            { label: 'Need Help?', icon: PhoneCall, href: '/contact', primary: false },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl border text-center transition-all
                ${action.primary
                  ? 'bg-[#0F766E] border-[#0F766E] text-white hover:bg-[#115E59]'
                  : 'bg-white border-[#E2E8F0] text-[#334155] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
                }`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-semibold leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">Items Ordered</h2>
            <span className="text-xs text-[#64748B]">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {items.length > 0 ? items.map((item: any) => {
              const imgUrl = item.product?.images?.[0] || item.product?.images?.[0]?.url;
              const name = item.product?.name || item.productNameSnapshot || 'Product';
              const variant = item.variantSnapshot || {};
              const price = Number(item.price || 0);
              const qty = item.quantity || 1;
              return (
                <div key={item.id} className="flex gap-4 p-4">
                  {imgUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imgUrl} alt={name} className="w-16 h-20 object-cover rounded-xl border border-[#E2E8F0] flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-20 bg-[#F1F5F9] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#94A3B8]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">FCISeller</p>
                    <p className="text-sm font-semibold text-[#0F172A] leading-snug mt-0.5">{name}</p>
                    <p className="text-xs text-[#64748B] mt-1">
                      {variant.size ? `Size: ${variant.size}` : ''}
                      {variant.color ? ` · Color: ${variant.color}` : ''}
                      {` · Qty: ${qty}`}
                    </p>
                    <p className="text-sm font-bold text-[#0F172A] mt-2">₹{price.toLocaleString('en-IN')}</p>
                  </div>
                  {statusKey === 'delivered' && (
                    <Link href={`/orders/${cleanId}/review`} className="flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline self-start mt-1 flex-shrink-0">
                      <Star className="w-3.5 h-3.5" /> Rate
                    </Link>
                  )}
                </div>
              );
            }) : (
              <div className="p-8 text-center text-[#94A3B8] text-sm">No items found</div>
            )}
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">Order Timeline</h2>
            <Link href={`/orders/${cleanId}/track`} className="text-xs font-semibold text-[#0F766E] flex items-center gap-1 hover:underline">
              Full Tracking <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5">
            <div className="space-y-0">
              {timelineSteps.map((step: any, i: number) => {
                const isLast = i === timelineSteps.length - 1;
                const isCurrent = i === lastDone - 1 && !timelineSteps[i + 1]?.done;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all
                        ${step.done ? 'bg-[#0F766E] shadow-[0_0_0_3px_rgba(15,118,110,0.15)]' :
                          isCurrent ? 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]' :
                          'border-2 border-[#E2E8F0] bg-white'}`}>
                        {step.done && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                        {isCurrent && <Clock className="w-3 h-3 text-white" />}
                      </div>
                      {!isLast && <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-[#0F766E]' : 'bg-[#E2E8F0]'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-semibold ${step.done ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{step.label}</p>
                      <p className="text-xs text-[#64748B]">{step.time}</p>
                      {step.note && <p className="text-xs text-[#94A3B8] mt-0.5">{step.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#F0FDFA] rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-[#0F766E]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Delivery Address</p>
              <p className="text-sm text-[#64748B] leading-relaxed">{addressStr || 'Address not available'}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-bold text-[#0F172A]">Payment Summary</h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
              <CreditCard className="w-4 h-4 text-[#64748B]" />
              <span className="text-sm text-[#64748B]">Paid via</span>
              <span className="text-sm font-semibold text-[#0F172A] ml-auto">{paymentMethod}</span>
            </div>
            {[
              { label: 'Subtotal', value: subtotal },
              { label: 'Discount', value: -discount, green: true },
              { label: 'Shipping', value: shipping === 0 ? 'FREE' : `₹${shipping}`, green: shipping === 0 },
              { label: 'GST (18%)', value: tax },
            ].map(({ label, value, green }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[#64748B]">{label}</span>
                <span className={`font-medium ${green ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
                  {typeof value === 'string' ? value : value < 0 ? `− ₹${Math.abs(value).toLocaleString('en-IN')}` : `₹${value.toLocaleString('en-IN')}`}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold border-t border-[#E2E8F0] pt-3">
              <span className="text-[#0F172A]">Total Paid</span>
              <span className="text-[#0F766E]">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Invoice download */}
        <button className="w-full flex items-center justify-center gap-2 h-11 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-[#64748B] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-all">
          <Download className="w-4 h-4" />
          Download Invoice
        </button>

        {/* Need help */}
        <div className="bg-[#F0FDFA] border border-[#99F6E4] rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#0F766E] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0F766E]">Need help with this order?</p>
            <p className="text-xs text-[#64748B]">Our team is available 24/7</p>
          </div>
          <Link href="/contact" className="text-xs font-semibold text-[#0F766E] border border-[#0F766E] px-3 py-1.5 rounded-lg hover:bg-[#0F766E] hover:text-white transition-colors flex-shrink-0">
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}
