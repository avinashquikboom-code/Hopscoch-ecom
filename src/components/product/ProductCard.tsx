'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useAddToCart, useAddToWishlist } from '@/hooks';
import { useWishlistStore } from '@/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const [cartAdded, setCartAdded] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1800);
    // Haptic feedback simulation
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlistPulse(true);
    setTimeout(() => setWishlistPulse(false), 600);
    if (!isInWishlist) {
      addToWishlist.mutate(product.id);
    }
    // Haptic feedback simulation
    if (navigator.vibrate) navigator.vibrate(isInWishlist ? [30] : [30, 50, 30]);
  };

  const handleNavigate = () => router.push(`/products/${product.id}`);

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        onClick={handleNavigate}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer
          hover:border-primary/40 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-300 flex gap-0
          ${isPressed ? 'scale-[0.98] shadow-inner' : 'scale-100'}
          active:scale-[0.97]`}
      >
        {/* Image */}
        <div className="relative w-52 flex-shrink-0 overflow-hidden">
          {!imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="208px"
              className={`object-cover transition-transform duration-500 ${isPressed ? 'scale-100' : 'group-hover:scale-105'}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-4xl">
              🛍️
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-primary-foreground shadow-sm">
                New
              </span>
            )}
            {discount && discount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accent text-accent-foreground shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{product.brand}</p>
            <h3 className="font-semibold text-foreground text-lg leading-snug mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {stars.map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToWishlist}
                className={`p-2 rounded-xl border transition-all duration-200
                  ${isInWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-red-200 hover:text-red-500'}
                  ${wishlistPulse ? 'scale-125' : 'scale-100'}`}
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                  ${cartAdded
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-95'}
                  disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ShoppingCart className="w-4 h-4" />
                {cartAdded ? 'Added!' : product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode
  return (
    <div
      ref={cardRef}
      onClick={handleNavigate}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer
        hover:border-primary/30 hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.18)] transition-all duration-300 flex flex-col
        ${isPressed ? 'scale-[0.98] shadow-inner' : 'scale-100'}
        active:scale-[0.97]`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
        {!imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ${isPressed ? 'scale-100' : 'group-hover:scale-108'}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-6xl">🛍️</div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase bg-primary text-primary-foreground shadow-lg">
              New
            </span>
          )}
          {product.isTrending && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase bg-amber-500 text-white shadow-lg">
              Trending
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <div className="absolute top-3 right-12 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-accent text-accent-foreground shadow-lg">
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-sm transition-all duration-300
            ${isInWishlist
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30 opacity-0 group-hover:opacity-100'}
            ${wishlistPulse ? 'scale-125' : 'scale-100'}
            active:scale-90`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View - appears on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 rounded-xl
            bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-800 shadow-lg
            opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-300 whitespace-nowrap hover:bg-white
            active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 translate-y-0"
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-black/70 text-white text-xs font-bold rounded-full tracking-widest uppercase backdrop-blur-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">{product.name}</h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {stars.map((s) => (
              <Star
                key={s}
                className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/25'}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">({product.reviewCount})</span>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border/60">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300
              ${cartAdded
                ? 'bg-green-500 text-white scale-95'
                : 'bg-primary text-primary-foreground hover:bg-primary/85 hover:shadow-md hover:shadow-primary/20 hover:scale-[1.03] active:scale-95'}
              disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-90`}
          >
            <ShoppingCart className={`w-3.5 h-3.5 transition-transform ${cartAdded ? 'scale-110' : ''}`} />
            {cartAdded ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
