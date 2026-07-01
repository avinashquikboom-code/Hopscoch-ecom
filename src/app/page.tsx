'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import { ArrowRight, Sparkles, Mail, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useAddToCart, useAddToWishlist } from '@/hooks';
import { useWishlistStore } from '@/store';

export default function Home() {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const wishlistStore = useWishlistStore();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter mock products for the Flash Sale cards
  const flashSaleProducts = mockProducts.slice(0, 4);

  // Live Countdown Timer state (Initialized to 2 hours, 45 minutes, 51 seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 51,
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

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative h-[85vh] w-full overflow-hidden">
        {/* Background Image with Zoom on Mount */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80"
            alt="Luxury Arches Background"
            fill
            priority
            className={`object-cover object-center transition-transform duration-[2000ms] ease-out brightness-[0.8] dark:brightness-[0.6] ${isVisible ? 'scale-105' : 'scale-100'}`}
          />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center bg-black/10 dark:bg-black/30">
          <div className="container mx-auto px-6 sm:px-12">
            <div className="max-w-2xl text-white">
              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Sparkles className="h-3 w-3 text-white" />
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                  NEW COLLECTION 2026
                </span>
              </div>
              <h1 className={`text-5xl sm:text-7xl font-serif font-bold mb-6 leading-[1.15] tracking-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Elevate Your Daily Narrative.
              </h1>
              <p className={`text-base sm:text-lg mb-8 text-neutral-100/90 leading-relaxed font-light transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Discover a curated selection of essentials that blend architectural precision with contemporary ease. Experience the new standard of premium living.
              </p>
              <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 rounded-md shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 active:scale-95">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/lookbook">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/40 text-white font-semibold px-8 py-6 rounded-md backdrop-blur-sm transition-all hover:-translate-y-0.5 active:scale-95">
                    View Lookbook
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES SECTION */}
      <section className="py-20 px-6 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-wide relative inline-block pb-3">
              Curated Categories
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-primary"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-6 justify-center">
            {mockCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-border/60 shadow-md group-hover:shadow-xl transition-all duration-500 mb-4 bg-muted active:scale-95">
                  <Image
                    src={category.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'}
                    alt={category.name}
                    fill
                    sizes="128px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                </div>
                <h3 className="font-sans font-medium text-sm text-foreground/90 group-hover:text-primary transition-colors tracking-wide">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLASH SALE SECTION */}
      <section className="py-20 px-6 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto">
          {/* Header Row with Countdown */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-serif font-semibold text-primary tracking-wide mb-2">
                Flash Sale
              </h2>
              <p className="text-sm text-muted-foreground">
                Limited time offer. Once they're gone, they're gone.
              </p>
            </div>
            
            {/* Live Timer Widget */}
            <div className="flex items-center gap-3 bg-card px-5 py-3 rounded-lg border border-border/40 shadow-sm">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-muted-foreground uppercase mr-2">
                Ending In
              </span>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-primary font-mono bg-muted/60 px-2 py-1 rounded">
                    {formatNumber(timeLeft.hours)}
                  </span>
                  <span className="text-[9px] text-muted-foreground/80 mt-1 uppercase font-semibold">Hrs</span>
                </div>
                <span className="text-primary font-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-primary font-mono bg-muted/60 px-2 py-1 rounded">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                  <span className="text-[9px] text-muted-foreground/80 mt-1 uppercase font-semibold">Min</span>
                </div>
                <span className="text-primary font-bold -mt-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-primary font-mono bg-muted/60 px-2 py-1 rounded">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                  <span className="text-[9px] text-muted-foreground/80 mt-1 uppercase font-semibold">Sec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flashSaleProducts.map((product, index) => {
              const isInWishlist = wishlistStore.isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/45 transition-all duration-300 flex flex-col cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => window.location.href = `/products/${product.id}`}
                  onTouchStart={(e) => e.currentTarget.classList.add('scale-[0.98]')}
                  onTouchEnd={(e) => e.currentTarget.classList.remove('scale-[0.98]')}
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    {product.discount && (
                      <span className="absolute top-3.5 left-3.5 bg-accent text-accent-foreground text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase">
                        Save {product.discount}%
                      </span>
                    )}

                    {/* Quick Action Overlay Buttons */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-md bg-card/95 hover:bg-primary hover:text-primary-foreground border-none transition-all hover:scale-110 active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInWishlist) {
                            // wishlistStore.removeFromWishlist(product.id)
                          } else {
                            addToWishlist.mutate(product.id);
                          }
                          if (navigator.vibrate) navigator.vibrate(30);
                        }}
                      >
                        <Heart className={`h-4.5 w-4.5 ${isInWishlist ? 'fill-accent text-accent' : ''}`} />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-md bg-card/95 hover:bg-primary hover:text-primary-foreground border-none transition-all hover:scale-110 active:scale-90"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/products/${product.id}`;
                        }}
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {product.category}
                      </span>
                      <h3 className="font-sans font-medium text-base text-foreground mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-8 rounded px-3 gap-1.5 transition-all active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart.mutate({ productId: product.id, quantity: 1 });
                          if (navigator.vibrate) navigator.vibrate(50);
                        }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRENDING NOW SECTION */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground tracking-wide mb-2">
                Trending Now
              </h2>
              <p className="text-sm text-muted-foreground">
                The pieces everyone is talking about this season.
              </p>
            </div>
            <Link 
              href="/products" 
              className="text-xs font-semibold tracking-widest text-primary hover:text-primary/80 transition-colors uppercase flex items-center gap-1.5"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Asymmetric Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Big Card */}
            <div className="lg:col-span-8 group relative rounded-xl overflow-hidden shadow-md min-h-[500px] flex flex-col justify-end bg-muted cursor-pointer"
                 onClick={() => window.location.href = '/products?collection=silk-edit'}>
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80"
                alt="The Silk Edit Models"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.85] dark:brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              
              <div className="relative z-10 p-8 sm:p-12 text-white max-w-lg">
                <span className="inline-block bg-primary text-primary-foreground text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase mb-4">
                  Just In
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                  The Silk Edit
                </h3>
                <Button className="bg-white hover:bg-neutral-100 text-black font-semibold rounded-full px-6 py-2 shadow-md">
                  Shop The Look
                </Button>
              </div>
            </div>

            {/* Right Stacked Column */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Stacked Card 1 */}
              <div className="flex-1 group relative rounded-xl overflow-hidden shadow-md min-h-[236px] flex flex-col justify-end bg-muted cursor-pointer"
                   onClick={() => window.location.href = '/products?collection=basics'}>
                <Image
                  src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&auto=format&fit=crop&q=80"
                  alt="Essential Basics Flatlay"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.8] dark:brightness-[0.65]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                
                <div className="relative z-10 p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">
                    Essential Basics
                  </h3>
                  <p className="text-xs text-neutral-200/90 font-light mb-3">
                    The modern essentials
                  </p>
                  <span className="text-xs font-semibold tracking-widest hover:underline uppercase inline-flex items-center gap-1">
                    Shop Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Stacked Card 2 */}
              <div className="flex-1 group relative rounded-xl overflow-hidden shadow-md min-h-[236px] flex flex-col justify-end bg-muted cursor-pointer"
                   onClick={() => window.location.href = '/products?collection=statement-prints'}>
                <Image
                  src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&auto=format&fit=crop&q=80"
                  alt="Statement Prints Model"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.8] dark:brightness-[0.65]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                
                <div className="relative z-10 p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">
                    Statement Prints
                  </h3>
                  <p className="text-xs text-neutral-200/90 font-light mb-3">
                    New Arrivals
                  </p>
                  <span className="text-xs font-semibold tracking-widest hover:underline uppercase inline-flex items-center gap-1">
                    Discover <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION */}
      <section className="py-24 px-6 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle Background SVG Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTIwIDIwYzAgMiAtNCAyIC00cy0yIC0yIC0yIC0yYzAgMCAtMiAtMiAtMiAtNHMyIC0yIDIgLTJyMiAyIDIgMmMyIDAgMiAyIDIgNHMtMiAyIC0yIDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 z-0"></div>
        
        <div className="container mx-auto max-w-3xl text-center relative z-10 flex flex-col items-center gap-6">
          <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
            Stay in the Circle
          </h2>
          <p className="text-sm sm:text-base text-neutral-100/90 leading-relaxed font-light max-w-xl">
            Join our newsletter to receive early access to new collections, exclusive event invitations, and style inspiration.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3 h-12 rounded bg-white text-gray-900 border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 text-sm placeholder:text-gray-500"
              required
            />
            <Button className="bg-black hover:bg-neutral-900 text-white font-semibold h-12 px-6 rounded uppercase tracking-wider text-xs transition-colors border border-black">
              Subscribe
            </Button>
          </form>
          
          <span className="text-[10px] text-neutral-200/60 uppercase tracking-widest mt-2">
            By subscribing, you agree to our privacy policy.
          </span>
        </div>
      </section>

    </div>
  );
}
