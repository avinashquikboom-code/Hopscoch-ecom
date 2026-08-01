import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';
import { STORAGE_KEYS } from '@/constants';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  
  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
}

const calcTax = (items: CartItem[]) => {
  let totalExclusiveTax = 0;
  let totalInclusiveTax = 0;

  items.forEach((i) => {
    const p = i.product as any;
    if (!p) return;
    const rate = p.taxPercent !== undefined ? Number(p.taxPercent) : (p.taxRule?.rate ? Number(p.taxRule.rate) : (p.effectiveTaxRule?.rate ? Number(p.effectiveTaxRule.rate) : 0));
    if (!rate || rate <= 0) return;
    const rawType = (p.taxType || p.taxRule?.taxType || p.effectiveTaxRule?.taxType || 'EXCLUSIVE').toString().toUpperCase();
    const isInclusive = rawType === 'INCLUSIVE';
    const lineTotal = (p.price || 0) * (i.quantity || 1);
    if (isInclusive) {
      const taxVal = Math.round((lineTotal - (lineTotal / (1 + rate / 100))) * 100) / 100;
      totalInclusiveTax += taxVal;
    } else {
      const taxVal = Math.round((lineTotal * (rate / 100)) * 100) / 100;
      totalExclusiveTax += taxVal;
    }
  });

  return {
    totalExclusiveTax: Math.round(totalExclusiveTax * 100) / 100,
    totalInclusiveTax: Math.round(totalInclusiveTax * 100) / 100,
    totalTax: Math.round((totalExclusiveTax + totalInclusiveTax) * 100) / 100,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isOpen: false,

      setCart: (cart: Cart) => {
        const taxAmount = cart.taxAmount !== undefined ? cart.taxAmount : calcTax(cart.items || []);
        set({ cart: { ...cart, taxAmount, total: cart.subtotal - cart.discount + taxAmount } });
      },

      addItem: (item: CartItem) => {
        set((state) => {
          if (!state.cart) {
            const taxAmount = calcTax([item]);
            return {
              cart: {
                id: 'temp',
                userId: '',
                items: [item],
                subtotal: item.product.price * item.quantity,
                discount: 0,
                taxAmount,
                total: item.product.price * item.quantity + taxAmount,
                updatedAt: new Date().toISOString(),
              },
            };
          }

          const existingItemIndex = state.cart.items.findIndex(
            (i) => i.productId === item.productId && 
            i.variant?.id === item.variant?.id
          );

          let newItems: CartItem[];
          if (existingItemIndex >= 0) {
            newItems = state.cart.items.map((i, index) =>
              index === existingItemIndex
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.cart.items, item];
          }

          const subtotal = newItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          );
          const discount = state.cart.discount;
          const taxAmount = calcTax(newItems);
          const total = subtotal - discount + taxAmount;

          return {
            cart: {
              ...state.cart,
              items: newItems,
              subtotal,
              taxAmount,
              total,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      updateItem: (itemId: string, quantity: number) => {
        set((state) => {
          if (!state.cart) return state;

          const newItems = state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );

          const subtotal = newItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          );
          const discount = state.cart.discount;
          const taxAmount = calcTax(newItems);
          const total = subtotal - discount + taxAmount;

          return {
            cart: {
              ...state.cart,
              items: newItems,
              subtotal,
              taxAmount,
              total,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => {
          if (!state.cart) return state;

          const newItems = state.cart.items.filter((item) => item.id !== itemId);

          const subtotal = newItems.reduce(
            (sum, i) => sum + i.product.price * i.quantity,
            0
          );
          const discount = state.cart.discount;
          const taxAmount = calcTax(newItems);
          const total = subtotal - discount + taxAmount;

          return {
            cart: {
              ...state.cart,
              items: newItems,
              subtotal,
              taxAmount,
              total,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      clearCart: () => {
        set({
          cart: {
            id: 'temp',
            userId: '',
            items: [],
            subtotal: 0,
            discount: 0,
            taxAmount: 0,
            total: 0,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      openCart: () => {
        set({ isOpen: true });
      },
    }),
    {
      name: STORAGE_KEYS.CART_DATA,
    }
  )
);
