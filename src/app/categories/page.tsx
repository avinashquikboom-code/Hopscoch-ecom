'use client';
import { useProducts, useCategories } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function isImageUrl(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/') ||
    /\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(s)
  );
}

export default function CategoriesPage() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useCategories();
  const categories = categoriesData || [];
  const { data: productsData } = useProducts();
  const products = productsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase font-mono">
              Shop By Category
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
              Explore curated fashion collections and trending drops
            </p>
          </div>
        </div>

        {isCategoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryProductsCount = products.filter(
                (p) => p.category?.toLowerCase() === category.name.toLowerCase() || (p as any).subcategory?.toLowerCase() === category.name.toLowerCase()
              ).length;
              const productCount = category.productCount || categoryProductsCount;

              const hasImage = isImageUrl(category.image) || isImageUrl(category.icon);
              const displayImg = isImageUrl(category.image) ? category.image : (isImageUrl(category.icon) ? category.icon : undefined);

              return (
                <Link 
                  key={category.id} 
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white dark:bg-gray-950 flex flex-col h-full">
                    <CardContent className="p-0 flex-1 flex flex-col">
                      <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center">
                        {hasImage && displayImg ? (
                          <img
                            src={displayImg}
                            alt={category.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="text-6xl select-none group-hover:scale-110 transition-transform duration-300">
                            {category.icon || '👗'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h3 className="text-base font-extrabold uppercase tracking-wider leading-tight">
                            {category.name}
                          </h3>
                          <p className="text-[11px] font-medium text-gray-300 mt-0.5">
                            {productCount} Products
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-950 mt-auto">
                        <span className="text-xs font-bold text-[#0d9488] tracking-wider uppercase group-hover:underline">
                          Browse Collection
                        </span>
                        <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center group-hover:bg-[#0d9488] group-hover:text-white transition-colors">
                          <ArrowRight className="h-3.5 w-3.5 text-[#0d9488] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
