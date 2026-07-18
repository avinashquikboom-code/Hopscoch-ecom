'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ShoppingCart,
  RotateCcw,
  DollarSign,
  CreditCard,
  Truck,
  BarChart3,
  Bell,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    children: [
      { title: 'All Orders', href: '/admin/orders', icon: Package },
      { title: 'Pending', href: '/admin/orders/pending', icon: Package },
      { title: 'Confirmed', href: '/admin/orders/confirmed', icon: Package },
      { title: 'Processing', href: '/admin/orders/processing', icon: Package },
      { title: 'Packed', href: '/admin/orders/packed', icon: Package },
      { title: 'Shipped', href: '/admin/orders/shipped', icon: Package },
      { title: 'Delivered', href: '/admin/orders/delivered', icon: Package },
      { title: 'Cancelled', href: '/admin/orders/cancelled', icon: Package },
    ],
  },
  {
    title: 'Returns',
    href: '/admin/returns',
    icon: RotateCcw,
    children: [
      { title: 'All Returns', href: '/admin/returns', icon: Package },
      { title: 'Pending Review', href: '/admin/returns/pending-review', icon: Package },
      { title: 'Approved', href: '/admin/returns/approved', icon: Package },
      { title: 'Rejected', href: '/admin/returns/rejected', icon: Package },
      { title: 'Completed', href: '/admin/returns/completed', icon: Package },
    ],
  },
  {
    title: 'Refunds',
    href: '/admin/refunds',
    icon: DollarSign,
    children: [
      { title: 'All Refunds', href: '/admin/refunds', icon: Package },
      { title: 'Pending', href: '/admin/refunds/pending', icon: Package },
      { title: 'Approved', href: '/admin/refunds/approved', icon: Package },
      { title: 'Processing', href: '/admin/refunds/processing', icon: Package },
      { title: 'Completed', href: '/admin/refunds/completed', icon: Package },
    ],
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    children: [
      { title: 'Transactions', href: '/admin/payments', icon: Package },
      { title: 'Gateway', href: '/admin/payments/gateway', icon: Package },
      { title: 'Analytics', href: '/admin/payments/analytics', icon: Package },
    ],
  },
  {
    title: 'Shipping',
    href: '/admin/shipping',
    icon: Truck,
    children: [
      { title: 'Shipments', href: '/admin/shipping', icon: Package },
      { title: 'Tracking', href: '/admin/shipping/tracking', icon: Package },
      { title: 'Courier Partners', href: '/admin/shipping/couriers', icon: Package },
    ],
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={cn(
      'flex flex-col bg-card border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-primary tracking-wider">
              FCI SELLER
            </span>
            <span className="text-xs font-medium text-muted-foreground">ADMIN</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.title);
            const active = isActive(item.href);

            return (
              <div key={item.title}>
                <button
                  onClick={() => hasChildren && toggleExpanded(item.title)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', !collapsed && 'h-5 w-5')} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {hasChildren && (
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 transition-transform',
                            isExpanded && 'rotate-90'
                          )}
                        />
                      )}
                    </>
                  )}
                </button>

                {!collapsed && hasChildren && isExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                            childActive
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <ChildIcon className="h-4 w-4" />
                          <span>{child.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span>← Back to Store</span>
          </Link>
        )}
      </div>
    </div>
  );
}
