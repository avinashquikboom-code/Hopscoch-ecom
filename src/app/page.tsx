'use client';
import { useProducts, useCategories } from '@/hooks/use-products';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Sparkles, ChevronLeft, ChevronRight, Star, Tag, ShoppingBag, Eye, Mail, ShieldCheck, Undo, HelpCircle } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Mock Slides for Main Carousel
const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'GRAND END OF SEASON SALE',
    subtitle: 'Min. 50% Off on Winter Wear & Trench Coats',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
    link: '/products?category=Women',
  },
  {
    id: 2,
    title: 'EXCLUSIVE MEN\'S COUTURE',
    subtitle: 'Flat 40% Off on Tailored Overcoats & Linen Shirts',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&auto=format&fit=crop&q=80',
    link: '/products?category=Men',
  },
  {
    id: 3,
    title: 'KIDS SEAMLESS COMFORT',
    subtitle: 'Under ₹499 Deals on Kidswear & Accessories',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1600&auto=format&fit=crop&q=80',
    link: '/products?category=Kids',
  }
];

const INSTAGRAM_POSTS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
];

import { API_BASE } from '@/constants';

export default function Home() {
  const { data: categoriesData } = useCategories();
  const mockCategories = categoriesData || [];
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];

  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [isBannersLoading, setIsBannersLoading] = useState(true);

  // Fetch active banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/banners`);
        if (res.ok) {
          const json = await res.json();
          const raw = json.data ?? json ?? [];
          setBanners(Array.isArray(raw) ? raw.filter((b: any) => b.isActive) : []);
        }
      } catch (e) {
        console.error('Error fetching banners:', e);
      } finally {
        setIsBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);
  
  // Live Countdown Timer state (Initialized to 8 hours, 32 minutes, 15 seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 19,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Carousel slide change loop
  useEffect(() => {
    if (banners.length <= 1) return;
    const slideLoop = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(slideLoop);
  }, [banners.length]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  // Filter mock products for distinct home screen sections
  const flashSaleProducts = mockProducts.slice(0, 4);
  const dealsProducts = mockProducts.slice(4, 10);
  const newArrivalsProducts = mockProducts.slice(1, 7);
  const trendingProducts = mockProducts.slice(5, 11);
  const bestSellers = mockProducts.slice(2, 8);
  const topRated = mockProducts.slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 text-foreground font-sans">
      
      {/* 1. Category Bar (Modern Editorial Layout) */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 py-5 px-4 sm:px-6 md:px-12 shadow-xs shrink-0 transition-colors duration-300">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide py-1">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center text-center shrink-0 group select-none cursor-pointer"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 relative bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                  <Image
                    src={category.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-305"></div>
                </div>
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 mt-2.5 group-hover:text-[#0d9488] transition-colors leading-none tracking-widest uppercase">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Large Carousel Banner (Cinematic Auto-Playing with dynamic fetching and mobile responsiveness) */}
      {isBannersLoading ? (
        <div className="w-full h-[56.25vw] sm:h-[420px] bg-neutral-900 animate-pulse flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-neutral-700 animate-spin" />
        </div>
      ) : banners.length > 0 ? (
        <section className="relative w-full h-[56.25vw] sm:h-[420px] overflow-hidden bg-gray-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full flex items-center bg-gray-950"
            >
              {/* Ken Burns Zoom Effect */}
              <div className="absolute inset-0 overflow-hidden bg-gray-950">
                <motion.div
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={banners[activeSlide].imageUrl}
                    alt={banners[activeSlide].title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center brightness-[0.55] select-none"
                  />
                </motion.div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
              
              {/* Staggered Text Animations */}
              <div className="absolute left-6 sm:left-16 max-w-xs sm:max-w-lg text-white z-10 flex flex-col gap-1.5 sm:gap-2.5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-[#0d9488] text-white hover:bg-[#0d9488] font-black uppercase text-[8px] sm:text-[9px] tracking-widest w-fit rounded-sm px-1.5 sm:px-2.5 py-0.5 border-none shadow-xs">
                    {banners[activeSlide].type ? `${banners[activeSlide].type} Collection` : 'EXCLUSIVE COLLECTION'}
                  </Badge>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg sm:text-4xl font-serif font-black tracking-wide leading-tight mt-0.5 sm:mt-1"
                >
                  {banners[activeSlide].title}
                </motion.h2>
                
                {banners[activeSlide].description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-[10px] sm:text-base text-gray-200 font-light mt-0.5"
                  >
                    {banners[activeSlide].description}
                  </motion.p>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-1.5 sm:mt-4"
                >
                  <Link href={banners[activeSlide].link || '/products'}>
                    <Button className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-8 sm:h-10 px-5 sm:px-8 rounded-sm shadow-md border-none text-[10px] sm:text-xs tracking-wider uppercase active:scale-95 transition-all cursor-pointer">
                      Shop Now
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-all cursor-pointer border-none ${
                    activeSlide === i ? 'bg-[#0d9488] w-4 sm:w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Arrows (Hidden on mobile for cleaner touch UI) */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setActiveSlide(prev => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-xs text-white hidden sm:flex items-center justify-center cursor-pointer border-none z-20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveSlide(prev => (prev + 1) % banners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-xs text-white hidden sm:flex items-center justify-center cursor-pointer border-none z-20 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </section>
      ) : null}

      {/* 3. Flash Sale Section (Meesho inspired with countdown timer) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex flex-col sm:flex-row justify-between items-baseline sm:items-center border-b border-gray-150 pb-4 mb-5 gap-3.5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <h2 className="text-lg font-black uppercase text-gray-900 dark:text-gray-100 tracking-wider">Flash Sale</h2>
              
              {/* Flash Countdown */}
              <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-black font-mono">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Ends in {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}</span>
              </div>
            </div>
            <Link href="/products?sort=popular" className="text-xs font-black text-[#0d9488] hover:underline flex items-center gap-0.5">
              <span>EXPLORE ALL FLASH DEALS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Today's Deals (Slider) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4">
        <div className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 flex-wrap gap-4">
            <h2 className="text-lg font-black uppercase text-gray-900 dark:text-gray-100 tracking-wider">Today's Hot Deals</h2>
            <Link href="/products">
              <Button className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-8.5 px-6 rounded-sm text-xs tracking-wider uppercase border-none cursor-pointer">
                View All
              </Button>
            </Link>
          </div>
          <div className="p-4 flex items-stretch gap-4 overflow-x-auto scrollbar-hide py-5">
            {dealsProducts.map((product) => (
              <div key={product.id} className="min-w-[170px] sm:min-w-[210px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured / Season Collections (Grid of promotional cards) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => router.push('/products?category=Women')}
          className="bg-white dark:bg-gray-900 p-3.5 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 cursor-pointer group"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 rounded-sm">
            <Image 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80" 
              alt="Couture collection" 
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover object-top group-hover:scale-102 transition-all duration-300"
            />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-3 text-center uppercase tracking-wider">Premium Winter Wear</h3>
          <p className="text-xs text-[#0d9488] text-center font-bold mt-0.5">Min. 40% OFF</p>
        </div>

        <div 
          onClick={() => router.push('/products?category=Men')}
          className="bg-white dark:bg-gray-900 p-3.5 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 cursor-pointer group"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 rounded-sm">
            <Image 
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80" 
              alt="Men couture" 
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover object-top group-hover:scale-102 transition-all duration-300"
            />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-3 text-center uppercase tracking-wider">Luxe Formal Suits</h3>
          <p className="text-xs text-[#0d9488] text-center font-bold mt-0.5">Up to ₹1,500 Off</p>
        </div>

        <div 
          onClick={() => router.push('/products?category=Accessories')}
          className="bg-white dark:bg-gray-900 p-3.5 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 cursor-pointer group"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 rounded-sm">
            <Image 
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80" 
              alt="Designer handbags" 
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-102 transition-all duration-300"
            />
          </div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-3 text-center uppercase tracking-wider">Leather Accessories</h3>
          <p className="text-xs text-[#0d9488] text-center font-bold mt-0.5">Flat 30% OFF</p>
        </div>
      </section>

      {/* 6. New Arrivals (Grid Layout) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex justify-between items-baseline border-b border-gray-150 pb-4 mb-5">
            <h2 className="text-lg font-black uppercase text-gray-900 dark:text-gray-100 tracking-wider">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-xs font-black text-[#0d9488] hover:underline flex items-center gap-0.5">
              <span>VIEW ALL NEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {newArrivalsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trending & Best Sellers (Side-by-side Tabs or stacked Grids) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Trending Section */}
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex justify-between items-baseline border-b border-gray-150 pb-3 mb-4">
            <h2 className="text-base font-black uppercase text-gray-900 tracking-wider">Trending Right Now</h2>
            <Link href="/products?sort=popular" className="text-xs font-bold text-[#0d9488] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex justify-between items-baseline border-b border-gray-150 pb-3 mb-4">
            <h2 className="text-base font-black uppercase text-gray-900 tracking-wider">Best Sellers</h2>
            <Link href="/products?sort=popular" className="text-xs font-bold text-[#0d9488] hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </section>

      {/* 8. Top Rated / Popular Products (Grid) */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden p-5">
          <div className="flex justify-between items-baseline border-b border-gray-150 pb-4 mb-5">
            <h2 className="text-lg font-black uppercase text-gray-900 dark:text-gray-100 tracking-wider">Top Rated Products</h2>
            <Link href="/products?sort=rating" className="text-xs font-black text-[#0d9488] hover:underline flex items-center gap-0.5">
              <span>EXPLORE TOP RATED</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Instagram Social Feed Section */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4">
        <div className="bg-white dark:bg-gray-900 rounded-sm shadow-xs border border-gray-200 dark:border-gray-700 p-5">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-teal-50 text-[#0d9488] mb-2">
              <Instagram className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black uppercase text-gray-900 dark:text-gray-100 tracking-wider">Shop The Look</h2>
            <p className="text-xs text-gray-400 mt-1">Tag us on Instagram <span className="font-bold text-gray-700">#AuraCoutureStyle</span> to get featured</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
            {INSTAGRAM_POSTS.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-sm overflow-hidden bg-gray-50 group shadow-xs">
                <Image
                  src={url}
                  alt={`Instagram look ${i + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Premium Newsletter Block */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 mt-4 pb-16">
        <div className="bg-[#f0f9f8] rounded-sm border border-teal-150 p-8 sm:p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-gray-800 tracking-wide">SUBSCRIBE TO OUR NEWSLETTER</h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Join the FCISeller circle to receive updates on new seasonal drops, private previews, and exclusive offers.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 mt-6">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#0d9488]"
                />
                <Button 
                  type="submit"
                  className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-10 px-6 rounded-sm text-xs cursor-pointer border-none"
                >
                  SUBSCRIBE
                </Button>
              </form>
            ) : (
              <div className="mt-6 p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-sm text-xs font-bold animate-fade-in">
                Thank you! You have been successfully subscribed to our newsletter.
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
