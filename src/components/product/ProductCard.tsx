'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { useAddToCart, useAddToWishlist } from '@/hooks';
import { useWishlistStore, useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
const DEFAULT_COLORS = ['#0d9488', '#1e293b', '#94a3b8', '#d1d5db', '#e2e8f0'];

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
        className="group bg-white border border-gray-150 rounded-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-350 flex flex-col h-full relative"
      >
        
        {/* Wishlist Overlay (Myntra Style - Top Right of Image) */}
        <button
          onClick={handleAddToWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-xs border border-gray-100/50 shadow-md text-gray-400 hover:text-red-500 transition-all duration-300
            ${isInWishlist ? 'text-red-500 fill-red-500 bg-white' : 'text-gray-400'}
            ${wishlistPulse ? 'scale-125' : 'scale-100'}
            active:scale-90`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className="w-4.5 h-4.5" />
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

          {/* Rating Badge Overlay (Myntra Style - Bottom Left on Image) */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-gray-100/50 z-10">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 text-[#0d9488] fill-[#0d9488]" />
              <span className="text-gray-400 font-normal">|</span>
              <span className="text-gray-500 font-bold">{product.reviewCount || 10}</span>
            </div>
          )}

          {/* Discount Tag Overlay (Myntra Style - Bottom Right on Image) */}
          {discount && discount > 0 && (
            <Badge className="absolute bottom-2.5 right-2.5 bg-[#0d9488] hover:bg-[#0d9488] text-white font-extrabold text-[9px] px-2 py-0.5 rounded-sm tracking-wide shadow-sm border-none z-10">
              {discount}% OFF
            </Badge>
          )}

          {/* Sliding Quick Add & Quick View Overlay (Myntra Style) */}
          <div className={`absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xs border-t border-gray-150 py-3 px-2.5 flex flex-col gap-2 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 z-20`}>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-wider">
              <span>Quick Add</span>
              <span className="text-[#0d9488] flex items-center gap-0.5"><Eye className="w-3.5 h-3.5" /> View Details</span>
            </div>
            
            {/* Quick Sizes */}
            <div className="flex justify-between gap-1.5">
              {DEFAULT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleQuickAddSize(e, size)}
                  disabled={product.stock === 0}
                  className="flex-1 bg-white hover:bg-teal-50 border border-gray-200 hover:border-[#0d9488] text-gray-850 hover:text-[#0d9488] text-xs font-bold py-1 rounded transition-colors disabled:opacity-40"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Details (Myntra layout) */}
        <div className="p-3.5 flex flex-col flex-1 gap-1 bg-white">
          
          {/* Brand */}
          <p className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
            {product.brand || 'Aura Couture'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-xs text-gray-500 font-normal line-clamp-1 group-hover:text-[#0d9488] transition-colors leading-relaxed">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs sm:text-sm font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="text-[10px] font-bold text-[#0d9488] italic">
                  ({discount}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Color swatches under pricing */}
          <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-gray-100">
            {DEFAULT_COLORS.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(col); }}
                style={{ backgroundColor: col }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === col ? 'ring-2 ring-[#0d9488] border-white scale-110' : 'border-gray-250 hover:scale-105'
                }`}
                title={`Color option ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    );
  }

  // List Mode (Myntra search list item style)
  return (
    <div
      onClick={handleNavigate}
      className="group bg-white border-b border-gray-200/80 p-5 cursor-pointer hover:shadow-sm transition-all duration-200 flex gap-6"
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
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1 bg-white">
        <div>
          {/* Brand */}
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {product.brand || 'Aura Couture'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2 truncate group-hover:text-[#0d9488] transition-colors">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {product.reviewCount} Ratings & Reviews
            </span>
            
            {/* Assured Badge */}
            <span className="inline-flex items-center text-[9px] font-black tracking-tighter bg-gradient-to-r from-teal-600 to-[#0d9488] text-white px-1 py-0.5 rounded-sm italic ml-1">
              Assured <span className="text-yellow-400 ml-0.5">★</span>
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex items-baseline gap-2.5 mt-auto border-t border-gray-100 pt-3 flex-wrap">
          <span className="text-lg sm:text-xl font-bold text-gray-900">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-bold text-[#0d9488]">
                {discount}% Off
              </span>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}
