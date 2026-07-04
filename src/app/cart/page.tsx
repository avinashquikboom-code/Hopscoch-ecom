'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingBag, ArrowRight, Truck, Tag, Gift, Percent, Check, AlertCircle } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart, useApplyCoupon, useRemoveCoupon } from '@/hooks';
import { toast } from 'sonner';

const AVAILABLE_COUPONS = [
  { code: 'AURA10', description: 'Get 10% off on your entire purchase' },
  { code: 'WELCOME200', description: 'Flat ₹200 off for your first order' },
  { code: 'FESTIVE30', description: 'Get 30% off on couture collections' }
];

export default function CartPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const applyCouponMutation = useApplyCoupon();
  const removeCouponMutation = useRemoveCoupon();

  const [couponCode, setCouponCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const cartItems = cart?.items || [];
  
  // Totals calculations
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const giftWrapCost = giftWrap ? 30 : 0;
  const total = subtotal - discount + shipping + giftWrapCost;

  const handleQtyChange = (itemId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    updateCartItemMutation.mutate({ itemId, quantity: newQty });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCartMutation.mutate(itemId);
  };

  const handleApplyCoupon = (code: string) => {
    applyCouponMutation.mutate(code, {
      onSuccess: () => {
        setCouponCode('');
        toast.success(`Coupon ${code} applied!`);
      }
    });
  };

  const handleRemoveCoupon = () => {
    removeCouponMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Coupon removed');
      }
    });
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F3F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#0d9488] border-t-transparent" />
          <p className="text-xs text-gray-400 font-bold tracking-wider uppercase animate-pulse">Loading Cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-10 px-4 sm:px-6 md:px-12 font-sans">
      <div className="container mx-auto max-w-5xl">
        
        {/* Title */}
        <div className="bg-white border border-gray-250/60 p-5 mb-5 rounded-sm shadow-xs flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black uppercase text-gray-900 tracking-wider">Shopping Cart</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage details and apply discount coupons before checking out.</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 px-8 border border-dashed border-gray-300 rounded-sm bg-white shadow-xs">
            <ShoppingBag className="h-14 w-14 mx-auto text-gray-400 mb-5" />
            <h2 className="text-base font-bold text-gray-800 mb-2">Shopping Cart is Empty</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Looks like your cart is empty. Explore our latest premium fashion collections and fill it up!
            </p>
            <Link href="/products">
              <Button className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-10 px-8 rounded-sm text-xs border-none uppercase cursor-pointer">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemDiscount = item.product.originalPrice
                  ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
                  : undefined;

                return (
                  <Card key={item.id} className="border-gray-200 shadow-xs rounded-sm overflow-hidden bg-white">
                    <CardContent className="p-4.5">
                      <div className="flex gap-4">
                        
                        {/* Image */}
                        <Link href={`/products/${item.product.id}`} className="w-20 sm:w-24 aspect-[3/4] bg-gray-50 border border-gray-100 rounded-sm overflow-hidden relative shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </Link>
                        
                        {/* Info details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <p className="text-[9px] font-black uppercase text-gray-400 tracking-wider leading-none">{item.product.brand || 'Aura Couture'}</p>
                            <Link href={`/products/${item.product.id}`}>
                              <h3 className="font-semibold text-xs sm:text-sm text-gray-800 hover:text-[#0d9488] transition-colors truncate mt-1">{item.product.name}</h3>
                            </Link>
                            {item.variant && (
                              <p className="text-[10px] font-bold text-[#0d9488] mt-1 bg-teal-50 px-2 py-0.5 w-fit rounded-sm border border-teal-100/50">
                                Size: {item.variant.value}
                              </p>
                            )}

                            {/* Pricing */}
                            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-xs">
                              <span className="font-bold text-gray-900">₹{item.product.price}</span>
                              {item.product.originalPrice && (
                                <>
                                  <span className="text-gray-400 line-through text-[10px]">₹{item.product.originalPrice}</span>
                                  <span className="text-[#0d9488] font-bold text-[10px]">{itemDiscount}% OFF</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Qty action selectors */}
                          <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-gray-100">
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-sm p-0.5">
                              <button 
                                onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                                className="h-6 w-6 font-bold hover:bg-white text-gray-700 flex items-center justify-center rounded-sm transition-colors cursor-pointer border-none"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                              <button 
                                onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                                className="h-6 w-6 font-bold hover:bg-white text-gray-700 flex items-center justify-center rounded-sm transition-colors cursor-pointer border-none"
                              >
                                +
                              </button>
                            </div>

                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-xs text-gray-400 hover:text-red-500 font-bold flex items-center gap-1 cursor-pointer transition-colors border-none bg-transparent"
                            >
                              <Trash2 className="h-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Delivery Estimate timeline block */}
              <div className="bg-white border border-gray-200 p-4.5 rounded-sm shadow-xs flex items-center gap-3">
                <Truck className="h-5 w-5 text-[#0d9488]" />
                <div className="text-xs">
                  <p className="font-bold text-gray-850">Estimated Express Delivery</p>
                  <p className="text-gray-500 font-semibold mt-0.5">
                    {estimatedDelivery.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Gift Wrap Addition Option (Couture details) */}
              <div className="bg-[#fcf8f2] border border-amber-200/60 p-4.5 rounded-sm shadow-xs flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="gift-wrap-check"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="rounded-sm border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4 mt-0.5"
                  />
                  <div className="text-xs flex-1">
                    <label htmlFor="gift-wrap-check" className="font-bold text-amber-800 cursor-pointer flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>Add Premium Gift Wrap (+₹30)</span>
                    </label>
                    <p className="text-amber-700/80 mt-0.5">We will pack this in a luxury matte black gift box with a customized message.</p>
                  </div>
                </div>
                {giftWrap && (
                  <Input
                    placeholder="Enter personalized greeting message (optional)"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500 text-xs py-2 h-9"
                  />
                )}
              </div>

            </div>

            {/* Order Price Details & Coupon Options */}
            <div className="space-y-4">
              
              {/* Premium Coupons Panel list */}
              <Card className="border-gray-200 shadow-xs rounded-sm bg-white overflow-hidden p-4.5">
                <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider mb-3 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#0d9488]" />
                  <span>Available Discount Coupons</span>
                </h3>
                
                <div className="space-y-2.5">
                  {AVAILABLE_COUPONS.map((coupon) => (
                    <div 
                      key={coupon.code}
                      className="border border-dashed border-gray-200 hover:border-[#0d9488] p-2.5 rounded-sm bg-gray-50 flex flex-col justify-between items-start gap-2.5 transition-all"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="bg-teal-50 text-[#0d9488] px-2.5 py-0.5 rounded-sm border border-teal-200/50 text-[10px] font-black uppercase tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleApplyCoupon(coupon.code)}
                          disabled={cart?.coupon?.code === coupon.code}
                          className="text-[10px] font-black text-[#0d9488] hover:underline cursor-pointer border-none bg-transparent disabled:opacity-40"
                        >
                          APPLY
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">{coupon.description}</p>
                    </div>
                  ))}
                </div>

                {/* Custom Input apply coupon */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-150">
                  <Input
                    placeholder="Enter Custom Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-8.5 text-xs bg-white uppercase placeholder:normal-case font-bold"
                  />
                  <Button
                    onClick={() => handleApplyCoupon(couponCode)}
                    disabled={!couponCode.trim()}
                    className="h-8.5 bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold text-xs uppercase px-4 cursor-pointer border-none"
                  >
                    Apply
                  </Button>
                </div>
              </Card>

              {/* Pricing Details */}
              <Card className="border-gray-200 shadow-xs rounded-sm bg-white overflow-hidden p-4.5">
                <h3 className="text-xs font-black uppercase text-gray-800 tracking-wider mb-3.5 pb-2 border-b border-gray-150">Price Details</h3>
                <div className="space-y-3 text-xs text-gray-600 font-medium">
                  
                  <div className="flex justify-between">
                    <span>Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {cart?.coupon && (
                    <div className="flex justify-between items-center text-[#0d9488] bg-teal-50/50 p-2 rounded border border-dashed border-teal-200">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <div>
                          <p className="font-bold text-[10px] uppercase">Coupon: {cart.coupon.code}</p>
                          <p className="text-[9px] text-teal-600">Discount applied successfully</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-[10px] font-black text-red-500 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        REMOVE
                      </button>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-[#0d9488] font-bold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{shipping === 0 ? <span className="text-[#0d9488] font-bold">FREE</span> : `₹${shipping}`}</span>
                  </div>

                  {giftWrap && (
                    <div className="flex justify-between text-amber-800 font-bold">
                      <span>Gift Wrapping</span>
                      <span>₹30.00</span>
                    </div>
                  )}

                  <div className="border-t border-gray-150 pt-3 mt-3">
                    <div className="flex justify-between text-sm font-black text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-[#0d9488] text-base">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                </div>

                <div className="mt-5 space-y-2">
                  <Button 
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-11 text-xs tracking-wider uppercase rounded-sm border-none shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Link href="/products" className="block text-center mt-2.5 text-xs text-[#0d9488] hover:underline font-bold">
                    Continue Shopping
                  </Link>
                </div>
              </Card>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
