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
    <div className="min-h-screen bg-[#F1F3F6] py-10 px-4 sm:px-6 md:px-12 font-sans">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header Block */}
        <div className="bg-white border border-gray-200 rounded-sm p-5 mb-5 flex justify-between items-center shadow-xs">
          <div>
            <h1 className="text-xl font-black uppercase text-gray-900 tracking-wider">
              My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage, share or move your saved items directly to your shopping cart.
            </p>
          </div>
        </div>
        
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center py-20 px-8 border border-dashed border-gray-300 rounded-sm bg-white shadow-xs">
            <div className="h-14 w-14 rounded-full bg-teal-50 text-[#0d9488] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Heart className="h-6 w-6 text-[#0d9488]" />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-2">Wishlist is Empty</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Looks like you haven't added anything here yet. Explore our premium seasonal drops to find your styles.
            </p>
            <Link href="/products">
              <Button className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold px-8 py-2 h-10 rounded-sm text-xs shadow-xs border-none uppercase cursor-pointer">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wishlistItems.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : undefined;

              return (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between h-full relative group hover:shadow-md transition-shadow duration-300"
                >
                  {/* Trash Icon top right overlay */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 border border-gray-100 shadow-sm z-10 cursor-pointer transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Image */}
                    <Link href={`/products/${product.id}`} className="relative aspect-[3/4] block w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="240px"
                        className="object-cover object-top"
                      />
                    </Link>

                    {/* Details */}
                    <div className="p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">{product.brand || 'Aura Couture'}</p>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xs text-gray-800 font-semibold truncate hover:text-[#0d9488] transition-colors mt-0.5">{product.name}</h3>
                      </Link>
                      
                      {/* Price Row */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                            <span className="text-[10px] font-bold text-[#0d9488]">{discount}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="p-2 border-t border-gray-100 bg-gray-50 flex gap-2">
                    
                    {/* Share */}
                    <button
                      onClick={(e) => handleShare(e, product.id)}
                      className="p-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 rounded-sm cursor-pointer transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Move to Cart */}
                    <button
                      onClick={() => handleMoveToCart(product.id)}
                      className="flex-1 bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold py-1.5 px-2 rounded-sm text-[10px] uppercase flex items-center justify-center gap-1 cursor-pointer border-none"
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
