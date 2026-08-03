'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, CreditCard, Star, RefreshCw, PhoneCall,
  ChevronRight, Download, MessageSquare, RotateCcw, ShieldCheck, Loader2,
  Copy, Check, FileText, AlertTriangle, Upload, X
} from 'lucide-react';
import { useOrder, useCancelOrder, useReturnOrder } from '@/hooks/use-orders';
import { orderService } from '@/services';
import { toast } from '@/components/ui/toast';
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
  refund_processing: { label: 'Refund Processing', color: 'text-purple-700 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-950/40',  border: 'border-purple-200 dark:border-purple-800',  Icon: RefreshCw },
  refund_completed:  { label: 'Refund Completed',  color: 'text-emerald-700 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-950/40',   border: 'border-emerald-200 dark:border-emerald-800',   Icon: CheckCircle },
};

function getStatusCfg(status: string) {
  const key = (status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_CONFIG[key] || STATUS_CONFIG['processing'];
}

const ORDER_STEPS = [
  { id: 'placed', label: 'Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'packed', label: 'Packed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params.id as string) || '';
  const cleanId = rawId.replace('#', '');

  const { data: order, isLoading, isError, refetch } = useOrder(cleanId);
  const cancelOrderMutation = useCancelOrder();
  const returnOrderMutation = useReturnOrder();

  const [copiedTracking, setCopiedTracking] = useState(false);
  
  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');

  // Return Modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size too small / wrong fit');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[80vh] bg-slate-50/80 dark:bg-slate-950 flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="w-12 h-12 text-rose-500" />
        <p className="text-slate-800 dark:text-slate-200 font-semibold">Order details not found</p>
        <div className="flex gap-3">
          <Link href="/orders" className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors">
            Back to Orders
          </Link>
          <button
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statusKey = (order.status || '').toLowerCase().replace(/\s+/g, '_');
  const statusCfg = getStatusCfg(statusKey);
  const StatusIcon = statusCfg.Icon;

  const displayId = (order as any).orderNumber || `#${order.id}`;
  const orderDate = (order as any).createdAt
    ? new Date((order as any).createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

  const currentStepIndex = (order as any).step ?? 1;

  // Shipping Address
  const addr = (order as any).shippingAddress || {};
  const addressStr = typeof addr === 'string'
    ? addr
    : [addr.fullName, addr.streetAddress || addr.address, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean).join(', ');

  const items = (order as any).items || [];
  const total = Number((order as any).total || 0);
  const subtotal = Number((order as any).subtotal || total);
  const tax = Number((order as any).taxAmount || (order as any).tax || 0);
  const shipping = Number((order as any).shippingFee || (order as any).shipping || 0);
  const discount = Number((order as any).discountAmount || (order as any).discount || 0);
  const paymentMethod = ((order as any).paymentMethod || 'COD').toUpperCase();
  const trackingNumber = (order as any).trackingNumber;

  const canCancel = ['pending', 'payment_pending', 'confirmed', 'processing'].includes(statusKey);
  const canReturn = statusKey === 'delivered';

  const copyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedTracking(true);
      toast.success('Tracking number copied to clipboard!');
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleConfirmCancel = () => {
    cancelOrderMutation.mutate({ id: cleanId, reason: cancelReason }, {
      onSuccess: () => setCancelModalOpen(false),
    });
  };

  const handleConfirmReturn = () => {
    returnOrderMutation.mutate({ id: cleanId, reason: returnReason }, {
      onSuccess: () => setReturnModalOpen(false),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 pb-16">
      
      {/* Header Sticky Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/orders" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-mono text-slate-900 dark:text-white">{displayId}</h1>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusCfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Placed on {orderDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors"
              >
                Cancel Order
              </button>
            )}
            {canReturn && (
              <button
                onClick={() => setReturnModalOpen(true)}
                className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                Request Return
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* ── TRACKING STEPPER CARD ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Delivery Tracker</h2>
              <p className="text-xs text-slate-500">Live order status and fulfillment progress</p>
            </div>
            {trackingNumber && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Truck className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">AWB: {trackingNumber}</span>
                <button onClick={copyTracking} className="p-1 text-slate-400 hover:text-teal-600">
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative">
            {ORDER_STEPS.map((step, idx) => {
              const isPassed = idx + 1 <= currentStepIndex;
              const isCurrent = idx + 1 === currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-semibold ${isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ORDER ITEMS LIST ────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Items in Order</h2>
            <span className="text-xs font-semibold text-slate-500">{items.length} product(s)</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item: any) => {
              const rawImg = item.product?.images?.[0] || item.product?.imageUrl || item.imageUrl || item.image || item.variantSnapshot?.imageUrl || item.variantSnapshot?.image;
              const imgUrl = resolveImageUrl(rawImg);
              const name = item.product?.name || 'Product Item';
              const unitPrice = Number(item.unitPrice || item.price || 0);
              const totalPrice = Number(item.totalPrice || unitPrice * (item.quantity || 1));
              const qty = item.quantity || 1;

              return (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {imgUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imgUrl}
                        alt={name}
                        className="w-16 h-20 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex-shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h3>
                      <p className="text-xs text-slate-500">
                        Quantity: <span className="font-semibold text-slate-700 dark:text-slate-300">{qty}</span> • Unit Price: ₹{unitPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-auto">
                    <p className="text-base font-bold text-slate-900 dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ADDRESS & PAYMENT BREAKDOWN GRID ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-teal-600 pb-2 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delivery Address</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {addressStr || 'Address details registered with order'}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-teal-600">
                <CreditCard className="w-4 h-4" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Payment Summary</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                {paymentMethod}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold">- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>GST / Tax</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Paid</span>
                <span className="text-teal-600 dark:text-teal-400">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── DOWNLOAD TAX INVOICE BUTTON ─────────────────────────────────── */}
        <button
          onClick={() => orderService.downloadInvoice(cleanId)}
          className="w-full flex items-center justify-center gap-2 h-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-all shadow-xs"
        >
          <Download className="w-4 h-4 text-teal-600" />
          Download / Print Tax Invoice
        </button>

      </div>

      {/* ── CANCEL ORDER MODAL ───────────────────────────────────────────── */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button onClick={() => setCancelModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cancel Order {displayId}?</h3>
            </div>

            <p className="text-xs text-slate-500">Are you sure you want to cancel this order? This action cannot be undone.</p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                <option value="Need to change shipping address">Need to change shipping address</option>
                <option value="Delivery date is too late">Delivery date is too late</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelOrderMutation.isPending}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                {cancelOrderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RETURN ORDER MODAL ───────────────────────────────────────────── */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button onClick={() => setReturnModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-amber-600">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Return for {displayId}</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                >
                  <option value="Size too small / wrong fit">Size too small / wrong fit</option>
                  <option value="Item defective or damaged">Item defective or damaged</option>
                  <option value="Received wrong product">Received wrong product</option>
                  <option value="Product not as described">Product not as described</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setReturnModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReturn}
                disabled={returnOrderMutation.isPending}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
              >
                {returnOrderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
