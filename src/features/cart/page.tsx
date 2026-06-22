'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Price } from '@/components/common/Price';
import { EmptyState } from '@/components/common/EmptyState';
import { useCartStore, useCartStore as useCartZustand } from '@/store';
import { useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { CURRENCY } from '@/constants';

export default function CartPage() {
  const router = useRouter();
  const cart = useCartZustand((state: any) => state.cart);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const clearCart = useClearCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet."
          action={{
            label: 'Start Shopping',
            onClick: () => router.push('/products'),
          }}
        />
      </div>
    );
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem.mutate(itemId);
  };

  const handleClearCart = () => {
    clearCart.mutate();
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.product.category}
                    </p>
                    <Price
                      value={item.product.price}
                      originalPrice={item.product.originalPrice}
                      size="sm"
                    />
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={handleClearCart}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
            <Button variant="ghost" onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">
                    {CURRENCY.SYMBOL}
                    {cart.subtotal.toLocaleString(CURRENCY.LOCALE)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="font-medium text-green-600">
                    -{CURRENCY.SYMBOL}
                    {cart.discount.toLocaleString(CURRENCY.LOCALE)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {CURRENCY.SYMBOL}
                    {cart.total.toLocaleString(CURRENCY.LOCALE)}
                  </span>
                </div>

                {cart.coupon && (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Coupon: {cart.coupon.code}
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {cart.coupon.discountType === 'percentage'
                        ? `${cart.coupon.discountValue}%`
                        : `${CURRENCY.SYMBOL}${cart.coupon.discountValue}`}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <Input placeholder="Coupon code" />
                  <Button variant="outline" className="w-full">
                    Apply Coupon
                  </Button>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Free shipping on orders over ₹999
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
