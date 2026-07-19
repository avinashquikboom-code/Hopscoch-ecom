import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services';
import { Product, ProductFilters, PaginatedResponse } from '@/types';

export function useProducts(filters?: ProductFilters, page = 1, limit = 12) {
  return useQuery({
    queryKey: ['products', filters, page, limit],
    queryFn: () => productService.getProducts(filters, { page, limit }),
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getFeaturedProducts(),
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ['trending-products'],
    queryFn: () => productService.getTrendingProducts(),
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productService.getNewArrivals(),
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['best-sellers'],
    queryFn: () => productService.getBestSellers(),
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['search-products', query],
    queryFn: () => productService.searchProducts(query),
    enabled: query.length > 2,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['product-reviews', productId, page, limit],
    queryFn: () => productService.getProductReviews(productId, page, limit),
    enabled: !!productId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, review }: { productId: string; review: any }) =>
      productService.addReview(productId, review),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });
}
