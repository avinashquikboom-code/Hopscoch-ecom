'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { SORT_OPTIONS, PRICE_RANGES, RATING_OPTIONS } from '@/constants';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brands = Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean)));

  let filteredProducts = [...mockProducts];

  // Apply price filter
  filteredProducts = filteredProducts.filter(
    p => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  // Apply brand filter
  if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(p => 
      p.brand && selectedBrands.includes(p.brand)
    );
  }

  // Apply rating filter
  if (selectedRating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= selectedRating);
  }

  // Apply stock filter
  if (inStockOnly) {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }

  // Apply sorting
  switch (sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popular':
      filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setSelectedRating(null);
    setInStockOnly(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          All Products
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredProducts.length} products
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <Label>Price Range</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as number[])}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <Label>Brands</Label>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand!)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand!]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                    />
                    <Label htmlFor={brand} className="text-sm cursor-pointer">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label>Customer Rating</Label>
              <div className="space-y-2">
                {RATING_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${option.value}`}
                      checked={selectedRating === option.value}
                      onCheckedChange={(checked) => {
                        setSelectedRating(checked ? option.value : null);
                      }}
                    />
                    <Label htmlFor={`rating-${option.value}`} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-6">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="space-y-6 mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                  {/* Mobile filters content - same as desktop */}
                  <div className="space-y-3">
                    <Label>Price Range</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as number[])}
                      max={10000}
                      step={100}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Brands</Label>
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-${brand}`}
                          checked={selectedBrands.includes(brand!)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand!]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <Label htmlFor={`mobile-${brand}`} className="text-sm cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value || 'newest')}>
                <SelectTrigger id="sort" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No products found</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
