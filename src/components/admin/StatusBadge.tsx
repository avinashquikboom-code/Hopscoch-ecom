import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { color: string; bg: string; label: string }> = {
      // Order Status
      pending: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Pending' },
      confirmed: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Confirmed' },
      processing: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Processing' },
      packed: { color: 'text-indigo-700', bg: 'bg-indigo-100', label: 'Packed' },
      shipped: { color: 'text-cyan-700', bg: 'bg-cyan-100', label: 'Shipped' },
      out_for_delivery: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Out For Delivery' },
      delivered: { color: 'text-green-700', bg: 'bg-green-100', label: 'Delivered' },
      cancelled: { color: 'text-red-700', bg: 'bg-red-100', label: 'Cancelled' },
      completed: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Completed' },
      
      // Payment Status
      authorized: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Authorized' },
      captured: { color: 'text-green-700', bg: 'bg-green-100', label: 'Captured' },
      successful: { color: 'text-green-700', bg: 'bg-green-100', label: 'Successful' },
      failed: { color: 'text-red-700', bg: 'bg-red-100', label: 'Failed' },
      refund_initiated: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Refund Initiated' },
      refund_completed: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Refund Completed' },
      
      // Return Status
      pending_review: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Pending Review' },
      approved: { color: 'text-green-700', bg: 'bg-green-100', label: 'Approved' },
      rejected: { color: 'text-red-700', bg: 'bg-red-100', label: 'Rejected' },
      pickup_scheduled: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Pickup Scheduled' },
      picked_up: { color: 'text-indigo-700', bg: 'bg-indigo-100', label: 'Picked Up' },
      received: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Received' },
      quality_inspection: { color: 'text-orange-700', bg: 'bg-orange-100', label: 'Quality Inspection' },
      refund_approved: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Refund Approved' },
      
      // Shipment Status
      ready_to_ship: { color: 'text-blue-700', bg: 'bg-blue-100', label: 'Ready To Ship' },
      shipment_picked_up: { color: 'text-indigo-700', bg: 'bg-indigo-100', label: 'Picked Up' },
      reached_hub: { color: 'text-purple-700', bg: 'bg-purple-100', label: 'Reached Hub' },
      transit: { color: 'text-cyan-700', bg: 'bg-cyan-100', label: 'In Transit' },
    };

    return (
      statusMap[status] || {
        color: 'text-gray-700',
        bg: 'bg-gray-100',
        label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        config.color,
        config.bg,
        className
      )}
    >
      {config.label}
    </span>
  );
}
