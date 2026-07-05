'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useAddToCart, useAddToWishlist } from '@/hooks';
import { useWishlistStore, useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
const DEFAULT_COLORS = ['#0F766E', '#1e293b', '#94a3b8', '#d1d5db', '#e2e8f0'];

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setWishlistPulse(true);
    setTimeout(() => setWishlistPulse(false), 600);
    addToWishlist.mutate(product.id);
  };

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (product.stock === 0) return;
    
    // Find variant for selected size if it exists
    const variant = product.variants?.find(v => v.value.toLowerCase() === size.toLowerCase());
    
    addToCart.mutate(
      { productId: product.id, quantity: 1, variantId: variant?.id },
      {
        onSuccess: () => {
          toast.success(`Added size ${size} of ${product.name} to Cart`);
        }
      }
    );
  };

  const handleNavigate = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    router.push(`/products/${product.id}`);
  };

  // Grid Mode (Myntra-Inspired Design)
  if (viewMode === 'grid') {
    return (
      <div
        onClick={handleNavigate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-[20px] overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_-4px_rgb(0_0_0/0.08),0_4px_10px_-2px_rgb(0_0_0/0.04)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex flex-col h-full relative"
      >
        
        {/* Wishlist — top right */}
        <button
          onClick={handleAddToWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/60 dark:border-white/10 shadow-[0_2px_8px_rgb(0_0_0/0.10)] transition-all duration-300
            ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
            ${wishlistPulse ? 'scale-125' : 'scale-100'}
            active:scale-90`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-[18px] h-[18px] ${isInWishlist ? 'fill-red-500' : ''}`} />
        </button>

        {/* Image Container with Hover Swap & Details Overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 flex items-center justify-center">
          
          {/* Main Image / Hover alternate view image */}
          {!imgError ? (
            <Image
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
          )}
          
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-10">
              <span className="px-3.5 py-1.5 bg-black/85 text-white text-[10px] font-bold rounded-sm tracking-wider uppercase">
                Out of Stock
              </span>
            </div>
          )}

          {/* Rating Badge — bottom left */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-800 dark:text-gray-100 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-[0_1px_4px_rgb(0_0_0/0.12)] border border-white/60 dark:border-white/10 z-10">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 text-[#0F766E] fill-[#0F766E]" />
              <span className="text-gray-400 font-normal">·</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium">{product.reviewCount || 10}</span>
            </div>
          )}

          {/* Discount Badge — bottom right */}
          {discount && discount > 0 && (
            <Badge className="absolute bottom-2.5 right-2.5 bg-[#0F766E] hover:bg-[#0F766E] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-xl tracking-wide shadow-sm border-none z-10">
              {discount}% OFF
            </Badge>
          )}

          {/* Quick Add — slides up on hover */}
          <div className={`absolute inset-x-0 bottom-0 bg-white/98 dark:bg-gray-950/98 backdrop-blur-sm border-t border-[#E2E8F0] dark:border-border py-3 px-3 flex flex-col gap-2 transition-transform duration-300 ease-out transform translate-y-full group-hover:translate-y-0 z-20`}>
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
              <span>Quick Add</span>
              <span className="text-[#0F766E] flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View Details</span>
            </div>
            
            <div className="flex justify-between gap-1.5">
              {DEFAULT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleQuickAddSize(e, size)}
                  disabled={product.stock === 0}
                  className="flex-1 min-h-[32px] bg-white dark:bg-gray-900 hover:bg-[#F0FDFA] dark:hover:bg-[#022c2a] border border-[#E2E8F0] dark:border-border hover:border-[#0F766E] text-gray-700 dark:text-gray-300 hover:text-[#0F766E] text-xs font-semibold rounded-xl transition-colors disabled:opacity-40"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Details */}
        <div className="p-3.5 flex flex-col flex-1 gap-1 bg-white dark:bg-card">
          
          {/* Brand */}
          <p className="text-[10px] font-bold text-[#64748B] dark:text-gray-500 uppercase tracking-widest leading-none">
            {product.brand || 'Aura Couture'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-xs text-[#334155] dark:text-gray-400 font-normal line-clamp-1 group-hover:text-[#0F766E] transition-colors leading-relaxed">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-semibold text-[#0F172A] dark:text-gray-100">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-[11px] text-[#94A3B8] dark:text-gray-600 line-through">₹{product.originalPrice}</span>
                <span className="text-[10px] font-semibold text-[#0F766E]">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#E2E8F0] dark:border-border">
            {DEFAULT_COLORS.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(col); }}
                style={{ backgroundColor: col }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === col ? 'ring-2 ring-[#0F766E] ring-offset-1 border-white scale-110' : 'border-gray-300 dark:border-gray-700 hover:scale-105'
                }`}
                title={`Color option ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    );
  }

  // List Mode
  return (
    <div
      onClick={handleNavigate}
      className="group bg-white dark:bg-card border-b border-[#E2E8F0] dark:border-border p-5 cursor-pointer hover:bg-[#F0FDFA]/30 dark:hover:bg-[#022c2a]/20 transition-colors duration-200 flex gap-6"
    >
      {/* Product Image */}
      <div className="relative w-40 sm:w-48 aspect-[3/4] flex-shrink-0 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden">
        {!imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="192px"
            className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center z-10">
            <span className="px-3 py-1 bg-black/75 text-white text-[10px] font-bold rounded-sm tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1 bg-white dark:bg-card">
        <div>
          {/* Brand */}
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {product.brand || 'Aura Couture'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-base font-semibold text-[#0F172A] dark:text-gray-100 leading-snug mb-2 truncate group-hover:text-[#0F766E] transition-colors">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-[#0F766E] text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-xs text-[#64748B] dark:text-gray-500 font-medium">
              {product.reviewCount} Ratings
            </span>
            
            <span className="inline-flex items-center text-[10px] font-semibold bg-[#F0FDFA] dark:bg-[#022c2a] text-[#0F766E] px-2 py-0.5 rounded-lg border border-[#99F6E4] dark:border-[#115E59] ml-1">
              Assured <span className="text-amber-400 ml-0.5">★</span>
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex items-baseline gap-2.5 mt-auto border-t border-[#E2E8F0] dark:border-border pt-3 flex-wrap">
          <span className="text-lg sm:text-xl font-semibold text-[#0F172A] dark:text-gray-100">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-[#94A3B8] dark:text-gray-600 line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-semibold text-[#0F766E]">
                {discount}% Off
              </span>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}
