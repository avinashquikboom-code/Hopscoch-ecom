'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, Truck, Package, MapPin, Phone, Copy, Check } from 'lucide-react';

const TRACKING_DATA: Record<string, any> = {
  'AUR-78421': {
    orderId: '#AUR-78421',
    status: 'delivered',
    carrier: 'Delhivery Express',
    trackingNumber: 'DL9283741092',
    estimatedDate: 'Jun 16, 2026',
    deliveredDate: 'Jun 16, 2026 at 2:15 PM',
    currentStep: 5,
    steps: [
      { id: 0, label: 'Order Placed',        time: 'Jun 12 · 10:22 AM', detail: 'Your order has been placed successfully',         done: true },
      { id: 1, label: 'Order Confirmed',      time: 'Jun 12 · 11:00 AM', detail: 'Seller confirmed and is preparing your order',    done: true },
      { id: 2, label: 'Packed & Dispatched',  time: 'Jun 13 · 9:15 AM',  detail: 'Package dispatched from Pune Warehouse',         done: true },
      { id: 3, label: 'In Transit',           time: 'Jun 14 · 7:00 AM',  detail: 'Package arrived at Mumbai sorting center',       done: true },
      { id: 4, label: 'Out for Delivery',     time: 'Jun 16 · 8:30 AM',  detail: 'Agent: Ramesh K. · +91 98765 00000',            done: true },
      { id: 5, label: 'Delivered',            time: 'Jun 16 · 2:15 PM',  detail: 'Delivered to Avinash Magar at the front door',   done: true },
    ],
  },
  'AUR-78316': {
    orderId: '#AUR-78316',
    status: 'shipped',
    carrier: 'BlueDart Priority',
    trackingNumber: 'BD4419023874',
    estimatedDate: 'Jun 07, 2026',
    deliveredDate: null,
    currentStep: 3,
    steps: [
      { id: 0, label: 'Order Placed',        time: 'Jun 03 · 3:45 PM',  detail: 'Your order has been placed successfully',         done: true },
      { id: 1, label: 'Order Confirmed',      time: 'Jun 03 · 4:00 PM',  detail: 'Seller confirmed and is preparing your order',    done: true },
      { id: 2, label: 'Packed & Dispatched',  time: 'Jun 04 · 10:00 AM', detail: 'Package dispatched from Bengaluru Warehouse',     done: true },
      { id: 3, label: 'In Transit',           time: 'Jun 05 · 8:00 AM',  detail: 'Package is on its way to your city',             done: true },
      { id: 4, label: 'Out for Delivery',     time: 'Expected Jun 07',   detail: 'Delivery agent will be assigned soon',           done: false },
      { id: 5, label: 'Delivered',            time: 'Estimated Jun 07',  detail: 'Expected by end of day',                        done: false },
    ],
  },
  'AUR-77904': {
    orderId: '#AUR-77904',
    status: 'processing',
    carrier: 'DTDC Express',
    trackingNumber: 'Pending',
    estimatedDate: 'May 30, 2026',
    deliveredDate: null,
    currentStep: 1,
    steps: [
      { id: 0, label: 'Order Placed',        time: 'May 25 · 6:30 PM',  detail: 'Your order has been placed successfully',         done: true },
      { id: 1, label: 'Order Confirmed',      time: 'May 25 · 6:45 PM',  detail: 'Payment confirmed, seller notified',             done: true },
      { id: 2, label: 'Packed & Dispatched',  time: 'Processing...',     detail: 'Seller is preparing your order',                 done: false },
      { id: 3, label: 'In Transit',           time: 'Pending',           detail: 'Tracking will update once dispatched',          done: false },
      { id: 4, label: 'Out for Delivery',     time: 'Pending',           detail: 'Delivery agent will be assigned soon',           done: false },
      { id: 5, label: 'Delivered',            time: 'Estimated May 30',  detail: 'Estimated delivery date',                       done: false },
    ],
  },
};

function getFallbackTracking(id: string) {
  return {
    orderId: `#${id}`, status: 'processing', carrier: 'Aura Couture Logistics',
    trackingNumber: 'AC' + Math.floor(Math.random() * 9000000 + 1000000),
    estimatedDate: 'In 5-7 days', deliveredDate: null, currentStep: 1,
    steps: [
      { id: 0, label: 'Order Placed',       time: 'Just now',    detail: 'Order placed successfully', done: true  },
      { id: 1, label: 'Order Confirmed',    time: 'Processing',  detail: 'Confirming your order',     done: false },
      { id: 2, label: 'Packed & Dispatched',time: 'Pending',     detail: 'Packing your order',        done: false },
      { id: 3, label: 'In Transit',         time: 'Pending',     detail: 'Pending',                   done: false },
      { id: 4, label: 'Out for Delivery',   time: 'Pending',     detail: 'Pending',                   done: false },
      { id: 5, label: 'Delivered',          time: 'Estimated',   detail: 'Estimated delivery',        done: false },
    ],
  };
}

export default function TrackOrderPage() {
  const params = useParams();
  const cleanId = (params.id as string || '').replace('#', '');
  const tracking = TRACKING_DATA[cleanId] || getFallbackTracking(cleanId);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tracking.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doneSteps = tracking.steps.filter((s: any) => s.done).length;
  const progressPct = Math.round((doneSteps / tracking.steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/orders/${cleanId}`} className="p-2 rounded-xl hover:bg-[#F0FDFA] text-[#64748B] hover:text-[#0F766E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#0F172A]">Track Order</h1>
            <p className="text-xs text-[#64748B]">{tracking.orderId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Tracking number card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F0FDFA] rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#0F766E]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Carrier</p>
                <p className="text-sm font-bold text-[#0F172A]">{tracking.carrier}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">AWB Number</p>
              <div className="flex items-center gap-1.5 justify-end">
                <p className="text-sm font-bold text-[#0F172A] font-mono">{tracking.trackingNumber}</p>
                {tracking.trackingNumber !== 'Pending' && (
                  <button onClick={handleCopy} className="text-[#64748B] hover:text-[#0F766E] transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[#64748B]">{doneSteps} of {tracking.steps.length} steps complete</span>
              <span className="text-xs font-bold text-[#0F766E]">{progressPct}%</span>
            </div>
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* ETA */}
          {tracking.status === 'delivered' ? (
            <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Delivered on {tracking.deliveredDate}</span>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">Estimated delivery: {tracking.estimatedDate}</span>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-bold text-[#0F172A]">Shipment Activity</h2>
          </div>
          <div className="p-5">
            {tracking.steps.slice().reverse().map((step: any, i: number) => {
              const originalIdx = tracking.steps.length - 1 - i;
              const isActive = originalIdx === tracking.currentStep;
              const isLast = i === tracking.steps.length - 1;
              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10
                      ${step.done && isActive ? 'bg-[#0F766E] shadow-[0_0_0_4px_rgba(15,118,110,0.2)]' :
                        step.done ? 'bg-[#0F766E]' : 'border-2 border-[#E2E8F0] bg-white'}`}>
                      {step.done && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                    </div>
                    {!isLast && <div className={`w-0.5 h-10 mt-1 ${step.done ? 'bg-[#0F766E]/30' : 'bg-[#E2E8F0]'}`} />}
                  </div>
                  <div className={`pb-8 ${!isLast ? '' : ''}`}>
                    <p className={`text-sm font-semibold ${step.done ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{step.label}</p>
                    <p className="text-xs text-[#0F766E] font-medium mt-0.5">{step.time}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex items-start gap-3">
          <div className="w-8 h-8 bg-[#F0FDFA] rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-[#0F766E]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Delivering To</p>
            <p className="text-sm font-semibold text-[#0F172A]">Avinash Magar</p>
            <p className="text-sm text-[#64748B]">42 Sunshine Lane, Koregaon Park, Pune – 411001</p>
          </div>
        </div>

        {/* Back to order */}
        <Link
          href={`/orders/${cleanId}`}
          className="w-full flex items-center justify-center gap-2 h-11 bg-white border border-[#E2E8F0] rounded-2xl text-sm font-semibold text-[#334155] hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-[#F0FDFA] transition-all"
        >
          <Package className="w-4 h-4" />
          View Order Details
        </Link>
      </div>
    </div>
  );
}
