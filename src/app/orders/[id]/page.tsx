'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, CreditCard, Star, RefreshCw, PhoneCall,
  ChevronRight, Download, MessageSquare, RotateCcw, ShieldCheck
} from 'lucide-react';

// ── Mock order data ────────────────────────────────────────────
const MOCK_ORDERS: Record<string, any> = {
  'AUR-78421': {
    id: '#AUR-78421', date: 'Jun 12, 2026', status: 'delivered',
    total: 2999, shipping: 0, tax: 540, discount: 300,
    paymentMethod: 'Visa •••• 4582',
    address: '42 Sunshine Lane, Koregaon Park, Pune, Maharashtra – 411001',
    items: [
      { id: '1', name: 'Premium Linen Blazer', brand: 'FCISeller', size: 'M', color: 'Sage Green', qty: 1, price: 1799, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80' },
      { id: '2', name: 'Tailored Chinos', brand: 'Aura Studio', size: '32', color: 'Ivory', qty: 1, price: 1200, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&q=80' },
    ],
    timeline: [
      { label: 'Order Placed', time: 'Jun 12 • 10:22 AM', done: true },
      { label: 'Order Confirmed', time: 'Jun 12 • 11:00 AM', done: true },
      { label: 'Packed & Dispatched', time: 'Jun 13 • 9:15 AM', done: true },
      { label: 'In Transit', time: 'Jun 14 • 7:00 AM', done: true },
      { label: 'Out for Delivery', time: 'Jun 16 • 8:30 AM', done: true },
      { label: 'Delivered', time: 'Jun 16 • 2:15 PM', done: true },
    ],
  },
  'AUR-78316': {
    id: '#AUR-78316', date: 'Jun 03, 2026', status: 'shipped',
    total: 1890, shipping: 0, tax: 340, discount: 0,
    paymentMethod: 'UPI — avinash@ybl',
    address: 'Level 5, Tower B, Cybercity, Magarpatta, Pune – 411013',
    items: [
      { id: '3', name: 'Silk Wrap Dress', brand: 'FCISeller', size: 'S', color: 'Dusty Rose', qty: 1, price: 1890, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&q=80' },
    ],
    timeline: [
      { label: 'Order Placed', time: 'Jun 03 • 3:45 PM', done: true },
      { label: 'Order Confirmed', time: 'Jun 03 • 4:00 PM', done: true },
      { label: 'Packed & Dispatched', time: 'Jun 04 • 10:00 AM', done: true },
      { label: 'In Transit', time: 'Jun 05 • 8:00 AM', done: true },
      { label: 'Out for Delivery', time: 'Expected Jun 07', done: false },
      { label: 'Delivered', time: 'Estimated Jun 07', done: false },
    ],
  },
  'AUR-77904': {
    id: '#AUR-77904', date: 'May 25, 2026', status: 'processing',
    total: 4799, shipping: 0, tax: 864, discount: 500,
    paymentMethod: 'Net Banking — HDFC',
    address: '42 Sunshine Lane, Koregaon Park, Pune, Maharashtra – 411001',
    items: [
      { id: '4', name: 'Cashmere Overcoat', brand: 'FCISeller', size: 'L', color: 'Charcoal', qty: 1, price: 3499, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&q=80' },
      { id: '5', name: 'Merino Turtleneck', brand: 'Aura Studio', size: 'M', color: 'Cream', qty: 2, price: 650, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=200&q=80' },
    ],
    timeline: [
      { label: 'Order Placed', time: 'May 25 • 6:30 PM', done: true },
      { label: 'Order Confirmed', time: 'May 25 • 6:45 PM', done: true },
      { label: 'Packed & Dispatched', time: 'Processing...', done: false },
      { label: 'In Transit', time: 'Pending', done: false },
      { label: 'Out for Delivery', time: 'Pending', done: false },
      { label: 'Delivered', time: 'Estimated May 30', done: false },
    ],
  },
};

function getFallbackOrder(id: string) {
  return {
    id: `#${id}`, date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'processing', total: 1499, shipping: 0, tax: 270, discount: 0,
    paymentMethod: 'Card •••• 0000',
    address: 'Your delivery address',
    items: [{ id: '0', name: 'FCISeller Item', brand: 'FCISeller', size: 'M', color: 'Teal', qty: 1, price: 1499, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=80' }],
    timeline: [
      { label: 'Order Placed', time: 'Just now', done: true },
      { label: 'Order Confirmed', time: 'Processing', done: false },
      { label: 'Packed & Dispatched', time: 'Pending', done: false },
      { label: 'In Transit', time: 'Pending', done: false },
      { label: 'Out for Delivery', time: 'Pending', done: false },
      { label: 'Delivered', time: 'Estimated soon', done: false },
    ],
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  delivered:  { label: 'Delivered',  color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', Icon: CheckCircle },
  shipped:    { label: 'Shipped',    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    Icon: Truck },
  processing: { label: 'Processing', color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   Icon: Clock },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     Icon: XCircle },
};

export default function OrderDetailPage() {
  const params = useParams();
  const rawId = (params.id as string) || '';
  // Support both AUR-78421 format and #AUR-78421
  const cleanId = rawId.replace('#', '');
  const order = MOCK_ORDERS[cleanId] || getFallbackOrder(cleanId);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.processing;
  const StatusIcon = status.Icon;
  const lastDone = order.timeline.filter((t: any) => t.done).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/orders" className="p-2 rounded-xl hover:bg-[#F0FDFA] text-[#64748B] hover:text-[#0F766E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#0F172A]">Order {order.id}</h1>
            <p className="text-xs text-[#64748B]">Placed on {order.date}</p>
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
            <span className="text-xs text-[#64748B]">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl border border-[#E2E8F0] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">{item.brand}</p>
                  <p className="text-sm font-semibold text-[#0F172A] leading-snug mt-0.5">{item.name}</p>
                  <p className="text-xs text-[#64748B] mt-1">Size: {item.size} · Color: {item.color} · Qty: {item.qty}</p>
                  <p className="text-sm font-bold text-[#0F172A] mt-2">₹{item.price.toLocaleString()}</p>
                </div>
                {order.status === 'delivered' && (
                  <Link href={`/orders/${cleanId}/review`} className="flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline self-start mt-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5" /> Rate
                  </Link>
                )}
              </div>
            ))}
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
              {order.timeline.map((step: any, i: number) => {
                const isLast = i === order.timeline.length - 1;
                const isCurrent = i === lastDone - 1 && !order.timeline[i + 1]?.done;
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
              <p className="text-sm font-semibold text-[#0F172A]">Avinash Magar</p>
              <p className="text-sm text-[#64748B] leading-relaxed">{order.address}</p>
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
              <span className="text-sm font-semibold text-[#0F172A] ml-auto">{order.paymentMethod}</span>
            </div>
            {[
              { label: 'Subtotal', value: order.total },
              { label: 'Discount', value: -order.discount, green: true },
              { label: 'Shipping', value: order.shipping === 0 ? 'FREE' : `₹${order.shipping}`, green: order.shipping === 0 },
              { label: 'GST (18%)', value: order.tax },
            ].map(({ label, value, green }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[#64748B]">{label}</span>
                <span className={`font-medium ${green ? 'text-emerald-600' : 'text-[#0F172A]'}`}>
                  {typeof value === 'string' ? value : value < 0 ? `− ₹${Math.abs(value)}` : `₹${value}`}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-base font-bold border-t border-[#E2E8F0] pt-3">
              <span className="text-[#0F172A]">Total Paid</span>
              <span className="text-[#0F766E]">₹{order.total.toLocaleString()}</span>
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
