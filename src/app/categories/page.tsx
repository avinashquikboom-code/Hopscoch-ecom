'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { mockCategories, mockProducts } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shop by Category</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => {
            const categoryProducts = mockProducts.filter(p => p.category === category.name);
            return (
              <Card key={category.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <div className="text-6xl">{category.icon}</div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{category.productCount} products</p>
                    <Button variant="outline" className="w-full group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-colors">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
