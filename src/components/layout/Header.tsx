'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, ChevronDown, MapPin, Compass, Plane, ShoppingBasket, Coins, Globe, DollarSign, History, Sparkles, X, Sun, Moon, Camera, Grid, Package, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MobileSearchOverlay } from '@/components/common/MobileSearchOverlay';
import { VisualSearchModal } from '@/components/common/VisualSearchModal';
import { LocationModal } from '@/components/common/LocationModal';
import { useAuthStore, useCartStore, useThemeStore, useLocationStore, useWishlistStore } from '@/store';
import { useAddresses } from '@/hooks/use-addresses';
import { useWishlist } from '@/hooks/use-wishlist';
import { resolveAvatarUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

import { searchKeywordService, SearchKeywordItem } from '@/services/search-keyword.service';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  // Dynamic Search Keywords from API
  const [popularKeywords, setPopularKeywords] = useState<SearchKeywordItem[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<SearchKeywordItem[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  // Language & Currency states
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [mounted, setMounted] = useState(false);

  const { user, isAuthenticated, openLoginModal, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { theme, setTheme } = useThemeStore();
  const { pincode, city, formattedLocation, isAutoDetected, setLocation, detectLocation } = useLocationStore();
  const { data: addresses = [] } = useAddresses();
  useWishlist();
  const wishlist = useWishlistStore((s) => s.wishlist);
  const wishlistItemsCount = wishlist?.items?.length || 0;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setMounted(true);
    // Auto detect location for guest if never set
    if (!isAutoDetected && pincode === '411001') {
      detectLocation();
    }
  }, []);

  // Sync location from user default address when signed in
  useEffect(() => {
    if (isAuthenticated && Array.isArray(addresses) && addresses.length > 0) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      const pin = defaultAddr.pincode || defaultAddr.zipCode;
      const c = defaultAddr.city;
      const s = defaultAddr.state;
      if (pin && c) {
        setLocation({
          pincode: pin,
          city: c,
          state: s,
          formattedLocation: `${c}, ${pin}`,
        });
      }
    }
  }, [isAuthenticated, addresses]);

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

  // Fetch popular & trending keywords from API when search box is focused
  useEffect(() => {
    if (searchFocused && popularKeywords.length === 0 && trendingKeywords.length === 0) {
      setKeywordsLoading(true);
      Promise.all([
        searchKeywordService.getPopularKeywords(),
        searchKeywordService.getTrendingKeywords(),
      ])
        .then(([popular, trending]) => {
          setPopularKeywords(popular);
          setTrendingKeywords(trending);
        })
        .catch(() => {})
        .finally(() => {
          setKeywordsLoading(false);
        });
    }
  }, [searchFocused]);

  // Early return AFTER all hooks
  if (pathname === '/checkout') {
    return null;
  }

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearchSubmit = (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (trimmed) {
      // Track search analytics API
      searchKeywordService.trackSearchKeyword(trimmed);

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
    <div className="w-full flex flex-col font-sans bg-white/75 dark:bg-gray-950/75 backdrop-blur-xl border-b border-gray-200/40 dark:border-gray-800/40 shadow-xs sticky top-0 z-50 transition-all duration-300">
      
      {/* 1. TOP UTILITY BAR (Clean, thin bar for location and preferences) */}
      <div className="w-full bg-[#f5f5f6] dark:bg-gray-900 py-1.5 px-4 sm:px-6 md:px-12 border-b border-gray-200 dark:border-gray-800 hidden md:block">
        <div className="container mx-auto flex items-center justify-between gap-4">
          
          {/* Left Side: Delivery address pin */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 cursor-pointer group"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Deliver to: <span className="text-gray-800 dark:text-gray-200 font-extrabold">{city ? `${city} (${pincode})` : pincode}</span></span>
            <span className="text-[#0d9488] group-hover:underline ml-1">Change &gt;</span>
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
                <option value="AR">العربية</option>
                <option value="MS">Bahasa Melayu</option>
                <option value="NL">Nederlands</option>
                <option value="FR">Français</option>
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
                <option value="AED">AED (UAE/Dubai)</option>
                <option value="BHD">BHD (Bahrain)</option>
                <option value="MYR">MYR - RM (Malaysia)</option>
                <option value="MUR">MUR ₨ (Mauritius)</option>
                <option value="FJD">FJD FJ$ (Fiji)</option>
                <option value="GYD">GYD G$ (Guyana)</option>
                <option value="SRD">SRD Sr$ (Suriname)</option>
                <option value="TTD">TTD TT$ (Trinidad &amp; Tobago)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {/* Supercoin balance */}
            <div className="flex items-center gap-1.5 bg-[#fef8e6] px-2.5 py-0.5 rounded-full text-gray-700 border border-amber-105">
              <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>0 Supercoins</span>
            </div>

          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER BAR (Responsive 56-64px height, vertically centered logo, equal icon spacing) */}
      <div className="w-full bg-white dark:bg-gray-950 h-14 sm:h-16 px-4 md:px-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-nowrap">
        <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8 h-full">
          
          {/* Left Side: Hamburger Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Hamburger menu */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden p-0 flex items-center justify-center cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 text-gray-800 dark:text-gray-200" />
            </Button>

            {/* FCISeller Logo */}
            <Link href="/" className="flex items-center gap-2 select-none shrink-0">
              <img src="/logo.png" alt="FCI Seller Logo" className="h-8 max-h-[34px] w-auto object-contain shrink-0" />
              <span className="font-black text-xs sm:text-sm tracking-wider text-[#282c3f] dark:text-white uppercase leading-none">FCI SELLER</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-extrabold tracking-wider text-[#282c3f] dark:text-gray-200 shrink-0 uppercase">
            <Link href="/products?category=Men" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Men</Link>
            <Link href="/products?category=Women" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Women</Link>
            <Link href="/products?category=Kids" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Kids</Link>
            <Link href="/accessories" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Accessories</Link>
            <Link href="/watches" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5">Watches</Link>
            <Link href="/studio" className="hover:text-[#0d9488] transition-colors border-b-4 border-transparent hover:border-[#0d9488] py-5 -my-5 flex items-center gap-0.5">
              <span>Studio</span>
              <sup className="text-[9px] font-black text-rose-500 tracking-normal ml-0.5 animate-pulse">NEW</sup>
            </Link>
          </nav>

          {/* Search Input Box (Desktop / Tablet) */}
          <div ref={searchRef} className="flex-1 max-w-lg relative hidden md:block">
            <form onSubmit={handleSearchForm} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for products, brands and more"
                className="w-full pl-10 pr-10 py-2.5 h-10 rounded-md bg-[#f5f5f6] dark:bg-gray-800 border border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-gray-200 focus:ring-0 text-gray-800 dark:text-gray-100 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-500 font-normal outline-none transition-all"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => { setSearchFocused(false); setIsVisualSearchOpen(true); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors cursor-pointer border-none bg-transparent"
                title="Search by image (AI)"
                aria-label="Search by image"
              >
                <Camera className="h-4 w-4" />
              </button>
            </form>

            {/* LIVE SEARCH DROPDOWN OVERLAY */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-4 px-5 z-50 text-xs animate-in fade-in duration-150">
                {/* Skeleton Loading State */}
                {keywordsLoading && (
                  <div className="space-y-3 py-1">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="flex flex-wrap gap-2">
                      <div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
                      <div className="h-7 w-28 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
                      <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
                    </div>
                  </div>
                )}

                {/* Auto Suggestions as user types */}
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

                {/* Recent Searches */}
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

                {/* Dynamic Popular Searches (Hidden if empty array) */}
                {!keywordsLoading && popularKeywords.length > 0 && !searchQuery && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Popular Searches</span>
                    <div className="flex flex-wrap gap-2">
                      {popularKeywords.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSearchSubmit(item.keyword)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-teal-50 dark:bg-gray-800 dark:hover:bg-teal-900/30 border border-gray-150 hover:border-[#0d9488] text-gray-800 dark:text-gray-200 hover:text-[#0d9488] rounded-full font-semibold transition-all cursor-pointer text-xs"
                        >
                          {item.keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic Trending Searches (Hidden if empty array) */}
                {!keywordsLoading && trendingKeywords.length > 0 && !searchQuery && (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span>Trending Searches</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {trendingKeywords.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSearchSubmit(item.keyword)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-teal-50 dark:bg-gray-800 dark:hover:bg-teal-900/30 border border-gray-150 hover:border-[#0d9488] text-gray-800 dark:text-gray-200 hover:text-[#0d9488] rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                          <span>{item.keyword}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Right Side Actions: Profile, Wishlist, Bag, Theme, Mobile Search */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-gray-800 dark:text-gray-200 shrink-0">
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="md:hidden flex items-center justify-center p-1 text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Search products"
            >
              <Search className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200" />
            </button>

            {/* Profile Dropdown (Hide username on mobile, show avatar only) */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group flex flex-col items-center cursor-pointer"
            >
              {mounted && isAuthenticated && user ? (
                <Link href="/profile" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none">
                  {(() => {
                    const avatarUrl = resolveAvatarUrl((user as any).avatar ?? (user as any).avatarUrl);
                    return avatarUrl ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-[#0d9488]/40">
                        <img src={avatarUrl} alt={user.firstName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0d9488]/60 flex items-center justify-center text-white text-[10px] font-bold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                    );
                  })()}
                  {/* Hide username on mobile to prevent overlapping */}
                  <span className="hidden md:block text-[10px] font-bold tracking-tight truncate max-w-[80px]">{displayName}</span>
                </Link>
              ) : (
                <Link href="/login" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none">
                  <User className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  <span className="hidden md:block text-[10px] font-bold tracking-tight">Profile</span>
                </Link>
              )}
            </motion.div>

            {/* Wishlist */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/wishlist" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors relative gap-0.5 select-none">
                <div className="relative">
                  <Heart className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  {mounted && wishlistItemsCount > 0 && (
                    <Badge className="absolute -top-1.5 -right-2 h-4 min-w-4 flex items-center justify-center p-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full border border-white shadow-sm">
                      {wishlistItemsCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden md:block text-[10px] font-bold tracking-tight">Wishlist</span>
              </Link>
            </motion.div>

            {/* Bag/Cart */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/cart" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors relative gap-0.5 select-none">
                <div className="relative">
                  <ShoppingBag className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                  {mounted && cartItemsCount > 0 && (
                    <Badge className="absolute -top-1.5 -right-2 h-4 min-w-4 flex items-center justify-center p-0.5 bg-[#0d9488] text-white text-[8px] font-black rounded-full border border-white shadow-sm">
                      {cartItemsCount}
                    </Badge>
                  )}
                </div>
                <span className="hidden md:block text-[10px] font-bold tracking-tight">Bag</span>
              </Link>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#0d9488] transition-colors gap-0.5 select-none cursor-pointer bg-transparent border-none p-0"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-amber-500 fill-amber-400" />
              ) : (
                <Moon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200" />
              )}
              <span className="hidden md:block text-[10px] font-bold tracking-tight">Theme</span>
            </motion.button>

          </div>

        </div>
      </div>

      {/* Visual Search Modal */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onResultsReady={(_results, queryStr) => {
          setIsVisualSearchOpen(false);
          router.push(`/products?visualSearch=1&q=${encodeURIComponent(queryStr)}`);
        }}
      />

      {/* 3. REDESIGNED LUXURY MOBILE SIDEBAR */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-[315px] sm:w-[340px] p-0 overflow-y-auto bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/10 shadow-2xl">
          
          {/* Header Card: Luxury Teal Gradient User / Brand Banner */}
          <div className="bg-gradient-to-br from-[#0F766E] via-[#0d9488] to-[#0a5c55] p-5 pt-6 pb-6 text-white relative overflow-hidden shadow-md">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-30%] right-[-20%] w-36 h-36 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-40%] left-[-20%] w-32 h-32 bg-emerald-400/15 rounded-full blur-xl pointer-events-none" />

            {/* Top Bar: Brand Identifier + Close Button */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-teal-100/90">
                  FCI SELLER
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* User Profile Card */}
            <div
              className="flex items-center gap-3.5 cursor-pointer relative z-10 group"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (!isAuthenticated) openLoginModal();
                else router.push('/profile');
              }}
            >
              {/* User avatar or initials */}
              {(() => {
                const avatarUrl = resolveAvatarUrl((user as any)?.avatar ?? (user as any)?.avatarUrl);
                return avatarUrl ? (
                  <div className="w-13 h-13 rounded-full overflow-hidden ring-2 ring-white/60 shadow-lg border border-white/30 shrink-0 group-hover:scale-105 transition-transform">
                    <img src={avatarUrl} alt={user?.firstName || 'User'} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-13 h-13 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white text-lg font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                    {isAuthenticated && user ? user.firstName?.[0] : <User className="w-6 h-6" />}
                  </div>
                );
              })()}

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white truncate max-w-[160px]">
                    {isAuthenticated && user ? `${user.firstName} ${user.lastName || ''}` : 'Welcome to FCI Seller'}
                  </span>
                </div>
                <span className="text-[11px] text-teal-100/90 font-medium truncate mt-0.5">
                  {isAuthenticated ? user?.email || 'Logged in user' : 'Tap to sign in or register →'}
                </span>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-200 mt-1 group-hover:text-white transition-colors">
                    View Profile →
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {/* Quick Category Pills */}
            <div>
              <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest block mb-2.5">
                Popular Departments
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Women', href: '/products?category=Women', icon: '👗' },
                  { label: 'Men', href: '/products?category=Men', icon: '👔' },
                  { label: 'Kids', href: '/products?category=Kids', icon: '🧸' },
                  { label: 'Accessories', href: '/accessories', icon: '🕶️' },
                  { label: 'Watches', href: '/watches', icon: '⌚' },
                  { label: 'Footwear', href: '/products?category=Footwear', icon: '👟' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 bg-slate-100/90 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-500/15 border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 rounded-xl p-2.5 transition-all text-xs font-bold text-slate-800 dark:text-gray-200"
                  >
                    <span className="text-base select-none">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Navigation Menu */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest block mb-2.5">
                Explore &amp; Shop
              </span>
              <nav className="space-y-1">
                {[
                  { label: 'Home', href: '/', icon: Compass },
                  { label: 'Shop All Products', href: '/products', icon: ShoppingBag },
                  { label: 'All Categories', href: '/categories', icon: Grid },
                  { label: 'Studio & Runway Drops', href: '/studio', icon: Sparkles, badge: 'NEW' },
                  { label: 'Curated Collections', href: '/products?category=Collections', icon: ShoppingBasket },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-teal-600 dark:text-teal-500" />
                        <span>{link.label}</span>
                      </div>
                      {link.badge ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black tracking-wider animate-pulse">
                          {link.badge}
                        </span>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Account Access */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest block mb-2.5">
                My Account
              </span>
              <nav className="space-y-1">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistItemsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {wishlistItemsCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600" />
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-teal-600 dark:text-teal-500" />
                    <span>Shopping Bag</span>
                  </div>
                  {cartItemsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-teal-600 dark:bg-teal-500 text-white text-[10px] font-bold">
                      {cartItemsCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600" />
                  )}
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span>Track Orders</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600" />
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 font-semibold text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>Profile &amp; Addresses</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-gray-600" />
                </Link>
              </nav>
            </div>

            {/* Regional Preferences & Theme */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest block mb-2.5">
                Preferences
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl p-2.5 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">Language</span>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white cursor-pointer p-0 text-xs"
                  >
                    <option value="EN" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">English</option>
                    <option value="HI" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">हिन्दी</option>
                    <option value="AR" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">العربية</option>
                    <option value="MS" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">Bahasa Melayu</option>
                    <option value="NL" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">Nederlands</option>
                    <option value="FR" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">Français</option>
                  </select>
                </div>

                <div className="bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl p-2.5 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 dark:text-gray-400">Currency</span>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="bg-transparent border-none outline-none font-bold text-slate-800 dark:text-white cursor-pointer p-0 text-xs"
                  >
                    <option value="INR" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">INR (₹)</option>
                    <option value="USD" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">USD ($)</option>
                    <option value="AED" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">AED (Dubai)</option>
                    <option value="BHD" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">BHD (Bahrain)</option>
                    <option value="MYR" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">MYR (Malaysia)</option>
                    <option value="GBP" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">GBP (£)</option>
                    <option value="EUR" className="bg-white dark:bg-gray-900 text-slate-900 dark:text-white">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Mobile Theme Mode Switcher */}
              <div className="mt-2 bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-teal-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span>Theme</span>
                </div>
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-0.5 border border-slate-200 dark:border-gray-700 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-[#0d9488] text-white shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#0d9488] text-white shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md transition-colors cursor-pointer ${
                      theme === 'system'
                        ? 'bg-[#0d9488] text-white shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Logout button */}
            {isAuthenticated && (
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 pb-2">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 rounded-xl font-bold text-xs text-rose-500 dark:text-rose-400 uppercase tracking-wider cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

    </div>
  );
}
