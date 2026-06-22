import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { wishlistService } from '@/services';
import { Wishlist } from '@/types';
import { useWishlistStore } from '@/store';
import { toast } from 'sonner';

export function useWishlist() {
  const queryClient = useQueryClient();
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
  });

  useEffect(() => {
    if (query.data) {
      setWishlist(query.data);
    }
  }, [query.data, setWishlist]);

  return query;
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  return useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setWishlist(data);
      toast.success('Product added to wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  return useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setWishlist(data);
      toast.success('Product removed from wishlist');
    },
  });
}

export function useClearWishlist() {
  const queryClient = useQueryClient();
  const setWishlist = useWishlistStore((state) => state.setWishlist);

  return useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setWishlist(data);
      toast.success('Wishlist cleared');
    },
  });
}
