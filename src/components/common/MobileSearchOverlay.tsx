'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchKeywordService, SearchKeywordItem } from '@/services/search-keyword.service';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [popularKeywords, setPopularKeywords] = useState<SearchKeywordItem[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<SearchKeywordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) inputRef.current.focus();
      loadKeywords();
    }
  }, [isOpen]);

  const loadKeywords = async () => {
    setLoading(true);
    try {
      const [popular, trending] = await Promise.all([
        searchKeywordService.getPopularKeywords(),
        searchKeywordService.getTrendingKeywords(),
      ]);
      setPopularKeywords(popular);
      setTrendingKeywords(trending);
    } catch (error) {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const clean = query.trim();
      searchKeywordService.trackSearchKeyword(clean);
      router.push(`/products?search=${encodeURIComponent(clean)}`);
      onClose();
      setQuery('');
    }
  };

  const handleQuickSearch = (term: string) => {
    if (!term) return;
    searchKeywordService.trackSearchKeyword(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="absolute inset-x-0 top-0 bg-card animate-slide-down">
        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 h-12 rounded-full bg-muted/50 border-transparent focus:border-border focus:bg-card text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-12 w-12 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Suggestions / Dynamic Keywords */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Suggestions</p>
              {[query, `${query} for women`, `${query} sale`].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors active:scale-95 flex items-center gap-3"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Skeleton loading state */}
              {loading && (
                <div className="space-y-4 py-2">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
                    <div className="h-8 w-32 bg-muted animate-pulse rounded-full" />
                    <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!loading && popularKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {popularKeywords.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleQuickSearch(item.keyword)}
                        className="px-4 py-2 rounded-full bg-muted/60 hover:bg-teal-500/10 hover:text-teal-600 border border-border text-sm font-semibold transition-all active:scale-95"
                      >
                        {item.keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {!loading && trendingKeywords.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <span>Trending Searches</span>
                  </p>
                  <div className="space-y-1.5">
                    {trendingKeywords.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleQuickSearch(item.keyword)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-muted/60 transition-colors active:scale-95 flex items-center gap-3"
                      >
                        <Sparkles className="h-4 w-4 text-amber-500 fill-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{item.keyword}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
