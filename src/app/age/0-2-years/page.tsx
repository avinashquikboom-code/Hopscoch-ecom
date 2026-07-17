'use client';
import { useProducts } from '@/hooks/use-products';


import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';

export default function Age02YearsPage() {
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];

  const products = mockProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">0-2 Years (Infant)</h1>
          <p className="text-gray-600 dark:text-gray-400">Comfortable clothes for growing babies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
