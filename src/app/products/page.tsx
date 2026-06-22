'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import {
  SlidersHorizontal, Grid3X3, List, X, ChevronDown, ChevronUp,
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  LayoutGrid, Package, Sparkles, TrendingUp, SortAsc,
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First',     icon: Sparkles },
  { value: 'popular',   label: 'Most Popular',      icon: TrendingUp },
  { value: 'price_asc', label: 'Price: Low → High', icon: SortAsc },
  { value: 'price_desc',label: 'Price: High → Low', icon: SortAsc },
  { value: 'rating',    label: 'Top Rated',         icon: null },
];

const PRICE_RANGES = [
  { label: 'Under ₹100',     min: 0,    max: 100  },
  { label: '₹100 – ₹300',   min: 100,  max: 300  },
  { label: '₹300 – ₹600',   min: 300,  max: 600  },
  { label: 'Over ₹600',      min: 600,  max: Infinity },
];

const RATING_OPTIONS = [
  { value: 5, label: '5 ★ Only'     },
  { value: 4, label: '4 ★ & above'  },
  { value: 3, label: '3 ★ & above'  },
];

const ITEMS_PER_PAGE_OPTIONS = [8, 12, 16, 24];

/* ─── Small reusable Checkbox ───────────────────────────────────────────── */
function FilterCheck({
  id, checked, onChange, label,
}: { id: string; checked: boolean; onChange: () => void; label: string }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-muted/60 transition-colors"
    >
      <span
        className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${checked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-primary-foreground" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors select-none">{label}</span>
    </label>
  );
}

/* ─── Collapsible Filter Section ────────────────────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pt-1 space-y-0.5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Pagination Component ───────────────────────────────────────────────── */
function Pagination({
  currentPage, totalPages, onPageChange,
}: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
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
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200
              ${currentPage === p
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-105'
                : 'text-foreground/70 hover:bg-muted/70 hover:text-foreground'
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Active Filter Chip ─────────────────────────────────────────────────── */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
      {label}
      <button onClick={onRemove} className="hover:text-primary/60 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

/* ─── Main Products Content ─────────────────────────────────────────────── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
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

  const brands = Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean))) as string[];

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
  if (inStockOnly) {
    filtered = filtered.filter(p => p.stock > 0);
  }
  if (onSaleOnly) {
    filtered = filtered.filter(p => !!p.originalPrice && p.originalPrice > p.price);
  }
  if (selectedBrands.length > 0) {
    filtered = filtered.filter(p => p.brand && selectedBrands.includes(p.brand));
  }

  // Sort
  switch (sortBy) {
    case 'price_asc':  filtered.sort((a, b) => a.price - b.price); break;
    case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating':     filtered.sort((a, b) => b.rating - a.rating); break;
    case 'popular':    filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
    case 'newest':
    default:           filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalProducts = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (n: number) => {
    setItemsPerPage(n);
    setCurrentPage(1);
  };

  // ── Clear filters ────────────────────────────────────────────────────────
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedPriceRanges([]);
    setSelectedRating(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSelectedBrands([]);
    resetPage();
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedPriceRanges.length +
    (selectedRating ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    selectedBrands.length;

  // ── Sidebar Filters JSX ─────────────────────────────────────────────────
  const FiltersPanel = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary/70 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="py-4 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value.toLowerCase()); resetPage(); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/50 border border-border/60 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <FilterCheck
          id="cat-all"
          checked={selectedCategory === 'all'}
          onChange={() => { setSelectedCategory('all'); resetPage(); }}
          label="All Categories"
        />
        {mockCategories.map(cat => (
          <FilterCheck
            key={cat.id}
            id={`cat-${cat.id}`}
            checked={selectedCategory === cat.name}
            onChange={() => { setSelectedCategory(cat.name); resetPage(); }}
            label={`${cat.icon} ${cat.name}`}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
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

      {/* Brands */}
      <FilterSection title="Brand">
        {brands.map(brand => (
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

      {/* Rating */}
      <FilterSection title="Customer Rating">
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
      <FilterSection title="Availability" defaultOpen={false}>
        <FilterCheck
          id="in-stock"
          checked={inStockOnly}
          onChange={() => { setInStockOnly(!inStockOnly); resetPage(); }}
          label="In Stock Only"
        />
        <FilterCheck
          id="on-sale"
          checked={onSaleOnly}
          onChange={() => { setOnSaleOnly(!onSaleOnly); resetPage(); }}
          label="On Sale"
        />
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-primary/5 border-b border-border/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-10 relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold tracking-widest uppercase text-primary">Catalog</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                All Products
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5">
                Discover our curated collection of premium lifestyle products
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground text-lg">{totalProducts}</span>
              <span>results found</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
              <FiltersPanel />
            </div>
          </aside>

          {/* ── Main Content ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-card border border-border/60 rounded-2xl px-4 py-3 shadow-sm">
              {/* Left: mobile filter btn + count */}
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-sm font-medium transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Showing <span className="font-semibold text-foreground">{startIdx + 1}–{Math.min(startIdx + itemsPerPage, totalProducts)}</span> of <span className="font-semibold text-foreground">{totalProducts}</span>
                </span>
              </div>

              {/* Right: Sort + View + Per-page */}
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-sm font-medium transition-colors"
                  >
                    <SortAsc className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.value === sortBy)?.label ?? 'Sort'}</span>
                    <span className="sm:hidden">Sort</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <div className="absolute right-0 mt-1.5 w-52 bg-card border border-border/60 rounded-2xl shadow-xl z-20 overflow-hidden py-1">
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setSortOpen(false); resetPage(); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                              ${sortBy === opt.value ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/60 text-foreground/80'}`}
                          >
                            {sortBy === opt.value && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            )}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Items per page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-sm font-medium border-0 outline-none cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(n => (
                    <option key={n} value={n}>{n} / page</option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Active Filter Chips ───────────────────────────────────────── */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
                  <FilterChip label="In Stock" onRemove={() => { setInStockOnly(false); resetPage(); }} />
                )}
                {onSaleOnly && (
                  <FilterChip label="On Sale" onRemove={() => { setOnSaleOnly(false); resetPage(); }} />
                )}
              </div>
            )}

            {/* ── Products Grid / List ──────────────────────────────────────── */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center mb-5 text-4xl">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-xs">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {paginated.map((product, i) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-3 duration-400"
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination Footer ─────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4">
                {/* Pagination Controls */}
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

                {/* Page info + jump */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Page <span className="font-semibold text-foreground">{safeCurrentPage}</span> of{' '}
                    <span className="font-semibold text-foreground">{totalPages}</span>
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-2">
                    Go to
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      defaultValue={safeCurrentPage}
                      key={safeCurrentPage}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = Math.min(Math.max(1, Number((e.target as HTMLInputElement).value)), totalPages);
                          handlePageChange(val);
                        }
                      }}
                      className="w-14 px-2 py-1 text-center text-sm bg-muted/60 border border-border/60 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                    <button
                      onClick={(e) => {
                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                        const val = Math.min(Math.max(1, Number(input.value)), totalPages);
                        handlePageChange(val);
                      }}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Go
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ──────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-card shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border/60 px-5 py-4 flex items-center justify-between z-10">
              <span className="font-bold text-base text-foreground">Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-xl hover:bg-muted/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <FiltersPanel />
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border/60 p-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Show {totalProducts} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page Export with Suspense ─────────────────────────────────────────── */
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 animate-pulse flex items-center justify-center">
            <Package className="w-6 h-6 text-primary/50" />
          </div>
          <p className="text-muted-foreground animate-pulse font-medium tracking-widest uppercase text-xs">
            Loading AURA catalog...
          </p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
