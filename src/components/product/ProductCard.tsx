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
import { motion } from 'framer-motion';

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

  // Grid Mode (Premium 3D & Glassmorphic Card Design)
  if (viewMode === 'grid') {
    return (
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={handleNavigate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-hover transition-all flex flex-col h-full relative z-10"
      >
        
        {/* Wishlist — top right */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleAddToWishlist}
          className={`absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border border-white/30 dark:border-white/5 shadow-md transition-all
            ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
            ${wishlistPulse ? 'scale-125' : 'scale-100'}`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4.5 h-4.5 ${isInWishlist ? 'fill-red-500' : ''}`} />
        </motion.button>

        {/* Image Container with Hover Zoom & Details Overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50/50 dark:bg-neutral-950/50 flex items-center justify-center rounded-2xl m-2.5 w-[calc(100%-20px)] self-center">
          
          {/* Main Image / Hover alternate view image */}
          {!imgError ? (
            <Image
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
          )}
          
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="px-4 py-2 bg-black/80 text-white text-[9px] font-black rounded-full tracking-widest uppercase border border-white/10">
                Out of Stock
              </span>
            </div>
          )}

          {/* Rating Badge — bottom left */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-md text-gray-800 dark:text-gray-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20 dark:border-white/5 z-10">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 text-[#0d9488] fill-[#0d9488]" />
              <span className="text-gray-400 font-normal">·</span>
              <span className="text-gray-500 font-bold">{product.reviewCount || 10}</span>
            </div>
          )}

          {/* Discount Badge — bottom right */}
          {discount && discount > 0 && (
            <Badge className="absolute bottom-2.5 right-2.5 bg-[#0d9488] hover:bg-[#0d9488] text-white font-black text-[9px] px-2.5 py-0.5 rounded-full tracking-wider shadow-md border-none z-10">
              {discount}% OFF
            </Badge>
          )}

          {/* Quick Add — slides up on hover */}
          <div className={`absolute inset-x-0 bottom-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-t border-gray-100 dark:border-neutral-900 py-3.5 px-3.5 flex flex-col gap-2.5 transition-transform duration-300 ease-out transform translate-y-full group-hover:translate-y-0 z-20`}>
            <div className="flex items-center justify-between text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">
              <span>Quick Add</span>
              <span className="text-[#0d9488] flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View Details</span>
            </div>
            
            <div className="flex justify-between gap-1.5">
              {DEFAULT_SIZES.map((size) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={size}
                  onClick={(e) => handleQuickAddSize(e, size)}
                  disabled={product.stock === 0}
                  className="flex-1 min-h-[32px] bg-white dark:bg-neutral-900 hover:bg-[#0d9488]/5 dark:hover:bg-[#0d9488]/10 border border-gray-200/80 dark:border-neutral-800 hover:border-[#0d9488] text-gray-700 dark:text-gray-300 hover:text-[#0d9488] text-xs font-bold rounded-xl transition-colors disabled:opacity-40"
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Details */}
        <div className="px-4 pb-4 pt-1 flex flex-col flex-1 gap-1.5 bg-transparent">
          
          {/* Brand */}
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
            {product.brand || 'FCISeller'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-xs text-gray-700 dark:text-gray-300 font-semibold line-clamp-1 group-hover:text-[#0d9488] transition-colors leading-relaxed">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-black text-[#0F172A] dark:text-white">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-[11px] text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="text-[10px] font-black text-[#0d9488]">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-1.5 pt-2 border-t border-gray-100 dark:border-neutral-900">
            {DEFAULT_COLORS.map((col, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setSelectedColor(col); }}
                style={{ backgroundColor: col }}
                className={`w-3 h-3 rounded-full border transition-all cursor-pointer ${
                  selectedColor === col ? 'ring-2 ring-[#0d9488] ring-offset-1 border-white dark:border-black scale-110' : 'border-gray-200 dark:border-neutral-800 hover:scale-110'
                }`}
                title={`Color option ${idx + 1}`}
              />
            ))}
          </div>
          
        </div>
      </motion.div>
    );
  }

  // List Mode (Premium Translucent Panel)
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={handleNavigate}
      className="group bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-3xl p-5 cursor-pointer hover:shadow-hover transition-all flex gap-6 z-10"
    >
      {/* Product Image */}
      <div className="relative w-40 sm:w-48 aspect-[3/4] flex-shrink-0 bg-gray-50/50 dark:bg-neutral-950/50 border border-gray-100/50 dark:border-neutral-900 rounded-2xl overflow-hidden">
        {!imgError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="192px"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-black/85 text-white text-[9px] font-black rounded-full tracking-widest uppercase border border-white/10">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-1 bg-transparent">
        <div>
          {/* Brand */}
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
            {product.brand || 'FCISeller'}
          </p>
          
          {/* Product Name */}
          <h3 className="text-base font-black text-gray-900 dark:text-white leading-snug mb-2 truncate group-hover:text-[#0d9488] transition-colors">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3.5 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-[#0d9488] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
              {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-current" />
            </span>
            <span className="text-xs text-gray-500 font-bold">
              {product.reviewCount} Ratings
            </span>
            
            <span className="inline-flex items-center text-[10px] font-black bg-teal-500/10 text-[#0d9488] px-3 py-0.5 rounded-full border border-teal-500/20 ml-1.5">
              Assured <span className="text-amber-550 ml-0.5">★</span>
            </span>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex items-baseline gap-2.5 mt-auto border-t border-gray-100 dark:border-neutral-900 pt-3 flex-wrap">
          <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="text-sm font-black text-[#0d9488]">
                {discount}% Off
              </span>
            </>
          )}
        </div>
      </div>
      
    </motion.div>
  );
}
