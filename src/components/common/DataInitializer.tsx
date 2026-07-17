'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { API_BASE } from '@/constants';

export function DataInitializer({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch categories and products in parallel
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/api/categories`),
          fetch(`${API_BASE}/api/products`)
        ]);

        if (!catRes.ok || !prodRes.ok) {
          throw new Error('Failed to load application data from server.');
        }

        const catJson = await catRes.json();
        const prodJson = await prodRes.json();

        // 1. Populate categories in-place
        const rawCats = catJson.data ?? catJson.categories ?? catJson ?? [];
        if (Array.isArray(rawCats)) {
          mockCategories.length = 0;
          mockCategories.push(...rawCats.map((c: any) => ({
            id: String(c.id),
            name: c.name || 'Unnamed Category',
            slug: c.slug || '',
            productCount: c.productCount || 0,
            icon: c.icon || '🛍️',
            image: c.bannerUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80'
          })));
        }

        // 2. Populate products in-place
        const rawProds = prodJson.data ?? prodJson.products ?? prodJson ?? [];
        if (Array.isArray(rawProds)) {
          mockProducts.length = 0;
          mockProducts.push(...rawProds.map((p: any) => {
            const price = Number(p.basePrice || p.price || 0);
            const images = (p.images && p.images.length > 0)
              ? p.images.map((img: any) => img.url.startsWith('http') ? img.url : `${API_BASE}/${img.url}`)
              : [p.thumbnailUrl || 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80'];
            
            return {
              id: String(p.id),
              name: p.name || 'Unnamed Product',
              description: p.description || '',
              price: price,
              originalPrice: price,
              discount: p.discountValue ? Number(p.discountValue) : 0,
              images: images,
              category: p.category?.name || 'Collections',
              brand: p.brand?.name || 'FCISeller',
              stock: p.stock !== undefined ? Number(p.stock) : 10,
              rating: Number(p.avgRating || 4.5),
              reviewCount: Number(p.reviewCount || 0),
              tags: p.tags || [],
              isNew: p.isNewArrival || false,
              isFeatured: p.isFeatured || false,
              isTrending: p.isTrending || false,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
            };
          }));
        }

        setInitialized(true);
      } catch (err: any) {
        console.error('Data initialization failed:', err);
        setError(err.message || 'Server connection failed.');
        // Fallback to empty states if backend is down
        mockCategories.length = 0;
        mockProducts.length = 0;
        setInitialized(true);
      }
    }

    loadData();
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
        <p className="mt-4 text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">
          Initializing FCISeller...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
