'use client';
import { useProducts, useCategories } from '@/hooks/use-products';


import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  LayoutGrid, List, Star
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',   label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { label: 'Under ₹500',     min: 0,    max: 500  },
  { label: '₹500 – ₹1000',   min: 500,  max: 1000  },
  { label: '₹1000 – ₹2000',  min: 1000, max: 2000  },
  { label: 'Over ₹2000',     min: 2000, max: Infinity },
];

const RATING_OPTIONS = [
  { value: 4, label: '4★ & above'  },
  { value: 3, label: '3★ & above'  },
];

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Teal', 'Slate', 'Blue', 'Red', 'Green', 'White'];
const MATERIALS = ['Cotton', 'Linen', 'Silk', 'Wool', 'Leather'];
const FABRICS = ['Pashmina', 'Velvet', 'Crepe', 'Georgette', 'Denim'];
const FITS = ['Regular', 'Slim', 'Oversized', 'Tailored'];
const OCCASIONS = ['Wedding', 'Casual', 'Formal', 'Party'];
const DISCOUNTS = [
  { label: '10% and above', value: 10 },
  { label: '20% and above', value: 20 },
  { label: '30% and above', value: 30 },
  { label: '40% and above', value: 40 },
];

const ITEMS_PER_PAGE = 12;

/* ─── Filter Checkbox (Flipkart Style) ────────────────────────────────── */
function FilterCheck({
  id, checked, onChange, label,
}: { id: string; checked: boolean; onChange: () => void; label: string }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer py-1.5 hover:text-[#0d9488] transition-colors select-none"
    >
      <input 
        id={id} 
        type="checkbox" 
        className="rounded-sm border-gray-300 text-[#0d9488] focus:ring-[#0d9488] h-3.5 w-3.5" 
        checked={checked} 
        onChange={onChange} 
      />
      <span className="text-xs text-gray-700 font-normal leading-none">{label}</span>
    </label>
  );
}

/* ─── Collapsible Filter Section ────────────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-150 py-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 text-xs font-bold uppercase tracking-wider text-gray-800 hover:text-[#0d9488]"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {open && <div className="pt-2 space-y-1">{children}</div>}
    </div>
  );
}

/* ─── Pagination Control (Flipkart Style) ────────────────────────────── */
function Pagination({
  currentPage, totalPages, onPageChange,
}: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-bold text-[#0d9488] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all
                ${currentPage === p
                  ? 'bg-[#0d9488] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-bold text-[#0d9488] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Active Filter Chip ─────────────────────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-sm text-xs font-medium border border-gray-200/60 shadow-sm animate-fade-in">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors cursor-pointer">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ─── Main Products Content ─────────────────────────────────────────────── */
function ProductsContent() {
  const { data: categoriesData } = useCategories();
  const mockCategories = categoriesData || [];
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];

  const searchParams = useSearchParams();
  const router = useRouter();

  // Basic Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // New specific filter states (FCISeller enhancements)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Read from URL params on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
    const search = searchParams.get('search');
    if (search) setSearchQuery(search.toLowerCase());
  }, [searchParams]);

  // Reset to page 1 whenever filters change
  const resetPage = useCallback(() => setCurrentPage(1), []);

  const brandsList = Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean))) as string[];

  // ── Filter & Sort ────────────────────────────────────────────────────────
  let filtered = [...mockProducts];

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery))
    );
  }
  if (selectedPriceRanges.length > 0) {
    filtered = filtered.filter(p =>
      selectedPriceRanges.some(idx => {
        const r = PRICE_RANGES[idx];
        return p.price >= r.min && p.price <= r.max;
      })
    );
  }
  if (selectedRating !== null) {
    filtered = filtered.filter(p => p.rating >= selectedRating);
  }
  if (selectedBrands.length > 0) {
    filtered = filtered.filter(p => p.brand && selectedBrands.includes(p.brand));
  }
  if (inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Filter by size, color, material, fabric, fit, occasion, and discount
  if (selectedSizes.length > 0) {
    filtered = filtered.filter(p => 
      selectedSizes.some(s => p.tags.some(t => t.toLowerCase() === s.toLowerCase())) || 
      selectedSizes.some(s => p.name.toLowerCase().includes(s.toLowerCase()))
    );
  }
  if (selectedColors.length > 0) {
    filtered = filtered.filter(p => 
      selectedColors.some(c => p.tags.some(t => t.toLowerCase() === c.toLowerCase())) ||
      selectedColors.some(c => p.name.toLowerCase().includes(c.toLowerCase()))
    );
  }
  if (selectedMaterials.length > 0) {
    filtered = filtered.filter(p => 
      selectedMaterials.some(m => p.description.toLowerCase().includes(m.toLowerCase()))
    );
  }
  if (selectedFabrics.length > 0) {
    filtered = filtered.filter(p => 
      selectedFabrics.some(f => p.description.toLowerCase().includes(f.toLowerCase()))
    );
  }
  if (selectedFits.length > 0) {
    filtered = filtered.filter(p => 
      selectedFits.some(f => p.description.toLowerCase().includes(f.toLowerCase()) || p.name.toLowerCase().includes(f.toLowerCase()))
    );
  }
  if (selectedOccasions.length > 0) {
    filtered = filtered.filter(p => 
      selectedOccasions.some(o => p.tags.some(t => t.toLowerCase() === o.toLowerCase()) || p.description.toLowerCase().includes(o.toLowerCase()))
    );
  }
  if (selectedDiscount !== null) {
    filtered = filtered.filter(p => {
      const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      return disc >= selectedDiscount;
    });
  }

  // Sort
  switch (sortBy) {
    case 'price_asc':  filtered.sort((a, b) => a.price - b.price); break;
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'popular':    filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
    case 'newest':
    default:           filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalProducts = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Clear filters ────────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedPriceRanges([]);
    setSelectedRating(null);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedFabrics([]);
    setSelectedFits([]);
    setSelectedOccasions([]);
    setSelectedDiscount(null);
    resetPage();
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedPriceRanges.length +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    selectedBrands.length +
    selectedSizes.length +
    selectedColors.length +
    selectedMaterials.length +
    selectedFabrics.length +
    selectedFits.length +
    selectedOccasions.length +
    (selectedDiscount ? 1 : 0);

  // ── Sidebar Filters Panel (Flipkart Inspired) ──────────────────────────────
  const FiltersPanel = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-150">
        <span className="font-bold text-sm text-gray-800">Filters</span>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-[#0d9488] hover:underline font-bold transition-colors cursor-pointer"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Categories" defaultOpen={true}>
        <FilterCheck
          id="cat-all"
          checked={selectedCategory === 'all'}
          onChange={() => { setSelectedCategory('all'); resetPage(); }}
          label="All Clothing"
        />
        {mockCategories.map(cat => (
          <FilterCheck
            key={cat.id}
            id={`cat-${cat.id}`}
            checked={selectedCategory === cat.name}
            onChange={() => { setSelectedCategory(cat.name); resetPage(); }}
            label={cat.name}
          />
        ))}
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price" defaultOpen={true}>
        {PRICE_RANGES.map((range, idx) => (
          <FilterCheck
            key={idx}
            id={`price-${idx}`}
            checked={selectedPriceRanges.includes(idx)}
            onChange={() => {
              setSelectedPriceRanges(prev =>
                prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
              );
              resetPage();
            }}
            label={range.label}
          />
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand" defaultOpen={true}>
        {brandsList.map(brand => (
          <FilterCheck
            key={brand}
            id={`brand-${brand}`}
            checked={selectedBrands.includes(brand)}
            onChange={() => {
              setSelectedBrands(prev =>
                prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
              );
              resetPage();
            }}
            label={brand}
          />
        ))}
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Sizes">
        {SIZES.map(sz => (
          <FilterCheck
            key={sz}
            id={`size-${sz}`}
            checked={selectedSizes.includes(sz)}
            onChange={() => {
              setSelectedSizes(prev =>
                prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
              );
              resetPage();
            }}
            label={sz}
          />
        ))}
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors">
        {COLORS.map(col => (
          <FilterCheck
            key={col}
            id={`color-${col}`}
            checked={selectedColors.includes(col)}
            onChange={() => {
              setSelectedColors(prev =>
                prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
              );
              resetPage();
            }}
            label={col}
          />
        ))}
      </FilterSection>

      {/* Materials */}
      <FilterSection title="Materials">
        {MATERIALS.map(mat => (
          <FilterCheck
            key={mat}
            id={`mat-${mat}`}
            checked={selectedMaterials.includes(mat)}
            onChange={() => {
              setSelectedMaterials(prev =>
                prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
              );
              resetPage();
            }}
            label={mat}
          />
        ))}
      </FilterSection>

      {/* Fabric */}
      <FilterSection title="Fabric">
        {FABRICS.map(fab => (
          <FilterCheck
            key={fab}
            id={`fab-${fab}`}
            checked={selectedFabrics.includes(fab)}
            onChange={() => {
              setSelectedFabrics(prev =>
                prev.includes(fab) ? prev.filter(f => f !== fab) : [...prev, fab]
              );
              resetPage();
            }}
            label={fab}
          />
        ))}
      </FilterSection>

      {/* Fit */}
      <FilterSection title="Fit">
        {FITS.map(fit => (
          <FilterCheck
            key={fit}
            id={`fit-${fit}`}
            checked={selectedFits.includes(fit)}
            onChange={() => {
              setSelectedFits(prev =>
                prev.includes(fit) ? prev.filter(f => f !== fit) : [...prev, fit]
              );
              resetPage();
            }}
            label={fit}
          />
        ))}
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion">
        {OCCASIONS.map(occ => (
          <FilterCheck
            key={occ}
            id={`occ-${occ}`}
            checked={selectedOccasions.includes(occ)}
            onChange={() => {
              setSelectedOccasions(prev =>
                prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
              );
              resetPage();
            }}
            label={occ}
          />
        ))}
      </FilterSection>

      {/* Discount */}
      <FilterSection title="Discounts">
        {DISCOUNTS.map(disc => (
          <FilterCheck
            key={disc.value}
            id={`disc-${disc.value}`}
            checked={selectedDiscount === disc.value}
            onChange={() => {
              setSelectedDiscount(selectedDiscount === disc.value ? null : disc.value);
              resetPage();
            }}
            label={disc.label}
          />
        ))}
      </FilterSection>

      {/* Customer Rating */}
      <FilterSection title="Customer Ratings">
        {RATING_OPTIONS.map(opt => (
          <FilterCheck
            key={opt.value}
            id={`rating-${opt.value}`}
            checked={selectedRating === opt.value}
            onChange={() => { setSelectedRating(selectedRating === opt.value ? null : opt.value); resetPage(); }}
            label={opt.label}
          />
        ))}
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <FilterCheck
          id="in-stock"
          checked={inStockOnly}
          onChange={() => { setInStockOnly(!inStockOnly); resetPage(); }}
          label="Exclude Out of Stock"
        />
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-16 font-sans transition-colors duration-300">
      
      {/* Search Result Title Bar */}
      <div className="bg-white dark:bg-zinc-900 border-b border-neutral-100 dark:border-neutral-850 py-3 shadow-xs mb-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-base sm:text-lg font-black uppercase text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
              Showing Results for "{selectedCategory === 'all' ? 'All Clothing' : selectedCategory}"
            </h1>
            <p className="text-xs text-neutral-450 dark:text-neutral-500 mt-0.5 font-medium">
              (Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, totalProducts)} of {totalProducts} products)
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex gap-4 items-start">

          {/* Desktop Filters Sidebar (Sticky filters) */}
          <aside className="hidden lg:block w-64 xl:w-72 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-850/80 p-5 shadow-xs shrink-0 rounded-2xl sticky top-[80px] max-h-[85vh] overflow-y-auto scrollbar-hide">
            <FiltersPanel />
          </aside>

          {/* Products Grid & Toolbar Box */}
          <div className="flex-1 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-neutral-850/80 shadow-xs rounded-2xl p-5 min-w-0">
            
            {/* Top Toolbar (Sort tabs + View option) */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3.5 mb-5 flex-wrap gap-4">
              
              {/* Flipkart-style sorting tabs */}
              <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide text-xs sm:text-sm font-semibold text-gray-500">
                <span className="text-gray-800 font-bold shrink-0">Sort By</span>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); resetPage(); }}
                    className={`pb-0.5 border-b-2 tracking-wide uppercase text-[11px] shrink-0 cursor-pointer ${
                      sortBy === opt.value 
                        ? 'border-[#0d9488] text-[#0d9488]' 
                        : 'border-transparent hover:text-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* View options */}
              <div className="flex items-center gap-3">
                
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-sm bg-gray-50 text-xs font-bold text-gray-800 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> FILTERS
                </button>

                <div className="flex items-center gap-1 bg-gray-100 rounded-sm p-0.5 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded-sm ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#0d9488]' : 'text-gray-400 hover:text-gray-700'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded-sm ${viewMode === 'list' ? 'bg-white shadow-sm text-[#0d9488]' : 'text-gray-400 hover:text-gray-700'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Active Filters Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                {selectedCategory !== 'all' && (
                  <FilterChip
                    label={selectedCategory}
                    onRemove={() => { setSelectedCategory('all'); resetPage(); }}
                  />
                )}
                {selectedPriceRanges.map(idx => (
                  <FilterChip
                    key={idx}
                    label={PRICE_RANGES[idx].label}
                    onRemove={() => { setSelectedPriceRanges(prev => prev.filter(i => i !== idx)); resetPage(); }}
                  />
                ))}
                {selectedBrands.map(brand => (
                  <FilterChip
                    key={brand}
                    label={brand}
                    onRemove={() => { setSelectedBrands(prev => prev.filter(b => b !== brand)); resetPage(); }}
                  />
                ))}
                {selectedRating && (
                  <FilterChip
                    label={`${selectedRating}★ & above`}
                    onRemove={() => { setSelectedRating(null); resetPage(); }}
                  />
                )}
                {inStockOnly && (
                  <FilterChip label="In Stock Only" onRemove={() => { setInStockOnly(false); resetPage(); }} />
                )}
                {selectedSizes.map(sz => (
                  <FilterChip key={sz} label={`Size: ${sz}`} onRemove={() => { setSelectedSizes(prev => prev.filter(s => s !== sz)); resetPage(); }} />
                ))}
                {selectedColors.map(col => (
                  <FilterChip key={col} label={`Color: ${col}`} onRemove={() => { setSelectedColors(prev => prev.filter(c => c !== col)); resetPage(); }} />
                ))}
                {selectedMaterials.map(mat => (
                  <FilterChip key={mat} label={`Material: ${mat}`} onRemove={() => { setSelectedMaterials(prev => prev.filter(m => m !== mat)); resetPage(); }} />
                ))}
                {selectedFabrics.map(fab => (
                  <FilterChip key={fab} label={`Fabric: ${fab}`} onRemove={() => { setSelectedFabrics(prev => prev.filter(f => f !== fab)); resetPage(); }} />
                ))}
                {selectedFits.map(fit => (
                  <FilterChip key={fit} label={`Fit: ${fit}`} onRemove={() => { setSelectedFits(prev => prev.filter(f => f !== fit)); resetPage(); }} />
                ))}
                {selectedOccasions.map(occ => (
                  <FilterChip key={occ} label={`Occasion: ${occ}`} onRemove={() => { setSelectedOccasions(prev => prev.filter(o => o !== occ)); resetPage(); }} />
                ))}
                {selectedDiscount && (
                  <FilterChip label={`Discount: ${selectedDiscount}% & above`} onRemove={() => { setSelectedDiscount(null); resetPage(); }} />
                )}
              </div>
            )}

            {/* Products Listing Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-base text-gray-500 font-bold">No matches found for your filter criteria.</p>
                <Button 
                  onClick={clearAllFilters}
                  className="mt-4 bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-9 px-6 rounded-sm text-xs cursor-pointer border-none"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'flex flex-col gap-0'
                }
              >
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination Control */}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

          </div>
        </div>
      </div>

      {/* Mobile Drawer Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
          <div className="w-[300px] bg-white h-full flex flex-col animate-in slide-in-from-right duration-250">
            <div className="p-4 border-b border-gray-250/60 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800">Filters ({activeFilterCount})</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:text-red-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <FiltersPanel />
            </div>
            <div className="p-4 border-t border-gray-250/60 flex gap-3">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1 text-xs font-bold py-2 border-gray-300"
              >
                CLEAR ALL
              </Button>
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 text-xs font-bold bg-[#0d9488] hover:bg-[#0d9488]/95 text-white"
              >
                APPLY FILTERS
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#0d9488] border-t-transparent" />
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-bold tracking-wider uppercase animate-pulse">Loading Catalog...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
