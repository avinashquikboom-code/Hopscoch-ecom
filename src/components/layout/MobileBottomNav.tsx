'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore, useWishlistStore } from '@/store';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart } = useCartStore();
  const wishlistStore = useWishlistStore();
  
  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistStore.wishlist?.items.length || 0;

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/products', icon: Search, label: 'Search' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', badge: cartItemsCount },
    { href: '/wishlist', icon: Heart, label: 'Wishlist', badge: wishlistCount },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  // Hide on checkout and desktop
  if (pathname === '/checkout') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border/40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative group transition-all duration-200',
                'active:scale-95'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 transition-all duration-300',
                    isActive
                      ? 'text-primary scale-110'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full animate-scale-in">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium mt-1 transition-all duration-300',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full animate-fade-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
