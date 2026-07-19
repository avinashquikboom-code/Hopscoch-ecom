'use client';
import { useProducts, useCategories } from '@/hooks/use-products';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Tag, 
  ShoppingBag, 
  Eye, 
  Mail, 
  ShieldCheck, 
  Undo, 
  HelpCircle,
  Heart,
  Flame,
  TrendingUp,
  Award,
  Compass
} from 'lucide-react';
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

const INSTAGRAM_POSTS = [
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', likes: '1.2k', comments: '45' },
  { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', likes: '982', comments: '32' },
  { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', likes: '2.4k', comments: '118' },
  { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80', likes: '1.7k', comments: '84' },
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', likes: '3.1k', comments: '156' },
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80', likes: '1.5k', comments: '61' },
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
  
  // Live Countdown Timer state
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-foreground font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Cinematic Ambient Background System */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,_rgba(13,148,136,0.12)_0%,_transparent_65%)] blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-[35%] right-[-15%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,_rgba(124,58,237,0.08)_0%,_transparent_65%)] blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,_rgba(244,63,94,0.06)_0%,_transparent_65%)] blur-[80px] pointer-events-none rounded-full" />

      {/* 1. Category Bar (Modern Floating Glass Track) */}
      <section className="mx-4 sm:mx-6 md:mx-12 my-6 rounded-2xl backdrop-blur-md bg-white/45 dark:bg-gray-950/40 border border-white/40 dark:border-white/5 py-4 px-6 shadow-md transition-all duration-300 relative z-10">
        <div className="container mx-auto max-w-[1550px]">
          <div className="flex items-center justify-between gap-8 overflow-x-auto scrollbar-hide py-1">
            {mockCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center text-center shrink-0 group select-none cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-250/20 dark:border-neutral-800/20 shadow-md relative bg-neutral-100/30 dark:bg-neutral-900/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#0d9488]/40 dark:group-hover:border-[#0d9488]/50"
                >
                  <Image
                    src={category.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top filter group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </motion.div>
                <span className="text-[10px] sm:text-[11px] font-black text-neutral-600 dark:text-neutral-400 mt-2.5 group-hover:text-[#0d9488] transition-colors leading-none tracking-widest uppercase font-mono">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Large Carousel Banner (Cinematic Floating 3D Rounded Panel) */}
      {isBannersLoading ? (
        <div className="mx-4 sm:mx-6 md:mx-12 h-[56.25vw] sm:h-[450px] rounded-3xl bg-neutral-950/20 dark:bg-neutral-900/20 animate-pulse flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-neutral-500 animate-spin" />
        </div>
      ) : banners.length > 0 ? (
        <section className="relative mx-4 sm:mx-6 md:mx-12 h-[60vw] sm:h-[450px] rounded-3xl overflow-hidden bg-gray-950 shadow-xl border border-white/10 dark:border-white/5 z-10 group [perspective:1000px] [transform-style:preserve-3d] transition-all duration-550">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.75, ease: 'easeInOut' }}
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
                    className="object-cover object-center brightness-[0.45] select-none"
                  />
                </motion.div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/35 to-transparent" />
              
              {/* Text overlay content */}
              <div className="absolute left-8 sm:left-20 max-w-xs sm:max-w-2xl text-white z-10 flex flex-col gap-2 sm:gap-3.5">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Badge className="bg-[#0d9488] text-white font-extrabold uppercase text-[9px] tracking-widest rounded-full px-3.5 py-1 shadow-md backdrop-blur-md border border-white/10 hover:bg-[#0d9488]">
                    {banners[activeSlide].type ? `${banners[activeSlide].type} Collection` : 'EXCLUSIVE COLLECTION'}
                  </Badge>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl sm:text-5xl font-sans font-black tracking-tight leading-[1.1] mt-0.5 bg-gradient-to-b from-white to-gray-255 bg-clip-text text-transparent"
                >
                  {banners[activeSlide].title}
                </motion.h2>
                
                {banners[activeSlide].description && (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-[11px] sm:text-base text-gray-300 font-light mt-0.5 leading-relaxed max-w-lg"
                  >
                    {banners[activeSlide].description}
                  </motion.p>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-3 sm:mt-5"
                >
                  <Link href={banners[activeSlide].link || '/products'}>
                    <motion.button 
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white hover:bg-neutral-100 text-black font-extrabold h-10 sm:h-12 px-8 sm:px-10 rounded-full shadow-lg text-[10px] sm:text-xs tracking-wider uppercase transition-all cursor-pointer border-none flex items-center gap-2"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
 
          {/* Carousel Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${
                    activeSlide === i ? 'bg-[#0d9488] w-6' : 'bg-white/35 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
 
          {/* Slide navigation controls */}
          {banners.length > 1 && (
            <>
              <button
                onClick={() => setActiveSlide(prev => (prev - 1 + banners.length) % banners.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/30 hover:bg-[#0d9488] backdrop-blur-md text-white hidden sm:flex items-center justify-center cursor-pointer border border-white/10 z-20 transition-all duration-300 shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveSlide(prev => (prev + 1) % banners.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/30 hover:bg-[#0d9488] backdrop-blur-md text-white hidden sm:flex items-center justify-center cursor-pointer border border-white/10 z-20 transition-all duration-300 shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </section>
      ) : null}
 
      {/* 3. Flash Sale Section (Glowing glass design with premium countdown) */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 relative z-10">
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-baseline sm:items-center border-b border-gray-100 dark:border-gray-900 pb-5 mb-6 gap-4">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase text-gray-900 dark:text-gray-150 tracking-wider flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>Flash Deals</span>
              </h2>
              
              {/* Premium dark-mode digital timer */}
              <div className="flex items-center gap-2 bg-gray-950 dark:bg-gray-900 text-[#0d9488] px-4 py-2 rounded-xl text-xs font-black font-mono shadow-inner border border-neutral-800/40">
                <Clock className="w-4 h-4 text-[#0d9488]" />
                <span className="tracking-wider">ENDS IN</span>
                <span className="bg-neutral-850 px-1.5 py-0.5 rounded text-white">{formatNumber(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-neutral-850 px-1.5 py-0.5 rounded text-white">{formatNumber(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-neutral-850 px-1.5 py-0.5 rounded text-[#0d9488] animate-pulse">{formatNumber(timeLeft.seconds)}</span>
              </div>
            </div>
            <Link href="/products?sort=popular" className="text-xs font-extrabold text-[#0d9488] hover:underline flex items-center gap-1.5 group font-mono tracking-wider">
              <span>EXPLORE ALL FLASH DEALS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Today's Deals (Slider) */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-8 relative z-10">
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden">
          <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-gray-900 flex-wrap gap-4">
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#0d9488]" />
              <span>Today's Hot Deals</span>
            </h2>
            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-[#0d9488] hover:bg-[#0c857a] text-white font-bold h-9 px-6 rounded-full text-xs tracking-wider uppercase border-none cursor-pointer shadow-md"
              >
                View All
              </motion.button>
            </Link>
          </div>
          <div className="p-4 sm:p-6 flex items-stretch gap-6 overflow-x-auto scrollbar-hide py-8">
            {dealsProducts.map((product) => (
              <div key={product.id} className="min-w-[170px] sm:min-w-[210px] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Asymmetric Editorial Grid / Curator's Picks */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 relative z-10">
        <div className="text-center mb-8">
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono tracking-widest text-[9px] uppercase px-3 py-1 rounded-full border border-purple-500/20 mb-2">
            Curator's Drops
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-900 dark:text-white tracking-wider">Shop By Vibe</h2>
          <div className="h-0.5 w-10 bg-[#0d9488] mx-auto mt-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -6 }}
            onClick={() => router.push('/products?category=Women')}
            className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg p-5 rounded-3xl shadow-md border border-white/55 dark:border-white/5 cursor-pointer group transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-50 dark:bg-neutral-900 rounded-2xl shadow-inner">
              <Image 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80" 
                alt="Winter Couture" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 mt-5 text-center uppercase tracking-widest font-mono">Minimalist Outerwear</h3>
              <p className="text-xs text-[#0d9488] text-center font-extrabold mt-1.5 tracking-wider">UP TO 50% OFF</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6 }}
            onClick={() => router.push('/products?category=Men')}
            className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg p-5 rounded-3xl shadow-md border border-white/55 dark:border-white/5 cursor-pointer group transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-50 dark:bg-neutral-900 rounded-2xl shadow-inner">
              <Image 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80" 
                alt="Men couture" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 mt-5 text-center uppercase tracking-widest font-mono">Avant-Garde Suiting</h3>
              <p className="text-xs text-[#0d9488] text-center font-extrabold mt-1.5 tracking-wider">EXCLUSIVE PRICING</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -6 }}
            onClick={() => router.push('/products?category=Accessories')}
            className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg p-5 rounded-3xl shadow-md border border-white/55 dark:border-white/5 cursor-pointer group transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-50 dark:bg-neutral-900 rounded-2xl shadow-inner">
              <Image 
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80" 
                alt="Designer handbags" 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 mt-5 text-center uppercase tracking-widest font-mono">Crafted Accessories</h3>
              <p className="text-xs text-[#0d9488] text-center font-extrabold mt-1.5 tracking-wider">FLAT 30% OFF</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. New Arrivals (Grid Layout) */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 relative z-10">
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-gray-900 pb-5 mb-6">
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0d9488]" />
              <span>New Arrivals</span>
            </h2>
            <Link href="/products?sort=newest" className="text-xs font-black text-[#0d9488] hover:underline flex items-center gap-1.5 group font-mono tracking-wider">
              <span>VIEW ALL NEW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
            {newArrivalsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trending & Best Sellers (Side-by-side stacked Grids) */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Trending Section */}
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-900 pb-4 mb-5">
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-[#0d9488]" />
              <span>Trending Right Now</span>
            </h2>
            <Link href="/products?sort=popular" className="text-xs font-bold text-[#0d9488] hover:underline font-mono font-bold">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {trendingProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-900 pb-4 mb-5">
            <h2 className="text-sm sm:text-base font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-yellow-500" />
              <span>Best Sellers</span>
            </h2>
            <Link href="/products?sort=popular" className="text-xs font-bold text-[#0d9488] hover:underline font-mono font-bold">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </section>

      {/* 8. Top Rated / Popular Products (Grid) */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 relative z-10">
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-gray-900 pb-5 mb-6">
            <h2 className="text-base sm:text-lg font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-550 fill-amber-550" />
              <span>Top Rated Products</span>
            </h2>
            <Link href="/products?sort=rating" className="text-xs font-black text-[#0d9488] hover:underline flex items-center gap-1.5 group font-mono tracking-wider">
              <span>EXPLORE TOP RATED</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
            {topRated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. Instagram Social Feed Section */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 relative z-10">
        <div className="bg-white/40 dark:bg-gray-950/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 dark:border-white/5 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-teal-500/10 text-[#0d9488] mb-3">
              <Instagram className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold uppercase text-gray-900 dark:text-gray-100 tracking-wider">Shop The Look</h2>
            <p className="text-xs text-gray-400 mt-1.5">Tag us on Instagram <span className="font-bold text-gray-750 dark:text-gray-300">#FCISellerStyle</span> to get featured</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {INSTAGRAM_POSTS.map((post, i) => (
              <motion.div 
                whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? 1 : -1 }}
                key={i} 
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-neutral-900 group shadow-md border border-white/30 dark:border-white/5 cursor-pointer"
              >
                <Image
                  src={post.url}
                  alt={`Instagram look ${i + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Premium Glassmorphic Stats Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 backdrop-blur-xs">
                  <div className="flex items-center gap-1 text-white text-xs font-bold">
                    <Heart className="w-4 h-4 fill-white text-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white text-[10px] opacity-80">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Premium Newsletter Block */}
      <section className="container mx-auto max-w-[1550px] px-4 sm:px-6 md:px-12 mt-10 pb-16 relative z-10">
        <div className="bg-gradient-to-br from-[#f0f9f8] to-[#e6f4f2] dark:from-[#041a18] dark:to-[#020d0c] backdrop-blur-xl rounded-3xl border border-teal-500/20 dark:border-teal-500/10 p-8 sm:p-12 text-center shadow-lg overflow-hidden relative">
          
          {/* Animated Glow Particles */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-[#0d9488]/15 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-[#0d9488]/15 rounded-full blur-2xl animate-pulse" />
          
          <div className="max-w-lg mx-auto relative z-10 flex flex-col items-center">
            <div className="h-10 w-10 bg-[#0d9488]/15 text-[#0d9488] rounded-full flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            
            <h2 className="text-xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight uppercase">SUBSCRIBE TO OUR NEWSLETTER</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3.5 leading-relaxed font-light max-w-md">
              Join the FCISeller circle to receive updates on new seasonal drops, private previews, and exclusive offers.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white dark:bg-black/40 border border-gray-200 dark:border-neutral-850 px-5 py-3 text-xs rounded-full focus:outline-none focus:border-[#0d9488] dark:text-white backdrop-blur-md transition-all shadow-inner text-center sm:text-left"
                />
                <motion.button 
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="bg-[#0d9488] hover:bg-[#0c857a] text-white font-bold h-11 px-8 rounded-full text-xs cursor-pointer border-none shadow-md"
                >
                  SUBSCRIBE
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-4 bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 rounded-full text-xs font-bold w-full"
              >
                Thank you! You have been successfully subscribed to our newsletter.
              </motion.div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
