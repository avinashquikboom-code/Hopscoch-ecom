'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuthStore, useCartStore, useThemeStore } from '@/store';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  if (pathname === '/checkout') {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { cart } = useCartStore();
  const { theme, setTheme } = useThemeStore();

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Top Banner Ticker */}
      <div className="w-full bg-primary py-2 px-4 text-center">
        <p className="text-[10px] sm:text-xs font-semibold tracking-widest text-primary-foreground uppercase">
          Free shipping on orders over $50
        </p>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-[0.2em] text-primary uppercase">
                AURA
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                href="/products?category=Fashion" 
                className="text-sm font-medium tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase"
              >
                Fashion
              </Link>
              <Link 
                href="/products?category=Electronics" 
                className="text-sm font-medium tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase"
              >
                Electronics
              </Link>
              <Link 
                href="/products?category=Home & Kitchen" 
                className="text-sm font-medium tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase"
              >
                Home
              </Link>
              <Link 
                href="/products?category=Beauty & Personal Care" 
                className="text-sm font-medium tracking-wider text-foreground/80 hover:text-primary transition-colors uppercase"
              >
                Beauty
              </Link>
            </nav>

            {/* Search Bar - Pill Design */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs xl:max-w-sm mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 h-9 rounded-full bg-muted/50 border-transparent focus:border-border/60 focus:bg-card text-sm transition-all placeholder:text-muted-foreground/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 rounded-full hover:bg-muted"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted relative">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full border border-background">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Profile */}
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                  {isAuthenticated && user ? (
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-full hover:bg-muted"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Mobile Side Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-8 mt-12">
                    <div className="space-y-4">
                      <span className="text-xl font-serif font-semibold tracking-wider text-primary uppercase block pb-2 border-b border-border">
                        AURA
                      </span>
                      <nav className="flex flex-col gap-4">
                        <Link 
                          href="/products?category=Fashion" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-base font-medium text-foreground/80 hover:text-primary transition-colors uppercase"
                        >
                          Fashion
                        </Link>
                        <Link 
                          href="/products?category=Electronics" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-base font-medium text-foreground/80 hover:text-primary transition-colors uppercase"
                        >
                          Electronics
                        </Link>
                        <Link 
                          href="/products?category=Home & Kitchen" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-base font-medium text-foreground/80 hover:text-primary transition-colors uppercase"
                        >
                          Home
                        </Link>
                        <Link 
                          href="/products?category=Beauty & Personal Care" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-base font-medium text-foreground/80 hover:text-primary transition-colors uppercase"
                        >
                          Beauty
                        </Link>
                      </nav>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Account</h3>
                      {isAuthenticated ? (
                        <div className="flex flex-col gap-3">
                          <Link 
                            href="/profile" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                          >
                            Profile
                          </Link>
                          <Link 
                            href="/orders" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                          >
                            Orders
                          </Link>
                          <Link 
                            href="/wishlist" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                          >
                            Wishlist
                          </Link>
                        </div>
                      ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            Login
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

