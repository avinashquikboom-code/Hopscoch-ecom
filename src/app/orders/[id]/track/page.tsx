'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, Truck, Package, MapPin, Copy, Check, Info } from 'lucide-react';

import { API_BASE } from '@/constants';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function TrackOrderPage() {
  const params = useParams();
  const cleanId = (params.id as string || '').replace('#', '');
  
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<any>({
    carrier: 'Aura Couture Logistics',
    trackingNumber: 'Pending',
    status: 'PROCESSING',
    estimatedDate: 'In 5-7 days',
    steps: [
      { id: 0, label: 'Order Placed', time: 'Just now', detail: 'Order placed successfully', done: true },
      { id: 1, label: 'Order Confirmed', time: 'Processing', detail: 'Confirming your order', done: true },
      { id: 2, label: 'Packed & Dispatched', time: 'Pending', detail: 'Packing your order', done: false },
      { id: 3, label: 'In Transit', time: 'Pending', detail: 'Courier in transit', done: false },
      { id: 4, label: 'Out for Delivery', time: 'Pending', detail: 'Delivery agent will be assigned', done: false },
      { id: 5, label: 'Delivered', time: 'Estimated', detail: 'Estimated delivery', done: false },
    ]
  });

  useEffect(() => {
    async function getTracking() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/web/shipping/track/${cleanId}`, { headers: authHeaders() });
        const json = await res.json();
        
        if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
          // If we got activities from Shiprocket!
          const activities = json.data;
          const steps = activities.map((act: any, idx: number) => ({
            id: idx,
            label: act.activity || 'Status Update',
            time: act.date || act.time || '',
            detail: act.location || 'In Transit',
            done: true
          }));

          setTrackingInfo({
            carrier: 'Shiprocket Partner',
            trackingNumber: activities[0].awb || 'Assigned',
            status: 'IN_TRANSIT',
            estimatedDate: 'Expected Soon',
            steps
          });
        }
      } catch (err) {
        console.error('Failed to load live tracking, using premium simulator fallback');
      } finally {
        setLoading(false);
      }
    }

    if (cleanId) {
      getTracking();
    }
  }, [cleanId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingInfo.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doneSteps = trackingInfo.steps.filter((s: any) => s.done).length;
  const progressPct = Math.round((doneSteps / trackingInfo.steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/profile" className="p-2 rounded-xl hover:bg-[#F0FDFA] text-[#64748B] hover:text-[#0F766E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#0F172A]">Track Order</h1>
            <p className="text-xs text-[#64748B]">#{cleanId}</p>
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
                <p className="text-sm font-bold text-[#0F172A]">{trackingInfo.carrier}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">AWB Number</p>
              <div className="flex items-center gap-1.5 justify-end">
                <p className="text-sm font-bold text-[#0F172A] font-mono">{trackingInfo.trackingNumber}</p>
                {trackingInfo.trackingNumber !== 'Pending' && (
                  <button onClick={handleCopy} className="text-[#64748B] hover:text-[#0F766E] transition-colors cursor-pointer">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-[#64748B]">{doneSteps} of {trackingInfo.steps.length} steps complete</span>
              <span className="text-xs font-bold text-[#0F766E]">{progressPct}%</span>
            </div>
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline steps card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-6">
          <h2 className="text-sm font-bold text-[#0F172A]">Shipment Journey</h2>
          
          <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-6 ml-2.5">
            {trackingInfo.steps.map((step: any, index: number) => {
              const isLast = index === trackingInfo.steps.length - 1;
              return (
                <div key={step.id} className="relative">
                  {/* Step Dot */}
                  <span className={`absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-2 bg-white flex items-center justify-center transition-colors ${
                    step.done ? 'border-[#0D9488] bg-[#0D9488]' : 'border-[#CBD5E1]'
                  }`}>
                    {step.done && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${step.done ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{step.label}</h4>
                      <span className="text-[10px] font-semibold text-[#94A3B8]">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
