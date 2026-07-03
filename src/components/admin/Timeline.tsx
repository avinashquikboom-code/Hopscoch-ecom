'use client';

import { format } from 'date-fns';
import { CheckCircle2, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string;
  status: string;
  date: Date;
  time: string;
  updatedBy?: string;
  remarks?: string;
  location?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, any> = {
      pending: Clock,
      confirmed: CheckCircle2,
      processing: Package,
      packed: Package,
      shipped: Truck,
      out_for_delivery: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle,
      completed: CheckCircle2,
      failed: XCircle,
      rejected: XCircle,
      default: CheckCircle2,
    };

    return iconMap[status] || iconMap.default;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'text-amber-500 bg-amber-50',
      confirmed: 'text-blue-500 bg-blue-50',
      processing: 'text-purple-500 bg-purple-50',
      packed: 'text-indigo-500 bg-indigo-50',
      shipped: 'text-cyan-500 bg-cyan-50',
      out_for_delivery: 'text-orange-500 bg-orange-50',
      delivered: 'text-green-500 bg-green-50',
      completed: 'text-emerald-500 bg-emerald-50',
      cancelled: 'text-red-500 bg-red-50',
      failed: 'text-red-500 bg-red-50',
      rejected: 'text-red-500 bg-red-50',
      approved: 'text-green-500 bg-green-50',
      default: 'text-primary bg-primary/10',
    };

    return colorMap[status] || colorMap.default;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      
      <div className="space-y-6">
        {items.map((item, index) => {
          const Icon = getStatusIcon(item.status);
          const iconColor = getStatusColor(item.status);
          const isLast = index === items.length - 1;

          return (
            <div key={item.id} className="relative pl-10">
              {/* Timeline Dot */}
              <div className={cn(
                'absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center border-2 border-background',
                iconColor
              )}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Timeline Content */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {item.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(item.date, 'MMM dd, yyyy')} at {item.time}
                    </p>
                  </div>
                  {item.updatedBy && (
                    <span className="text-xs text-muted-foreground">
                      by {item.updatedBy}
                    </span>
                  )}
                </div>

                {item.location && (
                  <p className="text-xs text-muted-foreground">
                    📍 {item.location}
                  </p>
                )}

                {item.remarks && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.remarks}
                  </p>
                )}
              </div>

              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-6 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
