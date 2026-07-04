'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, Moon, Sun, ChevronDown, MapPin, Compass, Plane, ShoppingBasket, Coins, Globe, DollarSign, History, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MobileSearchOverlay } from '@/components/common/MobileSearchOverlay';
import { useAuthStore, useCartStore, useThemeStore } from '@/store';

const POPULAR_SEARCHES = [
  'Lehenga Choli',
  'Anarkali Suit',
  'Silk Saree',
  'Couture Dress',
  'Designer Kurti',
];

const TRENDING_SEARCHES = [
  'Winter Jackets',
  'Pashmina Shawl',
  'Velvet Suits',
  'Wedding Wear',
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Language & Currency states
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const { user, isAuthenticated, openLoginModal } = useAuthStore();
  const { cart } = useCartStore();
  const { theme, setTheme } = useThemeStore();

  // Load search history from LocalStorage
  useEffect(() => {
    const history = localStorage.getItem('aura_search_history');
    if (history) {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (e) {
        setSearchHistory([]);
      }
    }
  }, []);

  // Handle outside clicks to close search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Early return AFTER all hooks
  if (pathname === '/checkout') {
    return null;
  }

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearchSubmit = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (trimmed) {
      // Save to history
      const updatedHistory = [trimmed, ...searchHistory.filter(h => h !== trimmed)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('aura_search_history', JSON.stringify(updatedHistory));
      
      setSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(searchQuery);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('aura_search_history');
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = searchHistory.filter(h => h !== item);
    setSearchHistory(updated);
    localStorage.setItem('aura_search_history', JSON.stringify(updated));
  };

  const displayName = isAuthenticated && user 
    ? `${user.firstName}` 
    : 'Login';

  // Filtered auto suggestions based on input
  const suggestions = searchQuery.trim()
    ? [
        searchQuery,
        `${searchQuery} in Women`,
        `${searchQuery} in Men`,
        `${searchQuery} in Collections`,
      ]
    : [];

  return (
    <div className="w-full flex flex-col font-sans bg-white dark:bg-gray-950 border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm sticky top-0 z-50">
      
      {/* 1. TOP UTILITY BAR (Clean, thin bar for location and preferences) */}
      <div className="w-full bg-[#f5f5f6] dark:bg-gray-900 py-1.5 px-4 sm:px-6 md:px-12 border-b border-gray-200 dark:border-gray-800 hidden md:block">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: Delivery address pin */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-gray-500 dark:text-gray-500" />
            <span>Deliver to: <span className="text-gray-800 dark:text-gray-200">411036</span></span>
            <span className="text-[#0d9488] hover:underline cursor-pointer ml-1">Select location &gt;</span>
          </div>

          {/* Right Side: Language, Currency, Supercoins & Theme toggle */}
          <div className="flex items-center gap-5 text-[11px] font-bold text-gray-600 dark:text-gray-400">
            
            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none outline-none font-bold text-gray-600 dark:text-gray-300 cursor-pointer focus:ring-0 p-0 text-[11px]"
              >
                <option value="EN">English</option>
                <option value="HI">हिन्दी</option>
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 border-l border-gray-350 pl-4">
              <span className="text-gray-400 font-normal">₹/$</span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent border-none outline-none font-bold text-gray-600 dark:text-gray-300 cursor-pointer focus:ring-0 p-0 text-[11px]"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            {/* Supercoin balance */}
            <div className="flex items-center gap-1.5 bg-[#fef8e6] px-2.5 py-0.5 rounded-full text-gray-700 border border-amber-105">
              <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>0 Supercoins</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-6 w-6 rounded-full hover:bg-gray-200/50"
            >
              <Sun className="h-3 w-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-600" />
              <Moon className="absolute h-3 w-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-600" />
            </Button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR (Myntra-style Logo, Navigation Links, Search Bar & Action Buttons) */}
      <div className="w-full bg-white dark:bg-gray-950 py-3 px-4 sm:px-6 md:px-12 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto flex items-center justify-between gap-4 md:gap-8">
          
          {/* Left Side: Logo & Mobile Hamburger Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Aura Couture Logo */}
            <Link href="/" className="hidden md:flex items-center gap-2.5 select-none shrink-0">
              <svg className="w-9 h-7.5 shrink-0" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="auraPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                  <linearGradient id="auraSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
                <path d="M30 68 L50 20" stroke="url(#auraPrimary)" strokeWidth="12" strokeLinecap="round" />
                <path d="M50 20 L70 68" stroke="url(#auraPrimary)" strokeWidth="12" strokeLinecap="round" />
                <path d="M38 48 L62 48" stroke="url(#auraSecondary)" strokeWidth="10" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-black text-sm tracking-widest text-[#282c3f] uppercase">AURA</span>
                <span className="text-[7px] font-bold tracking-[0.25em] text-gray-500 uppercase mt-0.5">COUTURE</span>
              </div>
            </Link>

            {/* Mobile Hamburger menu & logo */}
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-800 rounded-full hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Link href="/" className="flex items-center gap-1.5 select-none shrink-0">
                <svg className="w-7 h-5.5 shrink-0" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 68 L50 20" stroke="url(#auraPrimary)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M50 20 L70 68" stroke="url(#auraPrimary)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M38 48 L62 48" stroke="url(#auraSecondary)" strokeWidth="10" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col justify-center leading-none">
                  <span className="font-black text-xs tracking-widest text-[#282c3f] uppercase">AURA</span>
                  <span className="text-[6px] font-bold tracking-[0.25em] text-gray-500 uppercase mt-0.5">COUTURE</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-extrabold tracking-wider text-[#282c3f] dark:text-gray-200 shrink-0 uppercase">
            <Link href="/products?category=Men" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Men</Link>
            <Link href="/products?category=Women" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Women</Link>
            <Link href="/products?category=Kids" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Kids</Link>

            <Link href="/products?category=Accessories" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Beauty</Link>
            <Link href="/products?category=Collections" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Genz</Link>
            <Link href="/products?sort=popular" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5 flex items-center gap-0.5">
              <span>Studio</span>
              <sup className="text-[9px] font-black text-rose-500 tracking-normal ml-0.5 animate-pulse">NEW</sup>
            </Link>
          </nav>

          {/* Search Input Box */}
          <div ref={searchRef} className="flex-1 max-w-lg relative hidden md:block">
            <form onSubmit={handleSearchForm} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="search"
                placeholder="Search for products, brands and more"
                className="w-full pl-10 pr-4 py-2.5 h-10 rounded-md bg-[#f5f5f6] dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-200 focus:ring-0 text-gray-800 dark:text-gray-100 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-500 font-normal outline-none transition-all"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* LIVE SEARCH DROPDOWN OVERLAY */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-700 rounded-lg shadow-xl py-4.5 px-5 z-40 text-xs text-gray-700 dark:text-gray-300 animate-in fade-in slide-in-from-top-1 duration-150">
                
                {/* 1. Dynamic Auto suggestions as user types */}
                {suggestions.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Suggestions</span>
                    <div className="space-y-1">
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSearchSubmit(s)}
                          className="flex items-center gap-2 py-2 px-2.5 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 hover:text-[#0d9488] rounded-md cursor-pointer transition-colors font-medium text-gray-800 dark:text-gray-200"
                        >
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Recent Searches (History) */}
                {searchHistory.length > 0 && !searchQuery && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Recent Searches</span>
                      <button 
                        onClick={clearHistory}
                        className="text-[10px] font-bold text-[#0d9488] hover:underline cursor-pointer border-none bg-transparent"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSearchSubmit(item)}
                          className="flex items-center justify-between py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
                            <History className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item}</span>
                          </div>
                          <button
                            onClick={(e) => removeHistoryItem(e, item)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Popular Searches */}
                {!searchQuery && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Popular Searches</span>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSearchSubmit(item)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-teal-50 border border-gray-150 hover:border-[#0d9488] text-gray-800 hover:text-[#0d9488] rounded-full font-semibold transition-all cursor-pointer"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Trending Searches */}
                {!searchQuery && (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Trending Searches</span>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleSearchSubmit(item)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-teal-50 border border-gray-150 hover:border-[#0d9488] text-gray-800 hover:text-[#0d9488] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Right Side Actions: Profile, Wishlist, Bag */}
          <div className="flex items-center gap-5 sm:gap-6 text-gray-800 dark:text-gray-200 shrink-0">
            
            {/* Login Button (only when not authenticated, hidden on mobile) */}
            {!isAuthenticated && (
              <button
                onClick={openLoginModal}
                className="hidden md:inline-flex items-center h-8 px-4 border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E]/5 font-bold text-xs rounded-sm tracking-wider cursor-pointer bg-transparent transition-colors"
              >
                LOGIN
              </button>
            )}

            {/* User Dropdown */}
            <div className="relative group flex flex-col items-center cursor-pointer">
              {isAuthenticated && user ? (
                <Link href="/profile" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none">
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-bold tracking-tight">{displayName}</span>
                </Link>
              ) : (
                <Link href="/login" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none">
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-bold tracking-tight">Profile</span>
                </Link>
              )}
              
              {/* Dropdown items popup */}
              <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-xl rounded-sm py-1.5 text-xs text-gray-700 dark:text-gray-300 hidden group-hover:block z-30">
                <Link href="/orders" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0d9488]">My Orders</Link>
                <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0d9488]">My Wishlist</Link>
                <Link href="/faq" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#0d9488]">Help Center</Link>
              </div>
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-bold tracking-tight">Wishlist</span>
            </Link>

            {/* Bag/Cart */}
            <Link href="/cart" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors relative gap-0.5 select-none">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-2 h-4 min-w-4 flex items-center justify-center p-0.5 bg-[#0d9488] text-white text-[8px] font-black rounded-full border border-white shadow-sm">
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">Bag</span>
            </Link>

            {/* Mobile Actions: Search (Icon only on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-gray-800 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

          </div>

        </div>
      </div>

      {/* 3. MOBILE DRAWER NAVIGATION */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 overflow-y-auto bg-card border-r border-border/30">
          <div 
            className="bg-[#0d9488] p-4 text-white flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (!isAuthenticated) {
                setIsMobileMenuOpen(false);
                openLoginModal();
              }
            }}
          >
            <User className="h-5 w-5" />
            <span className="font-bold text-sm">
              {isAuthenticated && user ? `Hello, ${user.firstName}` : 'Login & Signup'}
            </span>
          </div>

          <div className="py-4 space-y-4">
            <div className="px-4 border-b border-border/40 pb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Categories</span>
              <nav className="flex flex-col gap-3.5 mt-2">
                <Link 
                  href="/products?category=Women" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-foreground/80 hover:text-[#0d9488] transition-colors uppercase"
                >
                  Women
                </Link>
                <Link 
                  href="/products?category=Men" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-foreground/80 hover:text-[#0d9488] transition-colors uppercase"
                >
                  Men
                </Link>
                <Link 
                  href="/products?category=Kids" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-foreground/80 hover:text-[#0d9488] transition-colors uppercase"
                >
                  Kids
                </Link>
                <Link 
                  href="/products?category=Collections" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-foreground/80 hover:text-[#0d9488] transition-colors uppercase"
                >
                  Collections
                </Link>
              </nav>
            </div>

            <div className="px-4 border-b border-border/40 pb-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2.5">Preferences</span>
              <div className="space-y-3 text-xs font-semibold text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Language</span>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-transparent border border-gray-200 rounded px-2 py-1 outline-none font-bold"
                  >
                    <option value="EN">English</option>
                    <option value="HI">हिन्दी</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>Currency</span>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="bg-transparent border border-gray-200 rounded px-2 py-1 outline-none font-bold"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account</span>
              <div className="flex flex-col gap-3.5 mt-2 text-sm font-semibold text-foreground/80">
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>My Wishlist</Link>
                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>My Cart</Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

    </div>
  );
}
