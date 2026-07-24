'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useCartStore } from '@/store';
import { useCreateOrder } from '@/hooks';
import { CURRENCY } from '@/constants';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(6, 'Postal code is required'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'upi', 'net_banking', 'cod']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === 'credit_card' || data.paymentMethod === 'debit_card') {
    return !!data.cardNumber && !!data.cardExpiry && !!data.cardCvv;
  }
  return true;
}, {
  message: 'Card details are required for card payments',
  path: ['cardNumber'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((state: any) => state.cart);
  const createOrder = useCreateOrder();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cod',
    },
  });

  const paymentMethod = watch('paymentMethod');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push('/products')}>Start Shopping</Button>
      </div>
    );
  }

  if (orderPlaced && orderId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your order has been placed successfully. Order ID: {orderId}
            </p>
            <Button onClick={() => router.push(`/orders/${orderId}`)}>
              View Order Details
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: CheckoutFormData) => {
    createOrder.mutate(
      {
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: 'India',
          isDefault: false,
          type: 'home',
        },
        billingSameAsShipping: true,
        paymentMethod: data.paymentMethod,
        saveAddress: false,
      },
      {
        onSuccess: (order) => {
          setOrderPlaced(true);
          setOrderId(order.id);
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    placeholder="123 Main Street"
                    {...register('addressLine1')}
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-red-500">{errors.addressLine1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc."
                    {...register('addressLine2')}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      {...register('city')}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      {...register('state')}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      placeholder="400001"
                      {...register('postalCode')}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup defaultValue="cod" {...register('paymentMethod')}>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      Credit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="debit_card" id="debit_card" />
                    <Label htmlFor="debit_card" className="flex-1 cursor-pointer">
                      Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      UPI
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="net_banking" id="net_banking" />
                    <Label htmlFor="net_banking" className="flex-1 cursor-pointer">
                      Net Banking
                    </Label>
                  </div>
                </RadioGroup>

                {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...register('cardNumber')}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date *</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/YY"
                          {...register('cardExpiry')}
                        />
                        {errors.cardExpiry && (
                          <p className="text-sm text-red-500">{errors.cardExpiry.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV *</Label>
                        <Input
                          id="cardCvv"
                          placeholder="123"
                          {...register('cardCvv')}
                        />
                        {errors.cardCvv && (
                          <p className="text-sm text-red-500">{errors.cardCvv.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {CURRENCY.SYMBOL}
                        {(item.product.price * item.quantity).toLocaleString(CURRENCY.LOCALE)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
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

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated Tax</span>
                    <span className="font-medium">
                      {CURRENCY.SYMBOL}
                      {(cart.taxAmount || 0).toLocaleString(CURRENCY.LOCALE)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {CURRENCY.SYMBOL}
                    {cart.total.toLocaleString(CURRENCY.LOCALE)}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the Terms & Conditions and Privacy Policy
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  By placing this order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
