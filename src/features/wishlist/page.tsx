'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Price } from '@/components/common/Price';
import { Rating } from '@/components/common/Rating';
import { EmptyState } from '@/components/common/EmptyState';
import { useWishlistStore } from '@/store';
import { useRemoveFromWishlist } from '@/hooks';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const wishlist = useWishlistStore((state: any) => state.wishlist);
  const isInWishlist = useWishlistStore((state: any) => state.isInWishlist);
  const removeItem = useRemoveFromWishlist();

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love by clicking the heart icon on any product."
          action={{
            label: 'Start Shopping',
            onClick: () => router.push('/products'),
          }}
        />
      </div>
    );
  }

  const handleRemoveItem = (productId: string) => {
    removeItem.mutate(productId);
  };

  const handleAddToCart = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.items.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="relative aspect-square mb-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {item.product.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <Rating value={item.product.rating} size="sm" />
              </div>

              <Price
                value={item.product.price}
                originalPrice={item.product.originalPrice}
                size="md"
              />

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAddToCart(item.productId)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => router.push(`/products/${item.productId}`)}
                >
                  <Heart
                    className={`w-4 h-4 ${isInWishlist(item.productId) ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
