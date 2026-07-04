'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, MapPin, ArrowRight, ShoppingBag, Share2, Download, ChevronRight } from 'lucide-react';

// Confetti particle component
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <div
      className="absolute top-0 w-2 h-2 rounded-sm opacity-0 animate-confetti"
      style={{
        left: `${x}%`,
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${1.2 + Math.random() * 0.8}s`,
      }}
    />
  );
}

const CONFETTI_COLORS = ['#0F766E', '#14B8A6', '#F59E0B', '#EC4899', '#6366F1', '#10B981', '#F97316'];

import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `AUR-${Math.floor(80000 + Math.random() * 10000)}`;
  const total = searchParams.get('total') || '0';

  const [confettiPieces] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      delay: Math.random() * 1.5,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }))
  );

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 5);
  const deliveryDate = estimatedDate.toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const steps = [
    { label: 'Order Placed', desc: 'Just now', done: true },
    { label: 'Processing', desc: 'Within 2 hours', done: false },
    { label: 'Packed & Shipped', desc: 'Tomorrow', done: false },
    { label: 'Out for Delivery', desc: `${deliveryDate}`, done: false },
    { label: 'Delivered', desc: `By ${deliveryDate}`, done: false },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {confettiPieces.map((p) => (
          <ConfettiParticle key={p.id} delay={p.delay} x={p.x} color={p.color} />
        ))}
      </div>

      {/* Soft bg blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#14B8A6]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-20 w-full max-w-lg">
        {/* Success Card */}
        <div className="bg-white rounded-[24px] shadow-[0_24px_48px_-8px_rgb(0_0_0/0.10)] overflow-hidden">
          {/* Top gradient band */}
          <div className="h-2 bg-gradient-to-r from-[#0F766E] via-[#14B8A6] to-[#10B981]" />

          <div className="p-8 text-center">
            {/* Success icon */}
            <div className="flex items-center justify-center w-20 h-20 bg-[#F0FDFA] rounded-full mx-auto mb-5 animate-success-pop">
              <CheckCircle className="w-10 h-10 text-[#0F766E]" strokeWidth={1.5} />
            </div>

            <h1 className="text-2xl font-bold text-[#0F172A] mb-1 animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
              Order Confirmed! 🎉
            </h1>
            <p className="text-[#64748B] text-sm mb-5 animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
              Thank you for shopping with Aura Couture
            </p>

            {/* Order details pill */}
            <div className="bg-[#F0FDFA] border border-[#99F6E4] rounded-2xl px-5 py-4 mb-6 animate-slide-up-fade" style={{ animationDelay: '0.5s' }}>
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-0.5">Order ID</p>
                  <p className="text-base font-bold text-[#0F766E]">#{orderId}</p>
                </div>
                <div className="w-px h-10 bg-[#99F6E4]" />
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mb-0.5">Amount Paid</p>
                  <p className="text-base font-bold text-[#0F172A]">₹{Number(total).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-8 text-left animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-800">Estimated Delivery</p>
                <p className="text-sm font-bold text-amber-900">{deliveryDate}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 animate-slide-up-fade" style={{ animationDelay: '0.7s' }}>
              <Link
                href={`/orders/${orderId}`}
                className="flex items-center justify-center gap-2 w-full h-12 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <Package className="w-4 h-4" />
                Track Your Order
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full h-12 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold rounded-xl transition-colors text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order timeline preview */}
          <div className="border-t border-[#E2E8F0] px-8 py-6">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">Order Progress</p>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.done ? 'bg-[#0F766E]' : 'border-2 border-[#E2E8F0] bg-white'}`}>
                    {step.done && <CheckCircle className="w-3 h-3 text-white fill-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${step.done ? 'text-[#0F766E]' : 'text-[#94A3B8]'}`}>{step.label}</p>
                    <p className="text-xs text-[#94A3B8]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share & Invoice row */}
          <div className="border-t border-[#E2E8F0] px-8 py-4 flex gap-3">
            <button className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F766E] transition-colors">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <span className="text-[#E2E8F0]">|</span>
            <button className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F766E] transition-colors">
              <Download className="w-3.5 h-3.5" /> Download Invoice
            </button>
            <span className="text-[#E2E8F0]">|</span>
            <Link href="/orders" className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F766E] transition-colors">
              <MapPin className="w-3.5 h-3.5" /> All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti-fall linear forwards; }
        @keyframes success-pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-success-pop { animation: success-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both; }
        @keyframes slide-up-fade {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-fade { animation: slide-up-fade 0.5s ease-out both; }
      `}</style>
      <Suspense fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="animate-pulse text-sm font-semibold text-[#64748B]">Confirming order details...</div>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </>
  );
}
