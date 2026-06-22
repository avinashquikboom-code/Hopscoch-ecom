'use client';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame } from 'lucide-react';

export default function DealsPage() {
  const dealProducts = mockProducts.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hot Deals</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Limited time offers on your favorite products</p>
        </div>

        {/* Flash Deal Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Flash Sale Ends In</span>
              </div>
              <div className="text-3xl font-bold">02:45:30</div>
            </div>
            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
              View All Flash Deals
            </Button>
          </div>
        </div>

        {/* Deal Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['Fashion', 'Electronics', 'Home', 'Beauty'].map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="text-2xl font-bold text-teal-600 mb-1">Up to 70%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{category}</div>
            </div>
          ))}
        </div>

        {/* Deal Products */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">All Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => {
            const discount = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
            return (
              <div key={product.id} className="relative">
                <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white">
                  {discount}% OFF
                </Badge>
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
