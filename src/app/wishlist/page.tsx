'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const wishlistItems = mockProducts.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          <span className="text-gray-600 dark:text-gray-400">{wishlistItems.length} items</span>
        </div>
        
        {wishlistItems.length === 0 ? (
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Your wishlist is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Save items you love to your wishlist</p>
              <Button className="bg-teal-600 hover:bg-teal-700">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
