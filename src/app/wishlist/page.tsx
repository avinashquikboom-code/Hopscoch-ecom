'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store';
import { useAddToCart, useRemoveFromWishlist } from '@/hooks';
import { Heart, Trash2, ShoppingCart, Share2, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.wishlist?.items || []);
  const wishlistItems = items.map(item => item.product);

  const addToCartMutation = useAddToCart();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleMoveToCart = (productId: string) => {
    addToCartMutation.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          removeFromWishlistMutation.mutate(productId);
          toast.success('Moved item to Cart successfully!');
        }
      }
    );
  };

  const handleRemove = (productId: string) => {
    removeFromWishlistMutation.mutate(productId);
    toast.success('Removed from Wishlist');
  };

  const handleShare = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/products/${productId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Copied link to clipboard!');
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 py-10 px-4 sm:px-6 md:px-12 font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-800/80 rounded-2xl p-5 mb-5 flex justify-between items-center shadow-xs">
          <div>
            <h1 className="text-xl font-black uppercase text-neutral-850 dark:text-neutral-100 tracking-wider">
              My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
              Manage, share or move your saved items directly to your shopping cart.
            </p>
          </div>
        </div>
        
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-20 px-8 border border-dashed border-neutral-250 dark:border-neutral-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-xs">
            <div className="h-14 w-14 rounded-full bg-teal-50 dark:bg-teal-950/30 text-[#0d9488] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Heart className="h-6 w-6 text-[#0d9488]" />
            </div>
            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-2">Wishlist is Empty</h2>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Looks like you haven't added anything here yet. Explore our premium seasonal drops to find your styles.
            </p>
            <Link href="/products">
              <Button className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold px-8 py-2 h-10 rounded-lg text-xs shadow-xs border-none uppercase cursor-pointer">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid (Responsive columns: 2 on mobile, 3 on tablet, 4 on desktop) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlistItems.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : undefined;

              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-850 rounded-2xl overflow-hidden flex flex-col justify-between h-full relative group hover:shadow-md transition-all duration-300"
                >
                  {/* Trash Icon top right overlay */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xs text-neutral-400 hover:text-red-500 border border-neutral-100 dark:border-zinc-700 shadow-sm z-10 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="relative aspect-[3/4] block w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-850">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 150px, 240px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-102"
                      />
                    </Link>

                    {/* Details */}
                    <div className="p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-450 dark:text-neutral-500">{product.brand || 'FCISeller'}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xs text-neutral-850 dark:text-neutral-200 font-semibold truncate hover:text-[#0d9488] transition-colors mt-0.5">{product.name}</h3>
                      </Link>
                      
                      {/* Price Row */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">₹{product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through">₹{product.originalPrice}</span>
                            <span className="text-[10px] font-bold text-[#0d9488]">{discount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="p-2 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950/30 flex gap-2">
                    
                    {/* Share */}
                    <button
                      onClick={(e) => handleShare(e, product.id)}
                      className="p-2 bg-white dark:bg-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-750 border border-neutral-200 dark:border-zinc-700 text-neutral-500 dark:text-neutral-400 rounded-lg cursor-pointer transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Move to Cart */}
                    <button
                      onClick={() => handleMoveToCart(product.id)}
                      className="flex-1 bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold py-1.5 px-2 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer border-none"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
