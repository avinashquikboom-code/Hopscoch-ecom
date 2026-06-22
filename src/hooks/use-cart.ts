import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { cartService } from '@/services';
import { Cart } from '@/types';
import { useCartStore } from '@/store';
import { toast } from 'sonner';

export function useCart() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
  });

  useEffect(() => {
    if (query.data) {
      setCart(query.data);
    }
  }, [query.data, setCart]);

  return query;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: ({ productId, quantity, variantId }: { productId: string; quantity?: number; variantId?: string }) =>
      cartService.addToCart(productId, quantity, variantId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Product added to cart');
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateCartItem(itemId, quantity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Cart updated');
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeFromCart(itemId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Product removed from cart');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Cart cleared');
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Coupon applied successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  const setCart = useCartStore((state) => state.setCart);

  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCart(data);
      toast.success('Coupon removed');
    },
  });
}
