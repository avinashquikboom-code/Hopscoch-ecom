'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Package, CheckCircle, Loader2 } from 'lucide-react';

const RETURN_REASONS = [
  { id: 'size', label: 'Wrong size / fit issue', emoji: '📏' },
  { id: 'damaged', label: 'Product is damaged or defective', emoji: '⚠️' },
  { id: 'not_as_described', label: 'Not as described / wrong product', emoji: '🏷️' },
  { id: 'quality', label: 'Quality not as expected', emoji: '✨' },
  { id: 'changed_mind', label: "Changed my mind", emoji: '💭' },
  { id: 'missing', label: 'Missing items / accessories', emoji: '📦' },
];

const REFUND_METHODS = [
  { id: 'original', label: 'Original Payment Method', sub: 'Refund to your card / UPI (3–5 days)' },
  { id: 'wallet', label: 'FCISeller Wallet', sub: 'Instant credit for next purchase' },
];

const PICKUP_SLOTS = [
  { id: 'tomorrow_am', label: 'Tomorrow', time: '9 AM – 12 PM' },
  { id: 'tomorrow_pm', label: 'Tomorrow', time: '2 PM – 5 PM' },
  { id: 'day2_am',     label: 'Day After', time: '9 AM – 12 PM' },
  { id: 'day2_pm',     label: 'Day After', time: '2 PM – 5 PM' },
];

export default function ReturnPage() {
  const params = useParams();
  const router = useRouter();
  const cleanId = (params.id as string || '').replace('#', '');

  const [step, setStep] = useState<'reason' | 'details' | 'confirm' | 'success'>('reason');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedRefund, setSelectedRefund] = useState('original');
  const [selectedPickup, setSelectedPickup] = useState('tomorrow_am');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-[0_24px_48px_-8px_rgb(0_0_0/0.08)] p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Return Requested!</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Your return for order <span className="font-semibold text-[#0F172A]">#{cleanId}</span> has been initiated. Our pickup agent will arrive at your chosen slot.
          </p>
          <div className="bg-[#F0FDFA] border border-[#99F6E4] rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Return Reference</p>
            <p className="text-base font-bold text-[#0F766E]">RET-{cleanId.slice(-4)}-{Math.floor(1000 + Math.random() * 9000)}</p>
            <p className="text-xs text-[#64748B] mt-1">Refund will be processed within 5–7 business days</p>
          </div>
          <div className="space-y-2">
            <Link href={`/orders/${cleanId}`} className="flex items-center justify-center w-full h-11 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold rounded-xl text-sm transition-colors">
              Back to Order
            </Link>
            <Link href="/orders" className="flex items-center justify-center w-full h-11 border border-[#E2E8F0] text-[#334155] font-semibold rounded-xl text-sm hover:bg-[#F8FAFC] transition-colors">
              All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => step === 'reason' ? router.push(`/orders/${cleanId}`) : setStep(step === 'details' ? 'reason' : 'details')}
            className="p-2 rounded-xl hover:bg-[#F0FDFA] text-[#64748B] hover:text-[#0F766E] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#0F172A]">Return / Exchange</h1>
            <p className="text-xs text-[#64748B]">Order #{cleanId}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {['reason', 'details', 'confirm'].map((s, i) => (
              <div key={s} className={`w-6 h-1.5 rounded-full transition-colors ${
                s === step || (s === 'reason' && step === 'details') || (s !== 'confirm' && step === 'confirm')
                  ? 'bg-[#0F766E]' : 'bg-[#E2E8F0]'
              }`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* STEP 1: Select reason */}
        {step === 'reason' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] mb-1">Why are you returning?</h2>
              <p className="text-sm text-[#64748B]">Select the reason that best describes your issue</p>
            </div>
            <div className="space-y-2">
              {RETURN_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all
                    ${selectedReason === reason.id
                      ? 'border-[#0F766E] bg-[#F0FDFA] ring-2 ring-[#0F766E]/20'
                      : 'border-[#E2E8F0] bg-white hover:border-[#0F766E]/40'}`}
                >
                  <span className="text-xl">{reason.emoji}</span>
                  <span className="text-sm font-semibold text-[#0F172A]">{reason.label}</span>
                  {selectedReason === reason.id && <CheckCircle className="w-4 h-4 text-[#0F766E] ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
            <button
              disabled={!selectedReason}
              onClick={() => setStep('details')}
              className="w-full h-12 bg-[#0F766E] disabled:bg-[#94A3B8] hover:bg-[#115E59] text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Details — refund method + pickup slot */}
        {step === 'details' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] mb-1">Return Details</h2>
              <p className="text-sm text-[#64748B]">Choose your preferred options</p>
            </div>

            {/* Refund method */}
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Refund Method</p>
              <div className="space-y-2">
                {REFUND_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedRefund(method.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all
                      ${selectedRefund === method.id
                        ? 'border-[#0F766E] bg-[#F0FDFA] ring-2 ring-[#0F766E]/20'
                        : 'border-[#E2E8F0] bg-white hover:border-[#0F766E]/40'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedRefund === method.id ? 'border-[#0F766E] bg-[#0F766E]' : 'border-[#E2E8F0]'}`} />
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{method.label}</p>
                      <p className="text-xs text-[#64748B]">{method.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pickup slot */}
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Pickup Slot</p>
              <div className="grid grid-cols-2 gap-2">
                {PICKUP_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedPickup(slot.id)}
                    className={`p-3 rounded-2xl border text-center transition-all
                      ${selectedPickup === slot.id
                        ? 'border-[#0F766E] bg-[#F0FDFA] ring-2 ring-[#0F766E]/20'
                        : 'border-[#E2E8F0] bg-white hover:border-[#0F766E]/40'}`}
                  >
                    <p className="text-sm font-semibold text-[#0F172A]">{slot.label}</p>
                    <p className="text-xs text-[#64748B]">{slot.time}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional info */}
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Additional Details (Optional)</p>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Describe the issue in more detail..."
                rows={3}
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 resize-none transition-all"
              />
            </div>

            <button
              onClick={() => setStep('confirm')}
              className="w-full h-12 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              Review & Confirm <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] mb-1">Confirm Return</h2>
              <p className="text-sm text-[#64748B]">Review your return request before submitting</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#E2E8F0]">
              {[
                { label: 'Return Reason', value: RETURN_REASONS.find(r => r.id === selectedReason)?.label || '' },
                { label: 'Refund Method', value: REFUND_METHODS.find(r => r.id === selectedRefund)?.label || '' },
                { label: 'Pickup Slot', value: `${PICKUP_SLOTS.find(s => s.id === selectedPickup)?.label} · ${PICKUP_SLOTS.find(s => s.id === selectedPickup)?.time}` },
                { label: 'Pickup Address', value: '42 Sunshine Lane, Koregaon Park, Pune – 411001' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 px-5 py-4">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider flex-shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-[#0F172A] text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">⚠️ Before the pickup</p>
              <p className="text-xs leading-relaxed">Please keep the item in its original packaging with all tags intact. Our pickup agent will verify the item before accepting the return.</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-12 bg-[#0F766E] disabled:bg-[#94A3B8] hover:bg-[#115E59] text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Return Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
